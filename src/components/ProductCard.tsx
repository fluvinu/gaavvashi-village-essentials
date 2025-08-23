import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShoppingCart, Star, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  inStock: boolean;
}

const ProductCard = ({ 
  id,
  name, 
  description, 
  price, 
  originalPrice, 
  image, 
  rating = 4.8, 
  inStock 
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    await addToCart(id, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-golden text-golden" />
          <span className="text-sm text-muted-foreground">{rating}</span>
          <span className="text-sm text-muted-foreground">• {inStock ? 'In Stock' : 'Out of Stock'}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 text-foreground">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">₹{price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">₹{originalPrice}</span>
            )}
          </div>
          
          <Button 
            size="sm" 
            disabled={!inStock}
            onClick={handleAddToCart}
            className={`transition-colors ${
              isAdded 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;