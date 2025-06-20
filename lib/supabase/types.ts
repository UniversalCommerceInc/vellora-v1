// Database type definitions
export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          domain: string | null
          settings: Record<string, any>
          subscription_tier: string
          subscription_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          domain?: string | null
          settings?: Record<string, any>
          subscription_tier?: string
          subscription_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          domain?: string | null
          settings?: Record<string, any>
          subscription_tier?: string
          subscription_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          tenant_id: string
          name: string
          description: string | null
          logo_url: string | null
          website: string | null
          industry: string | null
          size: string | null
          address: Record<string, any> | null
          settings: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          industry?: string | null
          size?: string | null
          address?: Record<string, any> | null
          settings?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          industry?: string | null
          size?: string | null
          address?: Record<string, any> | null
          settings?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          phone: string | null
          timezone: string
          preferences: Record<string, any>
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          timezone?: string
          preferences?: Record<string, any>
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          timezone?: string
          preferences?: Record<string, any>
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_tenant_access: {
        Row: {
          id: string
          user_id: string
          tenant_id: string
          organization_id: string | null
          role: string
          permissions: Record<string, any>
          invited_by: string | null
          invited_at: string | null
          accepted_at: string | null
          status: string
          created_at: string
          updated_at: string
          tenant?: any
          organization?: any
        }
        Insert: {
          id?: string
          user_id: string
          tenant_id: string
          organization_id?: string | null
          role?: string
          permissions?: Record<string, any>
          invited_by?: string | null
          invited_at?: string | null
          accepted_at?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tenant_id?: string
          organization_id?: string | null
          role?: string
          permissions?: Record<string, any>
          invited_by?: string | null
          invited_at?: string | null
          accepted_at?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      deal_stages: {
        Row: {
          id: string
          tenant_id: string
          organization_id: string
          name: string
          description: string | null
          color: string
          order_index: number
          is_closed: boolean
          is_won: boolean
          probability_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          organization_id: string
          name: string
          description?: string | null
          color?: string
          order_index?: number
          is_closed?: boolean
          is_won?: boolean
          probability_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          organization_id?: string
          name?: string
          description?: string | null
          color?: string
          order_index?: number
          is_closed?: boolean
          is_won?: boolean
          probability_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          tenant_id: string
          organization_id: string | null
          first_name: string
          last_name: string | null
          email: string | null
          phone: string | null
          title: string | null
          company: string | null
          website: string | null
          linkedin_url: string | null
          address: Record<string, any> | null
          notes: string | null
          tags: string[] | null
          custom_fields: Record<string, any>
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          organization_id?: string | null
          first_name: string
          last_name?: string | null
          email?: string | null
          phone?: string | null
          title?: string | null
          company?: string | null
          website?: string | null
          linkedin_url?: string | null
          address?: Record<string, any> | null
          notes?: string | null
          tags?: string[] | null
          custom_fields?: Record<string, any>
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          organization_id?: string | null
          first_name?: string
          last_name?: string | null
          email?: string | null
          phone?: string | null
          title?: string | null
          company?: string | null
          website?: string | null
          linkedin_url?: string | null
          address?: Record<string, any> | null
          notes?: string | null
          tags?: string[] | null
          custom_fields?: Record<string, any>
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          tenant_id: string
          organization_id: string | null
          stage_id: string
          primary_contact_id: string | null
          title: string
          description: string | null
          value: number | null
          currency: string
          probability: number
          expected_close_date: string | null
          actual_close_date: string | null
          source: string | null
          industry: string | null
          company_size: string | null
          pain_points: string[] | null
          next_steps: string[] | null
          tags: string[] | null
          custom_fields: Record<string, any>
          ai_insights: Record<string, any>
          assigned_to: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          organization_id?: string | null
          stage_id: string
          primary_contact_id?: string | null
          title: string
          description?: string | null
          value?: number | null
          currency?: string
          probability?: number
          expected_close_date?: string | null
          actual_close_date?: string | null
          source?: string | null
          industry?: string | null
          company_size?: string | null
          pain_points?: string[] | null
          next_steps?: string[] | null
          tags?: string[] | null
          custom_fields?: Record<string, any>
          ai_insights?: Record<string, any>
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          organization_id?: string | null
          stage_id?: string
          primary_contact_id?: string | null
          title?: string
          description?: string | null
          value?: number | null
          currency?: string
          probability?: number
          expected_close_date?: string | null
          actual_close_date?: string | null
          source?: string | null
          industry?: string | null
          company_size?: string | null
          pain_points?: string[] | null
          next_steps?: string[] | null
          tags?: string[] | null
          custom_fields?: Record<string, any>
          ai_insights?: Record<string, any>
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          tenant_id: string
          organization_id: string | null
          deal_id: string | null
          contact_id: string | null
          activity_type: string
          title: string | null
          description: string | null
          scheduled_at: string | null
          completed_at: string | null
          duration_minutes: number | null
          outcome: string | null
          follow_up_required: boolean
          follow_up_date: string | null
          notes: string | null
          metadata: Record<string, any>
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          organization_id?: string | null
          deal_id?: string | null
          contact_id?: string | null
          activity_type: string
          title?: string | null
          description?: string | null
          scheduled_at?: string | null
          completed_at?: string | null
          duration_minutes?: number | null
          outcome?: string | null
          follow_up_required?: boolean
          follow_up_date?: string | null
          notes?: string | null
          metadata?: Record<string, any>
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          organization_id?: string | null
          deal_id?: string | null
          contact_id?: string | null
          activity_type?: string
          title?: string | null
          description?: string | null
          scheduled_at?: string | null
          completed_at?: string | null
          duration_minutes?: number | null
          outcome?: string | null
          follow_up_required?: boolean
          follow_up_date?: string | null
          notes?: string | null
          metadata?: Record<string, any>
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          tenant_id: string
          organization_id: string | null
          deal_id: string | null
          title: string
          description: string | null
          meeting_url: string | null
          scheduled_at: string
          duration_minutes: number
          meeting_type: string
          status: string
          recording_url: string | null
          transcript: string | null
          summary: string | null
          key_points: string[] | null
          action_items: string[] | null
          attendees: Record<string, any>
          ai_analysis: Record<string, any>
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          organization_id?: string | null
          deal_id?: string | null
          title: string
          description?: string | null
          meeting_url?: string | null
          scheduled_at: string
          duration_minutes?: number
          meeting_type?: string
          status?: string
          recording_url?: string | null
          transcript?: string | null
          summary?: string | null
          key_points?: string[] | null
          action_items?: string[] | null
          attendees?: Record<string, any>
          ai_analysis?: Record<string, any>
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          organization_id?: string | null
          deal_id?: string | null
          title?: string
          description?: string | null
          meeting_url?: string | null
          scheduled_at?: string
          duration_minutes?: number
          meeting_type?: string
          status?: string
          recording_url?: string | null
          transcript?: string | null
          summary?: string | null
          key_points?: string[] | null
          action_items?: string[] | null
          attendees?: Record<string, any>
          ai_analysis?: Record<string, any>
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      deal_pipeline_view: {
        Row: {
          tenant_id: string
          stage_name: string
          order_index: number
          deal_count: number
          total_value: number
          avg_probability: number
        }
      }
      user_activity_summary: {
        Row: {
          tenant_id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          total_activities: number
          calls: number
          emails: number
          meetings: number
          completed_activities: number
        }
      }
      deal_performance_metrics: {
        Row: {
          tenant_id: string
          user_id: string | null
          total_deals: number
          won_deals: number
          lost_deals: number
          won_value: number
          avg_deal_value: number
          avg_probability: number
        }
      }
    }
    Functions: {
      get_current_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_has_role_in_tenant: {
        Args: {
          required_role: string
          tenant_uuid?: string
        }
        Returns: boolean
      }
      user_can_access_tenant: {
        Args: {
          tenant_uuid: string
        }
        Returns: boolean
      }
      create_default_deal_stages: {
        Args: {
          tenant_uuid: string
        }
        Returns: undefined
      }
    }
  }
}

// Convenience types
export type Tenant = Database["public"]["Tables"]["tenants"]["Row"]
export type Organization = Database["public"]["Tables"]["organizations"]["Row"]
export type User = Database["public"]["Tables"]["users"]["Row"]
export type UserTenantAccess = Database["public"]["Tables"]["user_tenant_access"]["Row"]
export type DealStage = Database["public"]["Tables"]["deal_stages"]["Row"]
export type Contact = Database["public"]["Tables"]["contacts"]["Row"]
export type Deal = Database["public"]["Tables"]["deals"]["Row"]
export type Activity = Database["public"]["Tables"]["activities"]["Row"]
export type Meeting = Database["public"]["Tables"]["meetings"]["Row"]

// Insert types
export type TenantInsert = Database["public"]["Tables"]["tenants"]["Insert"]
export type OrganizationInsert = Database["public"]["Tables"]["organizations"]["Insert"]
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"]
export type UserTenantAccessInsert = Database["public"]["Tables"]["user_tenant_access"]["Insert"]
export type DealStageInsert = Database["public"]["Tables"]["deal_stages"]["Insert"]
export type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"]
export type DealInsert = Database["public"]["Tables"]["deals"]["Insert"]
export type ActivityInsert = Database["public"]["Tables"]["activities"]["Insert"]
export type MeetingInsert = Database["public"]["Tables"]["meetings"]["Insert"]

// Update types
export type TenantUpdate = Database["public"]["Tables"]["tenants"]["Update"]
export type OrganizationUpdate = Database["public"]["Tables"]["organizations"]["Update"]
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"]
export type UserTenantAccessUpdate = Database["public"]["Tables"]["user_tenant_access"]["Update"]
export type DealStageUpdate = Database["public"]["Tables"]["deal_stages"]["Update"]
export type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"]
export type DealUpdate = Database["public"]["Tables"]["deals"]["Update"]
export type ActivityUpdate = Database["public"]["Tables"]["activities"]["Update"]
export type MeetingUpdate = Database["public"]["Tables"]["meetings"]["Update"]

// User roles
export type UserRole = "super_admin" | "tenant_admin" | "org_admin" | "manager" | "user"

// Deal with relationships
export interface DealWithRelations extends Deal {
  stage?: DealStage
  primary_contact?: Contact
  organization?: Organization
  assigned_user?: User
  activities?: Activity[]
  meetings?: Meeting[]
}

// Contact with relationships
export interface ContactWithRelations extends Contact {
  organization?: Organization
  deals?: Deal[]
  activities?: Activity[]
}

// Tenant context type
export interface TenantContext {
  tenant: {
    id: string
    name: string
    slug: string
    created_at: string
    updated_at: string
  } | null
  organization: {
    id: string
    name: string
    tenant_id: string
    created_at: string
    updated_at: string
  } | null
  userAccess: {
    id: string
    user_id: string
    tenant_id: string
    organization_id?: string
    role: string
    status: string
    created_at: string
    updated_at: string
    tenant?: any
    organization?: any
  } | null
  isLoading: boolean
  switchTenant: (tenantId: string) => Promise<void>
  refreshContext: () => Promise<void>
}
