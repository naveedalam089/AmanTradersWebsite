
-- Create site-logos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('site-logos', 'site-logos', true);

-- Allow anyone to view logos
CREATE POLICY "Site logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-logos');

-- Allow admins to upload logos
CREATE POLICY "Admins can upload site logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-logos'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to update logos
CREATE POLICY "Admins can update site logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-logos'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to delete logos
CREATE POLICY "Admins can delete site logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-logos'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
