"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InviteUserModal } from "./invite-user-modal"
import { Plus, MoreHorizontal, Crown, Shield, User } from "lucide-react"
import { userQueries } from "@/lib/supabase/queries"
import { useTenant, useUserPermissions } from "@/contexts/tenant-context"
import type { UserTenantAccess } from "@/lib/supabase/types"

export function UserManagement() {
  const { tenant } = useTenant()
  const { isAdmin } = useUserPermissions()
  const [users, setUsers] = useState<UserTenantAccess[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!tenant) return
    loadUsers()
  }, [tenant])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const usersData = await userQueries.getUserTenantAccess()
      setUsers(usersData)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
      case "tenant_admin":
        return <Crown className="w-4 h-4 text-yellow-400" />
      case "org_admin":
      case "manager":
        return <Shield className="w-4 h-4 text-blue-400" />
      default:
        return <User className="w-4 h-4 text-gray-400" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-yellow-600 text-yellow-100"
      case "tenant_admin":
        return "bg-red-600 text-red-100"
      case "org_admin":
        return "bg-blue-600 text-blue-100"
      case "manager":
        return "bg-green-600 text-green-100"
      default:
        return "bg-gray-600 text-gray-100"
    }
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "U"
  }

  const handleUserInvited = () => {
    loadUsers()
    setShowInviteModal(false)
  }

  if (!tenant) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <p className="text-gray-400">Please select an organization</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-white">Team Members</CardTitle>
          {isAdmin && (
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowInviteModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="bg-red-900/20 border-red-500/50 mb-6">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Loading users...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((userAccess) => (
                <div key={userAccess.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {getInitials(userAccess.user?.first_name, userAccess.user?.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">
                          {userAccess.user?.first_name} {userAccess.user?.last_name}
                        </h3>
                        {getRoleIcon(userAccess.role)}
                      </div>
                      <p className="text-gray-400 text-sm">{userAccess.user?.email}</p>
                      {userAccess.organization && (
                        <p className="text-gray-500 text-xs">{userAccess.organization.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={getRoleBadgeColor(userAccess.role)}>
                      {userAccess.role.replace("_", " ").toUpperCase()}
                    </Badge>

                    <Badge
                      variant={userAccess.status === "active" ? "default" : "secondary"}
                      className={
                        userAccess.status === "active" ? "bg-green-600 text-green-100" : "bg-gray-600 text-gray-300"
                      }
                    >
                      {userAccess.status}
                    </Badge>

                    {isAdmin && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No team members found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showInviteModal && (
        <InviteUserModal onClose={() => setShowInviteModal(false)} onUserInvited={handleUserInvited} />
      )}
    </div>
  )
}
