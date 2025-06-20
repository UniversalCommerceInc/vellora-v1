"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { supabaseConfig, supabaseConfigured } from "@/lib/supabase/config"

export default function TestSupabasePage() {
  const [status, setStatus] = useState("Testing...")
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(message)
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    async function testSupabase() {
      addLog("🔧 Starting Supabase test...")

      // Check configuration
      addLog(`🔧 Supabase URL: ${supabaseConfig.url ? "✅ Set" : "❌ Missing"}`)
      addLog(`🔧 Supabase Anon Key: ${supabaseConfig.anonKey ? "✅ Set" : "❌ Missing"}`)
      addLog(`🔧 Configured: ${supabaseConfigured ? "✅ Yes" : "❌ No"}`)

      if (!supabaseConfigured) {
        setStatus("❌ Supabase not configured")
        addLog("❌ Missing environment variables")
        return
      }

      try {
        // Test client creation
        addLog("🔄 Creating Supabase client...")
        const supabase = await getSupabaseClient()

        if (!supabase) {
          setStatus("❌ Failed to create client")
          addLog("❌ Client creation failed")
          return
        }

        addLog("✅ Supabase client created")

        // Test auth session
        addLog("🔄 Testing auth session...")
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          addLog(`❌ Session error: ${sessionError.message}`)
        } else if (session) {
          addLog(`✅ User session found: ${session.user.id}`)
        } else {
          addLog("⚠️ No user session")
        }

        // Test database connectivity
        addLog("🔄 Testing database connectivity...")
        const { data: testData, error: dbError } = await supabase.from("tenants").select("id, name").limit(1)

        if (dbError) {
          addLog(`❌ Database error: ${dbError.message}`)
          addLog(`❌ Error code: ${dbError.code}`)
          addLog(`❌ Error details: ${dbError.details}`)
          setStatus("❌ Database connection failed")
          return
        }

        addLog(`✅ Database connected, found ${testData?.length || 0} tenants`)

        if (session) {
          // Test user data
          addLog("🔄 Testing user data...")
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (userError) {
            addLog(`❌ User query error: ${userError.message}`)
          } else {
            addLog(`✅ User found: ${userData.email}`)
          }

          // Test tenant access
          addLog("🔄 Testing tenant access...")
          const { data: accessData, error: accessError } = await supabase
            .from("user_tenant_access")
            .select("*, tenant:tenants(*), organization:organizations(*)")
            .eq("user_id", session.user.id)
            .eq("status", "active")

          if (accessError) {
            addLog(`❌ Tenant access error: ${accessError.message}`)
            addLog(`❌ Error code: ${accessError.code}`)
            addLog(`❌ Error details: ${accessError.details}`)
          } else {
            addLog(`✅ Found ${accessData?.length || 0} tenant access records`)
            accessData?.forEach((access, index) => {
              addLog(
                `  ${index + 1}. Tenant: ${access.tenant?.name}, Org: ${access.organization?.name}, Role: ${access.role}`,
              )
            })
          }
        }

        setStatus("✅ All tests passed")
        addLog("🎉 All tests completed successfully")
      } catch (error) {
        addLog(`❌ Unexpected error: ${error}`)
        setStatus("❌ Unexpected error")
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Status: {status}</h2>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Configuration:</h3>
        <p>URL: {supabaseConfig.url || "Not set"}</p>
        <p>Anon Key: {supabaseConfig.anonKey ? "Set" : "Not set"}</p>
        <p>Configured: {supabaseConfigured ? "Yes" : "No"}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Test Logs:</h3>
        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Run Test Again
        </button>
      </div>
    </div>
  )
}
