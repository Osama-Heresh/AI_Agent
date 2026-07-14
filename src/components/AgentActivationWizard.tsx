import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Building2, Settings, Play, Rocket } from 'lucide-react';
import type { AIAgent, AgentInstance } from '../lib/types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AgentActivationWizardProps {
  agent: AIAgent;
  onClose: () => void;
  onComplete: (instance: AgentInstance) => void;
}

type Step = 'overview' | 'business-info' | 'configuration' | 'test' | 'activate';

const AgentActivationWizard: React.FC<AgentActivationWizardProps> = ({ agent, onClose, onComplete }) => {
  const { user, company } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('overview');
  const [instanceName, setInstanceName] = useState(agent.name);
  const [instanceDescription, setInstanceDescription] = useState('');
  const [configuration, setConfiguration] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'business-info', label: 'Business Info', icon: <Building2 className="w-5 h-5" /> },
    { id: 'configuration', label: 'Configuration', icon: <Settings className="w-5 h-5" /> },
    { id: 'test', label: 'Test', icon: <Play className="w-5 h-5" /> },
    { id: 'activate', label: 'Activate', icon: <Rocket className="w-5 h-5" /> },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleActivate = async () => {
    if (!user || !company) {
      setError('User or company not found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('agent_instances')
        .insert({
          company_id: company.id,
          agent_template_id: agent.id,
          name: instanceName,
          description: instanceDescription,
          status: 'active',
          configuration,
          activated_at: new Date().toISOString(),
          created_by: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      onComplete(data as AgentInstance);
    } catch (err) {
      console.error('Error activating agent:', err);
      setError(err instanceof Error ? err.message : 'Failed to activate agent');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'overview':
        return <OverviewStep agent={agent} />;
      case 'business-info':
        return (
          <BusinessInfoStep
            instanceName={instanceName}
            instanceDescription={instanceDescription}
            onNameChange={setInstanceName}
            onDescriptionChange={setInstanceDescription}
          />
        );
      case 'configuration':
        return (
          <ConfigurationStep
            agent={agent}
            configuration={configuration}
            onChange={setConfiguration}
          />
        );
      case 'test':
        return <TestStep agent={agent} configuration={configuration} />;
      case 'activate':
        return <ActivateStep agent={agent} configuration={configuration} />;
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'business-info':
        return instanceName.trim().length > 0;
      case 'configuration':
        const requiredInputs = agent.user_inputs.filter(input => input.required);
        return requiredInputs.every(input => configuration[input.name]);
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-slate-700 flex flex-col">
        <div className="bg-gradient-to-r from-teal-600 to-green-600 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">Activate Agent</h2>
            <p className="text-teal-100">{agent.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index <= currentStepIndex
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span
                    className={`hidden md:block font-medium ${
                      index <= currentStepIndex ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index < currentStepIndex ? 'bg-teal-600' : 'bg-slate-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}
          {renderStepContent()}
        </div>

        <div className="border-t border-slate-700 p-6 flex items-center justify-between bg-slate-900">
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep === 'activate' ? (
            <button
              onClick={handleActivate}
              disabled={loading || !canProceed()}
              className="px-8 py-2 bg-gradient-to-r from-teal-600 to-green-500 hover:shadow-lg hover:shadow-teal-500/30 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? 'Activating...' : 'Activate Agent'}
              <Rocket className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const OverviewStep: React.FC<{ agent: AIAgent }> = ({ agent }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">{agent.name}</h3>
        <p className="text-slate-300 text-lg">{agent.purpose}</p>
      </div>

      <div className="bg-slate-900 rounded-lg p-6">
        <h4 className="text-xl font-bold text-white mb-3">Description</h4>
        <p className="text-slate-300 leading-relaxed">{agent.description}</p>
      </div>

      <div>
        <h4 className="text-xl font-bold text-white mb-3">Key Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {agent.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-teal-400">Pricing</span>
        </div>
        <div className="text-2xl font-bold text-white">
          ${agent.monthly_price.toFixed(2)}<span className="text-sm text-slate-400">/month</span>
        </div>
        <div className="text-sm text-slate-400 mt-1">
          {agent.credits_per_use} credits per use
        </div>
      </div>
    </div>
  );
};

const BusinessInfoStep: React.FC<{
  instanceName: string;
  instanceDescription: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}> = ({ instanceName, instanceDescription, onNameChange, onDescriptionChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Agent Information</h3>
        <p className="text-slate-300">Give your agent instance a name and description</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Agent Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={instanceName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g., Main Factory Production Planning"
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Description (Optional)
        </label>
        <textarea
          value={instanceDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe how you plan to use this agent..."
          rows={4}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
    </div>
  );
};

const ConfigurationStep: React.FC<{
  agent: AIAgent;
  configuration: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}> = ({ agent, configuration, onChange }) => {
  const handleInputChange = (name: string, value: any) => {
    onChange({ ...configuration, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Agent Configuration</h3>
        <p className="text-slate-300">Configure the agent parameters for your business</p>
      </div>

      <div className="space-y-4">
        {agent.user_inputs.map((input) => (
          <div key={input.name}>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {input.placeholder || input.name}{' '}
              {input.required && <span className="text-red-400">*</span>}
            </label>

            {input.type === 'text' && (
              <input
                type="text"
                value={configuration[input.name] || ''}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                placeholder={input.placeholder}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}

            {input.type === 'textarea' && (
              <textarea
                value={configuration[input.name] || ''}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                placeholder={input.placeholder}
                rows={4}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}

            {input.type === 'number' && (
              <input
                type="number"
                value={configuration[input.name] || ''}
                onChange={(e) => handleInputChange(input.name, Number(e.target.value))}
                placeholder={input.placeholder}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}

            {input.type === 'select' && (
              <select
                value={configuration[input.name] || ''}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select an option</option>
                {input.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {input.type === 'multiselect' && (
              <div className="space-y-2">
                {input.options?.map((option) => (
                  <label key={option} className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={(configuration[input.name] as string[])?.includes(option) || false}
                      onChange={(e) => {
                        const current = (configuration[input.name] as string[]) || [];
                        const updated = e.target.checked
                          ? [...current, option]
                          : current.filter((item) => item !== option);
                        handleInputChange(input.name, updated);
                      }}
                      className="w-4 h-4 text-teal-600 bg-slate-900 border-slate-700 rounded focus:ring-teal-500"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {input.type === 'checkbox' && (
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={configuration[input.name] || false}
                  onChange={(e) => handleInputChange(input.name, e.target.checked)}
                  className="w-4 h-4 text-teal-600 bg-slate-900 border-slate-700 rounded focus:ring-teal-500"
                />
                {input.placeholder}
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TestStep: React.FC<{
  agent: AIAgent;
  configuration: Record<string, any>;
}> = ({ configuration }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Test Configuration</h3>
        <p className="text-slate-300">Review your configuration before activation</p>
      </div>

      <div className="bg-slate-900 rounded-lg p-6">
        <h4 className="text-lg font-bold text-white mb-4">Configuration Summary</h4>
        <div className="space-y-3">
          {Object.entries(configuration).map(([key, value]) => (
            <div key={key} className="flex items-start gap-3">
              <span className="text-slate-400 font-medium min-w-[200px]">{key}:</span>
              <span className="text-white flex-1">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-teal-400 font-semibold mb-1">Configuration Valid</p>
            <p className="text-slate-300 text-sm">
              Your configuration is complete and ready to be activated. The agent will use these settings to perform its tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivateStep: React.FC<{
  agent: AIAgent;
  configuration: Record<string, any>;
}> = ({ agent }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-teal-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Ready to Activate</h3>
        <p className="text-slate-300">
          Your agent is configured and ready to go. Click "Activate Agent" to start using it.
        </p>
      </div>

      <div className="bg-slate-900 rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold">Agent configured</p>
            <p className="text-slate-400 text-sm">All required parameters are set</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold">Ready for production</p>
            <p className="text-slate-400 text-sm">Agent can start processing immediately</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold">Usage tracking enabled</p>
            <p className="text-slate-400 text-sm">Monitor performance and costs in your dashboard</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
        <p className="text-amber-400 text-sm">
          Note: Billing for this agent will begin upon activation at ${agent.monthly_price.toFixed(2)}/month.
        </p>
      </div>
    </div>
  );
};

export default AgentActivationWizard;
