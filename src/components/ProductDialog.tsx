import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

/**
 * ============================================
 * PRODUCT DIALOG COMPONENT
 * ============================================
 * Displays a list of products for a category
 * when the user clicks "View Products"
 * 
 * To customize products:
 * 1. Update the items array in Products.tsx
 * ============================================
 */

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: {
    icon: LucideIcon;
    title: string;
    description: string;
    items: string[];
    gradient: string;
    iconBg: string;
  } | null;
}

const ProductDialog = ({ open, onOpenChange, category }: ProductDialogProps) => {
  if (!category) return null;

  const Icon = category.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-md border-border">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.iconBg} flex items-center justify-center`}>
              <Icon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                {category.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {category.description}
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
            Available Products
          </h4>
          <div className="grid gap-2">
            {category.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors duration-300 group"
              >
                <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-125 transition-transform duration-300" />
                <span className="text-foreground font-medium">{item}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  In Stock
                </Badge>
              </div>
            ))}
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground text-center">
            Contact us for pricing and availability
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
