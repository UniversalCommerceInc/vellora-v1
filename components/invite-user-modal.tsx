"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Mail, User, Shield } from "lucide-react"
import { useTenant, useCurrentTenantId } from "@/contexts/tenant-context"

interface InviteUserModalProps {
  onClose: () => void
  onUserInvited: () => void
}

export function InviteUserModal({ onClose, onUserInvited }: InviteUserModalProps) {
  const { organization } = useTenant()
  const tenantId = useCurrentTenantId()

  const [formData, setFormData] = useState({
    email: "",
    role: "user",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const roles = [
    { value: "user", label: "User", description: "Basic access to deals and contacts" },
    { value: "manager", label: "Manager", description: "Can manage team members and deals" },
    { value: "org_admin", label: "Organization Admin", description: "Full access to organization settings" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tenantId) {
      setError("No tenant selected")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // In a real implementation, this would:
      // 1. Send an invitation email
      // 2. Create a pending user record
      // 3. Handle the invitation acceptance flow

      // For now, we'll simulate the invitation process
      console.log("Inviting user:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onUserInvited()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-700">
          <CardTitle className="text-white text-xl">Invite Team Member</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="bg-red-900/20 border-red-500/50">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="colleague@company.com"
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-300">
                Role *
              </label>
              <div className="space-y-3">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.role === role.value
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-600 bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {role.value === "org_admin" ? (
                          <Shield className="w-4 h-4 text-blue-400" />
                        ) : (
                          <User className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-white font-medium">{role.label}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{role.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Invitation Details</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• User will receive an email invitation</li>
                <li>• They can accept and create their account</li>
                <li>• Access will be granted to {organization?.name || "your organization"}</li>
                <li>• You can change their role later if needed</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.email}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
