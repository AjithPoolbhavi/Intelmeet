import React, { useState } from 'react';
import { BookOpen, Sparkles, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

export const AIShowcaseSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('transcription');

  const content = {
    transcription: {
      icon: BookOpen,
      title: 'Smart Transcription',
      description: 'Get accurate, real-time transcription of every word spoken in your meetings. Our AI learns your team\'s terminology for perfect accuracy.',
      features: [
        'Real-time transcription',
        'Multi-language support',
        'Speaker identification',
        'Searchable transcript archive',
      ],
    },
    insights: {
      icon: Sparkles,
      title: 'AI-Powered Insights',
      description: 'Automatic meeting summaries, action items, and key decisions extracted by intelligent AI.',
      features: [
        'Auto-generated summaries',
        'Action items extraction',
        'Key decisions tracking',
        'Meeting highlights',
      ],
    },
    optimization: {
      icon: Zap,
      title: 'Meeting Optimization',
      description: 'Get recommendations to improve meeting efficiency, engagement, and productivity.',
      features: [
        'Meeting duration analysis',
        'Engagement metrics',
        'Participation balance',
        'Best practice suggestions',
      ],
    },
  };

  const current = content[activeTab as keyof typeof content];
  const CurrentIcon = current.icon;

  return (
    <section id="showcase" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Meet Your <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">AI Copilot</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Intelligent features that make your meetings smarter and more productive.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Tab Navigation */}
          <div className="lg:w-1/3 space-y-4">
            {Object.entries(content).map(([key, value]) => {
              const Icon = value.icon;
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'glass border border-purple-400 dark:border-purple-600 shadow-lg shadow-purple-500/20 bg-gradient-to-r from-purple-500/10 to-cyan-500/10'
                      : 'border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                    <div>
                      <h3 className={`font-bold ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {value.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="lg:w-2/3 animate-fade-in">
            <div className="glass rounded-2xl p-8 border border-white/20 dark:border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg">
                  <CurrentIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {current.title}
                  </h3>
                </div>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {current.description}
              </p>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {current.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Visual Preview */}
              <div className="relative h-64 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-xl border border-purple-300 dark:border-purple-700/30 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                  <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                </div>
                <div className="relative text-center">
                  <Sparkles className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-3 opacity-50" />
                  <p className="text-gray-600 dark:text-gray-400">Premium Preview</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Button variant="primary" size="lg" isFullWidth>
                Explore All AI Features
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIShowcaseSection;
