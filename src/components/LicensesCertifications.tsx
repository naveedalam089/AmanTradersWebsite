import { useState, useEffect } from "react";
import { Award } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { supabase } from "@/integrations/supabase/client";

interface License {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

const LicensesCertifications = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const { data, error } = await supabase
          .from("licenses_certifications")
          .select("*")
          .order("sort_order", { ascending: true });
        if (error) throw error;
        setLicenses(data || []);
      } catch (error) {
        console.error("Error fetching licenses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLicenses();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-20">
        <div className="text-center mb-10">
          <div className="h-6 bg-muted rounded w-48 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-muted rounded w-72 mx-auto animate-pulse" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse p-6 bg-card/60 rounded-2xl border border-border">
              <div className="h-40 bg-muted rounded-xl mb-4" />
              <div className="h-5 bg-muted rounded w-2/3 mb-2" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (licenses.length === 0) return null;

  return (
    <div className="mt-20">
      <AnimatedSection className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Award className="w-6 h-6 text-primary" />
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            Licenses & Certifications
          </h3>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our commitment to quality is backed by industry-recognized certifications and licenses.
        </p>
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {licenses.map((license, index) => (
          <AnimatedSection key={license.id} animation="fadeUp" delay={index * 150}>
            <div className="group p-6 bg-card/80 backdrop-blur-md rounded-2xl border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 h-full">
              {license.image_url && (
                <div className="mb-4 rounded-xl overflow-hidden bg-muted/30">
                  <img
                    src={license.image_url}
                    alt={license.title}
                    className="w-full h-48 object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}
              <h4 className="text-lg font-bold text-foreground mb-2">{license.title}</h4>
              {license.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {license.description}
                </p>
              )}
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default LicensesCertifications;
