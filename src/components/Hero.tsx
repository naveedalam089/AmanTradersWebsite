import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Award, Truck, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import WaveDivider from "./WaveDivider";

/**
 * ============================================
 * HERO SECTION BACKGROUND IMAGE
 * ============================================
 * To change the hero background image:
 * 1. Replace the image file at: src/assets/hero-bg.jpg
 * 2. Or update the import below with your new image path
 * ============================================
 */
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 md:pt-20 overflow-hidden">
      {/* ============================================
           HERO BACKGROUND IMAGE
           Change the heroBg import above to update
           ============================================ */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }} />

      
      {/* Dark Overlay for Text Visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      
      {/* Animated Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />


      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Animated Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-pulse" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge with Animation */}
          <div
            className={`inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2.5 rounded-full text-sm font-medium mb-8 border border-primary/20 backdrop-blur-sm transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

            <Shield className="w-4 h-4" />
            <span className="relative">Trusted Healthcare Products Distributors

              <span className="absolute -right-2 -top-1 w-2 h-2 bg-primary rounded-full animate-ping" />
            </span>
          </div>

          {/* Main Heading with Stagger Animation */}
          <h1
            className={`text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-8 tracking-tight transition-all duration-1000 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            Your Trusted Partner in
            <br />
            <span className="relative inline-block mt-2">
              <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Healthcare Solutions
              </span>
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-full transform origin-left transition-transform duration-1000 delay-700" style={{ transform: isLoaded ? 'scaleX(1)' : 'scaleX(0)' }} />
            </span>
          </h1>

          {/* Subheading */}
          <p
            className={`text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            Aman Traders is a leading distributor of high-quality surgical instruments, 
            medical equipment, and healthcare products. Authorized dealers of premium brands 
            serving hospitals, clinics, and healthcare professionals.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            <Button
              size="lg"
              className="text-lg px-10 py-6 group relative overflow-hidden shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-500"
              onClick={() => scrollToSection("#products")}>

              <span className="relative z-10 flex items-center gap-2">
                Explore Products
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-6 border-2 hover:bg-primary/5 hover:border-primary transition-all duration-500 bg-background/50 backdrop-blur-sm"
              onClick={() => scrollToSection("#contact")}>

              Request Quote
            </Button>
          </div>

          {/* Trust Indicators with Stagger */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {[
            { icon: Shield, title: "100% Genuine", subtitle: "Authentic Products", delay: 0 },
            { icon: Award, title: "Premium Brands", subtitle: "Top Quality", delay: 100 },
            { icon: Truck, title: "Fast Delivery", subtitle: "Nationwide", delay: 200 }].
            map((item, index) =>
            <div
              key={index}
              className="group flex items-center justify-center gap-4 p-5 bg-card/80 backdrop-blur-md rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
              style={{ transitionDelay: `${800 + item.delay}ms` }}>

                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground text-lg">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* One-time Scroll Arrow */}
      {isLoaded &&
      <div
        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        style={{
          animation: 'scrollArrowBounce 1.5s ease-in-out forwards'
        }}>

          <ChevronDown className="w-14 h-14 text-primary/60" strokeWidth={2.5} />
        </div>
      }
      <style>{`
        @keyframes scrollArrowBounce {
          0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          20% { opacity: 1; transform: translateX(-50%) translateY(0); }
          40% { opacity: 1; transform: translateX(-50%) translateY(15px); }
          60% { opacity: 1; transform: translateX(-50%) translateY(0); }
          80% { opacity: 0.5; transform: translateX(-50%) translateY(15px); }
          100% { opacity: 0; transform: translateX(-50%) translateY(30px); }
        }
      `}</style>

      {/* ============================================
           WAVE DIVIDER
           Customize: variant (wave1, wave2, wave3), flip
           ============================================ */}
      <WaveDivider position="bottom" variant="wave1" className="text-secondary/30" />
    </section>);

};

export default Hero;