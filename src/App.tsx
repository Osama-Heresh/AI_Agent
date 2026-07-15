import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import CompanyOnboarding from './components/CompanyOnboarding';
import DashboardLayout from './components/dashboard/DashboardLayout';
import OverviewPage from './components/dashboard/OverviewPage';
import CreateAgentPage from './components/dashboard/CreateAgentPage';
import ManageAgentsPage from './components/dashboard/ManageAgentsPage';
import MyAgentsPage from './components/dashboard/MyAgentsPage';
import CompanyProfilePage from './components/dashboard/CompanyProfilePage';
import AnalyticsPage from './components/dashboard/AnalyticsPage';
import BillingPage from './components/dashboard/BillingPage';
import AdminDashboard from './components/dashboard/AdminDashboard';
import AgentMarketplacePage from './components/dashboard/AgentMarketplacePage';

type Page = 'landing' | 'auth' | 'dashboard';
type DashboardPage = 'overview' | 'marketplace' | 'agents' | 'myagents' | 'create' | 'analytics' | 'billing' | 'admin' | 'settings';

function AppContent() {
  const { user, company, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [dashboardPage, setDashboardPage] = useState<DashboardPage>('overview');
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'auth') {
      return <AuthPage onBack={() => setCurrentPage('landing')} />;
    }

    return (
      <LandingPage
        onGetStarted={() => setCurrentPage('auth')}
        onViewPricing={() => setCurrentPage('auth')}
      />
    );
  }

  // Show onboarding if user has no company
  if (!company || showOnboarding) {
    return (
      <CompanyOnboarding
        onComplete={() => {
          setShowOnboarding(false);
          window.location.reload();
        }}
      />
    );
  }

  if (dashboardPage === 'create') {
    return (
      <DashboardLayout currentPage="create" onNavigate={setDashboardPage}>
        <CreateAgentPage
          onBack={() => setDashboardPage('agents')}
          onComplete={() => setDashboardPage('agents')}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage={dashboardPage} onNavigate={setDashboardPage}>
      {dashboardPage === 'overview' && (
        <OverviewPage
          onCreateAgent={() => setDashboardPage('create')}
          onManageAgents={() => setDashboardPage('agents')}
          onViewAnalytics={() => setDashboardPage('analytics')}
          onViewBilling={() => setDashboardPage('billing')}
        />
      )}
      {dashboardPage === 'marketplace' && <AgentMarketplacePage />}
      {dashboardPage === 'agents' && (
        <ManageAgentsPage onCreateAgent={() => setDashboardPage('create')} />
      )}
      {dashboardPage === 'myagents' && <MyAgentsPage />}
      {dashboardPage === 'settings' && <CompanyProfilePage />}
      {dashboardPage === 'analytics' && <AnalyticsPage />}
      {dashboardPage === 'billing' && <BillingPage />}
      {dashboardPage === 'admin' && <AdminDashboard />}
    </DashboardLayout>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
