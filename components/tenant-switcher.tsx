"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Building2, Check } from "lucide-react"
import { useTenant } from "@/contexts/tenant-context"
import { userQueries } from "@/lib/supabase/queries"
import type { UserTenantAccess } from "@/lib/supabase/types"

export function TenantSwitcher() {
  const { tenant, userAccess, switchTenant, isLoading } = useTenant()
  const [availableTenants, setAvailableTenants] = useState<UserTenantAccess[]>([])
  const [isSwitching, setIsSwitching] = useState(false)

  useEffect(() => {
    async function loadAvailableTenants() {
      try {
        const tenantAccess = await userQueries.getUserTenantAccess()
        setAvailableTenants(tenantAccess)
      } catch (error) {
        console.error("Error loading available tenants:", error)
      }
    }

    loadAvailableTenants()
  }, [])

  const handleTenantSwitch = async (tenantId: string) => {
    if (tenantId === tenant?.id) return

    try {
      setIsSwitching(true)
      await switchTenant(tenantId)
      // Optionally refresh the page to ensure all components update
      window.location.reload()
    } catch (error) {
      console.error("Error switching tenant:", error)
    } finally {
      setIsSwitching(false)
    }
  }

  if (isLoading || !tenant) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-md">
        <Building2 className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 justify-between min-w-[200px]"
          disabled={isSwitching}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{tenant.name}</span>
              {userAccess && (
                <span className="text-xs text-gray-400 capitalize">{userAccess.role.replace("_", " ")}</span>
              )}
            </div>
          </div>
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[250px] bg-gray-800 border-gray-700">
        <DropdownMenuLabel className="text-gray-300">Switch Organization</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />

        {availableTenants.map((access) => (
          <DropdownMenuItem
            key={access.tenant_id}
            onClick={() => handleTenantSwitch(access.tenant_id)}
            className="flex items-center justify-between p-3 text-white hover:bg-gray-700 cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{access.tenant?.name || "Unknown Tenant"}</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                  {access.role.replace("_", " ")}
                </Badge>
                {access.organization && <span className="text-xs text-gray-400">{access.organization.name}</span>}
              </div>
            </div>
            {access.tenant_id === tenant.id && <Check className="w-4 h-4 text-green-400" />}
          </DropdownMenuItem>
        ))}

        {availableTenants.length === 0 && (
          <DropdownMenuItem disabled className="text-gray-400">
            No organizations available
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
