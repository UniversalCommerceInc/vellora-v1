"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { supabaseConfigured } from "@/lib/supabase/config"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { Tenant, Organization, UserTenantAccess, TenantContext } from "@/lib/supabase/types"

const TenantContextProvider = createContext<TenantContext | undefined>(undefined)

interface TenantProviderProps {
  children: React.ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [userAccess, setUserAccess] = useState<UserTenantAccess | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshContext = useCallback(async () => {
    console.log("🔄 TenantContext: Starting refresh...")
    console.log("🔧 TenantContext: Supabase configured:", supabaseConfigured)

    if (!supabaseConfigured) {
      console.log("⚠️ TenantContext: Supabase not configured, using mock data")
      // Mock data for development
      setTenant({
        id: "00000000-0000-0000-0000-000000000001",
        name: "Demo Organization",
        slug: "demo",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      console.log("🔄 TenantContext: Getting Supabase client...")

      // Get supabase client
      const supabase = await getSupabaseClient()
      if (!supabase) {
        console.log("❌ TenantContext: Failed to get Supabase client")
        setIsLoading(false)
        return
      }

      console.log("✅ TenantContext: Supabase client obtained")

      // Get current user session
      console.log("🔄 TenantContext: Getting user session...")
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("❌ TenantContext: Session error:", sessionError)
        setTenant(null)
        setOrganization(null)
        setUserAccess(null)
        setIsLoading(false)
        return
      }

      if (!session) {
        console.log("⚠️ TenantContext: No session found")
        setTenant(null)
        setOrganization(null)
        setUserAccess(null)
        setIsLoading(false)
        return
      }

      console.log("✅ TenantContext: User session found for user:", session.user.id)

      // Test basic database connectivity
      console.log("🔄 TenantContext: Testing database connectivity...")
      const { data: testData, error: testError } = await supabase.from("tenants").select("id, name").limit(1)

      if (testError) {
        console.error("❌ TenantContext: Database connectivity test failed:", testError)
        setTenant(null)
        setOrganization(null)
        setUserAccess(null)
        setIsLoading(false)
        return
      }

      console.log("✅ TenantContext: Database connectivity test passed:", testData)

      // Get user's tenant access from the database
      console.log("🔄 TenantContext: Fetching user tenant access for user:", session.user.id)
      const { data: userTenantAccess, error: accessError } = await supabase
        .from("user_tenant_access")
        .select(`
          *,
          tenant:tenants(*),
          organization:organizations(*)
        `)
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (accessError) {
        console.error("❌ TenantContext: Error fetching user tenant access:", accessError)
        console.error("❌ TenantContext: Error details:", {
          message: accessError.message,
          details: accessError.details,
          hint: accessError.hint,
          code: accessError.code,
        })
        setTenant(null)
        setOrganization(null)
        setUserAccess(null)
        setIsLoading(false)
        return
      }

      console.log("📊 TenantContext: User tenant access query result:", userTenantAccess)
      console.log("📊 TenantContext: Number of tenant access records:", userTenantAccess?.length || 0)

      if (!userTenantAccess || userTenantAccess.length === 0) {
        console.log("⚠️ TenantContext: No tenant access found for user")

        // Check if the user exists in the users table using maybeSingle
        console.log("🔄 TenantContext: Checking if user exists in users table...")
        const { data: existingUser, error: userCheckError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle()

        if (userCheckError) {
          console.error("❌ TenantContext: Error checking user in users table:", userCheckError)
          setTenant(null)
          setOrganization(null)
          setUserAccess(null)
          setIsLoading(false)
          return
        }

        let userRecord = existingUser

        if (!existingUser) {
          console.log("🔄 TenantContext: User not found in users table, creating user record...")

          // Create user record using upsert to handle duplicates
          const { data: newUser, error: createUserError } = await supabase
            .from("users")
            .upsert(
              {
                id: session.user.id,
                email: session.user.email || "",
                first_name: session.user.user_metadata?.first_name || session.user.email?.split("@")[0] || "User",
                last_name: session.user.user_metadata?.last_name || "",
                avatar_url: session.user.user_metadata?.avatar_url || null,
              },
              { onConflict: "id" },
            )
            .select()
            .single()

          if (createUserError) {
            console.error("❌ TenantContext: Error creating user record:", createUserError)
            setTenant(null)
            setOrganization(null)
            setUserAccess(null)
            setIsLoading(false)
            return
          }

          console.log("✅ TenantContext: User record created/updated:", newUser)
          userRecord = newUser
        } else {
          console.log("✅ TenantContext: User found in users table:", existingUser)
        }

        // Check if user already has tenant access (maybe it was created after our first check)
        console.log("🔄 TenantContext: Double-checking for existing tenant access...")
        const { data: recheckAccess, error: recheckError } = await supabase
          .from("user_tenant_access")
          .select(`
            *,
            tenant:tenants(*),
            organization:organizations(*)
          `)
          .eq("user_id", session.user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })

        if (!recheckError && recheckAccess && recheckAccess.length > 0) {
          console.log("✅ TenantContext: Found existing tenant access on recheck:", recheckAccess[0])
          const primaryAccess = recheckAccess[0]
          setTenant(primaryAccess.tenant)
          setOrganization(primaryAccess.organization)
          setUserAccess(primaryAccess)
          setIsLoading(false)
          return
        }

        // Now create a demo tenant and organization for this user
        console.log("🔄 TenantContext: Creating demo tenant and organization...")

        // Create tenant
        const { data: newTenant, error: tenantError } = await supabase
          .from("tenants")
          .insert({
            name: `${userRecord.first_name}'s Organization`,
            slug: `${userRecord.first_name.toLowerCase()}-${Date.now()}`,
          })
          .select()
          .single()

        if (tenantError) {
          console.error("❌ TenantContext: Error creating tenant:", tenantError)
          setTenant(null)
          setOrganization(null)
          setUserAccess(null)
          setIsLoading(false)
          return
        }

        console.log("✅ TenantContext: Tenant created:", newTenant)

        // Create organization
        const { data: newOrg, error: orgError } = await supabase
          .from("organizations")
          .insert({
            tenant_id: newTenant.id,
            name: `${userRecord.first_name}'s Organization`,
            description: "Your main organization",
          })
          .select()
          .single()

        if (orgError) {
          console.error("❌ TenantContext: Error creating organization:", orgError)
          setTenant(null)
          setOrganization(null)
          setUserAccess(null)
          setIsLoading(false)
          return
        }

        console.log("✅ TenantContext: Organization created:", newOrg)

        // Create user tenant access
        const { data: newAccess, error: accessError } = await supabase
          .from("user_tenant_access")
          .insert({
            user_id: session.user.id,
            tenant_id: newTenant.id,
            organization_id: newOrg.id,
            role: "admin",
            status: "active",
          })
          .select(`
            *,
            tenant:tenants(*),
            organization:organizations(*)
          `)
          .single()

        if (accessError) {
          console.error("❌ TenantContext: Error creating user tenant access:", accessError)
          setTenant(null)
          setOrganization(null)
          setUserAccess(null)
          setIsLoading(false)
          return
        }

        console.log("✅ TenantContext: User tenant access created:", newAccess)

        // Set the context with the new data
        setTenant(newAccess.tenant)
        setOrganization(newAccess.organization)
        setUserAccess(newAccess)
        setIsLoading(false)
        return
      }

      // Use the first (most recent) tenant access
      const primaryAccess = userTenantAccess[0]
      console.log("✅ TenantContext: Using primary access:", primaryAccess)

      // Set the tenant, organization, and user access
      if (primaryAccess.tenant) {
        setTenant(primaryAccess.tenant)
        console.log("✅ TenantContext: Tenant set:", primaryAccess.tenant.name)
      } else {
        console.log("⚠️ TenantContext: No tenant data in access record")
      }

      if (primaryAccess.organization) {
        setOrganization(primaryAccess.organization)
        console.log("✅ TenantContext: Organization set:", primaryAccess.organization.name)
      } else {
        console.log("⚠️ TenantContext: No organization data in access record")
      }

      setUserAccess(primaryAccess)
      console.log("✅ TenantContext: User access set with role:", primaryAccess.role)
    } catch (error) {
      console.error("❌ TenantContext: Unexpected error refreshing tenant context:", error)
      setTenant(null)
      setOrganization(null)
      setUserAccess(null)
    } finally {
      setIsLoading(false)
      console.log("🏁 TenantContext: Refresh complete")
    }
  }, [])

  const switchTenant = useCallback(async (tenantId: string) => {
    if (!supabaseConfigured) {
      console.log("⚠️ TenantContext: Cannot switch tenant - Supabase not configured")
      return
    }

    console.log("🔄 TenantContext: Switching to tenant:", tenantId)

    try {
      const supabase = await getSupabaseClient()
      if (!supabase) return

      // Get the user's access to the target tenant
      const { data: targetAccess, error } = await supabase
        .from("user_tenant_access")
        .select(`
          *,
          tenant:tenants(*),
          organization:organizations(*)
        `)
        .eq("tenant_id", tenantId)
        .eq("status", "active")
        .single()

      if (error || !targetAccess) {
        console.error("❌ TenantContext: Error switching tenant:", error)
        return
      }

      // Update the context
      if (targetAccess.tenant) {
        setTenant(targetAccess.tenant)
      }
      if (targetAccess.organization) {
        setOrganization(targetAccess.organization)
      }
      setUserAccess(targetAccess)

      console.log("✅ TenantContext: Successfully switched to tenant:", targetAccess.tenant?.name)
    } catch (error) {
      console.error("❌ TenantContext: Error switching tenant:", error)
    }
  }, [])

  useEffect(() => {
    console.log("🚀 TenantContext: Component mounted, starting initial refresh...")
    refreshContext()

    // Listen for auth changes (client-side only)
    if (supabaseConfigured) {
      getSupabaseClient().then((supabase) => {
        if (supabase) {
          console.log("👂 TenantContext: Setting up auth state listener...")
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("🔔 TenantContext: Auth state changed:", event, session?.user?.id)
            if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
              refreshContext()
            }
          })

          return () => {
            console.log("🔇 TenantContext: Cleaning up auth listener")
            subscription.unsubscribe()
          }
        }
      })
    }
  }, [refreshContext])

  const value: TenantContext = {
    tenant,
    organization,
    userAccess,
    isLoading,
    switchTenant,
    refreshContext,
  }

  return <TenantContextProvider.Provider value={value}>{children}</TenantContextProvider.Provider>
}

export function useTenant() {
  const context = useContext(TenantContextProvider)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}

export function useCurrentTenantId(): string | null {
  const { tenant } = useTenant()
  return tenant?.id || null
}
