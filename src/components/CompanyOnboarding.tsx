import React, { useState } from 'react';
import { Building2, ArrowRight, Globe, MapPin, Briefcase, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface CompanyOnboardingProps {
  onComplete: () => void;
}

const CompanyOnboarding: React.FC<CompanyOnboardingProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { t, dir } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    industry: '',
    language_preference: 'en',
    timezone: 'UTC',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('User not authenticated');
      return;
    }

    if (step === 1 && formData.name.trim()) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setLoading(true);
      setError('');

      try {
        // Create company
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: formData.name,
            country: formData.country,
            industry: formData.industry,
            language_preference: formData.language_preference,
            timezone: formData.timezone,
            owner_id: user.id,
          })
          .select()
          .single();

        if (companyError) throw companyError;

        // Update user profile with company_id
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            company_id: companyData.id,
            full_name: user.user_metadata?.first_name + ' ' + user.user_metadata?.last_name || 'User',
            role: 'owner',
            is_admin: true,
          });

        if (profileError) throw profileError;

        // Create default subscription
        const { error: subError } = await supabase.from('subscriptions').insert({
          company_id: companyData.id,
          plan: 'starter',
          status: 'active',
          billing_cycle: 'monthly',
          price: 0,
        });

        if (subError) throw subError;

        onComplete();
      } catch (err) {
        console.error('Error creating company:', err);
        setError(err instanceof Error ? err.message : 'Failed to create company');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4" dir={dir}>
      <div className="w-full max-w-2xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-400' : 'text-slate-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-teal-600' : 'bg-slate-700'}`}>
                {step > 1 ? <CheckCircle2 className="w-6 h-6" /> : <Building2 className="w-5 h-5" />}
              </div>
              <span className="font-medium">{t('company.basic')}</span>
            </div>
            <div className={`h-1 w-20 ${step >= 2 ? 'bg-teal-600' : 'bg-slate-700'}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-400' : 'text-slate-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-teal-600' : 'bg-slate-700'}`}>
                <Globe className="w-5 h-5" />
              </div>
              <span className="font-medium">{t('company.billing')}</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 1 ? t('onboarding.welcome') : t('onboarding.setup')}
            </h1>
            <p className="text-slate-400">
              {step === 1 ? t('onboarding.step1') : t('onboarding.step2')}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t('company.name')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder={t('company.nameplaceholder') || 'Enter your company name'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {t('company.industry')}
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">{t('company.selectindustry') || 'Select industry'}</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Construction">Construction</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Finance">Finance</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Energy">Energy & Utilities</option>
                    <option value="Government">Government</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {t('company.country')}
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">{t('company.selectcountry') || 'Select country'}</option>
                    <option value="JO">Jordan</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="KW">Kuwait</option>
                    <option value="BH">Bahrain</option>
                    <option value="QA">Qatar</option>
                    <option value="OM">Oman</option>
                    <option value="EG">Egypt</option>
                    <option value="LB">Lebanon</option>
                    <option value="IQ">Iraq</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {t('company.language')}
                    </label>
                    <select
                      value={formData.language_preference}
                      onChange={(e) => setFormData({ ...formData, language_preference: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic (العربية)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {t('company.timezone')}
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="UTC">UTC (GMT+0)</option>
                      <option value="Asia/Amman">Amman (GMT+3)</option>
                      <option value="Asia/Riyadh">Riyadh (GMT+3)</option>
                      <option value="Asia/Dubai">Dubai (GMT+4)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                      <option value="Europe/London">London (GMT+0)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-between pt-4">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                  {t('create.button.previous')}
                </button>
              )}

              <button
                type="submit"
                disabled={loading || (step === 1 && !formData.name.trim())}
                className="px-8 py-3 bg-gradient-to-r from-teal-600 to-green-500 hover:shadow-lg hover:shadow-teal-500/30 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
              >
                {loading ? t('loading') : step === 1 ? t('create.button.next') : t('onboarding.complete')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyOnboarding;
