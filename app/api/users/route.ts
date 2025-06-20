import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    // Fetch user tenant access with explicit joins
    const { data, error } = await supabase
      .from("user_tenant_access")
      .select(`
        id,
        user_id,
        tenant_id,
        organization_id,
        role,
        permissions,
        status,
        created_at,
        updated_at,
        users!user_tenant_access_user_id_fkey(
          id,
          email,
          first_name,
          last_name,
          phone
        ),
        tenants!user_tenant_access_tenant_id_fkey(
          id,
          name,
          slug
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users: data || [] })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, first_name, last_name, phone, tenant_id, role } = body

    if (!email || !tenant_id) {
      return NextResponse.json({ error: "Email and tenant_id are required" }, { status: 400 })
    }

    // Generate a simple default password that the admin can share
    const defaultPassword = "Welcome123!"

    // Create user with auto-confirmation (no email verification needed)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: defaultPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name,
        last_name,
        phone,
      },
    })

    if (authError) {
      console.error("Error creating user:", authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Create user profile
    const { data: userData, error: userError } = await supabase
      .from("users")
      .upsert({
        id: authData.user.id,
        email,
        first_name,
        last_name,
        phone,
        timezone: "UTC",
        preferences: {},
      })
      .select()
      .single()

    if (userError) {
      console.error("Error creating user profile:", userError)
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    // Create tenant access
    const { data: accessData, error: accessError } = await supabase
      .from("user_tenant_access")
      .insert({
        user_id: authData.user.id,
        tenant_id,
        role: role || "user",
        permissions: {},
        status: "active", // Set to active immediately
      })
      .select(`
        id,
        user_id,
        tenant_id,
        organization_id,
        role,
        permissions,
        status,
        created_at,
        updated_at,
        users!user_tenant_access_user_id_fkey(
          id,
          email,
          first_name,
          last_name,
          phone
        ),
        tenants!user_tenant_access_tenant_id_fkey(
          id,
          name,
          slug
        )
      `)
      .single()

    if (accessError) {
      console.error("Error creating tenant access:", accessError)
      return NextResponse.json({ error: accessError.message }, { status: 500 })
    }

    return NextResponse.json({
      user: accessData,
      defaultPassword: defaultPassword,
      message: "User created successfully! Share the default password with the user so they can sign in.",
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "User access ID is required" }, { status: 400 })
    }

    // Get the user access record to find the user_id
    const { data: userAccess, error: fetchError } = await supabase
      .from("user_tenant_access")
      .select("user_id")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching user access:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    // Delete the user access record
    const { error: deleteAccessError } = await supabase.from("user_tenant_access").delete().eq("id", id)

    if (deleteAccessError) {
      console.error("Error deleting user access:", deleteAccessError)
      return NextResponse.json({ error: deleteAccessError.message }, { status: 500 })
    }

    // Optionally delete the auth user if they have no other tenant access
    try {
      const { data: otherAccess } = await supabase
        .from("user_tenant_access")
        .select("id")
        .eq("user_id", userAccess.user_id)

      if (!otherAccess || otherAccess.length === 0) {
        // User has no other tenant access, delete the auth user
        await supabase.auth.admin.deleteUser(userAccess.user_id)
      }
    } catch (cleanupError) {
      console.warn("Could not cleanup auth user:", cleanupError)
      // Don't fail the operation if cleanup fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
