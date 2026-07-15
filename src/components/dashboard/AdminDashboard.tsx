import React, { useState, useEffect } from 'react';
import { Shield, Users, Building2, TrendingUp, AlertCircle, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdminStats {
  totalUsers: number;
  totalCompanies: number;
  activeSubscriptions: number;
  revenue: number;
}

const AdminDashboard: React.FC = () => {
  const { t, dir } = useLanguage();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCompanies: 0,
    activeSubscriptions: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    fetchAdminStats().then(() => clearTimeout(timeoutId));

    return () => clearTimeout(timeoutId);
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);

      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: companiesCount } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });

      const { count: subscriptionsCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      setStats({
        totalUsers: usersCount || 0,
        totalCompanies: companiesCount || 0,
        activeSubscriptions: subscriptionsCount || 0,
        revenue: 24580,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminStatCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: <Users className="w-6 h-6" />,
      trend: 8,
    },
    {
      label: 'Companies',
      value: stats.totalCompanies.toLocaleString(),
      icon: <Building2 className="w-6 h-6" />,
      trend: 12,
    },
    {
      label: 'Active Subscriptions',
      value: stats.activeSubscriptions.toLocaleString(),
      icon: <TrendingUp className="w-6 h-6" />,
      trend: 5,
    },
    {
      label: 'Monthly Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: <TrendingUp className="w-6 h-6" />,
      trend: 23,
    },
  ];

  return (
    <div className="space-y-8" dir={dir}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-teal-500" />
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.title')}</h1>
          <p className="text-slate-400 mt-1">{t('admin.subtitle')}</p>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStatCards.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-teal-500">{stat.icon}</div>
              <span className="text-sm font-semibold text-green-500">+{stat.trend}%</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700">
        {['overview', 'users', 'companies', 'subscriptions', 'system'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-teal-600 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview' && <OverviewTab loading={loading} />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'companies' && <CompaniesTab />}
        {activeTab === 'subscriptions' && <SubscriptionsTab />}
        {activeTab === 'system' && <SystemTab />}
      </div>
    </div>
  );
};

const OverviewTab: React.FC<{ loading: boolean }> = () => {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-8">
        <MetricsCard
          title="System Health"
          metrics={[
            { label: 'API Uptime', value: '99.99%', status: 'healthy' },
            { label: 'Database', value: 'Optimal', status: 'healthy' },
            { label: 'Queue Depth', value: '42 jobs', status: 'healthy' },
            { label: 'Error Rate', value: '0.02%', status: 'healthy' },
          ]}
        />

        <AlertsCard />
      </div>

      <RecentActivityCard />
    </div>
  );
};

const UsersTab: React.FC = () => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h3 className="text-lg font-bold text-white mb-6">Recent Users</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Company</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Joined</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-slate-700 hover:bg-slate-700/30">
                <td className="px-4 py-3 text-white font-medium">User {i + 1}</td>
                <td className="px-4 py-3 text-slate-300">user{i + 1}@company.com</td>
                <td className="px-4 py-3 text-slate-300">Company {i + 1}</td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 rounded-full bg-green-900 text-green-300 text-xs font-semibold">
                    Active
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">2024-12-{10 + i}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CompaniesTab: React.FC = () => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h3 className="text-lg font-bold text-white mb-6">Companies</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Company</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Employees</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Plan</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Joined</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-slate-700 hover:bg-slate-700/30">
                <td className="px-4 py-3 text-white font-medium">Company {i + 1}</td>
                <td className="px-4 py-3 text-slate-300">{50 + i * 10}</td>
                <td className="px-4 py-3 text-slate-300">
                  {['Starter', 'Professional', 'Enterprise'][i % 3]}
                </td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 rounded-full bg-green-900 text-green-300 text-xs font-semibold">
                    Active
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">2024-{10 + i}-{15}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SubscriptionsTab: React.FC = () => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h3 className="text-lg font-bold text-white mb-6">Subscriptions</h3>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <p className="text-white font-semibold">Company {i + 1}</p>
              <p className="text-slate-400 text-sm">
                {['Starter', 'Professional', 'Enterprise'][i % 3]} Plan
              </p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">
                ${[99, 499, 'Custom'][i % 3]}
              </p>
              <p className="text-green-400 text-sm">Active</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SystemTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="System Configuration"
        items={[
          { label: 'API Rate Limit', value: '10,000 req/min', action: 'Edit' },
          { label: 'Max Agents per Company', value: 'Unlimited', action: 'Edit' },
          { label: 'File Upload Limit', value: '100 MB', action: 'Edit' },
          { label: 'Retention Period', value: '90 days', action: 'Edit' },
        ]}
      />

      <SettingsCard
        title="Email Configuration"
        items={[
          { label: 'SMTP Server', value: 'Configured', action: 'Test' },
          { label: 'From Address', value: 'noreply@aiagents.com', action: 'Edit' },
          { label: 'Bounce Handling', value: 'Enabled', action: 'Edit' },
        ]}
      />

      <SettingsCard
        title="Integrations"
        items={[
          { label: 'Stripe', value: 'Connected', action: 'Manage' },
          { label: 'Slack', value: 'Disconnected', action: 'Connect' },
          { label: 'SendGrid', value: 'Connected', action: 'Manage' },
        ]}
      />
    </div>
  );
};

interface MetricsCardProps {
  title: string;
  metrics: Array<{ label: string; value: string; status: string }>;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, metrics }) => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h3 className="text-lg font-bold text-white mb-6">{title}</h3>
      <div className="space-y-4">
        {metrics.map((metric, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-slate-300">{metric.label}</span>
            <span className="text-white font-semibold">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AlertsCard: React.FC = () => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-bold text-white">System Alerts</h3>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded text-yellow-300 text-sm">
          High API usage detected in the last hour
        </div>
        <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded text-blue-300 text-sm">
          Scheduled maintenance on 2024-12-15
        </div>
      </div>
    </div>
  );
};

const RecentActivityCard: React.FC = () => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div>
              <p className="text-white font-medium">Activity {i + 1}</p>
              <p className="text-slate-400">Company {i + 1} updated settings</p>
            </div>
            <span className="text-slate-500">{i + 1}h ago</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SettingsCardProps {
  title: string;
  items: Array<{ label: string; value: string; action: string }>;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, items }) => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Settings className="w-5 h-5" />
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-slate-700 rounded">
            <div>
              <p className="text-white font-medium text-sm">{item.label}</p>
              <p className="text-slate-400 text-xs">{item.value}</p>
            </div>
            <button className="px-3 py-1 rounded bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors">
              {item.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
