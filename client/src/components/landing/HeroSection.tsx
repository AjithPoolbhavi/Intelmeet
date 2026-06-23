import React from 'react';
import { ArrowRight, Play, Zap, Users, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900" />

        {/* Animated Orbs */}
        <div className="absolute top-40 left-0 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-300 dark:bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, #8b5cf6 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 w-fit">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-300">
                Now with AI Transcription
              </span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                <span className="text-gray-900 dark:text-white">The Future of</span>{' '}
                <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                  Meeting & Collaboration
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                AI-powered video meetings, real-time collaboration, and intelligent transcription. Everything your team needs in one beautiful platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 px-8 py-3 text-lg gap-3"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
              <Button 
                variant="ghost" 
                size="lg"
                icon={<Play className="w-5 h-5" />}
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div>
                <div className="text-3xl font-bold text-purple-600">10M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Meetings</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-500">500K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-500">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 md:h-full min-h-96 animate-slide-in-right">
            {/* Premium Card */}
            <div className="absolute inset-0 glass rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl">
              {/* Video Preview */}
              <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl flex items-center justify-center border border-purple-300 dark:border-purple-700/30">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">
                    Premium Meeting Interface
                  </p>
                </div>
              </div>

              {/* Floating Features */}
              <div className="absolute -top-4 -right-4 glass px-4 py-2 rounded-lg border border-white/20 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-500" />
                  <span className="text-xs font-semibold">HD Video</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 glass px-4 py-2 rounded-lg border border-white/20 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold">AI Insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
