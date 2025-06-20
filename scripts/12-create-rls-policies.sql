-- RLS Policies for tenants table
CREATE POLICY "Users can view their own tenant" ON tenants
    FOR SELECT USING (
        id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Super admins can insert tenants" ON tenants
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_tenant_access 
            WHERE user_id = auth.uid() 
            AND role = 'super_admin'
        )
    );

CREATE POLICY "Tenant admins can update their tenant" ON tenants
    FOR UPDATE USING (
        id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid() 
            AND role IN ('tenant_admin', 'super_admin')
        )
    );

-- RLS Policies for organizations table
CREATE POLICY "Users can view organizations in their tenant" ON organizations
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage organizations in their tenant" ON organizations
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid() 
            AND role IN ('tenant_admin', 'org_admin', 'super_admin')
        )
    );

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can view users in their tenant" ON users
    FOR SELECT USING (
        id IN (
            SELECT uta1.user_id FROM user_tenant_access uta1
            WHERE uta1.tenant_id IN (
                SELECT uta2.tenant_id FROM user_tenant_access uta2
                WHERE uta2.user_id = auth.uid() 
                AND uta2.role IN ('tenant_admin', 'org_admin', 'super_admin')
            )
        )
    );

-- RLS Policies for user_tenant_access table
CREATE POLICY "Users can view their own access records" ON user_tenant_access
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage access in their tenant" ON user_tenant_access
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid() 
            AND role IN ('tenant_admin', 'super_admin')
        )
    );

-- RLS Policies for deal_stages table
CREATE POLICY "Users can view stages in their tenant" ON deal_stages
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage stages in their tenant" ON deal_stages
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid() 
            AND role IN ('tenant_admin', 'org_admin', 'super_admin')
        )
    );

-- RLS Policies for contacts table
CREATE POLICY "Users can view contacts in their tenant" ON contacts
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage contacts in their tenant" ON contacts
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for deals table
CREATE POLICY "Users can view deals in their tenant" ON deals
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage deals in their tenant" ON deals
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for activities table
CREATE POLICY "Users can view activities in their tenant" ON activities
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage activities in their tenant" ON activities
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for meetings table
CREATE POLICY "Users can view meetings in their tenant" ON meetings
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage meetings in their tenant" ON meetings
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenant_access 
            WHERE user_id = auth.uid()
        )
    );
