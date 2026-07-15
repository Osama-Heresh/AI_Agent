import React, { useState, ReactNode } from 'react';
import { Menu, X, LogOut, Settings, ChevronDown, Brain, Globe, LayoutDashboard, Users, BarChart3, CreditCard, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage?: string;
  onNavigate?: (page: any) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { signOut, profile, company } = useAuth();
  const { language, setLanguage, t, dir } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const menuItems = [
    { label: t('nav.overview'), path: 'overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Agent Marketplace', path: 'marketplace', icon: <Brain className="w-5 h-5" /> },
    { label: 'My Agents', path: 'myagents', icon: <Zap className="w-5 h-5" /> },
    { label: t('nav.agents'), path: 'agents', icon: <Users className="w-5 h-5" /> },
    { label: t('nav.analytics'), path: 'analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { label: t('nav.billing'), path: 'billing', icon: <CreditCard className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-900" dir={dir}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-800 border-${dir === 'rtl' ? 'l' : 'r'} border-slate-700 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-slate-700 flex items-center px-4 gap-3">
          <Brain className="w-8 h-8 text-teal-500 flex-shrink-0" />
          {sidebarOpen && <span className="text-white font-bold">AIAgents</span>}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate?.(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.path
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Admin Link */}
        {profile?.role === 'admin' && (
          <div className="border-t border-slate-700 p-4">
            <button
              onClick={() => onNavigate?.('admin')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'admin'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-700 text-teal-400 hover:bg-slate-600'
              }`}
            >
              <Shield className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{t('nav.admin')}</span>}
            </button>
          </div>
        )}

        {/* Toggle Button */}
        <div className="border-t border-slate-700 p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-700 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-8">
          <h2 className="text-white font-semibold">{company?.name || 'Dashboard'}</h2>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-600 text-white hover:bg-slate-700 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-green-500 flex items-center justify-center text-white font-semibold">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-${dir === 'rtl' ? 'right' : 'left'}">
                  <p className="text-white text-sm font-medium">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-slate-400 text-xs capitalize">{profile?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className={`absolute ${dir === 'rtl' ? 'left-0' : 'right-0'} mt-2 w-48 bg-slate-700 rounded-lg border border-slate-600 shadow-lg z-50`}>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate?.('settings');
                    }}
                    className="w-full px-4 py-3 text-${dir === 'rtl' ? 'right' : 'left'} text-slate-300 hover:bg-slate-600 flex items-center gap-2 rounded-t-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    {t('nav.admin')}
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-3 text-${dir === 'rtl' ? 'right' : 'left'} text-red-400 hover:bg-slate-600 flex items-center gap-2 rounded-b-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav.signout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-slate-900">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
