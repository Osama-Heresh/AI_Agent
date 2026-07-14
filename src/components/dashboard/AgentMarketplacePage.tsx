import React, { useState, useEffect } from 'react';
import { Search, Star, TrendingUp, CheckCircle2, ChevronRight, Sparkles, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { AIAgent, AgentCategory, AgentInstance } from '../../lib/types';
import AgentActivationWizard from '../AgentActivationWizard';

const AgentMarketplacePage: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [categories, setCategories] = useState<AgentCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [activatingAgent, setActivatingAgent] = useState<AIAgent | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    loadData().then(() => clearTimeout(timeoutId));

    return () => clearTimeout(timeoutId);
  }, []);

  const loadData = async () => {
    try {
      const [agentsResult, categoriesResult] = await Promise.all([
        supabase
          .from('ai_agents')
          .select('*')
          .eq('is_active', true)
          .order('popularity_score', { ascending: false }),
        supabase
          .from('agent_categories')
          .select('*')
          .order('display_order')
      ]);

      if (agentsResult.error) {
        console.error('Error loading agents:', agentsResult.error);
      } else if (agentsResult.data) {
        setAgents(agentsResult.data as AIAgent[]);
      }

      if (categoriesResult.error) {
        console.error('Error loading categories:', categoriesResult.error);
      } else if (categoriesResult.data) {
        setCategories(categoriesResult.data as AgentCategory[]);
      }
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesCategory = selectedCategory === 'all' || agent.category_id === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPriceColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'text-green-400';
      case 'pro': return 'text-blue-400';
      case 'enterprise': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pro': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'enterprise': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
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
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-teal-500" />
            <h1 className="text-4xl font-bold text-white">AI Agent Marketplace</h1>
          </div>
          <p className="text-slate-300 text-lg">
            Discover powerful AI agents designed to transform your business operations
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Agents
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-teal-500 transition-all cursor-pointer group hover:shadow-lg hover:shadow-teal-500/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
                    {agent.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded border ${getTierBadgeColor(agent.pricing_tier)}`}>
                    {agent.pricing_tier.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">{(agent.popularity_score / 10).toFixed(1)}</span>
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                {agent.purpose}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-teal-500" />
                  <span className="text-slate-400">{agent.credits_per_use} credits per use</span>
                </div>
                <div className={`text-2xl font-bold ${getPriceColor(agent.pricing_tier)}`}>
                  ${agent.monthly_price.toFixed(2)}<span className="text-sm text-slate-400">/month</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-900 rounded text-xs text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-teal-500" />
                      {feature}
                    </span>
                  ))}
                  {agent.features.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 bg-slate-900 rounded text-xs text-slate-400">
                      +{agent.features.length - 3} more
                    </span>
                  )}
                </div>

                <button className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group">
                  View Details
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-slate-400 text-lg">No agents found matching your criteria</div>
          </div>
        )}
      </div>

      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onActivate={(agent) => {
            setSelectedAgent(null);
            setActivatingAgent(agent);
          }}
        />
      )}

      {activatingAgent && (
        <AgentActivationWizard
          agent={activatingAgent}
          onClose={() => setActivatingAgent(null)}
          onComplete={(instance: AgentInstance) => {
            setActivatingAgent(null);
            alert(`Agent "${instance.name}" activated successfully!`);
          }}
        />
      )}
    </div>
  );
};

interface AgentDetailModalProps {
  agent: AIAgent;
  onClose: () => void;
  onActivate: (agent: AIAgent) => void;
}

const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, onClose, onActivate }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{agent.name}</h2>
            <p className="text-slate-300">{agent.purpose}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-500" />
              Description
            </h3>
            <p className="text-slate-300 leading-relaxed">{agent.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agent.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3">Workflow</h3>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{agent.workflow_logic}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3">Output Format</h3>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{agent.output_format}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3">Example Prompts</h3>
            <div className="space-y-2">
              {agent.example_prompts.map((prompt, idx) => (
                <div key={idx} className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-300 text-sm italic">"{prompt}"</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3">Tools & Integrations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agent.tools_needed.map((tool, idx) => (
                <div key={idx} className="bg-slate-900 rounded-lg p-3">
                  <div className="font-semibold text-white">{tool.name}</div>
                  <div className="text-sm text-slate-400">{tool.purpose}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-6 border border-teal-500/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-teal-400">
                  ${agent.monthly_price.toFixed(2)}<span className="text-lg text-slate-400">/month</span>
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  {agent.credits_per_use} credits per use
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${getTierBadgeColor(agent.pricing_tier)}`}>
                {agent.pricing_tier.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => onActivate(agent)}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-green-500 hover:shadow-lg hover:shadow-teal-500/30 text-white rounded-lg font-semibold transition-all"
            >
              Activate Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getTierBadgeColor = (tier: string) => {
  switch (tier) {
    case 'basic': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'pro': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'enterprise': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

export default AgentMarketplacePage;