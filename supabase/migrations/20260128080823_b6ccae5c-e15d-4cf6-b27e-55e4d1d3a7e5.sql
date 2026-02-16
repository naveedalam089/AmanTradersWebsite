-- Create function to update timestamps if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create site_settings table for dynamic contact information
CREATE TABLE public.site_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key text NOT NULL UNIQUE,
    setting_value text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for site_settings
CREATE POLICY "Site settings are viewable by everyone" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update site settings" 
ON public.site_settings 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert site settings" 
ON public.site_settings 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site settings" 
ON public.site_settings 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default contact settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
('contact_address', 'Main Market, Lahore, Punjab, Pakistan'),
('contact_phone_1', '+92 300 1234567'),
('contact_phone_2', '+92 42 1234567'),
('contact_email_1', 'info@amantraders.com'),
('contact_email_2', 'sales@amantraders.com'),
('business_hours', 'Mon - Sat: 9:00 AM - 7:00 PM | Sunday: Closed'),
('google_maps_url', 'https://maps.google.com/?q=31.5204,74.3587'),
('google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3403.0876036894!2d74.35655!3d31.52045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzEzLjYiTiA3NMKwMjEnMjMuNiJF!5e0!3m2!1sen!2s!4v1609459200000!5m2!1sen!2s');

-- Create storage bucket for team member images
INSERT INTO storage.buckets (id, name, public) VALUES ('team-images', 'team-images', true);

-- Storage policies for team-images bucket
CREATE POLICY "Team images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'team-images');

CREATE POLICY "Admins can upload team images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'team-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update team images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'team-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete team images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'team-images' AND has_role(auth.uid(), 'admin'::app_role));