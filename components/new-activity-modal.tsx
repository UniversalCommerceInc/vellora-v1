"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Calendar, Clock, Phone, Mail, MessageSquare, CheckSquare } from "lucide-react"
import { activityQueries } from "@/lib/supabase/queries"
import { useTenant, useCurrentTenantId } from "@/contexts/tenant-context"
import type { ActivityInsert } from "@/lib/supabase/types"

interface NewActivityModalProps {
  dealId?: string
  contactId?: string
  onClose: () => void
  onActivityCreated?: () => void
}

const activityTypes = [
  { value: "call", label: "Call", icon: Phone, color: "bg-blue-500" },
  { value: "email", label: "Email", icon: Mail, color: "bg-green-500" },
  { value: "meeting", label: "Meeting", icon: Calendar, color: "bg-purple-500" },
  { value: "note", label: "Note", icon: MessageSquare, color: "bg-gray-500" },
  { value: "task", label: "Task", icon: CheckSquare, color: "bg-orange-500" },
]

export function NewActivityModal({ dealId, contactId, onClose, onActivityCreated }: NewActivityModalProps) {
  const { organization } = useTenant()
  const tenantId = useCurrentTenantId()

  const [formData, setFormData] = useState({
    activity_type: "call",
    title: "",
    description: "",
    scheduled_at: "",
    duration_minutes: 30,
    outcome: "",
    follow_up_required: false,
    follow_up_date: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tenantId) {
      alert("No tenant selected")
      return
    }

    setIsSubmitting(true)

    try {
      const activityData: ActivityInsert = {
        tenant_id: tenantId,
        organization_id: organization?.id || null,
        deal_id: dealId || null,
        contact_id: contactId || null,
        activity_type: formData.activity_type,
        title: formData.title || null,
        description: formData.description || null,
        scheduled_at: formData.scheduled_at ? new Date(formData.scheduled_at).toISOString() : null,
        duration_minutes: formData.duration_minutes || null,
        outcome: formData.outcome || null,
        follow_up_required: formData.follow_up_required,
        follow_up_date: formData.follow_up_date || null,
        notes: formData.notes || null,
        metadata: {},
      }

      await activityQueries.createActivity(activityData)

      if (onActivityCreated) {
        onActivityCreated()
      }

      onClose()
    } catch (error: any) {
      console.error("Error creating activity:", error)
      alert(`Error creating activity: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedType = activityTypes.find((type) => type.value === formData.activity_type)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-700">
          <CardTitle className="text-white text-xl">Create New Activity</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Activity Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Activity Type</label>
              <div className="grid grid-cols-5 gap-2">
                {activityTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, activity_type: type.value }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.activity_type === type.value
                          ? "border-purple-500 bg-purple-500/20"
                          : "border-gray-600 bg-gray-800 hover:border-gray-500"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-white mx-auto mb-1" />
                      <span className="text-xs text-gray-300">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder={`Enter ${selectedType?.label.toLowerCase()} title...`}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description..."
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
              />
            </div>

            {/* Scheduled Date & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Scheduled Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData((prev) => ({ ...prev, scheduled_at: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, duration_minutes: Number.parseInt(e.target.value) || 0 }))
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                  min="1"
                />
              </div>
            </div>

            {/* Outcome */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Outcome</label>
              <Input
                value={formData.outcome}
                onChange={(e) => setFormData((prev) => ({ ...prev, outcome: e.target.value }))}
                placeholder="Enter outcome..."
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            {/* Follow-up */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="follow_up_required"
                  checked={formData.follow_up_required}
                  onChange={(e) => setFormData((prev) => ({ ...prev, follow_up_required: e.target.checked }))}
                  className="rounded border-gray-600 bg-gray-800"
                />
                <label htmlFor="follow_up_required" className="text-sm text-gray-300">
                  Follow-up required
                </label>
              </div>

              {formData.follow_up_required && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Follow-up Date</label>
                  <Input
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, follow_up_date: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter additional notes..."
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? "Creating..." : "Create Activity"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
