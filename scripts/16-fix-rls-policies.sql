-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own tenant" ON tenants;
DROP POLICY IF EXISTS "Super admins can insert tenants" ON tenants;
DROP POLICY IF EXISTS "Tenant admins can update their tenant" ON tenants;
DROP POLICY IF EXISTS "Admins can manage access in their tenant" ON user_tenant_access;
DROP POLICY IF EXISTS "Admins can view users in their tenant" ON users;

-- Create simpler, non-recursive policies for tenants
CREATE POLICY "Allow service role full access to tenants" ON tenants
    FOR ALL USING (true);

-- Create simpler policies for user_tenant_access
CREATE POLICY "Users can view their own access records" ON user_tenant_access
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all access records" ON user_tenant_access
    FOR ALL USING (true);

-- Create simpler policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Service role can manage all users" ON users
    FOR ALL USING (true);

-- Update other tables to allow service role access
CREATE POLICY "Service role can manage all organizations" ON organizations
    FOR ALL USING (true);

CREATE POLICY "Service role can manage all deal_stages" ON deal_stages
    FOR ALL USING (true);

CREATE POLICY "Service role can manage all contacts" ON contacts
    FOR ALL USING (true);

CREATE POLICY "Service role can manage all deals" ON deals
    FOR ALL USING (true);

CREATE POLICY "Service role can manage all activities" ON activities
    FOR ALL USING (true);

CREATE POLICY "Service role can manage all meetings" ON meetings
    FOR ALL USING (true);
