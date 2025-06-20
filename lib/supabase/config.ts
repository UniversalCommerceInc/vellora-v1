// Supabase configuration
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
}

// Check if Supabase is properly configured
export const supabaseConfigured = !!(supabaseConfig.url && supabaseConfig.anonKey)

// Log configuration status
if (typeof window !== "undefined") {
  console.log("🔧 Supabase Configuration Check:")
  console.log("  URL:", supabaseConfig.url ? "✅ Set" : "❌ Missing")
  console.log("  Anon Key:", supabaseConfig.anonKey ? "✅ Set" : "❌ Missing")
  console.log("  Configured:", supabaseConfigured ? "✅ Yes" : "❌ No")

  if (!supabaseConfigured) {
    console.warn("⚠️ Supabase not configured. Please check your environment variables:")
    console.warn("  - NEXT_PUBLIC_SUPABASE_URL")
    console.warn("  - NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
}
