import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteStats {
  totalResumes: number;
  totalCoverLetters: number;
  totalScans: number;
}

// Module-level cache — persists across component mounts
// but resets on page refresh
let cachedStats: SiteStats | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useSiteStats = () => {
  const [stats, setStats] = useState<SiteStats>(
    cachedStats || {
      totalResumes: 140,
      totalCoverLetters: 0,
      totalScans: 140,
    }
  );
  const [loading, setLoading] = useState(!cachedStats);

  useEffect(() => {
    const now = Date.now();

    // Return cached data if fresh
    if (cachedStats && (now - cacheTimestamp) < CACHE_TTL) {
      setStats(cachedStats);
      setLoading(false);
      return;
    }

    // Fetch fresh data
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from("site_stats")
          .select("total_resume_scans, total_cover_letter_scans")
          .eq("id", "global")
          .single();

        if (data && !error) {
          const totalResumes = data.total_resume_scans ?? 0;
          const totalCoverLetters = data.total_cover_letter_scans ?? 0;
          const mappedData = {
            totalResumes,
            totalCoverLetters,
            totalScans: totalResumes + totalCoverLetters,
          };
          cachedStats = mappedData;
          cacheTimestamp = now;
          setStats(mappedData);
        }
      } catch {
        // Silently fail — show default values
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data: stats, loading };
};
