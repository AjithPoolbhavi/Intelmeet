import React from 'react';
import { Video, MessageSquare, Zap, Users, Brain, Lock, BarChart3, Share2 } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Crystal Clear Video',
    description: 'HD quality video conferencing with adaptive bandwidth for seamless meetings.',
    gradient: 'from-purple-600 to-purple-400',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Chat',
    description: 'Instant messaging with file sharing and inline reactions.',
    gradient: 'from-cyan-600 to-cyan-400',
  },
  {
    icon: Brain,
    title: 'AI Transcription',
    description: 'Automatic meeting transcription and intelligent summaries powered by AI.',
    gradient: 'from-pink-600 to-pink-400',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Workspace management, shared documents, and team coordination tools.',
    gradient: 'from-green-600 to-green-400',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track meeting metrics, productivity insights, and team performance.',
    gradient: 'from-orange-600 to-orange-400',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'End-to-end encryption and compliance with industry standards.',
    gradient: 'from-blue-600 to-blue-400',
  },
  {
    icon: Share2,
    title: 'Screen Sharing',
    description: 'Share screens, presentations, and collaborate in real-time.',
    gradient: 'from-indigo-600 to-indigo-400',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Low-latency performance optimized for professional meetings.',
    gradient: 'from-yellow-600 to-yellow-400',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Packed with <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">Premium Features</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need for professional meetings and seamless collaboration.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group glass rounded-2xl p-6 border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 backdrop-blur-xl animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-current/30 transition-all`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 to-cyan-500/0 group-hover:from-purple-600/5 group-hover:to-cyan-500/5 transition-all duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
