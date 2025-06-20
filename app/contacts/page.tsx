"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ContactsList } from "@/components/contacts-list"
import { NewContactModal } from "@/components/new-contact-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Search, Plus, Users } from "lucide-react"
import { contactQueries } from "@/lib/supabase/queries"
import { useTenant } from "@/contexts/tenant-context"
import type { ContactWithRelations } from "@/lib/supabase/types"

export default function ContactsPage() {
  const { tenant } = useTenant()
  const [contacts, setContacts] = useState<ContactWithRelations[]>([])
  const [filteredContacts, setFilteredContacts] = useState<ContactWithRelations[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewContactModal, setShowNewContactModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!tenant) return

    loadContacts()
  }, [tenant])

  useEffect(() => {
    // Filter contacts based on search query
    if (!searchQuery) {
      setFilteredContacts(contacts)
    } else {
      const filtered = contacts.filter(
        (contact) =>
          contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.company?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredContacts(filtered)
    }
  }, [contacts, searchQuery])

  const loadContacts = async () => {
    try {
      setIsLoading(true)
      const contactsData = await contactQueries.getContacts()
      setContacts(contactsData)
    } catch (error) {
      console.error("Error loading contacts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactCreated = () => {
    loadContacts()
    setShowNewContactModal(false)
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Please select an organization</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
              <p className="text-gray-300 text-lg">Manage your customer relationships</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Filter"
                  className="pl-10 bg-black/40 border-gray-600 text-white placeholder:text-white w-32"
                  readOnly
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/40 border-gray-600 text-white placeholder:text-gray-400 w-64"
                />
              </div>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setShowNewContactModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Contact
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white">Loading contacts...</div>
            </div>
          ) : (
            <ContactsList contacts={filteredContacts} onContactUpdated={loadContacts} />
          )}

          {!isLoading && filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">
                {searchQuery ? "No contacts found" : "No contacts yet"}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Start building your customer relationships by adding your first contact"}
              </p>
              {!searchQuery && (
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setShowNewContactModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Contact
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {showNewContactModal && (
        <NewContactModal onClose={() => setShowNewContactModal(false)} onContactCreated={handleContactCreated} />
      )}
    </div>
  )
}
