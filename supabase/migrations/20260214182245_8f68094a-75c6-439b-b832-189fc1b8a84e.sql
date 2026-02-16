
-- Create licenses_certifications table
CREATE TABLE public.licenses_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.licenses_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Licenses are viewable by everyone" ON public.licenses_certifications FOR SELECT USING (true);
CREATE POLICY "Admins can insert licenses" ON public.licenses_certifications FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update licenses" ON public.licenses_certifications FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete licenses" ON public.licenses_certifications FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON public.licenses_certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for license images
INSERT INTO storage.buckets (id, name, public) VALUES ('license-images', 'license-images', true);

CREATE POLICY "License images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'license-images');
CREATE POLICY "Admins can upload license images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'license-images');
CREATE POLICY "Admins can update license images" ON storage.objects FOR UPDATE USING (bucket_id = 'license-images');
CREATE POLICY "Admins can delete license images" ON storage.objects FOR DELETE USING (bucket_id = 'license-images');
