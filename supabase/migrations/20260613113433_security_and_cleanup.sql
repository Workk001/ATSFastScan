-- 1. Drop unused view and tables (order matters)
DROP VIEW IF EXISTS daily_scan_stats;
DROP TABLE IF EXISTS scan_history;

-- 2. Add explicit deny policies for anon and authenticated roles
-- Service role key used by edge functions bypasses these automatically
CREATE POLICY "deny_anon_users" ON public.users
  FOR ALL TO anon, authenticated
  USING (false);

CREATE POLICY "deny_anon_subscription_history" 
  ON public.subscription_history
  FOR ALL TO anon, authenticated
  USING (false);

-- 3. Add only the missing index
-- (firebase_uid and email indexes already exist, do not recreate)
CREATE INDEX IF NOT EXISTS idx_users_razorpay_subscription_id
  ON public.users(razorpay_subscription_id);
