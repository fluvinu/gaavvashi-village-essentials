import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";

// Sample product data - in real app this would come from your database
const products = [
  {
    id: "1",
    name: "Pure Village Ghee",
    description: "Traditional cow ghee made in village using ancient methods. Rich in nutrients and authentic taste.",
    price: 450,
    originalPrice: 500,
    image: "https://images.unsplash.com/photo-1589881133595-acd14a11dc3b?w=400&h=400&fit=crop",
    rating: 4.9,
    inStock: true
  },
  {
    id: "2", 
    name: "Organic Jaggery",
    description: "Chemical-free jaggery made from pure sugarcane. Perfect natural sweetener for your family.",
    price: 120,
    originalPrice: 150,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    rating: 4.8,
    inStock: true
  },
  {
    id: "3",
    name: "Fresh Sattu Powder",
    description: "Roasted gram flour rich in protein. Traditional village breakfast and energy drink base.",
    price: 80,
    image: "https://images.unsplash.com/photo-1583736237004-d88892b23e12?w=400&h=400&fit=crop",
    rating: 4.7,
    inStock: true
  },
  {
    id: "4",
    name: "Organic Pulses Mix",
    description: "Premium quality mixed lentils grown without chemicals. Perfect for healthy daily meals.",
    price: 200,
    originalPrice: 220,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    rating: 4.8,
    inStock: true
  },
  {
    id: "5",
    name: "Cow Dung Cakes",
    description: "Dried cow dung cakes for traditional cooking and religious ceremonies. Completely natural.",
    price: 50,
    image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=400&fit=crop",
    rating: 4.6,
    inStock: false
  },
  {
    id: "6",
    name: "Village Honey",
    description: "Pure honey collected from village beehives. No processing, just natural sweetness.",
    price: 350,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    rating: 4.9,
    inStock: true
  }
];

const ProductShowcase = () => {
  return (
    <section id="products" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Village Treasures
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked authentic products from Indian villages, bringing you the 
            finest organic and traditional items straight from the source.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;