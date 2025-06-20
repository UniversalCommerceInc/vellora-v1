"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  X,
  Edit,
  Save,
  Mail,
  Phone,
  Building,
  Globe,
  Briefcase,
  Calendar,
  MessageSquare,
  ExternalLink,
} from "lucide-react"
import { contactQueries } from "@/lib/supabase/queries"
import type { ContactWithRelations } from "@/lib/supabase/types"

interface ContactDetailModalProps {
  contact: ContactWithRelations
  onClose: () => void
  onContactUpdated: () => void
}

export function ContactDetailModal({ contact, onClose, onContactUpdated }: ContactDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    firstName: contact.first_name,
    lastName: contact.last_name || "",
    email: contact.email || "",
    phone: contact.phone || "",
    title: contact.title || "",
    company: contact.company || "",
    website: contact.website || "",
    linkedinUrl: contact.linkedin_url || "",
    notes: contact.notes || "",
    tags: contact.tags?.join(", ") || "",
  })

  const getInitials = (firstName: string, lastName?: string) => {
    return `${firstName.charAt(0)}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")

    try {
      await contactQueries.updateContact(contact.id, {
        first_name: formData.firstName,
        last_name: formData.lastName || null,
        email: formData.email || null,
        phone: formData.phone || null,
        title: formData.title || null,
        company: formData.company || null,
        website: formData.website || null,
        linkedin_url: formData.linkedinUrl || null,
        notes: formData.notes || null,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : null,
      })

      setIsEditing(false)
      onContactUpdated()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: contact.first_name,
      lastName: contact.last_name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      title: contact.title || "",
      company: contact.company || "",
      website: contact.website || "",
      linkedinUrl: contact.linkedin_url || "",
      notes: contact.notes || "",
      tags: contact.tags?.join(", ") || "",
    })
    setIsEditing(false)
    setError("")
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-900 border-gray-700 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={contact.avatar_url || ""} />
              <AvatarFallback className="bg-purple-600 text-white text-lg">
                {getInitials(contact.first_name, contact.last_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-white text-xl">
                {contact.first_name} {contact.last_name}
              </CardTitle>
              {contact.title && <p className="text-gray-400">{contact.title}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <Alert className="bg-red-900/20 border-red-500/50 mb-6">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Contact Information</h3>

                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">First Name</label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Last Name</label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Phone</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">{contact.email}</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">{contact.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Professional Information</h3>

                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Job Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Company</label>
                      <Input
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Website</label>
                      <Input
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">LinkedIn URL</label>
                      <Input
                        value={formData.linkedinUrl}
                        onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contact.company && (
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">{contact.company}</span>
                      </div>
                    )}
                    {contact.title && (
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">{contact.title}</span>
                      </div>
                    )}
                    {contact.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">{contact.website}</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    {contact.linkedin_url && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">LinkedIn Profile</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Notes</h3>

                {isEditing ? (
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Add notes about this contact..."
                    className="bg-gray-800 border-gray-600 text-white min-h-[120px]"
                  />
                ) : (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-300">{contact.notes || "No notes added yet."}</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Tags</h3>

                {isEditing ? (
                  <Input
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="Enter tags separated by commas"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {contact.tags && contact.tags.length > 0 ? (
                      contact.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">No tags added</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Quick Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700 justify-start"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700 justify-start"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <span className="text-gray-300 ml-2">{new Date(contact.created_at).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Updated:</span>
                    <span className="text-gray-300 ml-2">{new Date(contact.updated_at).toLocaleDateString()}</span>
                  </div>
                  {contact.organization && (
                    <div>
                      <span className="text-gray-400">Organization:</span>
                      <span className="text-gray-300 ml-2">{contact.organization.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Deals */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Related Deals</h3>
                <div className="text-sm text-gray-500">No deals associated yet</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
