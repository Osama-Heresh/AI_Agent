import React from 'react';
import { ArrowRight, Brain, CheckCircle2, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CustomerFeedback from './CustomerFeedback';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewPricing?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { language, setLanguage, t, dir } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const features = [
    {
      title: t('feature.support.title'),
      description: t('feature.support.desc'),
      image: 'https://images.pexels.com/photos/7709189/pexels-photo-7709189.jpeg',
    },
    {
      title: t('feature.sales.title'),
      description: t('feature.sales.desc'),
      image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg',
    },
    {
      title: t('feature.marketing.title'),
      description: t('feature.marketing.desc'),
      image: 'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg',
    },
    {
      title: t('feature.hr.title'),
      description: t('feature.hr.desc'),
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    },
    {
      title: t('feature.accounting.title'),
      description: t('feature.accounting.desc'),
      image: 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg',
    },
    {
      title: t('feature.analytics.title'),
      description: t('feature.analytics.desc'),
      image: 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg',
    },
  ];

  const benefits = [
    t('benefits.support'),
    t('benefits.cost'),
    t('benefits.scale'),
    t('benefits.multichannel'),
    t('benefits.training'),
    t('benefits.analytics'),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir={dir}>
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Brain className="w-8 h-8 text-teal-500" />
            <span className="text-white font-bold text-xl">AIAgents</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-green-500 text-white font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all"
            >
              {t('nav.signin')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              {t('hero.title')}
              <span className="bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">
                {' '}{t('hero.title.highlight')}
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Benefits List */}
            <div className="grid sm:grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-teal-600 to-green-500 text-white font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{t('hero.cta.start')}</span>
                <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </button>
              <button className="px-8 py-4 rounded-lg border border-slate-600 text-white font-semibold hover:bg-slate-800 transition-colors">
                {t('hero.cta.pricing')}
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl blur-3xl opacity-20"></div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-700">
              <img
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
                alt="AI Robot"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{t('features.title')}</h2>
          <p className="text-xl text-slate-400">{t('features.subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors group"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{t('testimonials.title')}</h2>
          <p className="text-xl text-slate-400">{t('testimonials.subtitle')}</p>
        </div>
        <CustomerFeedback />
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl border border-slate-600 p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-teal-600 to-green-500 text-white font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all"
          >
            {t('cta.button')}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.product')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('footer.features')}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('footer.pricing')}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('footer.usecases')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.company')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('footer.about')}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('footer.blog')}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('footer.careers')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.contact')}</h3>
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-teal-500" />
                <span className="text-white font-bold">AIAgents</span>
              </div>
            </div>
          </div>
          <div className="text-center text-slate-400 pt-8 border-t border-slate-700">
            <p>&copy; 2024 AIAgents. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
