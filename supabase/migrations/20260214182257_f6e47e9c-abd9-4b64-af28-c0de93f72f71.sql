
-- Fix storage policies for license-images to be admin-only
DROP POLICY IF EXISTS "Admins can upload license images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update license images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete license images" ON storage.objects;

CREATE POLICY "Authenticated users can upload license images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'license-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update license images" ON storage.objects FOR UPDATE USING (bucket_id = 'license-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete license images" ON storage.objects FOR DELETE USING (bucket_id = 'license-images' AND auth.role() = 'authenticated');
