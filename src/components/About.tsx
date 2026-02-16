import { CheckCircle, Target, Eye, Heart } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import WaveDivider from "./WaveDivider";
import TeamMembers from "./TeamMembers";
import LicensesCertifications from "./LicensesCertifications";

/**
 * ============================================
 * ABOUT SECTION BACKGROUND IMAGE
 * ============================================
 * To change the about background image:
 * 1. Replace the image file at: src/assets/about-bg.jpg
 * 2. Or update the import below with your new image path
 * ============================================
 */
import aboutBg from "@/assets/about-bg.jpg";

const About = () => {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.3 });

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To provide healthcare professionals with the highest quality medical instruments and equipment, ensuring better patient care and outcomes."
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "To become the most trusted and preferred distributor of medical equipment in the region, known for quality, reliability, and exceptional service."
    },
    {
      icon: Heart,
      title: "Our Values",
      description: "Integrity, quality, customer satisfaction, and commitment to advancing healthcare through reliable medical solutions."
    }];


  const highlights = [
    "Authorized distributors of leading medical brands",
    "Wide range of surgical and medical instruments",
    "Serving hospitals, clinics, and healthcare facilities",
    "Competitive pricing with quality assurance",
    "Expert guidance and product consultation",
    "Reliable after-sales support and service"];


  const stats = [
    { number: 1, suffix: "K+", label: "Products" },
    { number: 20, suffix: "+", label: "Premium Brands" },
    { number: 1, suffix: "M+", label: "Happy Clients" },
    { number: 24, suffix: "/7", label: "Support" }];


  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* ============================================
           ABOUT BACKGROUND IMAGE
           Change the aboutBg import above to update
           ============================================ */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${aboutBg})` }} />


      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/95 via-background/98 to-background" />

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      {/* Top Wave Divider */}
      <WaveDivider position="top" variant="wave1" className="text-secondary/30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4 px-4 py-2 bg-primary/10 rounded-full backdrop-blur-sm">
            About Us
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6 tracking-tight">
            Committed to Excellence in Healthcare
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Aman Traders has established itself as a premier distributor of medical and surgical
            instruments, serving the healthcare industry with dedication and integrity.
          </p>
        </AnimatedSection>

        {/* Team Members Cards */}
        <TeamMembers />

        {/* Licenses & Certifications */}
        <LicensesCertifications />

        <div className="grid lg:grid-cols-2 gap-16 items-center mt-20">
          {/* Left Content */}
          <AnimatedSection animation="fadeLeft">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">
              Your Reliable Partner in Medical Equipment Distribution
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed text-lg">At Aman Traders, we understand the critical importance of quality medical equipment in healthcare delivery. As authorized distributors of renowned brands like B.Braun, BM, Certeza, Medico, Medicare, Intra-Health, and many more, we ensure that healthcare professionals have access to the best tools and equipment.




            </p>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Our extensive product range includes surgical instruments, diagnostic equipment,
              patient care products, and various healthcare essentials. We take pride in our
              commitment to quality, competitive pricing, and excellent customer service.
            </p>

            {/* Highlights */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, index) =>
                <AnimatedSection
                  key={index}
                  delay={index * 100}
                  className="flex items-start gap-3 group">

                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary transition-colors duration-500">
                    <CheckCircle className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                  </div>
                  <span className="text-foreground font-medium">{item}</span>
                </AnimatedSection>
              )}
            </div>
          </AnimatedSection>

          {/* Right Content - Values */}
          <div className="space-y-6">
            {values.map((value, index) =>
              <AnimatedSection
                key={index}
                animation="fadeRight"
                delay={index * 150}>

                <div className="group p-8 bg-card/80 backdrop-blur-md rounded-2xl border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                  <div className="flex items-start gap-5">
                    {/* ============================================
                       VALUE ICONS
                       These use Lucide icons. To change:
                       1. Import different icons from lucide-react
                       2. Update the icon property in the values array
                       ============================================ */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-3">{value.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24">
          {stats.map((stat, index) =>
            <div
              key={index}
              className={`text-center p-8 bg-card/80 backdrop-blur-md rounded-2xl border border-border hover:border-primary/30 transition-all duration-700 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`
              }
              style={{ transitionDelay: `${index * 150}ms` }}>

              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <span className="tabular-nums">
                  {statsVisible ? stat.number : 0}
                </span>
                <span>{stat.suffix}</span>
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <WaveDivider position="bottom" variant="wave2" className="text-background" />
    </section>);

};

export default About;