"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Send,
  Bot,
  User,
  Calendar,
  Clock,
  Mail,
  Phone,
  Zap,
  Mic,
  ExternalLink,
  ChevronDown,
  FileText,
} from "lucide-react"

import { NewActivityModal } from "./new-activity-modal"
import { NewMeetingModal } from "./new-meeting-modal"

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
}

interface DealDetailPopupProps {
  deal: any
  onClose: () => void
}

export function DealDetailPopup({ deal, onClose }: DealDetailPopupProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: `Ready to help with TechCorp Inc.. What would you like to do?`,
      timestamp: new Date(),
    },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<"next-steps" | "draft-email" | "analysis">("next-steps")
  const [activeMeeting, setActiveMeeting] = useState<"jun8" | "jun3">("jun8")
  const [activeMeetingTab, setActiveMeetingTab] = useState<"summary" | "highlights" | "actions">("summary")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showMeetingModal, setShowMeetingModal] = useState(false)

  // Meeting content data
  const meetingData = {
    jun8: {
      date: "Jun 8, 2025 at 06:01 PM",
      summary: "Discussed product features and pricing. Client showed interest in AI capabilities.",
      highlights: [
        "Client interested in AI capabilities",
        "Budget discussion initiated",
        "Technical requirements clarified",
      ],
      actions: ["Send product documentation", "Schedule technical demo", "Prepare pricing proposal"],
    },
    jun3: {
      date: "Jun 3, 2025 at 06:01 PM",
      summary: "Initial discovery call. Identified key pain points and potential solutions.",
      highlights: [
        "Integration challenges identified",
        "Current process inefficiencies discussed",
        "Decision makers identified",
      ],
      actions: ["Follow up with technical specifications", "Prepare ROI analysis", "Connect with IT team"],
    },
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsProcessing(true)
    setCurrentInput("")

    // Simulate AI response
    setTimeout(() => {
      let botResponse = ""

      if (currentInput.toLowerCase().includes("next step")) {
        botResponse = `Based on the current stage of this deal, I recommend:\n\n1. Schedule a technical demo with their IT team\n2. Prepare a customized ROI analysis\n3. Connect with additional stakeholders (CFO, CTO)\n\nWould you like me to draft an email for any of these actions?`
      } else if (currentInput.toLowerCase().includes("email")) {
        botResponse = `Here's a draft email for following up:\n\nSubject: Next Steps for ${deal.company} Partnership\n\nHi [Contact Name],\n\nThank you for our productive conversation about [topic]. I believe our solution can address your challenges with [pain point].\n\nI'd like to schedule a technical demo with your team. Would any of these times work for you?\n- Thursday, June 13th at 2pm\n- Friday, June 14th at 10am\n\nLooking forward to your response.\n\nBest regards,\n[Your Name]`
      } else if (currentInput.toLowerCase().includes("analysis")) {
        botResponse = `Deal Analysis:\n\n• Probability: 65% chance of closing\n• Timeline: Likely to close within 45 days\n• Risk factors: Budget approval process, competing solution\n• Opportunity: Expansion potential to other departments\n\nRecommendation: Focus on ROI metrics and executive buy-in to accelerate the decision process.`
      } else {
        botResponse = `I understand you're asking about "${currentInput}". Based on the deal information, I can help with:\n\n• Creating follow-up strategies\n• Analyzing deal progress\n• Drafting communication\n• Identifying potential roadblocks\n\nWhat specific aspect would you like me to focus on?`
      }

      const botMessage: Message = {
        id: (Date.now() + 100).toString(),
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsProcessing(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTabClick = (tab: "next-steps" | "draft-email" | "analysis") => {
    setActiveTab(tab)

    // Add a bot message based on the selected tab
    let botResponse = ""

    if (tab === "next-steps") {
      botResponse = `Here are the recommended next steps for ${deal.company}:\n\n1. Schedule a technical demo with their IT team\n2. Prepare a customized ROI analysis\n3. Connect with additional stakeholders (CFO, CTO)\n\nWould you like me to help you with any of these actions?`
    } else if (tab === "draft-email") {
      botResponse = `I can help you draft various types of emails for this deal:\n\n• Follow-up email\n• Meeting request\n• Proposal introduction\n• Technical information\n\nWhat type of email would you like me to draft?`
    } else if (tab === "analysis") {
      botResponse = `Deal Analysis for ${deal.company}:\n\n• Current stage: ${deal.stage}\n• Probability: 65% chance of closing\n• Timeline: Likely to close within 45 days\n• Risk factors: Budget approval process, competing solution\n• Opportunity: Expansion potential to other departments\n\nWould you like more detailed analysis on any specific aspect?`
    }

    const botMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: botResponse,
      timestamp: new Date(),
    }

    setMessages([
      {
        id: "1",
        type: "bot",
        content: `Ready to help with TechCorp Inc.. What would you like to do?`,
        timestamp: new Date(),
      },
      botMessage,
    ])
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[85vh] bg-gray-900 border border-gray-700 rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">TechCorp Inc.</h2>
            <Badge className="bg-gray-700 text-white text-sm">Interested</Badge>
            <span className="text-green-400 font-medium text-sm">${deal.value || "45,000"}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Deal Info */}
        <div className="flex items-center gap-4 px-3 py-2 border-b border-gray-700 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Close: 30/6/2023</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Created: 2d ago</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Software Solutions</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Section */}
          <div className="w-1/2 border-r border-gray-700 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Next Steps Section */}
              <div className="border border-green-500/30 bg-green-500/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-green-400" />
                  <h3 className="text-sm font-medium text-green-400">NEXT STEPS</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-green-400 flex-shrink-0 mt-1"></div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">Schedule technical demo</p>
                      <Button variant="link" className="text-green-400 p-0 h-auto flex items-center mt-1 text-xs">
                        <span className="mr-1">→</span>
                        Execute with AI
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-green-400 flex-shrink-0 mt-1"></div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">Prepare ROI analysis</p>
                      <Button variant="link" className="text-green-400 p-0 h-auto flex items-center mt-1 text-xs">
                        <span className="mr-1">→</span>
                        Execute with AI
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-green-400 flex-shrink-0 mt-1"></div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">Connect with IT decision maker</p>
                      <Button variant="link" className="text-green-400 p-0 h-auto flex items-center mt-1 text-xs">
                        <span className="mr-1">→</span>
                        Execute with AI
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pain Points Section */}
              <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded-full border-2 border-red-400 flex items-center justify-center">
                    <span className="text-red-400 text-xs">!</span>
                  </div>
                  <h3 className="text-sm font-medium text-red-400">PAIN POINTS TO ADDRESS</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 text-sm">•</span>
                    <p className="text-white text-sm">Current software lacks integration capabilities</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-red-400 text-sm">•</span>
                    <p className="text-white text-sm">Manual processes causing delays</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-red-400 text-sm">•</span>
                    <p className="text-white text-sm">Limited reporting functionality</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-black text-white border-gray-700 hover:bg-gray-800 text-xs px-3 py-2"
                  onClick={() => setShowActivityModal(true)}
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  className="bg-black text-white border-gray-700 hover:bg-gray-800 text-xs px-3 py-2"
                  onClick={() => setShowActivityModal(true)}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  className="bg-black text-white border-gray-700 hover:bg-gray-800 text-xs px-3 py-2"
                  onClick={() => setShowMeetingModal(true)}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  Meeting
                </Button>
              </div>

              {/* Primary Contact Section */}
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-400">PRIMARY CONTACT</h3>
                  <Button variant="link" className="text-gray-400 p-0 h-auto text-xs">
                    View All
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-sm">
                    JO
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">John Smith</p>
                    <p className="text-gray-400 text-xs">john@techcorp.com</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                      <Mail className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                      <Phone className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Meeting Insights Section */}
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-medium text-white">Meeting Insights</h3>
                  </div>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                    2 meetings
                  </Badge>
                </div>

                <p className="text-gray-400 mb-3 text-xs">AI-powered summaries from MeetGeek</p>

                {/* Meeting Tabs */}
                <div className="flex border-b border-gray-700 mb-3">
                  <Button
                    variant="ghost"
                    className={`flex-1 rounded-none py-2 text-xs ${
                      activeMeeting === "jun8" ? "text-white border-b-2 border-purple-500" : "text-gray-400"
                    }`}
                    onClick={() => setActiveMeeting("jun8")}
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Jun 8, 2025
                  </Button>
                  <Button
                    variant="ghost"
                    className={`flex-1 rounded-none py-2 text-xs ${
                      activeMeeting === "jun3" ? "text-white border-b-2 border-purple-500" : "text-gray-400"
                    }`}
                    onClick={() => setActiveMeeting("jun3")}
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Jun 3, 2025
                  </Button>
                </div>

                {/* Meeting Content Tabs */}
                <div className="flex gap-2 mb-3">
                  <Button
                    variant="ghost"
                    className={`flex-1 text-xs ${
                      activeMeetingTab === "summary"
                        ? "text-white border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveMeetingTab("summary")}
                  >
                    Summary
                  </Button>
                  <Button
                    variant="ghost"
                    className={`flex-1 text-xs ${
                      activeMeetingTab === "highlights"
                        ? "text-white border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveMeetingTab("highlights")}
                  >
                    Highlights
                  </Button>
                  <Button
                    variant="ghost"
                    className={`flex-1 text-xs ${
                      activeMeetingTab === "actions"
                        ? "text-white border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveMeetingTab("actions")}
                  >
                    Actions
                  </Button>
                </div>

                {/* Meeting Content */}
                <div className="bg-gray-800/50 p-3 rounded-md">
                  {activeMeetingTab === "summary" && (
                    <p className="text-gray-300 text-xs">{meetingData[activeMeeting].summary}</p>
                  )}
                  {activeMeetingTab === "highlights" && (
                    <div className="space-y-1">
                      {meetingData[activeMeeting].highlights.map((highlight, index) => (
                        <p key={index} className="text-gray-300 text-xs">
                          • {highlight}
                        </p>
                      ))}
                    </div>
                  )}
                  {activeMeetingTab === "actions" && (
                    <div className="space-y-1">
                      {meetingData[activeMeeting].actions.map((action, index) => (
                        <p key={index} className="text-gray-300 text-xs">
                          • {action}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* View Full Transcript Button */}
                <Button
                  variant="outline"
                  className="w-full bg-black text-white border-gray-700 hover:bg-gray-800 mt-3 text-xs py-2"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  View Full Transcript
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>

              {/* Recent Activity Section */}
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-400">RECENT ACTIVITY</h3>
                  <Button variant="link" className="text-gray-400 p-0 h-auto text-xs">
                    View All
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-3 h-3 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-white text-sm">Initial discovery call</p>
                      <p className="text-gray-400 text-xs">15/5/2023</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-3 h-3 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-white text-sm">Sent follow-up materials</p>
                      <p className="text-gray-400 text-xs">16/5/2023</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Timeline Section */}
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-white">Meeting Timeline</h3>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Mic className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">Initial Discovery Call</p>
                      <div className="flex items-center text-gray-400 text-xs mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>10/5/2023</span>
                        <Clock className="w-3 h-3 ml-2 mr-1" />
                        <span>45 min</span>
                      </div>
                      <p className="text-gray-300 mt-2 text-xs">
                        Discussed current pain points and potential solutions. Client expressed interest in our
                        enterprise package.
                      </p>

                      <div className="mt-2">
                        <p className="text-green-400 font-medium text-xs">Action Items:</p>
                        <ul className="mt-1 space-y-1">
                          <li className="flex items-start gap-1 text-gray-300 text-xs">
                            <span className="text-green-400">•</span>
                            <span>Send product documentation</span>
                          </li>
                          <li className="flex items-start gap-1 text-gray-300 text-xs">
                            <span className="text-green-400">•</span>
                            <span>Schedule technical demo</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - AI Assistant */}
          <div className="w-1/2 flex flex-col">
            {/* AI Assistant Header */}
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-sm font-medium text-white">AI Assistant</h3>
              </div>
            </div>

            {/* AI Assistant Chat */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${message.type === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === "bot" ? "bg-purple-600" : "bg-blue-600"
                      }`}
                    >
                      {message.type === "bot" ? (
                        <Bot className="w-3 h-3 text-white" />
                      ) : (
                        <User className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-lg p-2 ${
                        message.type === "bot" ? "bg-gray-800 text-gray-100" : "bg-blue-600 text-white"
                      }`}
                    >
                      <div className="whitespace-pre-line text-xs">{message.content}</div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-800 text-gray-100 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-700 p-2 flex gap-1">
                <Button
                  variant="outline"
                  className={`flex-1 text-xs ${activeTab === "next-steps" ? "bg-gray-800 text-white" : "bg-black text-gray-400"} border-gray-700 hover:bg-gray-800 hover:text-white py-1`}
                  onClick={() => handleTabClick("next-steps")}
                >
                  Next Steps
                </Button>
                <Button
                  variant="outline"
                  className={`flex-1 text-xs ${activeTab === "draft-email" ? "bg-gray-800 text-white" : "bg-black text-gray-400"} border-gray-700 hover:bg-gray-800 hover:text-white py-1`}
                  onClick={() => handleTabClick("draft-email")}
                >
                  Draft Email
                </Button>
                <Button
                  variant="outline"
                  className={`flex-1 text-xs ${activeTab === "analysis" ? "bg-gray-800 text-white" : "bg-black text-gray-400"} border-gray-700 hover:bg-gray-800 hover:text-white py-1`}
                  onClick={() => handleTabClick("analysis")}
                >
                  Analysis
                </Button>
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-gray-700">
                <div className="flex gap-2">
                  <Input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask AI to help execute next steps..."
                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 text-xs"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentInput.trim() || isProcessing}
                    className="bg-purple-600 hover:bg-purple-700 px-3"
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Modal */}
      {showActivityModal && (
        <NewActivityModal
          dealId={deal.id}
          contactId={deal.primary_contact?.id}
          onClose={() => setShowActivityModal(false)}
          onActivityCreated={() => {
            // Refresh deal data or show success message
            console.log("Activity created successfully")
          }}
        />
      )}

      {/* Meeting Modal */}
      {showMeetingModal && (
        <NewMeetingModal
          dealId={deal.id}
          onClose={() => setShowMeetingModal(false)}
          onMeetingCreated={() => {
            // Refresh deal data or show success message
            console.log("Meeting scheduled successfully")
          }}
        />
      )}
    </div>
  )
}
