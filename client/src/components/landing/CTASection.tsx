import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const CTASection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900 via-purple-800 to-cyan-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Ready to Transform Your Meetings?
        </h2>

        {/* Subheading */}
        <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
          Join thousands of teams already using IntellMeet to collaborate better, meet smarter, and accomplish more together.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 py-8 border-y border-white/20">
          <div>
            <div className="text-3xl font-bold text-white">500K+</div>
            <div className="text-sm text-purple-200">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">99.9%</div>
            <div className="text-sm text-purple-200">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">10M+</div>
            <div className="text-sm text-purple-200">Meetings</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/register"
            className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg gap-3"
          >
            <span>Start Your Free Trial</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Button 
            variant="ghost" 
            size="lg"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Schedule a Demo
          </Button>
        </div>

        {/* Trust Badge */}
        <div className="pt-4 space-y-2">
          <p className="text-sm text-purple-200">
            ✓ No credit card required  ✓ 14-day free trial  ✓ Enterprise-grade security
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
