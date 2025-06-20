-- Clear existing sample data (except the main tenant)
DELETE FROM activities WHERE deal_id IN (SELECT id FROM deals WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000');
DELETE FROM meetings WHERE deal_id IN (SELECT id FROM deals WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000');
DELETE FROM deals WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM contacts WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM deal_stages WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000';

-- Insert deal stages (matching v50 design) - NOW WITH organization_id
INSERT INTO deal_stages (id, tenant_id, organization_id, name, description, color, order_index, probability_percentage, is_closed, is_won) VALUES
('stage-lead', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Lead', 'Initial contact and qualification', '#6B7280', 0, 10, false, false),
('stage-qualified', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Qualified', 'Qualified prospects with confirmed interest', '#3B82F6', 1, 25, false, false),
('stage-proposal', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Proposal', 'Proposal sent and under review', '#F59E0B', 2, 50, false, false),
('stage-negotiation', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Negotiation', 'Active negotiations and contract discussions', '#EF4444', 3, 75, false, false),
('stage-closed-won', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Closed Won', 'Successfully closed deals', '#10B981', 4, 100, true, true),
('stage-closed-lost', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Closed Lost', 'Lost opportunities', '#6B7280', 5, 0, true, false);

-- Insert sample contacts
INSERT INTO contacts (id, tenant_id, organization_id, first_name, last_name, email, phone, company, title, website) VALUES
('contact-1', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'John', 'Smith', 'john@techcorp.com', '+1-555-0101', 'TechCorp Inc.', 'VP of Sales', 'https://techcorp.com'),
('contact-2', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Johnson', 'sarah@innovate.com', '+1-555-0102', 'Innovate Solutions', 'CTO', 'https://innovate.com'),
('contact-3', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Michael', 'Brown', 'michael@globalent.com', '+1-555-0103', 'Global Enterprises', 'CEO', 'https://globalent.com'),
('contact-4', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Emily', 'Davis', 'emily@startupx.com', '+1-555-0104', 'StartupX', 'Founder', 'https://startupx.com'),
('contact-5', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'David', 'Wilson', 'david@enterprise.com', '+1-555-0105', 'Enterprise Corp', 'Director of IT', 'https://enterprise.com'),
('contact-6', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Lisa', 'Anderson', 'lisa@futuretech.com', '+1-555-0106', 'FutureTech', 'VP of Operations', 'https://futuretech.com'),
('contact-7', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Robert', 'Taylor', 'robert@nexusgroup.com', '+1-555-0107', 'Nexus Group', 'CFO', 'https://nexusgroup.com'),
('contact-8', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Jennifer', 'Martinez', 'jennifer@dynamicllc.com', '+1-555-0108', 'Dynamic LLC', 'COO', 'https://dynamicllc.com');

-- Insert sample deals
INSERT INTO deals (id, tenant_id, organization_id, stage_id, primary_contact_id, title, description, value, currency, probability, expected_close_date, industry, pain_points, next_steps) VALUES
('deal-1', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'stage-qualified', 'contact-1', 'TechCorp Enterprise Solution', 'Enterprise software implementation for TechCorp Inc.', 45000, 'USD', 25, '2024-03-15', 'Technology', 
 ARRAY['Current software lacks integration capabilities', 'Manual processes causing delays', 'Limited reporting functionality'], 
 ARRAY['Schedule technical demo', 'Prepare ROI analysis', 'Connect with IT decision maker']),

('deal-2', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'stage-proposal', 'contact-2', 'Innovate Solutions CRM', 'Custom CRM solution for Innovate Solutions', 75000, 'USD', 50, '2024-02-28', 'Technology',
 ARRAY['Scattered customer data', 'Poor sales visibility', 'Manual follow-up processes'],
 ARRAY['Present final proposal', 'Schedule stakeholder meeting', 'Prepare contract terms']),

('deal-3', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'stage-negotiation', 'contact-3', 'Global Enterprises Integration', 'System integration and automation project', 120000, 'USD', 75, '2024-02-20', 'Manufacturing',
 ARRAY['Legacy system limitations', 'Data silos across departments', 'Inefficient workflows'],
 ARRAY['Finalize pricing terms', 'Review contract details', 'Schedule implementation timeline']),

('deal-4', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'stage-lead', 'contact-4', 'StartupX Growth Platform', 'Scalable platform for startup growth', 25000, 'USD', 10, '2024-04-10', 'Technology',
 ARRAY['Limited scalability', 'Resource constraints', 'Need for automation'],
 ARRAY['Conduct discovery call', 'Send product overview', 'Identify key stakeholders']),

('deal-5', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'stage-qualified', 'contact-5', 'Enterprise Corp Digital Transform', 'Digital transformation initiative', 200000, 'USD', 25, '2024-05-01', 'Enterprise',
 ARRAY['Outdated technology stack', 'Poor user experience', 'Compliance requirements'],
 ARRAY['Technical architecture review', 'Compliance assessment', 'Stakeholder alignment']),

('deal-6', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'stage-proposal', 'contact-6', 'FutureTech Analytics', 'Advanced analytics and reporting solution', 85000, 'USD', 50, '2024-03-05', 'Technology',
 ARRAY['Limited data insights', 'Manual reporting processes', 'Decision-making delays'],
 ARRAY['Demo analytics dashboard', 'Provide ROI calculations', 'Technical integration planning']),

('deal-7', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'stage-closed-won', 'contact-7', 'Nexus Group Implementation', 'Successfully implemented solution', 95000, 'USD', 100, '2024-01-15', 'Financial Services',
 ARRAY['Regulatory compliance gaps', 'Manual audit processes', 'Risk management issues'],
 ARRAY['Project completed', 'Post-implementation support', 'Expansion opportunities']),

('deal-8', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'stage-lead', 'contact-8', 'Dynamic LLC Optimization', 'Process optimization and efficiency improvement', 35000, 'USD', 10, '2024-04-20', 'Consulting',
 ARRAY['Inefficient processes', 'High operational costs', 'Quality control issues'],
 ARRAY['Process assessment', 'Efficiency analysis', 'Solution recommendation']);

-- Insert sample meetings
INSERT INTO meetings (id, tenant_id, organization_id, deal_id, title, description, scheduled_at, duration_minutes, meeting_type, status, summary, key_points, action_items) VALUES
('meeting-1', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'deal-1', 'TechCorp Discovery Call', 'Initial discovery and needs assessment', '2024-01-08 14:00:00', 45, 'discovery', 'completed',
 'Discussed current pain points and potential solutions. Client expressed interest in our enterprise package.',
 ARRAY['Current software lacks integration', 'Manual processes cause delays', 'Need for better reporting'],
 ARRAY['Send product documentation', 'Schedule technical demo', 'Prepare pricing proposal']),

('meeting-2', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'deal-1', 'TechCorp Technical Demo', 'Product demonstration and Q&A', '2024-01-15 10:00:00', 60, 'demo', 'completed',
 'Demonstrated key features and integration capabilities. Positive feedback from technical team.',
 ARRAY['Integration capabilities impressed team', 'Pricing discussion initiated', 'Technical requirements clarified'],
 ARRAY['Provide technical specifications', 'Schedule stakeholder meeting', 'Prepare detailed proposal']),

('meeting-3', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'deal-2', 'Innovate Solutions Proposal Review', 'Review and discuss proposal details', '2024-01-20 15:30:00', 90, 'proposal', 'completed',
 'Reviewed proposal in detail. Some pricing adjustments requested. Overall positive reception.',
 ARRAY['Proposal well-received', 'Pricing adjustments needed', 'Implementation timeline discussed'],
 ARRAY['Revise pricing structure', 'Update implementation plan', 'Schedule final presentation']);

-- Insert sample activities
INSERT INTO activities (id, tenant_id, organization_id, deal_id, activity_type, title, description, completed_at, notes) VALUES
('activity-1', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'deal-1', 'email', 'Follow-up Email Sent', 'Sent follow-up email with meeting summary and next steps', '2024-01-09 09:00:00', 'Email sent to john@techcorp.com with meeting recap'),
('activity-2', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'deal-1', 'call', 'Check-in Call', 'Quick check-in call to address questions', '2024-01-12 14:30:00', '15-minute call to clarify technical requirements'),
('activity-3', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'deal-2', 'email', 'Proposal Sent', 'Sent detailed proposal document', '2024-01-18 11:00:00', 'Comprehensive proposal sent via email with pricing options'),
('activity-4', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'deal-3', 'meeting', 'Contract Review Meeting', 'Reviewed contract terms with legal team', '2024-01-25 16:00:00', 'Legal review completed, minor adjustments needed');

-- Update the sample tenant and organization with more realistic data
UPDATE tenants SET 
  name = 'Vellora Demo Company',
  description = 'Demo organization for Vellora CRM system',
  website = 'https://vellora.ai'
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE organizations SET 
  name = 'Sales Team Alpha',
  description = 'Primary sales organization handling enterprise deals',
  website = 'https://vellora.ai',
  industry = 'Software & Technology'
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- Success message
SELECT 'Sample data loaded successfully! You now have:' as message,
       (SELECT COUNT(*) FROM deal_stages WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000') as deal_stages,
       (SELECT COUNT(*) FROM contacts WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000') as contacts,
       (SELECT COUNT(*) FROM deals WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000') as deals,
       (SELECT COUNT(*) FROM meetings WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000') as meetings,
       (SELECT COUNT(*) FROM activities WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000') as activities;
