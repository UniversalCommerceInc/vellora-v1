-- Add organization_id column to deal_stages table
ALTER TABLE deal_stages 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Create index for the new column
CREATE INDEX IF NOT EXISTS idx_deal_stages_organization_id ON deal_stages(organization_id);

-- Update existing deal stages to have organization_id (if any exist)
-- This will set them to the first organization in each tenant
UPDATE deal_stages 
SET organization_id = (
    SELECT id 
    FROM organizations 
    WHERE organizations.tenant_id = deal_stages.tenant_id 
    LIMIT 1
)
WHERE organization_id IS NULL;

-- Make organization_id NOT NULL after updating existing records
ALTER TABLE deal_stages 
ALTER COLUMN organization_id SET NOT NULL;

-- Update the unique constraint to include organization_id
ALTER TABLE deal_stages 
DROP CONSTRAINT IF EXISTS deal_stages_tenant_id_name_key;

ALTER TABLE deal_stages 
ADD CONSTRAINT deal_stages_tenant_org_name_unique 
UNIQUE(tenant_id, organization_id, name);

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'deal_stages' 
ORDER BY ordinal_position;

-- Success message
SELECT 'deal_stages table updated successfully!' as message,
       'Added organization_id column with proper constraints and indexes' as details;
