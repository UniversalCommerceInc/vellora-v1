"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ContactDetailModal } from "./contact-detail-modal"
import { Mail, Phone, Building, ExternalLink, MoreHorizontal } from "lucide-react"
import type { ContactWithRelations } from "@/lib/supabase/types"

interface ContactsListProps {
  contacts: ContactWithRelations[]
  onContactUpdated: () => void
}

export function ContactsList({ contacts, onContactUpdated }: ContactsListProps) {
  const [selectedContact, setSelectedContact] = useState<ContactWithRelations | null>(null)

  const getInitials = (firstName: string, lastName?: string) => {
    return `${firstName.charAt(0)}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  const handleContactClick = (contact: ContactWithRelations) => {
    setSelectedContact(contact)
  }

  const handleCloseModal = () => {
    setSelectedContact(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <Card
            key={contact.id}
            className="bg-gray-900/80 border-gray-700 backdrop-blur-sm hover:bg-gray-800/80 transition-colors cursor-pointer"
            onClick={() => handleContactClick(contact)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={contact.avatar_url || ""} />
                    <AvatarFallback className="bg-purple-600 text-white">
                      {getInitials(contact.first_name, contact.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-medium">
                      {contact.first_name} {contact.last_name}
                    </h3>
                    {contact.title && <p className="text-gray-400 text-sm">{contact.title}</p>}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {contact.company && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{contact.company}</span>
                </div>
              )}

              {contact.email && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm truncate">{contact.email}</span>
                </div>
              )}

              {contact.phone && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{contact.phone}</span>
                </div>
              )}

              {contact.website && (
                <div className="flex items-center gap-2 text-gray-300">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                  <span className="text-sm truncate">{contact.website}</span>
                </div>
              )}

              {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {contact.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {contact.tags.length > 3 && (
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                      +{contact.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <span className="text-xs text-gray-500">Added {new Date(contact.created_at).toLocaleDateString()}</span>
                {contact.organization && (
                  <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                    {contact.organization.name}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedContact && (
        <ContactDetailModal contact={selectedContact} onClose={handleCloseModal} onContactUpdated={onContactUpdated} />
      )}
    </>
  )
}
