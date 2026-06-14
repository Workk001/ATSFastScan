
-- Create site_stats table to track aggregate scan statistics
CREATE TABLE public.site_stats (
  id TEXT PRIMARY KEY DEFAULT 'global',
  total_resume_scans INTEGER NOT NULL DEFAULT 0,
  total_cover_letter_scans INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial row
INSERT INTO public.site_stats (id, total_resume_scans, total_cover_letter_scans)
VALUES ('global', 0, 0);

-- Enable RLS
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read stats (public data)
CREATE POLICY "Anyone can read site stats"
ON public.site_stats
FOR SELECT
USING (true);

-- Only service role can update (via edge functions)
-- No INSERT/UPDATE/DELETE policies for anon/authenticated

-- Function to increment resume scan count
CREATE OR REPLACE FUNCTION public.increment_resume_scans()
RETURNS void AS $$
BEGIN
  UPDATE public.site_stats SET total_resume_scans = total_resume_scans + 1, updated_at = now() WHERE id = 'global';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to increment cover letter scan count
CREATE OR REPLACE FUNCTION public.increment_cover_letter_scans()
RETURNS void AS $$
BEGIN
  UPDATE public.site_stats SET total_cover_letter_scans = total_cover_letter_scans + 1, updated_at = now() WHERE id = 'global';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
