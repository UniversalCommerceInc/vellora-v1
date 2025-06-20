-- This script should be run after a user has been authenticated through Supabase Auth
-- It sets up user access to the demo tenants and organizations
-- Replace the user_id with the actual authenticated user's ID

-- Function to grant user access to demo tenants
CREATE OR REPLACE FUNCTION grant_demo_access_to_user(user_uuid UUID)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
AS $$
    -- First, ensure the user exists in our users table
    INSERT INTO users (id, email, first_name, last_name)
    SELECT user_uuid, email, 'Demo', 'User'
    FROM auth.users 
    WHERE id = user_uuid
    ON CONFLICT (id) DO NOTHING;

    -- Grant access to the main demo tenant
    INSERT INTO user_tenant_access (user_id, tenant_id, organization_id, role, status)
    VALUES (
        user_uuid,
        '00000000-0000-0000-0000-000000000002'::uuid,
        '00000000-0000-0000-0000-000000000012'::uuid,
        'admin',
        'active'
    ) ON CONFLICT (user_id, tenant_id, organization_id) DO UPDATE SET
        role = EXCLUDED.role,
        status = EXCLUDED.status;

    -- Grant access to the sales division
    INSERT INTO user_tenant_access (user_id, tenant_id, organization_id, role, status)
    VALUES (
        user_uuid,
        '00000000-0000-0000-0000-000000000002'::uuid,
        '00000000-0000-0000-0000-000000000013'::uuid,
        'manager',
        'active'
    ) ON CONFLICT (user_id, tenant_id, organization_id) DO UPDATE SET
        role = EXCLUDED.role,
        status = EXCLUDED.status;
$$;

-- Example usage (uncomment and replace with actual user ID after authentication):
-- SELECT grant_demo_access_to_user('your-actual-user-id-here'::uuid);
