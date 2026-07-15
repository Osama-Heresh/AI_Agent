import React, { useState, useEffect } from 'react';
import { Play, Pause, Archive, Settings, TrendingUp, Clock, Zap, MoreVertical, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { AgentInstance, AIAgent } from '../../lib/types';

const MyAgentsPage: React.FC = () => {
  const { company } = useAuth();
  const { t } = useLanguage();
  const [instances, setInstances] = useState<AgentInstance[]>([]);
  const [templates, setTemplates] = useState<Record<string, AIAgent>>({});
  const [loading, setLoading] = useState(true);
  const [selectedInstance, setSelectedInstance] = useState<AgentInstance | null>(null);

  useEffect(() => {
    if (company) {
      loadInstances();
    }
  }, [company]);

  const loadInstances = async () => {
    if (!company) return;

    try {
      const { data: instancesData, error: instancesError } = await supabase
        .from('agent_instances')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (instancesError) throw instancesError;

      if (instancesData && instancesData.length > 0) {
        setInstances(instancesData as AgentInstance[]);

        const templateIds = [...new Set(instancesData.map(i => i.agent_template_id))];
        const { data: templatesData, error: templatesError } = await supabase
          .from('ai_agents')
          .select('*')
          .in('id', templateIds);

        if (templatesError) throw templatesError;

        if (templatesData) {
          const templatesMap: Record<string, AIAgent> = {};
          templatesData.forEach(template => {
            templatesMap[template.id] = template as AIAgent;
          });
          setTemplates(templatesMap);
        }
      }
    } catch (error) {
      console.error('Error loading instances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (instance: AgentInstance, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('agent_instances')
        .update({ status: newStatus })
        .eq('id', instance.id);

      if (error) throw error;

      setInstances(instances.map(i =>
        i.id === instance.id ? { ...i, status: newStatus as any } : i
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update agent status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'paused': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'draft': return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
      case 'archived': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (instances.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">{t('agents.empty.title')}</h2>
          <p className="text-slate-400 mb-6">{t('agents.empty.subtitle')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My AI Agents</h1>
          <p className="text-slate-300 text-lg">Manage your activated agent instances</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {instances.map(instance => {
            const template = templates[instance.agent_template_id];
            if (!template) return null;

            return (
              <div
                key={instance.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-teal-500 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">{instance.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(instance.status)}`}>
                        {getStatusIcon(instance.status)}
                        {instance.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-400 mb-2">Based on: {template.name}</p>
                    {instance.description && (
                      <p className="text-slate-300">{instance.description}</p>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setSelectedInstance(instance)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Usage</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{instance.usage_count}</div>
                    <div className="text-xs text-slate-400">executions</div>
                  </div>

                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Last Used</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {instance.last_used_at
                        ? new Date(instance.last_used_at).toLocaleDateString()
                        : 'Never'}
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm">Activated</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {instance.activated_at
                        ? new Date(instance.activated_at).toLocaleDateString()
                        : 'Not activated'}
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Configuration</span>
                    </div>
                    <div className="text-sm font-semibold text-teal-400">
                      {Object.keys(instance.configuration || {}).length} params
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {instance.status === 'active' ? (
                    <button
                      onClick={() => handleStatusChange(instance, 'paused')}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                  ) : instance.status === 'paused' ? (
                    <button
                      onClick={() => handleStatusChange(instance, 'active')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Resume
                    </button>
                  ) : null}

                  <button
                    onClick={() => handleStatusChange(instance, 'archived')}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>

                  <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Run Agent
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedInstance && (
        <InstanceDetailsModal
          instance={selectedInstance}
          template={templates[selectedInstance.agent_template_id]}
          onClose={() => setSelectedInstance(null)}
        />
      )}
    </div>
  );
};

interface InstanceDetailsModalProps {
  instance: AgentInstance;
  template: AIAgent;
  onClose: () => void;
}

const InstanceDetailsModal: React.FC<InstanceDetailsModalProps> = ({ instance, template, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{instance.name}</h2>
            <p className="text-slate-400">{template.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Configuration</h3>
            <div className="bg-slate-900 rounded-lg p-4 space-y-2">
              {Object.entries(instance.configuration || {}).map(([key, value]) => (
                <div key={key} className="flex items-start gap-3 py-2 border-b border-slate-700 last:border-0">
                  <span className="text-slate-400 font-medium min-w-[180px]">{key}:</span>
                  <span className="text-white flex-1">
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">Instance Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Status</div>
                <div className="text-lg font-semibold text-white capitalize">{instance.status}</div>
              </div>
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Total Executions</div>
                <div className="text-lg font-semibold text-white">{instance.usage_count}</div>
              </div>
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Created</div>
                <div className="text-sm font-semibold text-white">
                  {new Date(instance.created_at).toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Last Used</div>
                <div className="text-sm font-semibold text-white">
                  {instance.last_used_at
                    ? new Date(instance.last_used_at).toLocaleString()
                    : 'Never'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAgentsPage;
