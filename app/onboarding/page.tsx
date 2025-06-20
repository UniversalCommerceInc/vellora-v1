"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseClient } from "@/lib/supabase/client"
import { supabaseConfigured } from "@/lib/supabase/config"

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)

  const [organizationData, setOrganizationData] = useState({
    name: "",
    description: "",
    website: "",
    industry: "",
    size: "",
  })

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "welcome",
      title: "Welcome to Vellora AI",
      description: "Let's get you set up with your organization",
      completed: false,
    },
    {
      id: "organization",
      title: "Organization Setup",
      description: "Tell us about your organization",
      completed: false,
    },
    {
      id: "complete",
      title: "Setup Complete",
      description: "You're ready to start using Vellora AI",
      completed: false,
    },
  ])

  useEffect(() => {
    async function loadUser() {
      try {
        if (!supabaseConfigured) {
          setError("Supabase is not configured. Please set up your environment variables.")
          setIsLoading(false)
          return
        }

        const supabase = await getSupabaseClient()
        if (!supabase) {
          setError("Unable to connect to authentication service.")
          setIsLoading(false)
          return
        }

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          console.error("Auth error:", authError)
          router.push("/auth/signin")
          return
        }

        if (!user) {
          router.push("/auth/signin")
          return
        }

        setUser(user)

        // Pre-fill organization name from signup metadata
        if (user.user_metadata?.organization_name) {
          setOrganizationData((prev) => ({
            ...prev,
            name: user.user_metadata.organization_name,
          }))
        }
      } catch (error: any) {
        console.error("Error loading user:", error)
        setError("Failed to load user information.")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [router])

  const handleNext = async () => {
    if (currentStep === 0) {
      // Welcome step - just move to next
      setCurrentStep(1)
      setSteps((prev) => prev.map((step, index) => (index === 0 ? { ...step, completed: true } : step)))
    } else if (currentStep === 1) {
      // Organization setup step
      await handleOrganizationSetup()
    }
  }

  const handleOrganizationSetup = async () => {
    setIsLoading(true)
    setError("")

    try {
      if (!user) throw new Error("User not found")

      // For now, just simulate the setup process
      // In a real implementation, you would create the tenant, organization, etc.
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mark step as completed
      setSteps((prev) => prev.map((step, index) => (index === 1 ? { ...step, completed: true } : step)))
      setCurrentStep(2)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = () => {
    router.push("/config")
  }

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full flex items-center justify-center">
        <div className="text-white text-2xl">🏢</div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Vellora AI!</h2>
        <p className="text-gray-400">
          We're excited to help you streamline your sales process with AI-powered insights and automation.
        </p>
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-medium mb-2">What you'll get:</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• AI-powered deal insights and recommendations</li>
          <li>• Automated meeting summaries and action items</li>
          <li>• Advanced pipeline management and analytics</li>
          <li>• Team collaboration and role management</li>
        </ul>
      </div>
    </div>
  )

  const renderOrganizationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full flex items-center justify-center mb-4">
          <div className="text-white text-2xl">👥</div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Organization Setup</h2>
        <p className="text-gray-400">Tell us about your organization to customize your experience</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="orgName" className="block text-sm font-medium text-gray-300 mb-2">
            Organization Name *
          </label>
          <Input
            id="orgName"
            value={organizationData.name}
            onChange={(e) => setOrganizationData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Acme Corporation"
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="orgDescription" className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <Input
            id="orgDescription"
            value={organizationData.description}
            onChange={(e) => setOrganizationData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of your organization"
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        <div>
          <label htmlFor="orgWebsite" className="block text-sm font-medium text-gray-300 mb-2">
            Website
          </label>
          <Input
            id="orgWebsite"
            value={organizationData.website}
            onChange={(e) => setOrganizationData((prev) => ({ ...prev, website: e.target.value }))}
            placeholder="https://acme.com"
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="orgIndustry" className="block text-sm font-medium text-gray-300 mb-2">
              Industry
            </label>
            <Input
              id="orgIndustry"
              value={organizationData.industry}
              onChange={(e) => setOrganizationData((prev) => ({ ...prev, industry: e.target.value }))}
              placeholder="Technology"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div>
            <label htmlFor="orgSize" className="block text-sm font-medium text-gray-300 mb-2">
              Company Size
            </label>
            <select
              id="orgSize"
              value={organizationData.size}
              onChange={(e) => setOrganizationData((prev) => ({ ...prev, size: e.target.value }))}
              className="w-full h-10 px-3 bg-gray-800 border border-gray-600 rounded-md text-white"
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-1000">201-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center">
        <div className="text-white text-2xl">✅</div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Setup Complete!</h2>
        <p className="text-gray-400">Your organization has been created and you're ready to start using Vellora AI.</p>
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-medium mb-2">Next steps:</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Set up your database schema</li>
          <li>• Create tenants and organizations</li>
          <li>• Add team members and assign roles</li>
          <li>• Start managing your deals and contacts</li>
        </ul>
      </div>
    </div>
  )

  // Show configuration error if Supabase is not configured
  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-700">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-6xl">⚙️</div>
            <h2 className="text-2xl font-bold text-white">Configuration Required</h2>
            <p className="text-gray-400">
              Supabase is not configured. Please set up your environment variables to continue.
            </p>
            <Button onClick={() => router.push("/")} className="bg-purple-600 hover:bg-purple-700">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-700">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-6xl">❌</div>
            <h2 className="text-2xl font-bold text-white">Error</h2>
            <p className="text-gray-400">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => router.push("/auth/signin")} className="w-full bg-purple-600 hover:bg-purple-700">
                Sign In
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? (step.completed ? "bg-green-500" : "bg-purple-500") : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 0 && renderWelcomeStep()}
          {currentStep === 1 && renderOrganizationStep()}
          {currentStep === 2 && renderCompleteStep()}

          <div className="flex justify-between pt-6">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || isLoading}
              className="px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <span className="mr-2">←</span>
              Back
            </button>

            {currentStep < 2 ? (
              <button
                onClick={handleNext}
                disabled={isLoading || (currentStep === 1 && !organizationData.name)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? "Setting up..." : "Continue"}
                <span className="ml-2">→</span>
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center"
              >
                Get Started
                <span className="ml-2">→</span>
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
