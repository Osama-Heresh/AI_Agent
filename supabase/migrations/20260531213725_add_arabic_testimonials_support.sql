/*
  # Add Arabic support to customer_feedback
  
  1. Changes
    - Add Arabic columns for customer_name, company_name, and feedback_text
*/

ALTER TABLE customer_feedback 
ADD COLUMN IF NOT EXISTS customer_name_ar text,
ADD COLUMN IF NOT EXISTS company_name_ar text,
ADD COLUMN IF NOT EXISTS feedback_text_ar text;