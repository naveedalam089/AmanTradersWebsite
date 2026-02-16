import { useState, useEffect } from "react";
import { User } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

const TeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-6 mt-16">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="p-8 bg-card/60 rounded-2xl border border-border">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4" />
              <div className="h-6 bg-muted rounded w-2/3 mx-auto mb-2" />
              <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-4/5 mx-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) return null;

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-16">
      {members.map((member, index) => (
        <AnimatedSection
          key={member.id}
          animation="fadeUp"
          delay={index * 150}
        >
          <div className="group p-8 bg-card/80 backdrop-blur-md rounded-2xl border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 text-center h-full">
            {/* Avatar */}
            <div className="relative mx-auto mb-6 w-28 h-28">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 group-hover:scale-110 transition-transform duration-500" />
              {member.image_url ? (
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover relative z-10 border-4 border-card"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative z-10 border-4 border-card">
                  <User className="w-12 h-12 text-primary" />
                </div>
              )}
            </div>

            {/* Name & Role */}
            <h4 className="text-xl font-bold text-foreground mb-1">{member.name}</h4>
            <p className="text-primary font-medium text-sm mb-4">{member.role}</p>

            {/* Description */}
            {member.description && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {member.description}
              </p>
            )}
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
};

export default TeamMembers;
