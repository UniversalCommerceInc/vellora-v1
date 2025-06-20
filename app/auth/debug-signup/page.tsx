"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DebugSignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  const testSignup = async () => {
    setLoading(true)
    setResult(null)

    try {
      const { getSupabaseClient } = await import("@/lib/supabase/client")
      const supabase = await getSupabaseClient()

      if (!supabase) {
        setResult({ error: "Supabase client not available" })
        return
      }

      console.log("Attempting signup with:", { email, password: "***" })

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: "Test User",
            organization_name: "Test Org",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      console.log("Signup response:", { data, error })

      setResult({
        data,
        error,
        user: data?.user,
        session: data?.session,
      })
    } catch (err) {
      console.error("Signup error:", err)
      setResult({ error: err })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Debug Signup Process</h1>
            <p className="text-gray-600">Test and debug the Supabase signup flow</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Test Form */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Test Signup</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="test@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="minimum 6 characters"
                  />
                </div>
                <button
                  onClick={testSignup}
                  disabled={loading || !email || !password}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? "Testing..." : "Test Signup"}
                </button>
              </div>
            </div>

            {/* Results */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Results</h2>
              {result && (
                <div className="space-y-4">
                  {result.error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-medium text-red-800 mb-2">Error</h3>
                      <pre className="text-sm text-red-700 whitespace-pre-wrap">
                        {JSON.stringify(result.error, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-medium text-green-800 mb-2">Success</h3>
                      <div className="text-sm text-green-700 space-y-2">
                        <p>
                          <strong>User Created:</strong> {result.user ? "✅ Yes" : "❌ No"}
                        </p>
                        <p>
                          <strong>User ID:</strong> {result.user?.id || "None"}
                        </p>
                        <p>
                          <strong>Email:</strong> {result.user?.email || "None"}
                        </p>
                        <p>
                          <strong>Email Confirmed:</strong> {result.user?.email_confirmed_at ? "✅ Yes" : "❌ No"}
                        </p>
                        <p>
                          <strong>Session:</strong> {result.session ? "✅ Yes" : "❌ No"}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-2">Full Response</h3>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-64">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div className="mt-8 border-t pt-8">
            <h2 className="text-lg font-semibold mb-4">Troubleshooting Guide</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Common Issues</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Email confirmation disabled in Supabase</li>
                  <li>• SMTP not configured</li>
                  <li>• Invalid redirect URLs</li>
                  <li>• Password too weak</li>
                  <li>• Email already exists</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Check Supabase Settings</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Authentication → Settings → Email confirmation</li>
                  <li>• Authentication → Settings → SMTP settings</li>
                  <li>• Authentication → URL Configuration</li>
                  <li>• Check Supabase logs for errors</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/auth/signup" className="text-purple-600 hover:text-purple-700">
              ← Back to Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
