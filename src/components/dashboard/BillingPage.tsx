import React, { useState, useEffect } from 'react';
import { Check, X, Download, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Subscription, Invoice } from '../../lib/types';

const BillingPage: React.FC = () => {
  const { company } = useAuth();
  const { t, dir } = useLanguage();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    fetchBillingData().then(() => clearTimeout(timeoutId));

    return () => clearTimeout(timeoutId);
  }, [company]);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      if (!company) return;

      const { data: subscriptionData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('company_id', company.id)
        .maybeSingle();

      if (subError) {
        console.error('Error fetching subscription:', subError);
      } else if (subscriptionData) {
        setSubscription(subscriptionData);
      }

      const { data: invoicesData, error: invError } = await supabase
        .from('invoices')
        .select('*')
        .eq('company_id', company.id)
        .order('issued_at', { ascending: false })
        .limit(10);

      if (invError) {
        console.error('Error fetching invoices:', invError);
      } else {
        setInvoices(invoicesData || []);
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Starter',
      price: 99,
      description: 'Perfect for getting started',
      features: [
        'Up to 3 agents',
        '10,000 conversations/month',
        'Basic analytics',
        'Email support',
        'Standard SLA',
      ],
      limitations: [
        'No custom integrations',
        'Limited API access',
      ],
    },
    {
      name: 'Professional',
      price: 499,
      description: 'For growing teams',
      features: [
        'Up to 20 agents',
        'Unlimited conversations',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'Full API access',
        'Advanced SLA',
      ],
      limitations: [],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: null,
      description: 'Custom solutions',
      features: [
        'Unlimited agents',
        'Unlimited conversations',
        'Custom analytics',
        '24/7 support',
        'Dedicated account manager',
        'Custom integrations',
        'White-label options',
      ],
      limitations: [],
    },
  ];

  return (
    <div className="space-y-8" dir={dir}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">{t('billing.title')}</h1>
        <p className="text-slate-400 mt-1">{t('billing.subtitle')}</p>
      </div>

      {/* Current Plan */}
      {subscription && (
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-slate-600 p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-slate-400 text-sm mb-2">Current Plan</p>
              <h2 className="text-3xl font-bold text-white capitalize mb-2">
                {subscription.plan}
              </h2>
              <p className="text-slate-300 mb-4">
                {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    subscription.status === 'active'
                      ? 'bg-green-900 text-green-300'
                      : 'bg-red-900 text-red-300'
                  }`}
                >
                  {subscription.status}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Billing Period</p>
                <p className="text-white font-semibold">
                  {new Date(subscription.current_period_start).toLocaleDateString()} -{' '}
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-2 rounded-lg border border-slate-600 text-white font-semibold hover:bg-slate-700 transition-colors">
                  Change Plan
                </button>
                <button className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">
                  Cancel Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plans Comparison */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg border p-6 transition-all ${
                plan.popular
                  ? 'bg-gradient-to-br from-teal-900/30 to-green-900/30 border-teal-600 shadow-lg shadow-teal-500/20'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              {plan.popular && (
                <div className="mb-4 inline-block px-3 py-1 rounded-full bg-teal-600 text-teal-100 text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                {plan.price ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-slate-400">/month</span>
                    </div>
                  </>
                ) : (
                  <p className="text-2xl font-bold text-white">Custom Pricing</p>
                )}
              </div>

              <button
                className={`w-full py-2 rounded-lg font-semibold mb-6 transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-teal-600 to-green-500 text-white hover:shadow-lg hover:shadow-teal-500/30'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                {subscription?.plan === plan.name.toLowerCase() ? 'Current Plan' : 'Select Plan'}
              </button>

              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-slate-300">Includes:</p>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}

                {plan.limitations.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-slate-400 pt-3">Not included:</p>
                    {plan.limitations.map((limitation, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <X className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-400 text-sm">{limitation}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Payment Method</h2>
          <button className="px-4 py-2 rounded-lg border border-slate-600 text-white text-sm font-semibold hover:bg-slate-700 transition-colors flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Update Card
          </button>
        </div>
        <div className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg">
          <div className="w-12 h-8 bg-slate-600 rounded flex items-center justify-center text-slate-400 text-xs font-bold">
            CARD
          </div>
          <div>
            <p className="text-white font-semibold">Visa ending in 4242</p>
            <p className="text-slate-400 text-sm">Expires 12/2025</p>
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Invoices</h2>

        {loading ? (
          <p className="text-slate-400 text-center py-8">Loading invoices...</p>
        ) : invoices.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No invoices yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Invoice
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-white font-medium">{invoice.id}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(invoice.issued_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">
                      ${invoice.amount} {invoice.currency?.toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'paid'
                            ? 'bg-green-900 text-green-300'
                            : invoice.status === 'pending'
                              ? 'bg-yellow-900 text-yellow-300'
                              : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-teal-500 hover:text-teal-400 flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span className="text-xs">Download</span>
                      </button>
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

export default BillingPage;
