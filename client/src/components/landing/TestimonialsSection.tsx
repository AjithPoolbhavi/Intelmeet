import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO at TechStart',
    company: 'TechStart Inc.',
    avatar: '👩‍💼',
    quote: 'IntellMeet transformed how our distributed team collaborates. The AI transcription alone has saved us countless hours.',
    rating: 5,
    highlight: 'AI Transcription',
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager at InnovateCo',
    company: 'InnovateCo',
    avatar: '👨‍💻',
    quote: 'The meeting analytics dashboard gives us insights we never had before. Our team productivity has increased by 30%.',
    rating: 5,
    highlight: 'Analytics Dashboard',
  },
  {
    name: 'Emma Rodriguez',
    role: 'HR Director at GlobalTech',
    company: 'GlobalTech Solutions',
    avatar: '👩‍🔬',
    quote: 'Crystal clear video quality and seamless collaboration tools. This is what enterprise-grade should look like.',
    rating: 5,
    highlight: 'Video Quality',
  },
  {
    name: 'James Wilson',
    role: 'CTO at CloudFirst',
    company: 'CloudFirst',
    avatar: '👨‍🎓',
    quote: 'Security and performance are exceptional. We trust IntellMeet with our most important client meetings.',
    rating: 5,
    highlight: 'Security',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Loved by <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">Professionals</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See what teams around the world are saying about IntellMeet
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group glass rounded-2xl p-8 border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Quote */}
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed line-clamp-3">
                "{testimonial.quote}"
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Highlight Badge */}
              <div className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-6">
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                  {testimonial.highlight}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
