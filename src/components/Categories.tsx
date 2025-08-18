import { Card, CardContent } from "@/components/ui/card";
import { Wheat, Droplets, Cookie, Leaf, TreePine, Sparkles } from "lucide-react";

const categories = [
  {
    name: "Grains & Flours",
    icon: Wheat,
    description: "Organic grains and traditional flours",
    color: "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800"
  },
  {
    name: "Dairy Products", 
    icon: Droplets,
    description: "Pure ghee and dairy from village cows",
    color: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800"
  },
  {
    name: "Natural Sweeteners",
    icon: Cookie, 
    description: "Jaggery and honey from villages",
    color: "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-800"
  },
  {
    name: "Organic Pulses",
    icon: Leaf,
    description: "Chemical-free lentils and beans", 
    color: "bg-gradient-to-br from-green-100 to-green-200 text-green-800"
  },
  {
    name: "Traditional Items",
    icon: TreePine,
    description: "Cow dung cakes and village essentials",
    color: "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800"
  },
  {
    name: "Special Products",
    icon: Sparkles,
    description: "Unique village specialties",
    color: "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-800"
  }
];

const Categories = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Explore Our Categories
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover authentic products organized by traditional village categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.name} className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-full mb-4 ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{category.name}</h3>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;