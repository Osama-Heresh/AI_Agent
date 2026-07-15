import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CustomerFeedback as CustomerFeedbackType } from '../lib/types';
import { useLanguage } from '../contexts/LanguageContext';

const CustomerFeedback: React.FC = () => {
  const { language, t } = useLanguage();
  const [feedbacks, setFeedbacks] = useState<CustomerFeedbackType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {feedbacks.map((feedback) => (
        <div
          key={feedback.id}
          className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors"
        >
          {/* Rating Stars */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < feedback.rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Feedback Text */}
          <p className="text-slate-300 mb-6 leading-relaxed min-h-24">
            "{language === 'ar' && feedback.feedback_text_ar ? feedback.feedback_text_ar : feedback.feedback_text}"
          </p>

          {/* Customer Info */}
          <div className="flex items-center gap-3">
            {feedback.avatar_url ? (
              <img
                src={feedback.avatar_url}
                alt={feedback.customer_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-600 to-green-500 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <p className="text-white font-semibold">
                {language === 'ar' && feedback.customer_name_ar
                  ? feedback.customer_name_ar
                  : feedback.customer_name}
              </p>
              <p className="text-teal-400 text-sm font-medium">
                {feedback.customer_title}
              </p>
              <p className="text-slate-400 text-sm">
                {language === 'ar' && feedback.company_name_ar
                  ? feedback.company_name_ar
                  : feedback.company_name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerFeedback;
