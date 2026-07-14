import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface CreateAgentPageProps {
  onBack: () => void;
  onComplete: () => void;
}

const CreateAgentPage: React.FC<CreateAgentPageProps> = ({ onBack, onComplete }) => {
  const { company } = useAuth();
  const { t, dir } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: '',
  });
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [newCapability, setNewCapability] = useState('');

  const availableCapabilities = [
    'Customer Support',
    'Sales Assistance',
    'Lead Generation',
    'Content Creation',
    'Data Analysis',
    'Task Automation',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'temperature' || name === 'maxTokens' ? parseFloat(value) : value,
    }));
  };

  const addCapability = () => {
    if (newCapability && !capabilities.includes(newCapability)) {
      setCapabilities([...capabilities, newCapability]);
      setNewCapability('');
    }
  };

  const removeCapability = (index: number) => {
    setCapabilities(capabilities.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!company) {
        throw new Error('Company not found');
      }

      const { error: insertError } = await supabase.from('agents').insert({
        company_id: company.id,
        name: formData.name,
        description: formData.description,
        model: formData.model,
        temperature: formData.temperature,
        max_tokens: formData.maxTokens,
        system_prompt: formData.systemPrompt,
        status: 'active',
        configuration: {
          capabilities,
        },
      });

      if (insertError) throw insertError;

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" dir={dir}>
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-teal-500 hover:text-teal-400 transition-colors"
      >
        <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        Back to Agents
      </button>

      <div>
        <h1 className="text-3xl font-bold text-white">{t('create.title')}</h1>
        <p className="text-slate-400 mt-2">{t('create.subtitle')}</p>
      </div>

      {/* Form Card */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 max-w-3xl">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Agent Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Customer Support Bot"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what your agent does"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Model Configuration */}
          <div className="space-y-4 border-t border-slate-700 pt-6">
            <h2 className="text-xl font-bold text-white">Model Configuration</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  AI Model
                </label>
                <select
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3">Claude 3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Temperature ({formData.temperature.toFixed(1)})
                </label>
                <input
                  type="range"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  min="0"
                  max="2"
                  step="0.1"
                  className="w-full"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Lower = more focused, Higher = more creative
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Tokens
              </label>
              <input
                type="number"
                name="maxTokens"
                value={formData.maxTokens}
                onChange={handleInputChange}
                min="100"
                max="4000"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          {/* System Prompt */}
          <div className="space-y-4 border-t border-slate-700 pt-6">
            <h2 className="text-xl font-bold text-white">System Prompt</h2>
            <textarea
              name="systemPrompt"
              value={formData.systemPrompt}
              onChange={handleInputChange}
              placeholder="Define the agent's behavior and personality"
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Capabilities */}
          <div className="space-y-4 border-t border-slate-700 pt-6">
            <h2 className="text-xl font-bold text-white">Capabilities</h2>

            <div className="flex flex-wrap gap-2">
              {capabilities.map((cap, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900 text-teal-300 text-sm"
                >
                  {cap}
                  <button
                    type="button"
                    onClick={() => removeCapability(index)}
                    className="ml-1 text-teal-400 hover:text-teal-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <select
                value={newCapability}
                onChange={(e) => setNewCapability(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-teal-500 transition-colors"
              >
                <option value="">Select a capability</option>
                {availableCapabilities.map((cap) => (
                  <option key={cap} value={cap}>
                    {cap}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addCapability}
                className="px-4 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 border-t border-slate-700 pt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-lg border border-slate-600 text-white font-semibold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-green-500 text-white font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('create.button.creating') : t('create.button.launch')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAgentPage;
