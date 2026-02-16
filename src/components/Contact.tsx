import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, ArrowRight, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "./AnimatedSection";
import WaveDivider from "./WaveDivider";
import contactBg from "@/assets/contact-bg.jpg";

interface SiteSetting {
  setting_key: string;
  setting_value: string;
}

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value');

      if (error) throw error;
      
      const settingsMap: Record<string, string> = {};
      (data || []).forEach((s: SiteSetting) => {
        settingsMap[s.setting_key] = s.setting_value;
      });
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          subject: formData.subject.trim(),
          message: formData.message.trim()
        }]);

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Parse business hours into multiple lines
  const parseBusinessHours = (hours: string) => {
    if (!hours) return ["Mon - Sat: 9:00 AM - 7:00 PM", "Sunday: Closed"];
    return hours.split('|').map(h => h.trim());
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Address",
      details: [settings.contact_address || "Main Market, Lahore, Punjab, Pakistan"],
      color: "from-rose-500/20 to-orange-500/20"
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        settings.contact_phone_1 || "+92 300 1234567",
        settings.contact_phone_2 || "+92 42 1234567"
      ].filter(Boolean),
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Mail,
      title: "Email Address",
      details: [
        settings.contact_email_1 || "info@amantraders.com",
        settings.contact_email_2 || "sales@amantraders.com"
      ].filter(Boolean),
      color: "from-emerald-500/20 to-teal-500/20"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: parseBusinessHours(settings.business_hours || ""),
      color: "from-violet-500/20 to-purple-500/20"
    }
  ];

  const inputClasses = (fieldName: string) => `
    transition-all duration-300 border-2 bg-background/50 backdrop-blur-sm
    ${focusedField === fieldName ? 'border-primary shadow-lg shadow-primary/10' : 'border-border hover:border-primary/30'}
  `;

  const handleViewLocation = () => {
    const mapsUrl = settings.google_maps_url || 'https://maps.google.com/?q=31.5204,74.3587';
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${contactBg})` }}
      />
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/98 to-background" />
      
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Wave */}
      <WaveDivider position="top" variant="wave1" className="text-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4 px-4 py-2 bg-primary/10 rounded-full backdrop-blur-sm">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6 tracking-tight">
            Get In Touch With Us
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Have questions about our products or services? We're here to help. 
            Reach out to us and our team will respond promptly.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <AnimatedSection animation="fadeLeft">
            <Card className="border-border overflow-hidden bg-card/80 backdrop-blur-md">
              <CardContent className="p-8 md:p-10">
                <h3 className="text-2xl font-bold text-foreground mb-8">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Your Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="John Doe"
                        required
                        className={inputClasses('name')}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="john@example.com"
                        required
                        className={inputClasses('email')}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Phone Number
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="+92 300 1234567"
                        className={inputClasses('phone')}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Subject *
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Product Inquiry"
                        required
                        className={inputClasses('subject')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Your Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tell us about your requirements..."
                      rows={5}
                      required
                      className={inputClasses('message')}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full group shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-500" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send Message
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Contact Info */}
          <AnimatedSection animation="fadeRight" className="space-y-6">
            {contactInfo.map((info, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="group border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 overflow-hidden bg-card/80 backdrop-blur-md">
                  <CardContent className="p-6 relative">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="flex items-start gap-5 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-2 text-lg">{info.title}</h4>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}

            {/* Map Section - Full Width with Click to Redirect */}
            <AnimatedSection delay={400}>
              <Card className="border-border overflow-hidden group hover:border-primary/30 transition-all duration-500 bg-card/80 backdrop-blur-md">
                {settings.google_maps_embed ? (
                  <div className="relative">
                    <iframe
                      src={settings.google_maps_embed}
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full"
                    />
                    <Button
                      onClick={handleViewLocation}
                      className="absolute bottom-4 right-4 shadow-lg"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in Maps
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="h-48 bg-gradient-to-br from-muted to-secondary/50 flex items-center justify-center relative overflow-hidden cursor-pointer"
                    onClick={handleViewLocation}
                  >
                    {/* Animated Grid */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                      backgroundSize: '30px 30px',
                    }} />
                    
                    <div className="text-center relative z-10">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <MapPin className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground font-medium">Click to view our location</p>
                      <p className="text-sm text-primary mt-1 flex items-center justify-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Open in Google Maps
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </AnimatedSection>
          </AnimatedSection>
        </div>

        {/* Full Width Map Section */}
        {settings.google_maps_embed && (
          <AnimatedSection delay={500} className="mt-12">
            <Card className="border-border overflow-hidden bg-card/80 backdrop-blur-md">
              <div className="relative w-full">
                <iframe
                  src={settings.google_maps_embed}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium text-foreground">
                      {settings.contact_address || "Main Market, Lahore, Punjab, Pakistan"}
                    </p>
                  </div>
                  <Button
                    onClick={handleViewLocation}
                    className="shadow-lg"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        )}
      </div>

      {/* Bottom Wave */}
      <WaveDivider position="bottom" variant="wave2" className="text-foreground" />
    </section>
  );
};

export default Contact;
