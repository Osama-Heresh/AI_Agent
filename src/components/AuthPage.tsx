import React, { useState } from 'react';
import { Brain, Mail, Lock, User, ArrowLeft, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const { signIn, signUp } = useAuth();
  const { language, setLanguage, t, dir } = useLanguage();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        if (!formData.firstName || !formData.lastName) {
          throw new Error('First and last names are required');
        }
        await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
      } else {
        await signIn(formData.email, formData.password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4" dir={dir}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{t('auth.back')}</span>
          </button>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Brain className="w-10 h-10 text-teal-500" />
              <span className="text-white font-bold text-2xl">AIAgents</span>
            </div>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-600 text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? t('auth.getstarted') : t('auth.welcome')}
          </h1>
          <p className="text-slate-400">
            {isSignUp ? t('auth.signup.subtitle') : t('auth.signin.subtitle')}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <FormField
                  label={t('auth.fullname')}
                  name="firstName"
                  type="text"
                  placeholder="John"
                  icon={<User className="w-5 h-5" />}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  dir={dir}
                />
                <FormField
                  label={t('auth.fullname')}
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  icon={<User className="w-5 h-5" />}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  dir={dir}
                />
              </>
            )}

            <FormField
              label={t('auth.email')}
              name="email"
              type="email"
              placeholder="you@company.com"
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={handleInputChange}
              dir={dir}
            />

            <FormField
              label={t('auth.password')}
              name="password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={handleInputChange}
              dir={dir}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-green-500 text-white font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('loading') : isSignUp ? t('auth.signup.button') : t('auth.signin.button')}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-center text-sm">
              {isSignUp ? t('auth.toggle.signin') : t('auth.toggle.signup')}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setFormData({ email: '', password: '', firstName: '', lastName: '' });
                }}
                className={`${dir === 'rtl' ? 'mr-2' : 'ml-2'} text-teal-500 hover:text-teal-400 font-medium transition-colors`}
              >
                {isSignUp ? t('auth.signin.button') : t('auth.signup.button')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dir: 'ltr' | 'rtl';
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  placeholder,
  icon,
  value,
  onChange,
  dir,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div className="relative">
        <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center text-slate-500`}>
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors`}
          required
        />
      </div>
    </div>
  );
};

export default AuthPage;
