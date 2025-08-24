import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Heart, Shield } from "lucide-react";
import heroImage from "@/assets/hero-village-products.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Authentic village products from GaavVashi" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-earth-brown/90 via-earth-brown/60 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Pure Village Products
            <span className="block text-golden">Straight to Your Home</span>
          </h1>
          
          <p className="text-xl mb-8 text-cream opacity-90">
            Discover authentic, organic products from Indian villages. 
            From fresh Sattu and golden Ghee to traditional Jaggery - 
            experience the purity of rural India.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-golden text-earth-brown hover:bg-golden/90 font-semibold">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-earth-brown hover:bg-white hover:text-black" >
              Learn More
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-golden" />
              <span>100% Organic</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-golden" />
              <span>Village Sourced</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-golden" />
              <span>Quality Assured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;