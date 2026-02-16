import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  Scissors, 
  Activity, 
  Pill, 
  Thermometer, 
  HeartPulse,
  Syringe,
  BedDouble,
  ArrowRight,
  Eye,
  Package,
  LucideIcon
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import WaveDivider from "./WaveDivider";
import ProductDialog from "./ProductDialog";
import { supabase } from "@/integrations/supabase/client";

/**
 * ============================================
 * PRODUCT CATEGORY ICONS
 * ============================================
 * Icon mapping for database-stored categories.
 * Add new icons here as needed.
 * ============================================
 */
const iconMap: Record<string, LucideIcon> = {
  Scissors,
  Stethoscope,
  Activity,
  Syringe,
  Thermometer,
  HeartPulse,
  Pill,
  BedDouble,
  Package
};

interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  icon_name: string;
  gradient: string;
  icon_bg: string;
  sort_order: number;
}

interface Product {
  id: string;
  category: string;
  name: string;
  is_available: boolean;
}

interface DisplayCategory {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
  gradient: string;
  iconBg: string;
}

const Products = () => {
  const [categories, setCategories] = useState<DisplayCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DisplayCategory | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      // Fetch categories and products in parallel
      const [categoriesRes, productsRes] = await Promise.all([
        supabase.from('product_categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('products').select('*').eq('is_available', true).order('sort_order', { ascending: true })
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (productsRes.error) throw productsRes.error;

      const dbCategories: ProductCategory[] = categoriesRes.data || [];
      const dbProducts: Product[] = productsRes.data || [];

      // Transform to display format
      const displayCategories: DisplayCategory[] = dbCategories.map(cat => ({
        icon: iconMap[cat.icon_name] || Package,
        title: cat.name,
        description: cat.description || '',
        items: dbProducts.filter(p => p.category === cat.name).map(p => p.name),
        gradient: cat.gradient,
        iconBg: cat.icon_bg
      }));

      setCategories(displayCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to default categories if database fails
      setCategories(defaultCategories);
    } finally {
      setIsLoading(false);
    }
  };

  // Default categories as fallback
  const defaultCategories: DisplayCategory[] = [
    {
      icon: Scissors,
      title: "Surgical Instruments",
      description: "Complete range of surgical tools including forceps, scissors, scalpels, retractors, and more.",
      items: ["Forceps", "Scissors", "Scalpels", "Retractors", "Clamps"],
      gradient: "from-rose-500/10 to-orange-500/10",
      iconBg: "from-rose-500/20 to-orange-500/20"
    },
    {
      icon: Stethoscope,
      title: "Diagnostic Equipment",
      description: "High-quality diagnostic devices for accurate patient assessment and monitoring.",
      items: ["Stethoscopes", "BP Monitors", "Pulse Oximeters", "ECG Machines", "Glucometers"],
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconBg: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Activity,
      title: "Patient Monitoring",
      description: "Advanced monitoring systems for continuous patient observation and care.",
      items: ["Patient Monitors", "Vital Signs", "Telemetry Systems"],
      gradient: "from-emerald-500/10 to-teal-500/10",
      iconBg: "from-emerald-500/20 to-teal-500/20"
    },
    {
      icon: Syringe,
      title: "Disposables",
      description: "Essential medical disposables for daily healthcare operations.",
      items: ["Syringes", "Gloves", "Masks", "Bandages", "Catheters"],
      gradient: "from-violet-500/10 to-purple-500/10",
      iconBg: "from-violet-500/20 to-purple-500/20"
    },
    {
      icon: Thermometer,
      title: "Laboratory Equipment",
      description: "Reliable laboratory instruments for accurate testing and analysis.",
      items: ["Thermometers", "Test Kits", "Centrifuges", "Microscopes"],
      gradient: "from-amber-500/10 to-yellow-500/10",
      iconBg: "from-amber-500/20 to-yellow-500/20"
    },
    {
      icon: HeartPulse,
      title: "Emergency & ICU",
      description: "Critical care equipment for emergency and intensive care units.",
      items: ["Defibrillators", "Ventilators", "Oxygen Concentrators"],
      gradient: "from-red-500/10 to-pink-500/10",
      iconBg: "from-red-500/20 to-pink-500/20"
    },
    {
      icon: Pill,
      title: "Orthopedic Products",
      description: "Orthopedic instruments and implants for bone and joint procedures.",
      items: ["Instruments", "Splints", "Braces", "Supports"],
      gradient: "from-indigo-500/10 to-blue-500/10",
      iconBg: "from-indigo-500/20 to-blue-500/20"
    },
    {
      icon: BedDouble,
      title: "Hospital Furniture",
      description: "Quality hospital furniture for patient comfort and facility needs.",
      items: ["Hospital Beds", "Stretchers", "Wheelchairs", "Tables"],
      gradient: "from-slate-500/10 to-gray-500/10",
      iconBg: "from-slate-500/20 to-gray-500/20"
    }
  ];

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section id="products" className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4 px-4 py-2 bg-primary/10 rounded-full">
            Our Products
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6 tracking-tight">
            Comprehensive Medical Equipment Solutions
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We offer an extensive range of medical and surgical instruments, 
            catering to all healthcare needs from small clinics to large hospitals.
          </p>
        </AnimatedSection>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="p-6 bg-card/50 rounded-lg border border-border">
                  <div className="w-16 h-16 bg-muted rounded-2xl mb-5" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Product Categories Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCategories.map((category, index) => (
              <AnimatedSection 
                key={index} 
                delay={index * 75}
                animation="scaleUp"
              >
                <Card 
                  className="group h-full border-border hover:border-primary/30 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 cursor-pointer bg-card/50 backdrop-blur-sm"
                >
                  <CardContent className="p-6 h-full flex flex-col relative">
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-500 relative`}>
                        <category.icon className="w-8 h-8 text-primary transition-all duration-500" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-500">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-5 line-clamp-2 flex-grow">
                        {category.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {category.items.slice(0, 3).map((item, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-primary/20 hover:text-primary"
                          >
                            {item}
                          </span>
                        ))}
                        {category.items.length > 3 && (
                          <span className="text-xs text-primary font-semibold px-2 py-1">
                            +{category.items.length - 3}
                          </span>
                        )}
                      </div>

                      {/* View Products Button - Always Visible */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category);
                          setDialogOpen(true);
                        }}
                        className="w-full mt-2 group/btn border-primary/30 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        <span>View Products</span>
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* Product Dialog */}
        <ProductDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          category={selectedCategory}
        />

        {/* CTA */}
        <AnimatedSection delay={600} className="text-center mt-16">
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-card to-secondary/30 border border-border backdrop-blur-sm">
            <p className="text-muted-foreground mb-6 text-lg">
              Can't find what you're looking for? We have a wide inventory of medical products.
            </p>
            <Button 
              size="lg" 
              onClick={scrollToContact}
              className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-500 group"
            >
              <span>Request Product Catalog</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </AnimatedSection>
      </div>

      {/* Bottom Wave Divider */}
      <WaveDivider position="bottom" variant="wave3" className="text-secondary/30" />
    </section>
  );
};

export default Products;
