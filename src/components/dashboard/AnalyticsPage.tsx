import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MessageSquare, Clock, Smile, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface MetricTrend {
  label: string;
  value: string | number;
  trend?: number;
  trendDirection?: 'up' | 'down';
  icon: React.ReactNode;
}

const AnalyticsPage: React.FC = () => {
  const { company } = useAuth();
  const { t, dir } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState<MetricTrend[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    fetchAnalyticsData().then(() => clearTimeout(timeoutId));

    return () => clearTimeout(timeoutId);
  }, [company, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      if (!company) return;

      // Mock analytics data - In production, this would query real metrics
      const mockMetrics: MetricTrend[] = [
        {
          label: 'Total Conversations',
          value: '3,847',
          trend: 12,
          trendDirection: 'up',
          icon: <MessageSquare className="w-6 h-6" />,
        },
        {
          label: 'Avg Response Time',
          value: '1.2s',
          trend: -8,
          trendDirection: 'down',
          icon: <Clock className="w-6 h-6" />,
        },
        {
          label: 'User Satisfaction',
          value: '4.8/5',
          trend: 5,
          trendDirection: 'up',
          icon: <Smile className="w-6 h-6" />,
        },
        {
          label: 'Error Rate',
          value: '0.3%',
          trend: -2,
          trendDirection: 'down',
          icon: <AlertTriangle className="w-6 h-6" />,
        },
      ];

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" dir={dir}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('analytics.title')}</h1>
          <p className="text-slate-400 mt-1">{t('analytics.subtitle')}</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                timeRange === range
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400">Loading analytics...</p>
          </div>
        ) : (
          metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-teal-500">{metric.icon}</div>
                {metric.trend !== undefined && (
                  <div className="flex items-center gap-1">
                    {metric.trendDirection === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        metric.trendDirection === 'up'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {metric.trend > 0 ? '+' : ''}{metric.trend}%
                    </span>
                  </div>
                )}
              </div>
              <p className="text-slate-400 text-sm font-medium">{metric.label}</p>
              <p className="text-2xl font-bold text-white mt-2">{metric.value}</p>
            </div>
          ))
        )}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Conversation Trends */}
        <ChartCard
          title="Conversation Trends"
          description="Number of conversations over time"
        />

        {/* Response Time Distribution */}
        <ChartCard
          title="Response Time Distribution"
          description="Distribution of response times"
        />

        {/* Agent Performance */}
        <ChartCard
          title="Agent Performance"
          description="Performance metrics by agent"
        />

        {/* User Satisfaction */}
        <ChartCard
          title="User Satisfaction"
          description="Satisfaction scores over time"
        />
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Detailed Metrics</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left font-semibold text-slate-300">
                  Metric
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">
                  Today
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">
                  Average
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              <DetailRow metric="Conversations" today="342" average="287" trend="+19%" />
              <DetailRow metric="Messages" today="1,025" average="856" trend="+20%" />
              <DetailRow metric="Avg Response Time" today="1.1s" average="1.4s" trend="-21%" />
              <DetailRow metric="Error Rate" today="0.2%" average="0.4%" trend="-50%" />
              <DetailRow metric="Satisfaction" today="4.9/5" average="4.7/5" trend="+4%" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface ChartCardProps {
  title: string;
  description: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, description }) => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-6">{description}</p>
      <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
        <p className="text-slate-500">Chart placeholder</p>
      </div>
    </div>
  );
};

interface DetailRowProps {
  metric: string;
  today: string;
  average: string;
  trend: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ metric, today, average, trend }) => {
  const isPositive = trend.startsWith('+');

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
      <td className="px-4 py-3 text-slate-300">{metric}</td>
      <td className="px-4 py-3 text-white font-medium">{today}</td>
      <td className="px-4 py-3 text-slate-300">{average}</td>
      <td className={`px-4 py-3 font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {trend}
      </td>
    </tr>
  );
};

export default AnalyticsPage;
