import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "./AnimatedSection";
import WaveDivider from "./WaveDivider";
import { supabase } from "@/integrations/supabase/client";

interface Brand {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
}

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section id="brands" className="py-24 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
        <WaveDivider position="top" variant="wave2" className="text-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="h-8 w-48 bg-primary-foreground/20 rounded-full mx-auto mb-6 animate-pulse" />
            <div className="h-12 w-96 bg-primary-foreground/20 rounded mx-auto mb-4 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-primary-foreground/10 rounded-2xl p-8 animate-pulse">
                <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 mx-auto mb-5" />
                <div className="h-6 bg-primary-foreground/20 rounded w-2/3 mx-auto mb-2" />
                <div className="h-4 bg-primary-foreground/20 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        </div>
        <WaveDivider position="bottom" variant="wave3" className="text-secondary/30" />
      </section>
    );
  }

  if (brands.length === 0) {
    return null;
  }

  return (
    <section id="brands" className="py-24 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
      {/* Top Wave */}
      <WaveDivider position="top" variant="wave2" className="text-background" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Floating Shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            Authorized Distributors
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 tracking-tight">
            Premium Brands We Distribute
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            As authorized distributors of leading medical brands, we ensure you receive 
            only genuine, high-quality products with manufacturer warranty and support.
          </p>
        </AnimatedSection>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <AnimatedSection 
              key={brand.id}
              animation="scaleUp"
              delay={index * 100}
            >
              <a 
                href={brand.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (brand.website_url) {
                    e.preventDefault();
                    window.open(brand.website_url, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="group relative bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center transition-all duration-500 border border-primary-foreground/10 hover:bg-primary-foreground/20 hover:border-primary-foreground/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 cursor-pointer overflow-hidden block"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent skew-x-12" />
                </div>
                
                {/* Brand Logo */}
                <div className="relative w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-primary-foreground/30 to-primary-foreground/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                  {brand.logo_url ? (
                    <img 
                      src={brand.logo_url} 
                      alt={brand.name} 
                      className="w-full h-full object-contain p-2" 
                    />
                  ) : (
                    <span className="text-3xl font-bold tracking-tight">{brand.name.charAt(0)}</span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-2 tracking-tight">{brand.name}</h3>
                {brand.description && (
                  <p className="text-sm text-primary-foreground/70">{brand.description}</p>
                )}
                
                {/* External Link Indicator */}
                {brand.website_url && (
                  <div className="mt-3 text-xs text-primary-foreground/50 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Visit Official Site</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                )}
              </a>
            </AnimatedSection>
          ))}
        </div>

        {/* Additional Info */}
        <AnimatedSection delay={800} className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary-foreground/10 border border-primary-foreground/20">
            <span className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
            <p className="text-primary-foreground/90 font-medium">
              And many more trusted brands... We're constantly expanding our partnerships.
            </p>
          </div>
        </AnimatedSection>
      </div>

      {/* Bottom Wave */}
      <WaveDivider position="bottom" variant="wave3" className="text-secondary/30" />
    </section>
  );
};

export default Brands;
