-- ===========================================================================
-- Security hardening
-- Closes findings 2.1 (CRITICAL), 2.2, 2.3 and enables 4.4 from security.md.
-- Project: wwqqkpehlvebgzhmamdq (ATSFastScan_DATA)
-- Date: 2026-09-16
--
-- HOW TO APPLY
--   Run each SECTION separately in the Supabase SQL editor, not the whole file
--   at once, so a failure in one section cannot mask another. Report back any
--   error before continuing to the next section.
--
--   Section 1  safe, closes the critical
--   Section 2  read-only report, nothing changes
--   Section 3  safe, fixes the total_users drift
--   Section 4  safe, creates the webhook idempotency table (enables 4.4)
--   Section 5  DELETES ROWS - read the note first, optional
--   Section 6  safe, narrows public read on site_stats
--   Section 7  rewrites function bodies - needs the Section 2 output first
-- ===========================================================================

-- ===========================================================================
-- SECTION 1 - CRITICAL (finding 2.1)
-- The counter RPCs are callable by anyone holding the public anon key, and
-- increment_scan_count takes the scan limit as a caller-supplied argument, so
-- a direct PostgREST call with p_limit => 999999 removes the monthly cap.
-- Every legitimate caller uses the service role key - verified: there are zero
-- client-side .rpc() calls anywhere in src/ - so revoking from the public roles
-- breaks nothing. Written dynamically so it is correct regardless of each
-- function's exact argument types.
-- ===========================================================================

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('increment_scan_count', 'increment_total_users', 'get_user_count',
                        'increment_resume_scans', 'increment_cover_letter_scans')
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.sig);
    RAISE NOTICE 'hardened: %', r.sig;
  END LOOP;
END $$;

-- Verify 1: one row per function. acl must list service_role and must NOT list
-- anon, authenticated, or a bare "=X/" (which means PUBLIC).
SELECT p.proname,
       pg_get_function_identity_arguments(p.oid) AS args,
       p.prosecdef AS security_definer,
       coalesce(array_to_string(p.proconfig, ', '), '(search_path not pinned)') AS config,
       coalesce(array_to_string(p.proacl, ' | '), '(default: PUBLIC has EXECUTE)') AS acl
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN ('increment_scan_count', 'increment_total_users', 'get_user_count',
                    'increment_resume_scans', 'increment_cover_letter_scans')
ORDER BY p.proname;

-- ===========================================================================
-- SECTION 2 - READ ONLY (finding 2.2)
-- Nothing is changed here. Paste the output back so the Section 7 rewrite can
-- use the real bodies. Their proconfig shows whether search_path is pinned.
-- ===========================================================================

SELECT p.proname,
       pg_get_function_identity_arguments(p.oid) AS args,
       coalesce(array_to_string(p.proconfig, ', '), '(not pinned)') AS config,
       pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN ('increment_scan_count', 'increment_total_users', 'get_user_count')
ORDER BY p.proname;

-- ===========================================================================
-- SECTION 3 - total_users drift (pre-existing bug, not from the audit)
-- The trigger was created AFTER INSERT OR UPDATE, so every updateUser() call
-- from the scan path incremented the public counter - the UI showed 504 while
-- public.users held 103 rows. Replaced with a self-healing recompute so drift
-- cannot accumulate again, and a DELETE counterpart so removals decrement.
-- ===========================================================================

CREATE OR REPLACE FUNCTION public.sync_total_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.site_stats
     SET total_users = (SELECT count(*) FROM public.users),
         updated_at  = now()
   WHERE id = 'global';
  RETURN NULL;
END $$;

-- Drop any pre-existing total_users trigger regardless of its name, so a
-- differently-named one cannot survive and keep double-counting.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT t.tgname
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_proc p ON p.oid = t.tgfoid
    WHERE n.nspname = 'public'
      AND c.relname = 'users'
      AND NOT t.tgisinternal
      AND (p.proname LIKE '%total_user%' OR t.tgname LIKE '%total_user%')
  LOOP
    EXECUTE format('DROP TRIGGER %I ON public.users', r.tgname);
    RAISE NOTICE 'dropped old trigger: %', r.tgname;
  END LOOP;
END $$;

-- FOR EACH STATEMENT so a bulk signup syncs once instead of once per row.
CREATE TRIGGER trg_sync_total_users_ins
  AFTER INSERT ON public.users
  FOR EACH STATEMENT EXECUTE FUNCTION public.sync_total_users();

