import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteStats {
  totalUsers: number;
  totalResumes: number;
  totalCoverLetters: number;
  totalScans: number;
}

// Module-level cache — persists across component mounts
// but resets on page refresh
let cachedStats: SiteStats | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const EMPTY_STATS: SiteStats = {
  totalUsers: 0,
  totalResumes: 0,
  totalCoverLetters: 0,
  totalScans: 0,
};

const toCount = (value: unknown): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export const useSiteStats = () => {
  const [stats, setStats] = useState<SiteStats>(cachedStats || EMPTY_STATS);
  const [loading, setLoading] = useState(!cachedStats);

  useEffect(() => {
    const now = Date.now();

    // Return cached data if fresh
    if (cachedStats && (now - cacheTimestamp) < CACHE_TTL) {
      setStats(cachedStats);
      setLoading(false);
      return;
    }

    // site_stats is the single public counter row; total_users is maintained
    // by a trigger on public.users so it stays in step with real signups.
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from("site_stats")
          .select("total_users, total_resume_scans, total_cover_letter_scans")
          .eq("id", "global")
          .single();

        if (error || !data) {
          return;
        }

        const totalResumes = toCount(data.total_resume_scans);
        const totalCoverLetters = toCount(data.total_cover_letter_scans);
        const mappedData: SiteStats = {
          totalUsers: toCount(data.total_users),
          totalResumes,
          totalCoverLetters,
          totalScans: totalResumes + totalCoverLetters,
        };

        cachedStats = mappedData;
        cacheTimestamp = now;
        setStats(mappedData);
      } catch {
        // Silently fail — components render a neutral placeholder
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data: stats, loading };
};