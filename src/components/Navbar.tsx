import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase.from('site_settings').select('setting_value').eq('setting_key', 'site_logo_url').maybeSingle();
      if (data?.setting_value) setLogoUrl(data.setting_value);
    };
    fetchLogo();
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About Us" },
    { href: "#products", label: "Products" },
    { href: "#brands", label: "Brands" },
    { href: "#services", label: "Services" },
    { href: "#reviews", label: "Reviews" },
    { href: "#contact", label: "Contact" }];


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navLinks.map((link) => link.href.substring(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || isOpen ?
          "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg shadow-foreground/5" :
          "bg-transparent"}`
      }>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => scrollToSection("#home")}>
            {logoUrl ?
              <img src={logoUrl} alt="Aman Traders" className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-contain shadow-lg group-hover:scale-105 transition-all duration-500" /> :

              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-500 group-hover:scale-105">
                <span className="text-primary-foreground font-bold text-lg md:text-xl">AT</span>
              </div>
            }
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-lg md:text-xl tracking-tight">Aman Traders</span>
              <span className="text-xs text-muted-foreground hidden sm:block tracking-wide">Healthcare Products Distributors</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-lg ${activeSection === link.href.substring(1) ?
                    "text-primary" :
                    "text-muted-foreground hover:text-foreground"}`
                }>

                {link.label}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300 ${activeSection === link.href.substring(1) ? "w-6" : "w-0"}`
                  } />

              </button>
            )}
          </div>

          {/* Contact Button */}
          <div className="hidden md:flex items-center">
            <Button
              onClick={() => scrollToSection("#contact")}
              className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-500">

              Get Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu">

            <div className="relative w-6 h-6">
              <span className={`absolute left-0 block w-6 h-0.5 bg-foreground rounded transition-all duration-300 ${isOpen ? 'top-3 rotate-45' : 'top-1'}`} />
              <span className={`absolute left-0 top-3 block w-6 h-0.5 bg-foreground rounded transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 block w-6 h-0.5 bg-foreground rounded transition-all duration-300 ${isOpen ? 'top-3 -rotate-45' : 'top-5'}`} />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`
          }>

          <div className="py-4 border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, index) =>
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-left py-3 px-4 rounded-lg font-medium transition-all duration-300 ${activeSection === link.href.substring(1) ?
                      "text-primary bg-primary/10" :
                      "text-muted-foreground hover:text-foreground hover:bg-muted"}`
                  }
                  style={{ transitionDelay: `${index * 50}ms` }}>

                  {link.label}
                </button>
              )}
              <Button
                className="mt-4 shadow-lg shadow-primary/25"
                onClick={() => scrollToSection("#contact")}>

                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>);

};

export default Navbar;