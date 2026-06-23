import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import AIShowcaseSection from './AIShowcaseSection';
import TestimonialsSection from './TestimonialsSection';
import StatsSection from './StatsSection';
import PricingSection from './PricingSection';
import CTASection from './CTASection';
import Footer from './Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white overflow-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AIShowcaseSection />
        <TestimonialsSection />
        <StatsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
