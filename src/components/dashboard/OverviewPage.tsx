import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, MessageSquare, AlertCircle, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
}

interface OverviewPageProps {
  onCreateAgent: () => void;
  onManageAgents: () => void;
  onViewAnalytics: () => void;
  onViewBilling?: () => void;
}

const OverviewPage: React.FC<OverviewPageProps> = ({ onCreateAgent, onManageAgents, onViewAnalytics }) => {
  const { t, dir } = useLanguage();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeAgents: 0,
    totalConversations: 0,
    avgResponseTime: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    fetchDashboardData().then(() => clearTimeout(timeoutId));

    return () => clearTimeout(timeoutId);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const { data: agentsData, error: agentsError } = await supabase
        .from('agents')
        .select('*')
        .eq('status', 'active')
        .limit(5);

      if (agentsError) {
        console.error('Error fetching agents:', agentsError);
      }

      setAgents(agentsData || []);

      setStats({
        activeAgents: agentsData?.length || 0,
        totalConversations: 1234,
        avgResponseTime: 1.2,
        satisfaction: 4.8,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards: StatCard[] = [
    {
      label: t('dashboard.stats.active'),
      value: stats.activeAgents,
      icon: <Users className="w-6 h-6" />,
      trend: 12,
    },
    {
      label: t('dashboard.stats.conversations'),
      value: stats.totalConversations.toLocaleString(),
      icon: <MessageSquare className="w-6 h-6" />,
      trend: 8,
    },
    {
      label: t('dashboard.stats.response'),
      value: `${stats.avgResponseTime}s`,
      icon: <TrendingUp className="w-6 h-6" />,
      trend: -5,
    },
    {
      label: 'Satisfaction Score',
      value: stats.satisfaction,
      icon: <AlertCircle className="w-6 h-6" />,
      trend: 3,
    },
  ];

  return (
    <div className="space-y-8" dir={dir}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('nav.overview')}</h1>
          <p className="text-slate-400 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <button
          onClick={onCreateAgent}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-green-500 text-white font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          {t('dashboard.actions.create')}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-teal-500">{stat.icon}</div>
              {stat.trend !== undefined && (
                <div
                  className={`text-sm font-semibold ${
                    stat.trend > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.trend > 0 ? '+' : ''}{stat.trend}%
                </div>
              )}
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Agents */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{t('dashboard.recent.title')}</h2>
          <button
            onClick={onManageAgents}
            className="text-teal-500 hover:text-teal-400 text-sm font-medium"
          >
            View All
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">{t('loading')}</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">{t('dashboard.recent.empty')}</p>
            <button
              onClick={onCreateAgent}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('dashboard.recent.cta')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
              >
                <div>
                  <h3 className="text-white font-semibold">{agent.name}</h3>
                  <p className="text-slate-400 text-sm">{agent.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full bg-teal-900 text-teal-300 text-xs font-semibold">
                    {agent.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Start */}
      <div className="grid md:grid-cols-2 gap-6">
        <QuickStartCard
          title={t('dashboard.actions.create')}
          description="Get started with our guided setup wizard"
          action={t('create.button.launch')}
          onClick={onCreateAgent}
        />
        <QuickStartCard
          title={t('dashboard.actions.analytics')}
          description="Track performance and user engagement metrics"
          action="Open Analytics"
          onClick={onViewAnalytics}
        />
      </div>
    </div>
  );
};

interface QuickStartCardProps {
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}

const QuickStartCard: React.FC<QuickStartCardProps> = ({
  title,
  description,
  action,
  onClick,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-slate-600 p-6">
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-6">{description}</p>
      <button
        onClick={onClick}
        className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
      >
        {action}
      </button>
    </div>
  );
};

export default OverviewPage;
