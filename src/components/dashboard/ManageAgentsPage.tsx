import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MoreVertical, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Agent } from '../../lib/types';

interface ManageAgentsPageProps {
  onCreateAgent: () => void;
}

const ManageAgentsPage: React.FC<ManageAgentsPageProps> = ({ onCreateAgent }) => {
  const { company } = useAuth();
  const { t, dir } = useLanguage();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    fetchAgents().then(() => clearTimeout(timeoutId));

    return () => clearTimeout(timeoutId);
  }, [company]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      if (!company) return;

      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('company_id', company.id);

      if (error) {
        console.error('Error fetching agents:', error);
        return;
      }

      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      const { error } = await supabase.from('agents').delete().eq('id', agentId);

      if (error) throw error;

      setAgents(agents.filter((a) => a.id !== agentId));
      setActiveMenu(null);
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  const handleToggleStatus = async (agentId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('agents')
        .update({ status: newStatus })
        .eq('id', agentId);

      if (error) throw error;

      setAgents(
        agents.map((a) => (a.id === agentId ? { ...a, status: newStatus as any } : a))
      );
      setActiveMenu(null);
    } catch (error) {
      console.error('Error updating agent status:', error);
    }
  };

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8" dir={dir}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('agents.title')}</h1>
          <p className="text-slate-400 mt-1">{t('agents.subtitle')}</p>
        </div>
        <button
          onClick={onCreateAgent}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-green-500 text-white font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          {t('agents.create')}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5`} />
        <input
          type="text"
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors`}
        />
      </div>

      {/* Agents Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-slate-400">{t('loading')}</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 mb-4">
              {searchTerm ? 'No agents match your search' : t('agents.empty.title')}
            </p>
            {!searchTerm && (
              <button
                onClick={onCreateAgent}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t('agents.empty.cta')}
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-700/30">
                  <th className={`px-6 py-4 text-${dir === 'rtl' ? 'right' : 'left'} text-sm font-semibold text-slate-300`}>
                    Name
                  </th>
                  <th className={`px-6 py-4 text-${dir === 'rtl' ? 'right' : 'left'} text-sm font-semibold text-slate-300`}>
                    Model
                  </th>
                  <th className={`px-6 py-4 text-${dir === 'rtl' ? 'right' : 'left'} text-sm font-semibold text-slate-300`}>
                    Status
                  </th>
                  <th className={`px-6 py-4 text-${dir === 'rtl' ? 'right' : 'left'} text-sm font-semibold text-slate-300`}>
                    Created
                  </th>
                  <th className={`px-6 py-4 text-${dir === 'rtl' ? 'left' : 'right'} text-sm font-semibold text-slate-300`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{agent.name}</p>
                        <p className="text-slate-400 text-sm">{agent.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{agent.model}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          agent.status === 'active'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {t(`agents.status.${agent.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(agent.created_at).toLocaleDateString()}
                    </td>
                    <td className={`px-6 py-4 text-${dir === 'rtl' ? 'left' : 'right'}`}>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenu(activeMenu === agent.id ? null : agent.id)
                          }
                          className="p-2 text-slate-400 hover:text-white transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {activeMenu === agent.id && (
                          <div className={`absolute ${dir === 'rtl' ? 'left-0' : 'right-0'} top-full mt-2 w-48 bg-slate-700 rounded-lg border border-slate-600 shadow-lg z-50`}>
                            <button
                              className={`w-full px-4 py-2 text-${dir === 'rtl' ? 'right' : 'left'} text-slate-300 hover:bg-slate-600 flex items-center gap-2 transition-colors rounded-t-lg`}
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleStatus(agent.id, agent.status)}
                              className={`w-full px-4 py-2 text-${dir === 'rtl' ? 'right' : 'left'} text-slate-300 hover:bg-slate-600 flex items-center gap-2 transition-colors`}
                            >
                              {agent.status === 'active' ? t('agents.action.deactivate') : t('agents.action.activate')}
                            </button>
                            <button
                              onClick={() => handleDeleteAgent(agent.id)}
                              className={`w-full px-4 py-2 text-${dir === 'rtl' ? 'right' : 'left'} text-red-400 hover:bg-slate-600 flex items-center gap-2 transition-colors rounded-b-lg`}
                            >
                              <Trash2 className="w-4 h-4" />
                              {t('agents.action.delete')}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAgentsPage;
