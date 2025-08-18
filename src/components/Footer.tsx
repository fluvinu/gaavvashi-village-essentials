import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-earth-brown text-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-golden">GaavVashi</h3>
            <p className="mb-4 text-cream/80">
              Bringing authentic village products to your doorstep. 
              Experience the purity and tradition of rural India.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-cream hover:text-golden hover:bg-warm-brown">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-cream hover:text-golden hover:bg-warm-brown">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-cream hover:text-golden hover:bg-warm-brown">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-golden">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-cream/80 hover:text-golden transition-colors">Home</a></li>
              <li><a href="#products" className="text-cream/80 hover:text-golden transition-colors">Products</a></li>
              <li><a href="#" className="text-cream/80 hover:text-golden transition-colors">About Us</a></li>
              <li><a href="#" className="text-cream/80 hover:text-golden transition-colors">Contact</a></li>
              <li><a href="#" className="text-cream/80 hover:text-golden transition-colors">My Orders</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-golden">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-cream/80 hover:text-golden transition-colors">Dairy Products</a></li>
              <li><a href="#" className="text-cream/80 hover:text-golden transition-colors">Organic Grains</a></li>
              <li><a href="#" className="text-cream/80 hover:text-golden transition-colors">Natural Sweeteners</a></li>
              <li><a href="#" className="text-cream/80 hover:text-golden transition-colors">Pulses & Lentils</a></li>
              <li><a href="#" className="text-cream/80 hover:text-golden transition-colors">Traditional Items</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-golden">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-golden" />
                <span className="text-cream/80 text-sm">Village Markets, Rural India</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-golden" />
                <span className="text-cream/80 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-golden" />
                <span className="text-cream/80 text-sm">hello@gaavvashi.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-warm-brown mt-8 pt-8 text-center">
          <p className="text-cream/60 text-sm">
            © 2024 GaavVashi. All rights reserved. Bringing village goodness to your home.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;