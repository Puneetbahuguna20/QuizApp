// import Hero from "@/components/hero/Hero";
// import Header from "@/shared/components/Header";
import Home from "@/pages/Home";
// import Header from "@/components/Header"; // Optional
// import Hero from "@/components/Hero";    // Optional
import  FeaturesSection  from "@/pages/Feature";
import  QuizTopicsSection  from "@/pages/QuizTopicsSection";
import  CallToActionSection  from "@/pages/CallToActionSection";
import Footer  from "@/pages/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
     
      <Home />
      <FeaturesSection />
     <QuizTopicsSection />
     <CallToActionSection /> 
      <Footer />  
    </div>
  );
};

export default Index;
