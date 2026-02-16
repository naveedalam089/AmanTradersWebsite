import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Send, Quote, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "./AnimatedSection";
import WaveDivider from "./WaveDivider";

/**
 * ============================================
 * REVIEWS SECTION
 * ============================================
 * This section displays customer reviews and allows
 * users to submit their own feedback.
 * 
 * Reviews are stored in the database and updated
 * in real-time.
 * ============================================
 */

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  created_at: string;
}

const ReviewText = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);
  const needsClamp = text.length > 150;

  return (
    <div>
      <p className={`text-muted-foreground leading-relaxed ${!expanded && needsClamp ? 'line-clamp-3' : ''}`}>
        {text}
      </p>
      {needsClamp && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary text-sm font-medium mt-1 hover:underline"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

const Reviews = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    review: ""
  });

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('reviews-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReviews(prev => [payload.new as Review, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          rating: formData.rating,
          review: formData.review.trim()
        });

      if (error) throw error;

      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback. Your review has been added.",
      });

      setFormData({ name: "", email: "", rating: 5, review: "" });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <section id="reviews" className="py-24 relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary/50">
      {/* Top Wave */}
      <WaveDivider position="top" variant="wave1" className="text-background" />
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4 px-4 py-2 bg-primary/10 rounded-full backdrop-blur-sm">
            Customer Reviews
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Don't just take our word for it. See what healthcare professionals 
            and institutions have to say about our products and services.
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
                {averageRating}
                <Star className="w-8 h-8 fill-primary text-primary" />
              </div>
              <p className="text-muted-foreground text-sm mt-1">Average Rating</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">{reviews.length}</div>
              <p className="text-muted-foreground text-sm mt-1">Total Reviews</p>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Submit Review Form */}
          <AnimatedSection animation="fadeLeft">
            <Card className="border-border bg-card/80 backdrop-blur-md overflow-hidden sticky top-24">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Quote className="w-6 h-6 text-primary" />
                  Share Your Experience
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Your Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="bg-background/50 border-border focus:border-primary transition-colors"
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
                        placeholder="john@example.com"
                        required
                        className="bg-background/50 border-border focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Your Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              star <= formData.rating
                                ? 'fill-primary text-primary'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Your Review *
                    </label>
                    <Textarea
                      name="review"
                      value={formData.review}
                      onChange={handleChange}
                      placeholder="Share your experience with our products and services..."
                      rows={4}
                      required
                      className="bg-background/50 border-border focus:border-primary transition-colors resize-none"
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
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Review
                        <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Reviews List */}
          <AnimatedSection animation="fadeRight" className="space-y-6">
            {isLoading ? (
              // Loading skeletons
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-border bg-card/50 animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-muted rounded w-1/3" />
                          <div className="h-3 bg-muted rounded w-1/4" />
                          <div className="h-16 bg-muted rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <Card className="border-border bg-card/50">
                <CardContent className="p-12 text-center">
                  <Quote className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                  <h4 className="text-lg font-semibold text-foreground mb-2">No Reviews Yet</h4>
                  <p className="text-muted-foreground">Be the first to share your experience!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {reviews.map((review, index) => (
                  <AnimatedSection key={review.id} delay={index * 100}>
                    <Card className="group border-border bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 overflow-hidden">
                      <CardContent className="p-6 relative">
                        {/* Quote decoration */}
                        <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors duration-500" />
                        
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-center justify-between gap-4 mb-2">
                              <h4 className="font-bold text-foreground truncate">{review.name}</h4>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(review.created_at)}
                              </span>
                            </div>
                            
                            {/* Rating */}
                            <div className="flex gap-1 mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? 'fill-primary text-primary'
                                      : 'text-muted-foreground/30'
                                  }`}
                                />
                              ))}
                            </div>
                            
                            {/* Review Text */}
                            <ReviewText text={review.review} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>

      {/* Bottom Wave */}
      <WaveDivider position="bottom" variant="wave2" className="text-background" />
    </section>
  );
};

export default Reviews;
