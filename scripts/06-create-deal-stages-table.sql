-- Create deal stages table
CREATE TABLE IF NOT EXISTS deal_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6366f1',
    order_index INTEGER NOT NULL DEFAULT 0,
    is_closed BOOLEAN DEFAULT FALSE,
    is_won BOOLEAN DEFAULT FALSE,
    probability_percentage INTEGER DEFAULT 0 CHECK (probability_percentage >= 0 AND probability_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_deal_stages_tenant_id ON deal_stages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_deal_stages_order ON deal_stages(tenant_id, order_index);

-- Enable RLS (policies will be added later)
ALTER TABLE deal_stages ENABLE ROW LEVEL SECURITY;
