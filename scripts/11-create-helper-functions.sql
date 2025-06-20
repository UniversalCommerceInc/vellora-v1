-- Helper function to get current user's tenant ID
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT tenant_id 
    FROM user_tenant_access 
    WHERE user_id = auth.uid() 
    LIMIT 1;
$$;

-- Helper function to check if user has role in tenant
CREATE OR REPLACE FUNCTION user_has_role_in_tenant(required_role TEXT, tenant_uuid UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM user_tenant_access 
        WHERE user_id = auth.uid() 
        AND (tenant_uuid IS NULL OR tenant_id = tenant_uuid)
        AND role = required_role
    );
$$;

-- Helper function to check if user can access tenant
CREATE OR REPLACE FUNCTION user_can_access_tenant(tenant_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM user_tenant_access 
        WHERE user_id = auth.uid() 
        AND tenant_id = tenant_uuid
        AND status = 'active'
    );
$$;

-- Updated function to create default deal stages for a specific tenant and organization
CREATE OR REPLACE FUNCTION create_default_deal_stages(tenant_uuid UUID, organization_uuid UUID)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
AS $$
    INSERT INTO deal_stages (tenant_id, organization_id, name, description, color, order_index, probability_percentage) VALUES
    (tenant_uuid, organization_uuid, 'Lead', 'Initial contact or inquiry', '#6b7280', 0, 10),
    (tenant_uuid, organization_uuid, 'Qualified', 'Qualified prospect with confirmed need', '#3b82f6', 1, 25),
    (tenant_uuid, organization_uuid, 'Proposal', 'Proposal sent to prospect', '#f59e0b', 2, 50),
    (tenant_uuid, organization_uuid, 'Negotiation', 'In negotiation phase', '#ef4444', 3, 75),
    (tenant_uuid, organization_uuid, 'Closed Won', 'Deal successfully closed', '#10b981', 4, 100),
    (tenant_uuid, organization_uuid, 'Closed Lost', 'Deal lost to competitor or cancelled', '#6b7280', 5, 0);
$$;

-- Convenience function for creating deal stages for all organizations in a tenant
CREATE OR REPLACE FUNCTION create_default_deal_stages_for_tenant(tenant_uuid UUID)
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
    org_record RECORD;
BEGIN
    -- Create default deal stages for all organizations in the tenant
    FOR org_record IN 
        SELECT id FROM organizations WHERE tenant_id = tenant_uuid
    LOOP
        PERFORM create_default_deal_stages(tenant_uuid, org_record.id);
    END LOOP;
END;
$$;