CREATE TRIGGER trg_sync_total_users_del
  AFTER DELETE ON public.users
  FOR EACH STATEMENT EXECUTE FUNCTION public.sync_total_users();

-- One-time resync, self-heals the existing drift.
UPDATE public.site_stats
   SET total_users = (SELECT count(*) FROM public.users),
       updated_at  = now()
 WHERE id = 'global';

-- Verify 3: these two numbers must be equal.
SELECT (SELECT count(*) FROM public.users)                      AS real_users,
       (SELECT total_users FROM public.site_stats WHERE id = 'global') AS counter;

-- ===========================================================================
-- SECTION 4 - idempotency store (enables finding 4.4)
--
-- The webhook used to dedupe by reading subscription_history and then writing to
-- it. Two concurrent deliveries of the same event could both read "not seen"
-- before either wrote, and both would then extend the subscription. It also
-- recorded an event id for only two of the five handlers, so the other three had
-- nothing to dedupe on at all.
--
-- A dedicated table makes the check atomic - the insert either wins or hits the
-- primary key - and gives every event type somewhere to be recorded.
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.webhook_events (
  razorpay_event_id TEXT PRIMARY KEY,
  event_type        TEXT NOT NULL,
  received_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Edge functions use the service role key, which bypasses RLS.
CREATE POLICY "deny_anon_webhook_events"
  ON public.webhook_events
  FOR ALL TO anon, authenticated
  USING (false);

REVOKE ALL ON public.webhook_events FROM anon, authenticated;

-- Defence in depth on the payment ledger: even if a duplicate somehow got past
-- the claim above, the ledger still cannot record the same event twice. Partial,
-- because verify-payment writes NULL into this column.
CREATE UNIQUE INDEX IF NOT EXISTS uq_subscription_history_razorpay_event_id
  ON public.subscription_history (razorpay_event_id)
  WHERE razorpay_event_id IS NOT NULL;

-- Verify 4: rls_on must be true, and the privileges query below must not list
-- anon or authenticated.
SELECT c.relname, c.relrowsecurity AS rls_on, count(p.polname) AS policies
FROM pg_class c
LEFT JOIN pg_policy p ON p.polrelid = c.oid
WHERE c.relnamespace = 'public'::regnamespace
  AND c.relname IN ('webhook_events', 'subscription_history')
GROUP BY 1, 2;

SELECT grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' AND table_name = 'webhook_events'
ORDER BY grantee, privilege_type;

-- ===========================================================================
-- SECTION 5 - OPTIONAL, DELETES ROWS
-- Run ONLY if Section 4 failed with a duplicate-key error. Keeps the earliest
-- row per event id and removes later duplicates, then re-run Section 4.
-- Inspect first if you would rather review what would go:
--   SELECT razorpay_event_id, count(*) FROM public.subscription_history
--   WHERE razorpay_event_id IS NOT NULL GROUP BY 1 HAVING count(*) > 1;
-- ===========================================================================

-- DELETE FROM public.subscription_history a
-- USING public.subscription_history b
-- WHERE a.razorpay_event_id IS NOT NULL
--   AND a.razorpay_event_id = b.razorpay_event_id
--   AND a.created_at > b.created_at;

-- ===========================================================================
-- SECTION 6 - narrow public read on site_stats (finding 2.3)
-- The RLS policy grants the whole table. Today it holds only counters, but any
-- column added later would become world-readable with no policy change.
-- updated_at is deliberately withheld; id is REQUIRED because the client
-- filters .eq("id", "global") in src/hooks/useSiteStats.ts:49, and PostgREST
-- needs SELECT on a column to filter on it.
-- ===========================================================================

REVOKE SELECT ON public.site_stats FROM anon, authenticated;

GRANT SELECT (id, total_users, total_resume_scans, total_cover_letter_scans)
  ON public.site_stats TO anon, authenticated;

-- Verify 6: anon should list exactly those four columns, nothing else.
SELECT grantee, privilege_type, column_name
FROM information_schema.column_privileges
WHERE table_schema = 'public' AND table_name = 'site_stats'
  AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, column_name;

-- ===========================================================================
-- SECTION 7 - deferred until the Section 2 output is available
-- The three hand-created functions have an unknown search_path. Two of the five
-- (increment_resume_scans, increment_cover_letter_scans) are already pinned to
-- `public` by migration 20260215163849, and PostgREST fixes the session
-- search_path server-side, so this is hardening rather than a live hole. The
-- rewrite is deliberately NOT included here: setting search_path to '' on a
-- body that references unqualified tables would break scanning outright.
-- ===========================================================================