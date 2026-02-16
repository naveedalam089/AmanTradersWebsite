-- Create brands table for brand management
CREATE TABLE public.brands (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    logo_url text,
    website_url text,
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- RLS policies for brands
CREATE POLICY "Brands are viewable by everyone" 
ON public.brands 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert brands" 
ON public.brands 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update brands" 
ON public.brands 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete brands" 
ON public.brands 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_brands_updated_at
BEFORE UPDATE ON public.brands
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default brands from current static data
INSERT INTO public.brands (name, description, website_url, sort_order) VALUES
('BM', 'Surgical Instruments', 'https://www.bminstruments.com', 1),
('Biosafe', 'Safety Products', 'https://www.biosafe.com', 2),
('Certeza', 'Diagnostic Equipment', 'https://www.certeza.com.pk', 3),
('Maxcare', 'Patient Care', 'https://www.maxcare.com', 4),
('Medicare', 'Healthcare Solutions', 'https://www.medicare.com', 5),
('LifeCare', 'Medical Devices', 'https://www.lifecare.com', 6),
('MediPro', 'Professional Equipment', 'https://www.medipro.com', 7),
('HealthGuard', 'Safety & Hygiene', 'https://www.healthguard.com', 8);

-- Create storage bucket for brand logos
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-logos', 'brand-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for brand-logos bucket
CREATE POLICY "Brand logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'brand-logos');

CREATE POLICY "Admins can upload brand logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'brand-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update brand logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'brand-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete brand logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'brand-logos' AND has_role(auth.uid(), 'admin'::app_role));