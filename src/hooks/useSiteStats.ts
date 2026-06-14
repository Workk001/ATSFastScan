import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SiteStats {
  totalResumes: number;
  totalCoverLetters: number;
  totalScans: number;
}

export const useSiteStats = () => {
  return useQuery({
    queryKey: ["site-stats"],
    queryFn: async (): Promise<SiteStats> => {
      const { data, error } = await supabase
        .from("site_stats")
        .select("total_resume_scans, total_cover_letter_scans")
        .eq("id", "global")
        .single();

      if (error) throw error;

      const totalResumes = data?.total_resume_scans ?? 0;
      const totalCoverLetters = data?.total_cover_letter_scans ?? 0;

      return {
        totalResumes,
        totalCoverLetters,
        totalScans: totalResumes + totalCoverLetters,
      };
    },
    staleTime: 60_000, // cache for 1 minute
    refetchOnWindowFocus: false,
  });
};
