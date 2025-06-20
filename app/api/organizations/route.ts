import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("organizations")
      .select(`
        *,
        tenant:tenants(name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching organizations:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ organizations: data || [] })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, tenant_id, industry, size, website, description } = body

    if (!name || !tenant_id) {
      return NextResponse.json({ error: "Name and tenant_id are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("organizations")
      .insert({
        name,
        tenant_id,
        industry,
        size,
        website,
        description,
        settings: {},
      })
      .select(`
        *,
        tenant:tenants(name)
      `)
      .single()

    if (error) {
      console.error("Error creating organization:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ organization: data })
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
      return NextResponse.json({ error: "Organization ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("organizations").delete().eq("id", id)

    if (error) {
      console.error("Error deleting organization:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
