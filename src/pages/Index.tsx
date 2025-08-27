import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductShowcase from "@/components/ProductShowcase";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Categories />
      <ProductShowcase />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
