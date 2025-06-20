import { supabaseConfigured } from "./config"
import type {
  Tenant,
  Organization,
  User,
  UserTenantAccess,
  Deal,
  DealWithRelations,
  Contact,
  ContactWithRelations,
  DealStage,
  Activity,
  Meeting,
  TenantInsert,
  OrganizationInsert,
  UserInsert,
  UserTenantAccessInsert,
  DealInsert,
  ContactInsert,
  ActivityInsert,
  MeetingInsert,
} from "./types"

// Mock data for development when Supabase is not configured
const mockDeals: DealWithRelations[] = [
  {
    id: "00000000-0000-0000-0000-000000000051",
    tenant_id: "00000000-0000-0000-0000-000000000002",
    organization_id: "00000000-0000-0000-0000-000000000012",
    title: "Acme Corp - Enterprise License",
    description: "Annual enterprise software license for Acme Corp",
    value: 50000,
    currency: "USD",
    probability: 75,
    expected_close_date: "2024-02-15",
    stage_id: "stage-negotiation",
    primary_contact_id: "00000000-0000-0000-0000-000000000041",
    assigned_to: null,
    next_steps: ["Review contract terms", "Schedule final meeting"],
    tags: ["enterprise", "high-value"],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    stage: {
      id: "stage-negotiation",
      tenant_id: "00000000-0000-0000-0000-000000000002",
      organization_id: "00000000-0000-0000-0000-000000000012",
      name: "Negotiation",
      description: "Contract negotiation phase",
      color: "#f59e0b",
      order_index: 4,
      probability_percentage: 75,
      is_won: false,
      is_lost: false,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    primary_contact: {
      id: "00000000-0000-0000-0000-000000000041",
      tenant_id: "00000000-0000-0000-0000-000000000002",
      organization_id: "00000000-0000-0000-0000-000000000012",
      first_name: "John",
      last_name: "Smith",
      email: "john.smith@example.com",
      phone: "+1-555-0101",
      company: "Acme Corp",
      title: "CEO",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    organization: {
      id: "00000000-0000-0000-0000-000000000012",
      tenant_id: "00000000-0000-0000-0000-000000000002",
      name: "Your Organization",
      description: "Your main organization",
      logo_url: null,
      website: null,
      industry: null,
      size: null,
      address: null,
      settings: {},
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    assigned_user: null,
    activities: [],
    meetings: [],
  },
  {
    id: "00000000-0000-0000-0000-000000000052",
    tenant_id: "00000000-0000-0000-0000-000000000002",
    organization_id: "00000000-0000-0000-0000-000000000012",
    title: "TechStart - Consulting Services",
    description: "Technical consulting and implementation services",
    value: 25000,
    currency: "USD",
    probability: 50,
    expected_close_date: "2024-03-01",
    stage_id: "stage-proposal",
    primary_contact_id: "00000000-0000-0000-0000-000000000042",
    assigned_to: null,
    next_steps: ["Send detailed proposal"],
    tags: ["consulting"],
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
    stage: {
      id: "stage-proposal",
      tenant_id: "00000000-0000-0000-0000-000000000002",
      organization_id: "00000000-0000-0000-0000-000000000012",
      name: "Proposal",
      description: "Proposal sent to client",
      color: "#3b82f6",
      order_index: 3,
      probability_percentage: 50,
      is_won: false,
      is_lost: false,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    primary_contact: {
      id: "00000000-0000-0000-0000-000000000042",
      tenant_id: "00000000-0000-0000-0000-000000000002",
      organization_id: "00000000-0000-0000-0000-000000000012",
      first_name: "Jane",
      last_name: "Doe",
      email: "jane.doe@techstart.com",
      phone: "+1-555-0102",
      company: "TechStart Inc",
      title: "CTO",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    organization: {
      id: "00000000-0000-0000-0000-000000000012",
      tenant_id: "00000000-0000-0000-0000-000000000002",
      name: "Your Organization",
      description: "Your main organization",
      logo_url: null,
      website: null,
      industry: null,
      size: null,
      address: null,
      settings: {},
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    assigned_user: null,
    activities: [],
    meetings: [],
  },
]

const mockStages: DealStage[] = [
  {
    id: "stage-lead",
    tenant_id: "00000000-0000-0000-0000-000000000002",
    organization_id: "00000000-0000-0000-0000-000000000012",
    name: "Lead",
    description: "Initial lead",
    color: "#6b7280",
    order_index: 1,
    probability_percentage: 10,
    is_won: false,
    is_lost: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "stage-qualified",
    tenant_id: "00000000-0000-0000-0000-000000000002",
    organization_id: "00000000-0000-0000-0000-000000000012",
    name: "Qualified",
    description: "Qualified lead",
    color: "#10b981",
    order_index: 2,
    probability_percentage: 25,
    is_won: false,
    is_lost: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "stage-proposal",
    tenant_id: "00000000-0000-0000-0000-000000000002",
    organization_id: "00000000-0000-0000-0000-000000000012",
    name: "Proposal",
    description: "Proposal sent",
    color: "#3b82f6",
    order_index: 3,
    probability_percentage: 50,
    is_won: false,
    is_lost: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "stage-negotiation",
    tenant_id: "00000000-0000-0000-0000-000000000002",
    organization_id: "00000000-0000-0000-0000-000000000012",
    name: "Negotiation",
    description: "Contract negotiation",
    color: "#f59e0b",
    order_index: 4,
    probability_percentage: 75,
    is_won: false,
    is_lost: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "stage-closed-won",
    tenant_id: "00000000-0000-0000-0000-000000000002",
    organization_id: "00000000-0000-0000-0000-000000000012",
    name: "Closed Won",
    description: "Deal won",
    color: "#10b981",
    order_index: 5,
    probability_percentage: 100,
    is_won: true,
    is_lost: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "stage-closed-lost",
    tenant_id: "00000000-0000-0000-0000-000000000002",
    organization_id: "00000000-0000-0000-0000-000000000012",
    name: "Closed Lost",
    description: "Deal lost",
    color: "#ef4444",
    order_index: 6,
    probability_percentage: 0,
    is_won: false,
    is_lost: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Get supabase client dynamically
async function getSupabaseClient() {
  if (!supabaseConfigured) {
    return null
  }

  try {
    const { supabase } = await import("./client")
    return supabase
  } catch (error) {
    console.error("Failed to load Supabase client:", error)
    return null
  }
}

// Tenant queries
export const tenantQueries = {
  // Get all tenants for current user
  async getUserTenants(): Promise<Tenant[]> {
    const supabase = await getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase.from("tenants").select("*").order("name")

    if (error) throw error
    return data || []
  },

  // Get tenant by ID
  async getTenantById(id: string): Promise<Tenant | null> {
    const supabase = await getSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase.from("tenants").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  // Get tenant by slug
  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    const supabase = await getSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase.from("tenants").select("*").eq("slug", slug).single()

    if (error) throw error
    return data
  },

  // Create new tenant
  async createTenant(tenant: TenantInsert): Promise<Tenant> {
    const supabase = await getSupabaseClient()
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.from("tenants").insert(tenant).select().single()

    if (error) throw error
    return data
  },
}

// Organization queries
export const organizationQueries = {
  // Get organizations for current tenant
  async getOrganizations(): Promise<Organization[]> {
    const supabase = await getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase.from("organizations").select("*").order("name")

    if (error) throw error
    return data || []
  },

  // Create new organization
  async createOrganization(organization: OrganizationInsert): Promise<Organization> {
    const supabase = await getSupabaseClient()
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.from("organizations").insert(organization).select().single()

    if (error) throw error
    return data
  },
}

// User queries
export const userQueries = {
  // Get current user profile
  async getCurrentUser(): Promise<User | null> {
    const supabase = await getSupabaseClient()
    if (!supabase) return null

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (error) throw error
    return data
  },

  // Create or update user profile
  async upsertUser(user: UserInsert): Promise<User> {
    const supabase = await getSupabaseClient()
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.from("users").upsert(user).select().single()

    if (error) throw error
    return data
  },

  // Get user tenant access
  async getUserTenantAccess(): Promise<UserTenantAccess[]> {
    const supabase = await getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("user_tenant_access")
      .select(`
        *,
        tenant:tenants(*),
        organization:organizations(*)
      `)
      .eq("status", "active")

    if (error) throw error
    return data || []
  },

  // Create user tenant access
  async createUserTenantAccess(access: UserTenantAccessInsert): Promise<UserTenantAccess> {
    const supabase = await getSupabaseClient()
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.from("user_tenant_access").insert(access).select().single()

    if (error) throw error
    return data
  },
}

// Deal queries
export const dealQueries = {
  // Get all deals for current tenant
  async getDeals(): Promise<DealWithRelations[]> {
    const supabase = await getSupabaseClient()
    if (!supabase) {
      console.log("Using mock deals data")
      return mockDeals
    }

    const { data, error } = await supabase
      .from("deals")
      .select(`
        *,
        stage:deal_stages(*),
        primary_contact:contacts(*),
        organization:organizations(*),
        assigned_user:users!deals_assigned_to_fkey(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get deal by ID with full relations
  async getDealById(id: string): Promise<DealWithRelations | null> {
    const supabase = await getSupabaseClient()
    if (!supabase) {
      return mockDeals.find((deal) => deal.id === id) || null
    }

    const { data, error } = await supabase
      .from("deals")
      .select(`
        *,
        stage:deal_stages(*),
        primary_contact:contacts(*),
        organization:organizations(*),
        assigned_user:users!deals_assigned_to_fkey(*),
        activities(*),
        meetings(*)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  },

  // Create new deal
  async createDeal(deal: DealInsert): Promise<Deal> {
    const supabase = await getSupabaseClient()
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.from("deals").insert(deal).select().single()

    if (error) throw error
    return data
  },

  // Update deal
  async updateDeal(id: string, updates: Partial<DealInsert>): Promise<Deal> {
    const supabase = await getSupabaseClient()
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.from("deals").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  // Get deal stages
  async getDealStages(): Promise<DealStage[]> {
    const supabase = await getSupabaseClient()
    if (!supabase) {
      console.log("Using mock stages data")
      return mockStages
    }

    const { data, error } = await supabase.from("deal_stages").select("*").order("order_index")

    if (error) throw error
    return data || []
  },
}

// Contact queries
export const contactQueries = {
  // Get all contacts for current tenant
  async getContacts(): Promise<ContactWithRelations[]> {
    const supabase = await getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("contacts")
      .select(`
        *,
        organization:organizations(*)
      `)
      .order("first_name")

    if (error) throw error
    return data || []
  },

  // Create new contact
  async createContact(contact: ContactInsert): Promise<Contact> {
    const supabase = await getSupabaseClient()
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.from("contacts").insert(contact).select().single()

    if (error) throw error
    return data
  },

  // Update contact
  async updateContact(id: string, updates: Partial<ContactInsert>): Promise<Contact> {
    const supabase = await getSupabaseClient()
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.from("contacts").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },
}

// Activity queries
export const activityQueries = {
  // Get activities for a deal
  async getActivitiesForDeal(dealId: string): Promise<Activity[]> {
    const supabase = await getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("activities")
      .select(`
        *,
        contact:contacts(*),
        created_by_user:users!activities_created_by_fkey(*)
      `)
      .eq("deal_id", dealId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get activities for current tenant/organization
  async getActivities(): Promise<Activity[]> {
    const supabase = await getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("activities")
      .select(`
        *,
        deal:deals(*),
        contact:contacts(*),
        created_by_user:users!activities_created_by_fkey(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create new activity
  async createActivity(activity: ActivityInsert): Promise<Activity> {
    const supabase = await getSupabaseClient()
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.from("activities").insert(activity).select().single()

    if (error) throw error
    return data
  },

  // Update activity
  async updateActivity(id: string, updates: Partial<ActivityInsert>): Promise<Activity> {
    const supabase = await getSupabaseClient()
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.from("activities").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },
}

// Meeting queries
export const meetingQueries = {
  // Get meetings for a deal
  async getMeetingsForDeal(dealId: string): Promise<Meeting[]> {
    const supabase = await getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("meetings")
      .select(`
        *,
        created_by_user:users!meetings_created_by_fkey(*)
      `)
      .eq("deal_id", dealId)
      .order("scheduled_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get meetings for current tenant/organization
  async getMeetings(): Promise<Meeting[]> {
    const supabase = await getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("meetings")
      .select(`
        *,
        deal:deals(*),
        created_by_user:users!meetings_created_by_fkey(*)
      `)
      .order("scheduled_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create new meeting
  async createMeeting(meeting: MeetingInsert): Promise<Meeting> {
    const supabase = await getSupabaseClient()
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.from("meetings").insert(meeting).select().single()

    if (error) throw error
    return data
  },

  // Update meeting
  async updateMeeting(id: string, updates: Partial<MeetingInsert>): Promise<Meeting> {
    const supabase = await getSupabaseClient()
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.from("meetings").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },
}

// Analytics queries
export const analyticsQueries = {
  // Get deal pipeline view
  async getDealPipeline() {
    const supabase = await getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase.from("deal_pipeline_view").select("*").order("order_index")

    if (error) throw error
    return data || []
  },

  // Get user activity summary
  async getUserActivitySummary() {
    const supabase = await getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase.from("user_activity_summary").select("*")

    if (error) throw error
    return data || []
  },

  // Get deal performance metrics
  async getDealPerformanceMetrics() {
    const supabase = await getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase.from("deal_performance_metrics").select("*")

    if (error) throw error
    return data || []
  },
}
