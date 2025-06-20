-- Insert sample tenant (for development/testing)
INSERT INTO tenants (id, name, slug, domain, subscription_tier) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Acme Corporation', 'acme-corp', 'acme.example.com', 'enterprise')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample organization
INSERT INTO organizations (id, tenant_id, name, description, website, industry) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Acme Sales Team', 'Primary sales organization', 'https://acme.com', 'Technology')
ON CONFLICT (id) DO NOTHING;

-- Note: User data will be created through the authentication flow
-- Sample user tenant access will be created when users sign up
