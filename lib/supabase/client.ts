import { supabaseConfig, supabaseConfigured } from "./config"

// Initialize supabase client
let supabase: any = null

// Function to create and return supabase client
export async function getSupabaseClient() {
  if (!supabaseConfigured) {
    console.log("⚠️ Supabase not configured - missing environment variables")
    return null
  }

  if (supabase) {
    return supabase
  }

  try {
    console.log("🔄 Creating Supabase client...")
    const { createClient } = await import("@supabase/supabase-js")

    supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })

    console.log("✅ Supabase client created successfully")
    return supabase
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error)
    return null
  }
}

// Export the client getter for backward compatibility
export { supabase }

// Initialize client immediately if configured
if (supabaseConfigured && typeof window !== "undefined") {
  getSupabaseClient().then((client) => {
    if (client) {
      console.log("🚀 Supabase client initialized on page load")
    }
  })
}
