import React, { useState, useEffect } from 'react';
import { Building2, Save, Globe, MapPin, Briefcase, Clock, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const CompanyProfilePage: React.FC = () => {
  const { company: currentCompany, user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    industry: '',
    language_preference: 'en',
    timezone: 'UTC',
    billing_email: '',
    vat_number: '',
    billing_address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    }
  });

  useEffect(() => {
    if (currentCompany) {
      loadCompanyData();
    }
  }, [currentCompany]);

  const loadCompanyData = async () => {
    if (!currentCompany) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', currentCompany.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name || '',
          country: data.country || '',
          industry: data.industry || '',
          language_preference: data.language_preference || 'en',
          timezone: data.timezone || 'UTC',
          billing_email: data.billing_email || '',
          vat_number: data.vat_number || '',
          billing_address: data.billing_address || {
            street: '',
            city: '',
            state: '',
            postal_code: '',
            country: ''
          }
        });
      }
    } catch (error) {
      console.error('Error loading company:', error);
      setMessage({ type: 'error', text: 'Failed to load company data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentCompany || !user) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: formData.name,
          country: formData.country,
          industry: formData.industry,
          language_preference: formData.language_preference,
          timezone: formData.timezone,
          billing_email: formData.billing_email,
          vat_number: formData.vat_number,
          billing_address: formData.billing_address,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentCompany.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Company profile updated successfully!' });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving company:', error);
      setMessage({ type: 'error', text: 'Failed to save company profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-teal-500" />
            <h1 className="text-4xl font-bold text-white">{t('company.title')}</h1>
          </div>
          <p className="text-slate-300 text-lg">{t('company.subtitle')}</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {message.type === 'success' ? t('company.success') : t('company.error')}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-500" />
              {t('company.basic')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('company.name')} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter company name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <option value="Asia/Kuwait">Kuwait (GMT+3)</option>
                    <option value="Asia/Bahrain">Bahrain (GMT+3)</option>
                    <option value="Asia/Qatar">Doha (GMT+3)</option>
                    <option value="Asia/Muscat">Muscat (GMT+4)</option>
                    <option value="Africa/Cairo">Cairo (GMT+2)</option>
                    <option value="America/New_York">New York (GMT-5)</option>
                    <option value="Europe/London">London (GMT+0)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-500" />
              {t('company.billing')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('company.billingemail')}
                </label>
                <input
                  type="email"
                  value={formData.billing_email}
                  onChange={(e) => setFormData({ ...formData, billing_email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="billing@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('company.vat')}
                </label>
                <input
                  type="text"
                  value={formData.vat_number}
                  onChange={(e) => setFormData({ ...formData, vat_number: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter VAT/Tax number"
                />
                <p className="text-sm text-slate-400 mt-1">
                  Required for VAT calculation (15% Saudi Arabia, 16% Jordan)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('company.address')}
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.billing_address.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      billing_address: { ...formData.billing_address, street: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Street address"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={formData.billing_address.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        billing_address: { ...formData.billing_address, city: e.target.value }
                      })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      value={formData.billing_address.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        billing_address: { ...formData.billing_address, state: e.target.value }
                      })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="State/Province"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={formData.billing_address.postal_code}
                      onChange={(e) => setFormData({
                        ...formData,
                        billing_address: { ...formData.billing_address, postal_code: e.target.value }
                      })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Postal code"
                    />
                    <input
                      type="text"
                      value={formData.billing_address.country}
                      onChange={(e) => setFormData({
                        ...formData,
                        billing_address: { ...formData.billing_address, country: e.target.value }
                      })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-green-500 hover:shadow-lg hover:shadow-teal-500/30 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? t('company.saving') : t('company.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
