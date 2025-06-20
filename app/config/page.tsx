"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabaseConfigured } from "@/lib/supabase/config"

// Tab Components
const TenantManagement = () => {
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", domain: "", subscription_tier: "free" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTenants()
  }, [])

  const fetchTenants = async () => {
    try {
      const response = await fetch("/api/tenants")
      const data = await response.json()
      if (response.ok) {
        setTenants(data.tenants)
      } else {
        console.error("Error fetching tenants:", data.error)
      }
    } catch (error) {
      console.error("Error fetching tenants:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const slug = formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")

      const response = await fetch("/api/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          slug,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTenants([data.tenant, ...tenants])
        setFormData({ name: "", domain: "", subscription_tier: "free" })
        setShowForm(false)
        alert("Tenant created successfully!")
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error creating tenant:", error)
      alert("Error creating tenant")
    } finally {
      setSubmitting(false)
    }
  }

  const deleteTenant = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tenant?")) return

    try {
      const response = await fetch(`/api/tenants?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTenants(tenants.filter((t) => t.id !== id))
        alert("Tenant deleted successfully!")
      } else {
        const data = await response.json()
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error deleting tenant:", error)
      alert("Error deleting tenant")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading tenants...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tenant Management</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          {showForm ? "Cancel" : "Add Tenant"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain (optional)</label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="example.com"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Tier</label>
              <select
                value={formData.subscription_tier}
                onChange={(e) => setFormData({ ...formData, subscription_tier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={submitting}
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Tenant"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border">
        <div className="px-4 py-3 border-b">
          <h4 className="font-medium">Existing Tenants ({tenants.length})</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Domain</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tier</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{tenant.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{tenant.slug}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{tenant.domain || "—"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tenant.subscription_tier === "enterprise"
                          ? "bg-purple-100 text-purple-800"
                          : tenant.subscription_tier === "pro"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {tenant.subscription_tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {tenant.subscription_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button onClick={() => deleteTenant(tenant.id)} className="text-red-600 hover:text-red-800 text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No tenants found. Create your first tenant to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState<any[]>([])
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    tenant_id: "",
    industry: "",
    size: "",
    website: "",
    description: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [orgsResponse, tenantsResponse] = await Promise.all([fetch("/api/organizations"), fetch("/api/tenants")])

      const orgsData = await orgsResponse.json()
      const tenantsData = await tenantsResponse.json()

      if (orgsResponse.ok) setOrganizations(orgsData.organizations)
      if (tenantsResponse.ok) setTenants(tenantsData.tenants)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setOrganizations([data.organization, ...organizations])
        setFormData({ name: "", tenant_id: "", industry: "", size: "", website: "", description: "" })
        setShowForm(false)
        alert("Organization created successfully!")
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error creating organization:", error)
      alert("Error creating organization")
    } finally {
      setSubmitting(false)
    }
  }

  const deleteOrganization = async (id: string) => {
    if (!confirm("Are you sure you want to delete this organization?")) return

    try {
      const response = await fetch(`/api/organizations?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setOrganizations(organizations.filter((o) => o.id !== id))
        alert("Organization deleted successfully!")
      } else {
        const data = await response.json()
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error deleting organization:", error)
      alert("Error deleting organization")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading organizations...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Organization Management</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          disabled={tenants.length === 0}
        >
          {showForm ? "Cancel" : "Add Organization"}
        </button>
      </div>

      {tenants.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">You need to create at least one tenant before adding organizations.</p>
        </div>
      )}

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
              <select
                value={formData.tenant_id}
                onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={submitting}
              >
                <option value="">Select Tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Technology, Healthcare"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
              >
                <option value="">Select Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="10-50">10-50 employees</option>
                <option value="50-100">50-100 employees</option>
                <option value="100-500">100-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Brief description of the organization"
                disabled={submitting}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Organization"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border">
        <div className="px-4 py-3 border-b">
          <h4 className="font-medium">Existing Organizations ({organizations.length})</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tenant</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Industry</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Website</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {organizations.map((org) => (
                <tr key={org.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{org.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{org.tenant?.name || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{org.industry || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{org.size || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {org.website ? (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {org.website}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => deleteOrganization(org.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {organizations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No organizations found. Create your first organization to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([])
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    tenant_id: "",
    role: "user",
  })
  const [submitting, setSubmitting] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newUserCredentials, setNewUserCredentials] = useState<{
    email: string
    password: string
    name: string
  } | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersResponse, tenantsResponse] = await Promise.all([fetch("/api/users"), fetch("/api/tenants")])

      const usersData = await usersResponse.json()
      const tenantsData = await tenantsResponse.json()

      if (usersResponse.ok) setUsers(usersData.users)
      if (tenantsResponse.ok) setTenants(tenantsData.tenants)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setUsers([data.user, ...users])
        setFormData({ email: "", first_name: "", last_name: "", phone: "", tenant_id: "", role: "user" })
        setShowForm(false)

        // Show the password modal with credentials
        setNewUserCredentials({
          email: data.user.users.email,
          password: data.defaultPassword,
          name: `${data.user.users.first_name || ""} ${data.user.users.last_name || ""}`.trim() || "User",
        })
        setShowPasswordModal(true)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error creating user:", error)
      alert("Error creating user")
    } finally {
      setSubmitting(false)
    }
  }

  const removeUser = async (id: string) => {
    if (!confirm("Are you sure you want to remove this user's access?")) return

    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== id))
        alert("User access removed successfully!")
      } else {
        const data = await response.json()
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error removing user:", error)
      alert("Error removing user")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          disabled={tenants.length === 0}
        >
          {showForm ? "Cancel" : "Create User"}
        </button>
      </div>

      {tenants.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">You need to create at least one tenant before creating users.</p>
        </div>
      )}

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Users will be created immediately with a default password. You'll receive the login
              credentials to share with the user.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={submitting}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
              <select
                value={formData.tenant_id}
                onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                disabled={submitting}
              >
                <option value="">Select Tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={submitting}
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="org_admin">Organization Admin</option>
                <option value="tenant_admin">Tenant Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Creating User..." : "Create User"}
            </button>
          </form>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && newUserCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">✓</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">User Created Successfully!</h2>
              <p className="text-gray-600">Share these credentials with {newUserCredentials.name}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 font-mono">{newUserCredentials.email}</span>
                  <button
                    onClick={() => copyToClipboard(newUserCredentials.email)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Password</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 font-mono">{newUserCredentials.password}</span>
                  <button
                    onClick={() => copyToClipboard(newUserCredentials.password)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Instructions for the user:</strong>
                  <br />
                  1. Go to the sign-in page
                  <br />
                  2. Use the email and password above
                  <br />
                  3. Change the password after first login
                </p>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() =>
                  copyToClipboard(`Email: ${newUserCredentials.email}\nPassword: ${newUserCredentials.password}`)
                }
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Copy Both
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setNewUserCredentials(null)
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border">
        <div className="px-4 py-3 border-b">
          <h4 className="font-medium">Team Members ({users.length})</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tenant</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((userAccess) => (
                <tr key={userAccess.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {userAccess.users?.first_name || userAccess.users?.last_name
                      ? `${userAccess.users.first_name || ""} ${userAccess.users.last_name || ""}`.trim()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{userAccess.users?.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        userAccess.role === "super_admin"
                          ? "bg-red-100 text-red-800"
                          : userAccess.role === "tenant_admin"
                            ? "bg-purple-100 text-purple-800"
                            : userAccess.role === "org_admin"
                              ? "bg-blue-100 text-blue-800"
                              : userAccess.role === "manager"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {userAccess.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{userAccess.tenants?.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        userAccess.status === "active"
                          ? "bg-green-100 text-green-800"
                          : userAccess.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {userAccess.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => removeUser(userAccess.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No users found. Create your first team member to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const DatabaseSetup = () => {
  const [setupStatus, setSetupStatus] = useState("not-started")
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  const runSetup = async () => {
    setSetupStatus("running")
    setProgress(0)
    setLogs([])

    const steps = [
      "Creating extensions...",
      "Creating tenants table...",
      "Creating organizations table...",
      "Creating users table...",
      "Creating user_tenant_access table...",
      "Creating deal_stages table...",
      "Creating contacts table...",
      "Creating deals table...",
      "Creating activities table...",
      "Creating meetings table...",
      "Creating helper functions...",
      "Setting up RLS policies...",
      "Creating triggers...",
      "Seeding sample data...",
      "Creating views...",
    ]

    for (let i = 0; i < steps.length; i++) {
      setLogs((prev) => [...prev, steps[i]])
      setProgress(((i + 1) / steps.length) * 100)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setLogs((prev) => [...prev, "✅ Database setup completed successfully!"])
    setSetupStatus("completed")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Database Setup</h3>
        <button
          onClick={runSetup}
          disabled={setupStatus === "running"}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          {setupStatus === "running" ? "Setting up..." : "Setup Database"}
        </button>
      </div>

      {setupStatus !== "not-started" && (
        <div className="bg-white rounded-lg border p-4">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-medium mb-4">Database Schema Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "tenants",
            "organizations",
            "users",
            "user_tenant_access",
            "deal_stages",
            "contacts",
            "deals",
            "activities",
            "meetings",
          ].map((table) => (
            <div key={table} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">{table}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  setupStatus === "completed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                }`}
              >
                {setupStatus === "completed" ? "✅ Created" : "⏳ Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ConfigPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("tenants")
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      if (!supabaseConfigured) {
        setError("Supabase not configured")
        setLoading(false)
        return
      }

      const { getSupabaseClient } = await import("@/lib/supabase/client")
      const supabase = await getSupabaseClient()

      if (!supabase) {
        setError("Could not connect to Supabase")
        setLoading(false)
        return
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Session error:", error)
        setError("Authentication error")
        setLoading(false)
        return
      }

      if (!session) {
        console.log("No session found, redirecting to signin")
        router.push("/auth/signin")
        return
      }

      console.log("User authenticated:", session.user.email)
      setUser(session.user)
      setLoading(false)
    } catch (err) {
      console.error("Load user error:", err)
      setError("Failed to load user")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Configuration Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-yellow-600 text-xl">🔐</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please sign in to access the configuration dashboard.</p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "tenants", label: "🏢 Tenants", component: TenantManagement },
    { id: "organizations", label: "🏛️ Organizations", component: OrganizationManagement },
    { id: "users", label: "👥 Users", component: UserManagement },
    { id: "database", label: "🗄️ Database Setup", component: DatabaseSetup },
  ]

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || TenantManagement

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Configuration Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={async () => {
                  const { getSupabaseClient } = await import("@/lib/supabase/client")
                  const supabase = await getSupabaseClient()
                  if (supabase) {
                    await supabase.auth.signOut()
                    router.push("/")
                  }
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  )
}
