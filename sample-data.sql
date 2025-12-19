-- Sample Data for LMA NEXUS Application
-- Run this after setting up the basic policies

-- Note: In a real Supabase setup, users are created through the auth system
-- This script creates sample profiles and roles for existing users
-- You'll need to replace the UUIDs with actual user IDs from your auth.users table

-- Sample user profiles (replace UUIDs with real user IDs from your auth.users table)
INSERT INTO profiles (id, full_name, avatar_url, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'John Admin', null, now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'Sarah Johnson', null, now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'Mike Trader', null, now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'Lisa Compliance', null, now(), now())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  updated_at = now();

-- Sample user roles
INSERT INTO user_roles (user_id, role, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin', now()),
  ('22222222-2222-2222-2222-222222222222', 'loan_officer', now()),
  ('33333333-3333-3333-3333-333333333333', 'trader', now()),
  ('44444444-4444-4444-4444-444444444444', 'compliance_officer', now())
ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role;

-- Sample notifications
INSERT INTO notifications (user_id, title, message, type, read, metadata, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'System Update', 'LMA NEXUS has been updated to version 2.1', 'system', false, '{"version": "2.1"}', now() - interval '1 hour'),
  ('11111111-1111-1111-1111-111111111111', 'New User Registration', 'A new user has registered and needs role assignment', 'user', false, '{"user_email": "newuser@example.com"}', now() - interval '2 hours'),
  ('22222222-2222-2222-2222-222222222222', 'Loan Covenant Alert', 'ABC Corp loan covenant requires attention', 'alert', false, '{"loan_id": "L001", "covenant_type": "financial"}', now() - interval '30 minutes'),
  ('22222222-2222-2222-2222-222222222222', 'Document Ready', 'Credit agreement for XYZ Inc is ready for review', 'document', true, '{"document_id": "D001"}', now() - interval '3 hours'),
  ('33333333-3333-3333-3333-333333333333', 'Trading Opportunity', 'New loan available for secondary trading', 'trading', false, '{"loan_id": "L002", "amount": 25000000}', now() - interval '15 minutes'),
  ('44444444-4444-4444-4444-444444444444', 'Compliance Review', 'Monthly compliance report is due', 'compliance', false, '{"report_type": "monthly", "due_date": "2024-02-01"}', now() - interval '1 day');

-- Sample notification settings
INSERT INTO notification_settings (user_id, email, audit_critical, integration_alerts, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@lmanexus.com', true, true, now()),
  ('22222222-2222-2222-2222-222222222222', 'sarah.johnson@lmanexus.com', true, false, now()),
  ('33333333-3333-3333-3333-333333333333', 'mike.trader@lmanexus.com', false, true, now()),
  ('44444444-4444-4444-4444-444444444444', 'lisa.compliance@lmanexus.com', true, true, now())
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  audit_critical = EXCLUDED.audit_critical,
  integration_alerts = EXCLUDED.integration_alerts;

-- Sample scheduled reports
INSERT INTO scheduled_reports (user_id, report_name, template_id, frequency, recipients, sections, date_range, is_active, next_run_at, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Weekly Portfolio Summary', 'portfolio-summary', 'weekly', ARRAY['admin@lmanexus.com', 'management@lmanexus.com'], '{"portfolio": true, "risk": true, "performance": true}', 'last_7_days', true, now() + interval '7 days', now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'Monthly Loan Report', 'loan-details', 'monthly', ARRAY['sarah.johnson@lmanexus.com'], '{"loans": true, "covenants": true, "payments": true}', 'last_30_days', true, now() + interval '30 days', now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'Daily Trading Summary', 'trading-summary', 'daily', ARRAY['mike.trader@lmanexus.com', 'trading-desk@lmanexus.com'], '{"trades": true, "market": true, "pnl": true}', 'last_1_day', true, now() + interval '1 day', now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'Compliance Dashboard', 'compliance-report', 'weekly', ARRAY['lisa.compliance@lmanexus.com', 'legal@lmanexus.com'], '{"compliance": true, "audit": true, "risk": true}', 'last_7_days', true, now() + interval '7 days', now(), now());

-- Sample audit logs
INSERT INTO audit_logs (user_id, entity_type, entity_id, action, details, ip_address, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'user', '22222222-2222-2222-2222-222222222222', 'role_assigned', '{"role": "loan_officer", "assigned_by": "admin"}', '192.168.1.100', now() - interval '1 day'),
  ('22222222-2222-2222-2222-222222222222', 'loan', 'L001', 'created', '{"borrower": "ABC Corp", "amount": 50000000, "type": "term_loan"}', '192.168.1.101', now() - interval '2 hours'),
  ('33333333-3333-3333-3333-333333333333', 'trade', 'T001', 'executed', '{"loan_id": "L001", "amount": 5000000, "price": 99.25, "side": "buy"}', '192.168.1.102', now() - interval '1 hour'),
  ('44444444-4444-4444-4444-444444444444', 'compliance', 'C001', 'review_completed', '{"entity": "ABC Corp", "status": "approved", "reviewer": "Lisa Compliance"}', '192.168.1.103', now() - interval '30 minutes'),
  ('11111111-1111-1111-1111-111111111111', 'system', 'SYS001', 'backup_completed', '{"backup_size": "2.5GB", "duration": "45 minutes"}', '192.168.1.100', now() - interval '6 hours');

-- Display summary of created data
SELECT 'Sample data created successfully!' as status;
SELECT 'Profiles created: ' || count(*) as profiles_count FROM profiles WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444');
SELECT 'User roles created: ' || count(*) as roles_count FROM user_roles WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444');
SELECT 'Notifications created: ' || count(*) as notifications_count FROM notifications WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444');