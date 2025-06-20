-- Create demo user setup for testing
-- This script creates a complete demo user with tenant, organization, and access

-- First, let's create a demo tenant
INSERT INTO tenants (id, name, slug, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Organization',
  'demo-org',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  updated_at = NOW();

-- Create a demo organization
INSERT INTO organizations (id, tenant_id, name, description, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Demo Organization',
  'Demo organization for testing Vellora AI',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Create demo user in auth.users table (Supabase auth)
-- Note: This requires admin privileges and may need to be done via Supabase dashboard
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo@vellora.ai',
  crypt('demo123456', gen_salt('bf')), -- Encrypted password
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Demo", "last_name": "User"}',
  false,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  updated_at = NOW();

-- Create demo user in custom users table
INSERT INTO users (id, email, first_name, last_name, avatar_url, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'demo@vellora.ai',
  'Demo',
  'User',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  updated_at = NOW();

-- Create user tenant access
INSERT INTO user_tenant_access (
  id,
  user_id,
  tenant_id,
  organization_id,
  role,
  status,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'admin',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Create some sample deal stages for the demo organization
INSERT INTO deal_stages (id, tenant_id, organization_id, name, order_index, color, is_closed, is_won, probability_percentage, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Lead', 1, '#3B82F6', false, false, 25, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Qualified', 2, '#F59E0B', false, false, 50, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Proposal', 3, '#8B5CF6', false, false, 65, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Negotiation', 4, '#EF4444', false, false, 80, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Closed Won', 5, '#10B981', true, true, 100, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Closed Lost', 6, '#6B7280', true, false, 0, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  order_index = EXCLUDED.order_index,
  color = EXCLUDED.color,
  is_closed = EXCLUDED.is_closed,
  is_won = EXCLUDED.is_won,
  probability_percentage = EXCLUDED.probability_percentage,
  updated_at = NOW();

-- Create some sample contacts for the demo organization
INSERT INTO contacts (id, tenant_id, organization_id, first_name, last_name, email, phone, company, title, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'John', 'Smith', 'john.smith@acme.com', '+1-555-0101', 'Acme Corp', 'CEO', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Sarah', 'Johnson', 'sarah.johnson@techstart.com', '+1-555-0102', 'TechStart Inc', 'CTO', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Mike', 'Davis', 'mike.davis@globalcorp.com', '+1-555-0103', 'Global Corp', 'VP Sales', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  company = EXCLUDED.company,
  title = EXCLUDED.title,
  updated_at = NOW();

-- Create some sample deals for the demo organization
INSERT INTO deals (id, tenant_id, organization_id, primary_contact_id, stage_id, title, description, value, probability, expected_close_date, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010', 'Acme Corp - Enterprise License', 'Enterprise software license deal with Acme Corp', 50000.00, 25, '2024-03-15', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000011', 'TechStart - Consulting Services', 'Technical consulting services for TechStart Inc', 25000.00, 50, '2024-02-28', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000013', 'Global Corp - Integration Project', 'System integration project for Global Corp', 75000.00, 80, '2024-02-15', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000014', 'Acme Corp - Support Contract', 'Annual support contract with Acme Corp', 15000.00, 100, '2024-01-31', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  value = EXCLUDED.value,
  probability = EXCLUDED.probability,
  expected_close_date = EXCLUDED.expected_close_date,
  updated_at = NOW();

-- Verify the setup
SELECT 'Demo setup completed successfully!' as status;

-- Show what was created
SELECT 
  'Tenant: ' || t.name as created_item
FROM tenants t 
WHERE t.id = '00000000-0000-0000-0000-000000000001'

UNION ALL

SELECT 
  'Organization: ' || o.name as created_item
FROM organizations o 
WHERE o.id = '00000000-0000-0000-0000-000000000002'

UNION ALL

SELECT 
  'User: ' || u.email as created_item
FROM users u 
WHERE u.id = '00000000-0000-0000-0000-000000000003'

UNION ALL

SELECT 
  'User Access: ' || uta.role || ' access to ' || t.name as created_item
FROM user_tenant_access uta
JOIN tenants t ON uta.tenant_id = t.id
WHERE uta.user_id = '00000000-0000-0000-0000-000000000003'

UNION ALL

SELECT 
  'Deal Stages: ' || COUNT(*)::text || ' stages created' as created_item
FROM deal_stages ds
WHERE ds.organization_id = '00000000-0000-0000-0000-000000000002'

UNION ALL

SELECT 
  'Contacts: ' || COUNT(*)::text || ' contacts created' as created_item
FROM contacts c
WHERE c.organization_id = '00000000-0000-0000-0000-000000000002'

UNION ALL

SELECT 
  'Deals: ' || COUNT(*)::text || ' deals created' as created_item
FROM deals d
WHERE d.organization_id = '00000000-0000-0000-0000-000000000002';
