import { Card, CardContent } from "@/components/ui/card";
import { 
  Truck, 
  HeadphonesIcon, 
  ShieldCheck, 
  Wrench, 
  Package, 
  Clock 
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import WaveDivider from "./WaveDivider";

/**
 * ============================================
 * SERVICES SECTION BACKGROUND IMAGE
 * ============================================
 * To change the services background image:
 * 1. Replace the image file at: src/assets/services-bg.jpg
 * 2. Or update the import below with your new image path
 * ============================================
 */
import servicesBg from "@/assets/services-bg.jpg";

/**
 * ============================================
 * SERVICE ICONS
 * ============================================
 * To change service icons:
 * 1. Import new icons from lucide-react at the top
 * 2. Update the 'icon' property in the services array
 * 
 * Available colors for gradient:
 * - from-blue-500 to-cyan-500
 * - from-emerald-500 to-teal-500
 * - from-violet-500 to-purple-500
 * - from-orange-500 to-amber-500
 * - from-rose-500 to-pink-500
 * - from-indigo-500 to-blue-500
 * ============================================
 */

const Services = () => {
  const services = [
    {
      icon: Truck,
      title: "Nationwide Delivery",
      description: "Fast and reliable delivery service across Pakistan. We ensure your medical equipment reaches you safely and on time.",
      color: "from-blue-500 to-cyan-500",
      iconBg: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: ShieldCheck,
      title: "Quality Assurance",
      description: "All products come with manufacturer warranty and our quality guarantee. We only deal in 100% genuine products.",
      color: "from-emerald-500 to-teal-500",
      iconBg: "from-emerald-500/20 to-teal-500/20"
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Our dedicated support team is available around the clock to assist you with inquiries and technical support.",
      color: "from-violet-500 to-purple-500",
      iconBg: "from-violet-500/20 to-purple-500/20"
    },
    {
      icon: Wrench,
      title: "After-Sales Service",
      description: "Comprehensive after-sales support including maintenance, repairs, and spare parts for all products we sell.",
      color: "from-orange-500 to-amber-500",
      iconBg: "from-orange-500/20 to-amber-500/20"
    },
    {
      icon: Package,
      title: "Bulk Orders",
      description: "Special pricing for bulk orders. Perfect for hospitals, clinics, and healthcare institutions.",
      color: "from-rose-500 to-pink-500",
      iconBg: "from-rose-500/20 to-pink-500/20"
    },
    {
      icon: Clock,
      title: "Quick Quotations",
      description: "Get detailed quotations within 24 hours. Transparent pricing with no hidden charges.",
      color: "from-indigo-500 to-blue-500",
      iconBg: "from-indigo-500/20 to-blue-500/20"
    }
  ];

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* ============================================
          SERVICES BACKGROUND IMAGE
          Change the servicesBg import above to update
          ============================================ */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${servicesBg})` }}
      />
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/95 via-background/98 to-background" />
      
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-1/2 right-0 w-1/2 h-px bg-gradient-to-l from-transparent via-border to-transparent" />
      
      {/* Top Wave */}
      <WaveDivider position="top" variant="wave3" className="text-secondary/30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4 px-4 py-2 bg-primary/10 rounded-full backdrop-blur-sm">
            Our Services
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6 tracking-tight">
            Why Choose Aman Traders?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We go beyond just selling products. Our commitment to customer satisfaction 
            means you get comprehensive support at every step.
          </p>
        </AnimatedSection>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedSection 
              key={index}
              delay={index * 100}
              animation="fadeUp"
            >
              <Card 
                className="group h-full border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 overflow-hidden bg-card/80 backdrop-blur-md"
              >
                <CardContent className="p-8 h-full relative">
                  {/* Gradient Accent */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* ============================================
                      SERVICE ICON
                      To change: update the icon property above
                      ============================================ */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500`}>
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-500">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Bottom Wave */}
      <WaveDivider position="bottom" variant="wave1" className="text-background" />
    </section>
  );
};

export default Services;
