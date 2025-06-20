-- Create user tenant access table (many-to-many with roles)
CREATE TABLE IF NOT EXISTS user_tenant_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    permissions JSONB DEFAULT '{}',
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tenant_id, organization_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_tenant_access_user_id ON user_tenant_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenant_access_tenant_id ON user_tenant_access(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_tenant_access_org_id ON user_tenant_access(organization_id);

-- Enable RLS (policies will be added later)
ALTER TABLE user_tenant_access ENABLE ROW LEVEL SECURITY;
