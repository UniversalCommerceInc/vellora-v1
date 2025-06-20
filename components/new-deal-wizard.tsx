"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Send, Bot, User } from "lucide-react"
import { dealQueries, contactQueries } from "@/lib/supabase/queries"
import { useTenant, useCurrentTenantId } from "@/contexts/tenant-context"
import type { DealInsert, ContactInsert } from "@/lib/supabase/types"
import { getSupabaseClient } from "@/lib/supabase/client"

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
}

interface DealData {
  email: string
  website: string
  value: string
  companyName?: string
  industry?: string
  contactName?: string
  title?: string
  description?: string
  painPoints?: string[]
  nextSteps?: string[]
}

interface NewDealWizardProps {
  onClose: () => void
  onDealCreated?: () => void
}

export function NewDealWizard({ onClose, onDealCreated }: NewDealWizardProps) {
  const { tenant, organization } = useTenant()
  const tenantId = useCurrentTenantId()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hi! I'm here to help you create a new deal. Let's start by gathering some basic information. What's the point of contact's email address?",
      timestamp: new Date(),
    },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [dealData, setDealData] = useState<DealData>({
    email: "",
    website: "",
    value: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const steps = ["Email Address", "Company Website", "Deal Value", "Company Analysis", "Deal Review", "Confirmation"]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const simulateCompanyAnalysis = async (website: string) => {
    // Reduce delay to prevent hanging
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const companyData = {
      companyName: website.includes("techcorp")
        ? "TechCorp Solutions"
        : website.includes("innovate")
          ? "Innovate Dynamics"
          : "Global Enterprises Inc",
      industry: website.includes("tech")
        ? "Technology"
        : website.includes("health")
          ? "Healthcare"
          : "Financial Services",
      contactName: "John Smith",
      title: "VP of Sales",
      description: "Enterprise software solutions provider",
    }

    return companyData
  }

  const generatePainPointsAndNextSteps = () => {
    return {
      painPoints: [
        "Manual processes causing inefficiencies",
        "Lack of real-time data visibility",
        "Difficulty scaling current operations",
      ],
      nextSteps: ["Schedule technical demo", "Prepare ROI analysis", "Connect with decision makers"],
    }
  }

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentInput("")

    let botResponse = ""
    const newDealData = { ...dealData }

    if (currentStep === 0) {
      // Email step
      newDealData.email = currentInput
      botResponse = `Great! I've recorded ${currentInput} as the contact email. Now, what's the company's website?`
      setCurrentStep(1)
    } else if (currentStep === 1) {
      // Website step
      newDealData.website = currentInput
      botResponse = `Perfect! I'll analyze ${currentInput} to gather company information. What is the deal value?`
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // Deal value step
      newDealData.value = currentInput
      botResponse = `Excellent! Let me analyze the company website and gather additional information...`
      setCurrentStep(3)
      setDealData(newDealData)

      // Add bot response immediately
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 100).toString(),
          type: "bot",
          content: botResponse,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsProcessing(false)
      }, 500)

      // Then handle company analysis separately
      handleCompanyAnalysis(newDealData)
      return
    } else if (currentStep === 5) {
      // Confirmation step
      if (currentInput.toLowerCase() === "yes") {
        setIsProcessing(false) // Clear processing state before creating deal
        await createDeal(newDealData)
        return // Exit early to prevent additional processing
      } else {
        botResponse = `I understand you'd like to make changes. Please let me know what you'd like to modify, or type "restart" to begin again.`
      }
    }

    setDealData(newDealData)

    // Add bot response
    if (botResponse) {
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 100).toString(),
          type: "bot",
          content: botResponse,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsProcessing(false)
      }, 500)
    } else {
      setIsProcessing(false)
    }
  }

  // Add this new function to handle company analysis separately
  const handleCompanyAnalysis = async (data: DealData) => {
    try {
      setIsProcessing(true)

      const companyInfo = await simulateCompanyAnalysis(data.website)
      const { painPoints, nextSteps } = generatePainPointsAndNextSteps()

      const updatedData = {
        ...data,
        ...companyInfo,
        painPoints,
        nextSteps,
      }
      setDealData(updatedData)

      const analysisMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `I've analyzed ${companyInfo.companyName} and gathered the following information:\n\n• Company: ${companyInfo.companyName}\n• Industry: ${companyInfo.industry}\n• Contact: ${companyInfo.contactName} (${companyInfo.title})\n• Description: ${companyInfo.description}\n\nBased on similar companies, I've identified potential pain points and next steps. Let me show you the complete deal summary for review.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, analysisMessage])
      setCurrentStep(4)

      // Add review message after a short delay
      setTimeout(() => {
        const reviewMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: "bot",
          content: `Here's the complete deal summary:\n\n**Contact:** ${updatedData.contactName} (${updatedData.email})\n**Company:** ${companyInfo.companyName}\n**Website:** ${updatedData.website}\n**Industry:** ${companyInfo.industry}\n**Deal Value:** ${updatedData.value}\n**Description:** ${companyInfo.description}\n\n**Pain Points:**\n${painPoints.map((p) => `• ${p}`).join("\n")}\n\n**Next Steps:**\n${nextSteps.map((s) => `• ${s}`).join("\n")}\n\nDoes this look correct? Type "yes" to create the deal or "edit" to make changes.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, reviewMessage])
        setCurrentStep(5)
        setIsProcessing(false)
      }, 1000)
    } catch (error) {
      console.error("Error in company analysis:", error)
      setIsProcessing(false)
    }
  }

  const createDeal = async (data: DealData) => {
    console.log("🔍 Debug: Starting deal creation...")
    console.log("🔍 Debug: Current tenant:", tenant)
    console.log("🔍 Debug: Current tenantId:", tenantId)
    console.log("🔍 Debug: Current organization:", organization)

    // Enhanced tenant ID validation with better debugging
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!tenantId) {
      console.error("❌ Debug: No tenant ID found")
      const errorMsg: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: "Error: No tenant ID found. Please refresh the page and sign in again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
      setIsCreating(false)
      setIsProcessing(false)
      return
    }

    if (!uuidRegex.test(tenantId)) {
      console.error("❌ Debug: Invalid tenant ID format:", tenantId)
      const errorMsg: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: `Error: Invalid tenant ID format: ${tenantId}. Please refresh the page and try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
      setIsCreating(false)
      setIsProcessing(false)
      return
    }

    if (!tenant) {
      console.error("❌ Debug: No tenant object found")
      const errorMsg: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: "Error: No tenant selected. Please refresh and try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
      setIsCreating(false)
      setIsProcessing(false)
      return
    }

    console.log("✅ Debug: Tenant validation passed, proceeding with deal creation...")
    setIsCreating(true)

    try {
      // Get current user with better error handling
      console.log("🔍 Debug: Getting Supabase client...")
      const supabase = await getSupabaseClient()
      if (!supabase) {
        throw new Error("Database connection not available")
      }

      console.log("🔍 Debug: Getting current user session...")
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("❌ Debug: Session error:", sessionError)
        throw new Error(`Session error: ${sessionError.message}`)
      }

      if (!session || !session.user) {
        console.error("❌ Debug: No session or user found")
        console.log("🔍 Debug: Session data:", session)
        throw new Error("User not authenticated. Please sign in again.")
      }

      const user = session.user
      console.log("✅ Debug: User authenticated:", user.id)

      // Get deal stages and find the "Lead" stage specifically
      console.log("🔍 Debug: Loading deal stages...")
      const stages = await dealQueries.getDealStages()
      console.log("✅ Debug: Available stages:", stages)

      if (!stages || stages.length === 0) {
        throw new Error("No deal stages found. Please ensure deal stages are configured in your database.")
      }

      // Filter stages by current tenant and organization to ensure we get the right Lead stage
      const filteredStages = stages.filter(
        (stage) => stage.tenant_id === tenantId && stage.organization_id === (organization?.id || null),
      )

      console.log("🔍 Debug: Filtered stages for current tenant/org:", filteredStages)

      // Find Lead stage more precisely - look for the stage with order_index 1 or lowest order_index
      const leadStage =
        filteredStages.find((stage) => {
          const stageName = stage.name.toLowerCase().trim()
          return stageName === "lead" || stageName === "leads"
        }) ||
        filteredStages.find((stage) => stage.order_index === 1) ||
        filteredStages[0] // fallback to first stage

      if (!leadStage) {
        console.error(
          "❌ Debug: No Lead stage found in filtered stages:",
          filteredStages.map((s) => ({ id: s.id, name: s.name, order: s.order_index })),
        )
        throw new Error(
          `No 'Lead' stage found for your organization. Available stages: ${filteredStages.map((s) => s.name).join(", ")}. Please ensure deal stages are properly configured.`,
        )
      }

      console.log("✅ Debug: Using Lead stage:", leadStage)
      console.log("✅ Debug: Lead stage ID:", leadStage.id)

      // Create contact first with proper tenant ID
      console.log("🔍 Debug: Creating contact...")
      const contactData: ContactInsert = {
        tenant_id: tenantId,
        organization_id: organization?.id || null,
        first_name: data.contactName?.split(" ")[0] || "Unknown",
        last_name: data.contactName?.split(" ").slice(1).join(" ") || "",
        email: data.email,
        company: data.companyName || "",
        website: data.website,
        title: data.title || "",
        created_by: user.id,
      }

      console.log("🔍 Debug: Contact data:", contactData)
      const contact = await contactQueries.createContact(contactData)
      console.log("✅ Debug: Contact created:", contact)

      // Parse deal value - remove currency symbols and convert to number
      const dealValue = data.value ? Number.parseFloat(data.value.replace(/[^0-9.]/g, "")) : null
      console.log("🔍 Debug: Parsed deal value:", dealValue)

      // Create ONLY ONE deal with the Lead stage
      const dealInsert: DealInsert = {
        tenant_id: tenantId,
        organization_id: organization?.id || null,
        stage_id: leadStage.id,
        primary_contact_id: contact.id,
        title: `${data.companyName || "New Deal"} - ${data.description || "Enterprise Solution"}`,
        description: data.description || `Deal for ${data.companyName || "prospect company"}`,
        value: dealValue,
        currency: "USD",
        probability: leadStage.probability_percentage || 10,
        expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
        industry: data.industry || null,
        pain_points: data.painPoints || null,
        next_steps: data.nextSteps || null,
        source: "AI Wizard",
        assigned_to: user.id,
        created_by: user.id,
      }

      console.log("🔍 Debug: Creating deal with data:", dealInsert)
      const newDeal = await dealQueries.createDeal(dealInsert)
      console.log("✅ Debug: Deal created successfully:", newDeal)

      const successMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: `🎉 Perfect! I've successfully created the new deal:

**Deal Created:**
• **ID:** ${newDeal.id}
• **Title:** ${newDeal.title}
• **Company:** ${data.companyName}
• **Contact:** ${data.contactName} (${data.email})
• **Value:** ${data.value}
• **Stage:** ${leadStage.name}

The deal has been added to your pipeline under the "${leadStage.name}" column. You can now close this wizard and see it in your DealFlow dashboard.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, successMessage])
      setCurrentStep(6)

      // Call the callback to refresh the deals list
      console.log("🔄 Debug: Calling onDealCreated callback...")
      if (onDealCreated) {
        onDealCreated()
      }
    } catch (error: any) {
      console.error("❌ Debug: Error creating deal:", error)
      console.error("❌ Debug: Error stack:", error.stack)

      // Provide more specific error messages
      let errorMessage = "I encountered an error while creating the deal:\n\n"

      if (error.message?.includes("uuid")) {
        errorMessage += "• UUID/ID format error - there may be a configuration issue with your account."
      } else if (error.message?.includes("foreign key")) {
        errorMessage += "• Database relationship error - some required data may be missing."
      } else if (error.message?.includes("permission") || error.message?.includes("RLS")) {
        errorMessage += "• Permission denied - you may not have access to create deals."
      } else if (error.message?.includes("authenticated")) {
        errorMessage += "• Authentication error - please sign in again."
      } else if (error.message?.includes("stages")) {
        errorMessage += "• Deal stages not configured - please contact your administrator."
      } else {
        errorMessage += `• ${error.message}`
      }

      errorMessage +=
        "\n\nPlease check the console for detailed error information, or contact support if the issue persists."

      const errorMsg: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: errorMessage,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsCreating(false)
      setIsProcessing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[80vh] bg-gray-900 border-gray-700 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-700">
          <CardTitle className="text-white text-xl">Create New Deal</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === "bot" ? "bg-purple-600" : "bg-blue-600"
                  }`}
                >
                  {message.type === "bot" ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "bot" ? "bg-gray-800 text-gray-100" : "bg-blue-600 text-white"
                  }`}
                >
                  <div className="whitespace-pre-line text-sm">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
            {(isProcessing || isCreating) && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-800 text-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm">{isCreating ? "Creating deal..." : "AI is thinking..."}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response..."
                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                disabled={isProcessing || isCreating || currentStep === 6}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isProcessing || isCreating || currentStep === 6}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex-shrink-0 px-4 py-3 border-t border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-gray-400">{Math.min(currentStep + 1, 6)}/6</span>
            </div>
            <div className="flex gap-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    index <= currentStep ? "bg-purple-600" : "bg-gray-700"
                  }`}
                  title={step}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
