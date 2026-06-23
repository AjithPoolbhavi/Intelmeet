import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const stats = [
  {
    label: 'Active Users',
    value: '500K+',
    change: '+12.5%',
    positive: true,
  },
  {
    label: 'Monthly Meetings',
    value: '10M+',
    change: '+8.2%',
    positive: true,
  },
  {
    label: 'Uptime',
    value: '99.9%',
    change: '+0.1%',
    positive: true,
  },
  {
    label: 'Support Response',
    value: '< 2h',
    change: '-15%',
    positive: true,
  },
];

export const StatsSection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900 via-purple-800 to-cyan-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Trusted by Teams Worldwide
          </h2>
          <p className="text-xl text-purple-100">
            Growing strong with thousands of businesses
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-8 border border-white/20 backdrop-blur-xl hover:border-white/40 transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Label */}
              <p className="text-sm font-semibold text-white/70 mb-2 uppercase tracking-wider">
                {stat.label}
              </p>

              {/* Value */}
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-3xl md:text-4xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {stat.value}
                </h3>

                {/* Change Badge */}
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                  stat.positive
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {stat.positive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>

              {/* Divider */}
              <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full group-hover:w-full transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
