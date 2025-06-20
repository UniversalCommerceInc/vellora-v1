-- Create demo tenant data with proper UUIDs for development
-- This script ensures we have consistent demo data for testing
-- Note: User creation is handled through Supabase Auth, not directly in SQL

-- First, let's make sure we have the required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert demo tenant if it doesn't exist
INSERT INTO tenants (id, name, slug, subscription_tier, subscription_status)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Demo Organization',
  'demo',
  'pro',
  'active'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  subscription_tier = EXCLUDED.subscription_tier,
  subscription_status = EXCLUDED.subscription_status;

-- Insert authenticated tenant if it doesn't exist  
INSERT INTO tenants (id, name, slug, subscription_tier, subscription_status)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'Your Organization',
  'your-org',
  'pro', 
  'active'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  subscription_tier = EXCLUDED.subscription_tier,
  subscription_status = EXCLUDED.subscription_status;

-- Create demo organization for the demo tenant
INSERT INTO organizations (id, tenant_id, name, description)
VALUES (
  '00000000-0000-0000-0000-000000000011'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Demo Organization',
  'Demo organization for testing'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Create demo organization for the authenticated tenant
INSERT INTO organizations (id, tenant_id, name, description)
VALUES (
  '00000000-0000-0000-0000-000000000012'::uuid,
  '00000000-0000-0000-0000-000000000002'::uuid,
  'Your Organization',
  'Your main organization'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Create additional organizations for testing multi-org scenarios
INSERT INTO organizations (id, tenant_id, name, description)
VALUES (
  '00000000-0000-0000-0000-000000000013'::uuid,
  '00000000-0000-0000-0000-000000000002'::uuid,
  'Sales Division',
  'Sales division organization'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Check if deal stages already exist before creating them
DO $$
BEGIN
    -- Create default deal stages for demo tenant - demo organization
    IF NOT EXISTS (
        SELECT 1 FROM deal_stages 
        WHERE tenant_id = '00000000-0000-0000-0000-000000000001'::uuid 
        AND organization_id = '00000000-0000-0000-0000-000000000011'::uuid
    ) THEN
        PERFORM create_default_deal_stages(
            '00000000-0000-0000-0000-000000000001'::uuid,
            '00000000-0000-0000-0000-000000000011'::uuid
        );
    END IF;

    -- Create default deal stages for authenticated tenant - main organization
    IF NOT EXISTS (
        SELECT 1 FROM deal_stages 
        WHERE tenant_id = '00000000-0000-0000-0000-000000000002'::uuid 
        AND organization_id = '00000000-0000-0000-0000-000000000012'::uuid
    ) THEN
        PERFORM create_default_deal_stages(
            '00000000-0000-0000-0000-000000000002'::uuid,
            '00000000-0000-0000-0000-000000000012'::uuid
        );
    END IF;

    -- Create default deal stages for authenticated tenant - sales division
    IF NOT EXISTS (
        SELECT 1 FROM deal_stages 
        WHERE tenant_id = '00000000-0000-0000-0000-000000000002'::uuid 
        AND organization_id = '00000000-0000-0000-0000-000000000013'::uuid
    ) THEN
        PERFORM create_default_deal_stages(
            '00000000-0000-0000-0000-000000000002'::uuid,
            '00000000-0000-0000-0000-000000000013'::uuid
        );
    END IF;
END $$;

-- Create some sample contacts for testing
INSERT INTO contacts (id, tenant_id, organization_id, first_name, last_name, email, phone, company, title)
VALUES 
  ('00000000-0000-0000-0000-000000000041'::uuid, '00000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000012'::uuid, 'John', 'Smith', 'john.smith@example.com', '+1-555-0101', 'Acme Corp', 'CEO'),
  ('00000000-0000-0000-0000-000000000042'::uuid, '00000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000012'::uuid, 'Jane', 'Doe', 'jane.doe@techstart.com', '+1-555-0102', 'TechStart Inc', 'CTO'),
  ('00000000-0000-0000-0000-000000000043'::uuid, '00000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000012'::uuid, 'Bob', 'Johnson', 'bob.johnson@enterprise.com', '+1-555-0103', 'Enterprise Solutions', 'VP Sales'),
  ('00000000-0000-0000-0000-000000000044'::uuid, '00000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000013'::uuid, 'Sarah', 'Wilson', 'sarah.wilson@globaltech.com', '+1-555-0104', 'GlobalTech', 'Director'),
  ('00000000-0000-0000-0000-000000000045'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000011'::uuid, 'Mike', 'Davis', 'mike.davis@startup.com', '+1-555-0105', 'StartupCo', 'Founder')
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  company = EXCLUDED.company,
  title = EXCLUDED.title;

-- Create some sample deals for testing (using a safer approach with variables)
DO $$
DECLARE
    stage_negotiation_id uuid;
    stage_proposal_id uuid;
    stage_qualified_id uuid;
    stage_lead_id uuid;
    stage_closed_won_id uuid;
    stage_proposal_sales_id uuid;
BEGIN
    -- Get stage IDs for main organization
    SELECT id INTO stage_negotiation_id FROM deal_stages 
    WHERE tenant_id = '00000000-0000-0000-0000-000000000002'::uuid 
    AND organization_id = '00000000-0000-0000-0000-000000000012'::uuid 
    AND name = 'Negotiation' LIMIT 1;
    
    SELECT id INTO stage_proposal_id FROM deal_stages 
    WHERE tenant_id = '00000000-0000-0000-0000-000000000002'::uuid 
    AND organization_id = '00000000-0000-0000-0000-000000000012'::uuid 
    AND name = 'Proposal' LIMIT 1;
    
    SELECT id INTO stage_qualified_id FROM deal_stages 
    WHERE tenant_id = '00000000-0000-0000-0000-000000000002'::uuid 
    AND organization_id = '00000000-0000-0000-0000-000000000012'::uuid 
    AND name = 'Qualified' LIMIT 1;
    
    SELECT id INTO stage_lead_id FROM deal_stages 
    WHERE tenant_id = '00000000-0000-0000-0000-000000000002'::uuid 
    AND organization_id = '00000000-0000-0000-0000-000000000012'::uuid 
    AND name = 'Lead' LIMIT 1;
    
    -- Get stage IDs for sales division
    SELECT id INTO stage_proposal_sales_id FROM deal_stages 
    WHERE tenant_id = '00000000-0000-0000-0000-000000000002'::uuid 
    AND organization_id = '00000000-0000-0000-0000-000000000013'::uuid 
    AND name = 'Proposal' LIMIT 1;
    
    -- Get stage ID for demo organization
    SELECT id INTO stage_closed_won_id FROM deal_stages 
    WHERE tenant_id = '00000000-0000-0000-0000-000000000001'::uuid 
    AND organization_id = '00000000-0000-0000-0000-000000000011'::uuid 
    AND name = 'Closed Won' LIMIT 1;

    -- Insert deals with proper stage references
    INSERT INTO deals (id, tenant_id, organization_id, title, description, value, currency, probability, expected_close_date, primary_contact_id, stage_id)
    VALUES 
      (
        '00000000-0000-0000-0000-000000000051'::uuid,
        '00000000-0000-0000-0000-000000000002'::uuid,
        '00000000-0000-0000-0000-000000000012'::uuid,
        'Acme Corp - Enterprise License',
        'Annual enterprise software license for Acme Corp',
        50000.00,
        'USD',
        75,
        '2024-02-15'::date,
        '00000000-0000-0000-0000-000000000041'::uuid,
        stage_negotiation_id
      ),
      (
        '00000000-0000-0000-0000-000000000052'::uuid,
        '00000000-0000-0000-0000-000000000002'::uuid,
        '00000000-0000-0000-0000-000000000012'::uuid,
        'TechStart - Consulting Services',
        'Technical consulting and implementation services',
        25000.00,
        'USD',
        50,
        '2024-03-01'::date,
        '00000000-0000-0000-0000-000000000042'::uuid,
        stage_proposal_id
      ),
      (
        '00000000-0000-0000-0000-000000000053'::uuid,
        '00000000-0000-0000-0000-000000000002'::uuid,
        '00000000-0000-0000-0000-000000000012'::uuid,
        'Enterprise Solutions - Integration',
        'System integration and data migration project',
        75000.00,
        'USD',
        25,
        '2024-04-15'::date,
        '00000000-0000-0000-0000-000000000043'::uuid,
        stage_qualified_id
      ),
      (
        '00000000-0000-0000-0000-000000000054'::uuid,
        '00000000-0000-0000-0000-000000000002'::uuid,
        '00000000-0000-0000-0000-000000000013'::uuid,
        'GlobalTech - Platform Migration',
        'Migration to new platform with training',
        100000.00,
        'USD',
        60,
        '2024-03-30'::date,
        '00000000-0000-0000-0000-000000000044'::uuid,
        stage_proposal_sales_id
      ),
      (
        '00000000-0000-0000-0000-000000000055'::uuid,
        '00000000-0000-0000-0000-000000000001'::uuid,
        '00000000-0000-0000-0000-000000000011'::uuid,
        'StartupCo - Initial Setup',
        'Complete CRM setup and onboarding',
        15000.00,
        'USD',
        90,
        '2024-01-30'::date,
        '00000000-0000-0000-0000-000000000045'::uuid,
        stage_closed_won_id
      ),
      (
        '00000000-0000-0000-0000-000000000056'::uuid,
        '00000000-0000-0000-0000-000000000002'::uuid,
        '00000000-0000-0000-0000-000000000012'::uuid,
        'New Lead - Software Evaluation',
        'Potential customer evaluating our software solution',
        30000.00,
        'USD',
        10,
        '2024-05-01'::date,
        '00000000-0000-0000-0000-000000000041'::uuid,
        stage_lead_id
      )
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      value = EXCLUDED.value,
      currency = EXCLUDED.currency,
      probability = EXCLUDED.probability,
      expected_close_date = EXCLUDED.expected_close_date,
      primary_contact_id = EXCLUDED.primary_contact_id,
      stage_id = EXCLUDED.stage_id;
END $$;

-- Create some sample activities for testing
INSERT INTO activities (id, tenant_id, organization_id, activity_type, title, description, deal_id, contact_id, scheduled_at, completed_at)
VALUES 
  ('00000000-0000-0000-0000-000000000061'::uuid, '00000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000012'::uuid, 'call', 'Follow-up call with John', 'Discuss contract terms and timeline', '00000000-0000-0000-0000-000000000051'::uuid, '00000000-0000-0000-0000-000000000041'::uuid, '2024-01-20 14:00:00'::timestamp, NULL),
  ('00000000-0000-0000-0000-000000000062'::uuid, '00000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000012'::uuid, 'email', 'Send proposal to Jane', 'Send detailed proposal with pricing', '00000000-0000-0000-0000-000000000052'::uuid, '00000000-0000-0000-0000-000000000042'::uuid, '2024-01-18 09:00:00'::timestamp, '2024-01-18 09:30:00'::timestamp),
  ('00000000-0000-0000-0000-000000000063'::uuid, '00000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000012'::uuid, 'meeting', 'Demo session with Bob', 'Product demonstration and Q&A', '00000000-0000-0000-0000-000000000053'::uuid, '00000000-0000-0000-0000-000000000043'::uuid, '2024-01-25 15:00:00'::timestamp, NULL)
ON CONFLICT (id) DO UPDATE SET
  activity_type = EXCLUDED.activity_type,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  deal_id = EXCLUDED.deal_id,
  contact_id = EXCLUDED.contact_id,
  scheduled_at = EXCLUDED.scheduled_at,
  completed_at = EXCLUDED.completed_at;

-- Create some sample meetings for testing
INSERT INTO meetings (id, tenant_id, organization_id, title, description, scheduled_at, duration_minutes, meeting_type, deal_id, status)
VALUES 
  ('00000000-0000-0000-0000-000000000071'::uuid, '00000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000012'::uuid, 'Acme Corp - Contract Review', 'Review final contract terms', '2024-01-22 14:00:00'::timestamp, 60, 'video_call', '00000000-0000-0000-0000-000000000051'::uuid, 'scheduled'),
  ('00000000-0000-0000-0000-000000000072'::uuid, '00000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000012'::uuid, 'TechStart - Kickoff Meeting', 'Project kickoff and planning session', '2024-01-24 10:00:00'::timestamp, 90, 'in_person', '00000000-0000-0000-0000-000000000052'::uuid, 'scheduled')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  scheduled_at = EXCLUDED.scheduled_at,
  duration_minutes = EXCLUDED.duration_minutes,
  meeting_type = EXCLUDED.meeting_type,
  deal_id = EXCLUDED.deal_id,
  status = EXCLUDED.status;
