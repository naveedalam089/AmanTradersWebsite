-- Create contact_messages table for storing contact form submissions
CREATE TABLE public.contact_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Only admins can view messages
CREATE POLICY "Admins can view all messages"
ON public.contact_messages
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can insert a message (public contact form)
CREATE POLICY "Anyone can submit a contact message"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Admins can update messages (mark as read)
CREATE POLICY "Admins can update messages"
ON public.contact_messages
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete messages
CREATE POLICY "Admins can delete messages"
ON public.contact_messages
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create products table for admin to manage
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view products (public catalog)
CREATE POLICY "Products are viewable by everyone"
ON public.products
FOR SELECT
USING (true);

-- Only admins can insert products
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update products
CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete products
CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create product_categories table for admin to manage categories
CREATE TABLE public.product_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT NOT NULL DEFAULT 'Package',
    gradient TEXT NOT NULL DEFAULT 'from-primary/10 to-primary/5',
    icon_bg TEXT NOT NULL DEFAULT 'from-primary/20 to-primary/10',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view categories
CREATE POLICY "Categories are viewable by everyone"
ON public.product_categories
FOR SELECT
USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can insert categories"
ON public.product_categories
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
ON public.product_categories
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
ON public.product_categories
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create admin_settings table for storing admin credentials flag
CREATE TABLE public.admin_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view/modify settings
CREATE POLICY "Admins can view settings"
ON public.admin_settings
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
ON public.admin_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default product categories with initial data
INSERT INTO public.product_categories (name, description, icon_name, gradient, icon_bg, sort_order) VALUES
('Surgical Instruments', 'Complete range of surgical tools including forceps, scissors, scalpels, retractors, and more.', 'Scissors', 'from-rose-500/10 to-orange-500/10', 'from-rose-500/20 to-orange-500/20', 1),
('Diagnostic Equipment', 'High-quality diagnostic devices for accurate patient assessment and monitoring.', 'Stethoscope', 'from-blue-500/10 to-cyan-500/10', 'from-blue-500/20 to-cyan-500/20', 2),
('Patient Monitoring', 'Advanced monitoring systems for continuous patient observation and care.', 'Activity', 'from-emerald-500/10 to-teal-500/10', 'from-emerald-500/20 to-teal-500/20', 3),
('Disposables', 'Essential medical disposables for daily healthcare operations.', 'Syringe', 'from-violet-500/10 to-purple-500/10', 'from-violet-500/20 to-purple-500/20', 4),
('Laboratory Equipment', 'Reliable laboratory instruments for accurate testing and analysis.', 'Thermometer', 'from-amber-500/10 to-yellow-500/10', 'from-amber-500/20 to-yellow-500/20', 5),
('Emergency & ICU', 'Critical care equipment for emergency and intensive care units.', 'HeartPulse', 'from-red-500/10 to-pink-500/10', 'from-red-500/20 to-pink-500/20', 6),
('Orthopedic Products', 'Orthopedic instruments and implants for bone and joint procedures.', 'Pill', 'from-indigo-500/10 to-blue-500/10', 'from-indigo-500/20 to-blue-500/20', 7),
('Hospital Furniture', 'Quality hospital furniture for patient comfort and facility needs.', 'BedDouble', 'from-slate-500/10 to-gray-500/10', 'from-slate-500/20 to-gray-500/20', 8);

-- Insert default products
INSERT INTO public.products (category, name, sort_order) VALUES
('Surgical Instruments', 'Forceps', 1),
('Surgical Instruments', 'Scissors', 2),
('Surgical Instruments', 'Scalpels', 3),
('Surgical Instruments', 'Retractors', 4),
('Surgical Instruments', 'Clamps', 5),
('Diagnostic Equipment', 'Stethoscopes', 1),
('Diagnostic Equipment', 'BP Monitors', 2),
('Diagnostic Equipment', 'Pulse Oximeters', 3),
('Diagnostic Equipment', 'ECG Machines', 4),
('Diagnostic Equipment', 'Glucometers', 5),
('Patient Monitoring', 'Patient Monitors', 1),
('Patient Monitoring', 'Vital Signs', 2),
('Patient Monitoring', 'Telemetry Systems', 3),
('Disposables', 'Syringes', 1),
('Disposables', 'Gloves', 2),
('Disposables', 'Masks', 3),
('Disposables', 'Bandages', 4),
('Disposables', 'Catheters', 5),
('Laboratory Equipment', 'Thermometers', 1),
('Laboratory Equipment', 'Test Kits', 2),
('Laboratory Equipment', 'Centrifuges', 3),
('Laboratory Equipment', 'Microscopes', 4),
('Emergency & ICU', 'Defibrillators', 1),
('Emergency & ICU', 'Ventilators', 2),
('Emergency & ICU', 'Oxygen Concentrators', 3),
('Orthopedic Products', 'Instruments', 1),
('Orthopedic Products', 'Splints', 2),
('Orthopedic Products', 'Braces', 3),
('Orthopedic Products', 'Supports', 4),
('Hospital Furniture', 'Hospital Beds', 1),
('Hospital Furniture', 'Stretchers', 2),
('Hospital Furniture', 'Wheelchairs', 3),
('Hospital Furniture', 'Tables', 4);

-- Create team_members table for About section
CREATE TABLE public.team_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Anyone can view team members
CREATE POLICY "Team members are viewable by everyone"
ON public.team_members
FOR SELECT
USING (true);

-- Only admins can manage team members
CREATE POLICY "Admins can insert team members"
ON public.team_members
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update team members"
ON public.team_members
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete team members"
ON public.team_members
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default team members (placeholders)
INSERT INTO public.team_members (name, role, description, sort_order) VALUES
('Founder Name', 'Founder & CEO', 'With decades of experience in the medical equipment industry, our founder established Aman Traders with a vision to provide quality healthcare solutions.', 1),
('Son Name 1', 'Managing Director', 'Continuing the family legacy, bringing modern business practices and expanding our product range to serve healthcare professionals better.', 2),
('Son Name 2', 'Operations Director', 'Ensuring smooth operations and maintaining the high standards of quality and service that Aman Traders is known for.', 3);