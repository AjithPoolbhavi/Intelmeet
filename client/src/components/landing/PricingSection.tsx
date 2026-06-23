import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small teams',
    price: '$29',
    period: 'per month',
    cta: 'Start Free Trial',
    popular: false,
    features: [
      'Up to 10 meetings/month',
      'HD video calling',
      'Basic chat',
      'Email support',
      '5GB storage',
    ],
  },
  {
    name: 'Professional',
    description: 'For growing teams',
    price: '$79',
    period: 'per month',
    cta: 'Start Free Trial',
    popular: true,
    features: [
      'Unlimited meetings',
      '4K video calling',
      'AI Transcription',
      'Priority support',
      '100GB storage',
      'Team collaboration',
      'Analytics dashboard',
      'Screen sharing',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For organizations',
    price: 'Custom',
    period: 'contact us',
    cta: 'Schedule Demo',
    popular: false,
    features: [
      'Everything in Professional',
      'Custom branding',
      'SSO & SAML',
      'Dedicated support',
      'Advanced security',
      'Unlimited storage',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
];

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Simple, <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your team. Always flexible to scale.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 glass rounded-full p-1 border border-white/20 dark:border-white/10 backdrop-blur-xl">
            <button className="px-6 py-2 rounded-full font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-all">
              Monthly
            </button>
            <button className="px-6 py-2 rounded-full font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
              Yearly
              <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl backdrop-blur-xl transition-all duration-300 animate-fade-in ${
                plan.popular
                  ? 'md:scale-105 glass border-2 border-purple-500 shadow-2xl shadow-purple-500/30 bg-gradient-to-br from-purple-600/10 to-cyan-600/10'
                  : 'glass border border-white/20 dark:border-white/10 hover:border-white/40'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-bold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {plan.description}
                </p>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {plan.period}
                  </span>
                </div>

                {/* CTA Button */}
                <Button
                  variant={plan.popular ? 'primary' : 'ghost'}
                  size="lg"
                  isFullWidth
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                  className="mb-8"
                >
                  {plan.cta}
                </Button>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-8" />

                {/* Features */}
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400">
            Have questions?{' '}
            <a href="#faq" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
              Check our FAQ
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
