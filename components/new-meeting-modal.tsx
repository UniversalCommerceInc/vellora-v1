"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Calendar, Clock, Video } from "lucide-react"
import { meetingQueries } from "@/lib/supabase/queries"
import { useTenant, useCurrentTenantId } from "@/contexts/tenant-context"
import type { MeetingInsert } from "@/lib/supabase/types"

interface NewMeetingModalProps {
  dealId?: string
  onClose: () => void
  onMeetingCreated?: () => void
}

const meetingTypes = [
  { value: "discovery", label: "Discovery Call" },
  { value: "demo", label: "Product Demo" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closing", label: "Closing Call" },
  { value: "follow_up", label: "Follow-up" },
  { value: "other", label: "Other" },
]

export function NewMeetingModal({ dealId, onClose, onMeetingCreated }: NewMeetingModalProps) {
  const { organization } = useTenant()
  const tenantId = useCurrentTenantId()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meeting_url: "",
    scheduled_at: "",
    duration_minutes: 60,
    meeting_type: "discovery",
    attendees: [] as any[],
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
      const meetingData: MeetingInsert = {
        tenant_id: tenantId,
        organization_id: organization?.id || null,
        deal_id: dealId || null,
        title: formData.title,
        description: formData.description || null,
        meeting_url: formData.meeting_url || null,
        scheduled_at: new Date(formData.scheduled_at).toISOString(),
        duration_minutes: formData.duration_minutes,
        meeting_type: formData.meeting_type,
        status: "scheduled",
        attendees: formData.attendees,
        ai_analysis: {},
      }

      await meetingQueries.createMeeting(meetingData)

      if (onMeetingCreated) {
        onMeetingCreated()
      }

      onClose()
    } catch (error: any) {
      console.error("Error creating meeting:", error)
      alert(`Error creating meeting: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-700">
          <CardTitle className="text-white text-xl">Schedule New Meeting</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meeting Title <span className="text-red-400">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter meeting title..."
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

            {/* Meeting Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Meeting Type</label>
              <select
                value={formData.meeting_type}
                onChange={(e) => setFormData((prev) => ({ ...prev, meeting_type: e.target.value }))}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white"
              >
                {meetingTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter meeting description..."
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
              />
            </div>

            {/* Scheduled Date & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Scheduled Date & Time <span className="text-red-400">*</span>
                </label>
                <Input
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData((prev) => ({ ...prev, scheduled_at: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
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
                    setFormData((prev) => ({ ...prev, duration_minutes: Number.parseInt(e.target.value) || 60 }))
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                  min="15"
                  step="15"
                />
              </div>
            </div>

            {/* Meeting URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Video className="w-4 h-4 inline mr-1" />
                Meeting URL
              </label>
              <Input
                type="url"
                value={formData.meeting_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, meeting_url: e.target.value }))}
                placeholder="https://zoom.us/j/..."
                className="bg-gray-800 border-gray-600 text-white"
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
                disabled={isSubmitting || !formData.title || !formData.scheduled_at}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
