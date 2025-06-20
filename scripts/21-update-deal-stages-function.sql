-- Drop the old function
DROP FUNCTION IF EXISTS create_default_deal_stages(UUID);

-- Create updated function that accepts both tenant_id and organization_id
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

-- Also create a convenience function for creating deal stages for all organizations in a tenant
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
