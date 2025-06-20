"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      if (!supabaseConfigured) {
        setCheckingSession(false);
        return;
      }

      try {
        const supabase = await getSupabaseClient();
        if (!supabase) {
          setCheckingSession(false);
          return;
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session check error:", error);
        }

        if (session) {
          console.log("✅ User already logged in, redirecting to dealflow");
          router.push("/dealflow");
          return;
        }

        console.log("ℹ️ No existing session found");
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  // Show configuration message if Supabase is not configured
  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Setup Required</h1>
            <p className="text-gray-600">Supabase configuration is missing</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="font-medium mb-2 text-blue-800">Development Mode</p>
            <p className="text-sm mb-2 text-blue-700">
              To enable authentication, please:
            </p>
            <ol className="text-sm list-decimal list-inside space-y-1 text-blue-700">
              <li>Create a Supabase project</li>
              <li>Add your environment variables to .env.local:</li>
            </ol>
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
              NEXT_PUBLIC_SUPABASE_URL=your_project_url
              <br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("🔄 Starting sign in process...");

    try {
      const supabase = await getSupabaseClient();

      if (!supabase) {
        setError(
          "Authentication service is not available. Please check your configuration."
        );
        return;
      }

      console.log("🔄 Attempting to sign in with email:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Sign in error:", error);
        setError(error.message);
        return;
      }

      if (data.user && data.session) {
        console.log("✅ Sign in successful!");
        console.log("👤 User:", data.user.id);
        console.log(
          "🎫 Session:",
          data.session.access_token ? "Valid" : "Invalid"
        );

        // Wait a moment for the session to be properly set
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Force redirect to dealflow dashboard
        console.log("🔄 Redirecting to dealflow...");
        window.location.href = "/dealflow";
      } else {
        console.log("⚠️ Sign in returned no user or session");
        setError("Sign in failed - no session created");
      }
    } catch (err) {
      console.error("❌ Unexpected sign in error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createDemoUser = async () => {
    setLoading(true);
    setError("");

    console.log("🔄 Creating demo user...");

    try {
      const supabase = await getSupabaseClient();

      if (!supabase) {
        setError("Authentication service is not available.");
        return;
      }

      const demoEmail = "demo@vellora.ai";
      const demoPassword = "demo123456";

      // Try to sign up the demo user
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
        });

      if (signUpError && !signUpError.message.includes("already registered")) {
        console.error("❌ Demo user creation error:", signUpError);
        setError(`Demo user creation failed: ${signUpError.message}`);
        return;
      }

      console.log("✅ Demo user created or already exists");

      // Now try to sign in with the demo user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (error) {
        console.error("❌ Demo sign in error:", error);
        setError(`Demo sign in failed: ${error.message}`);
        return;
      }

      if (data.user && data.session) {
        console.log("✅ Demo sign in successful!");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        window.location.href = "/dealflow";
      }
    } catch (err) {
      console.error("❌ Demo user creation error:", err);
      setError("Failed to create demo user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Vellora AI account</p>
        </div>

        {/* <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="font-medium mb-2 text-gray-800">Demo Credentials</p>
          <div className="text-sm space-y-1 text-gray-600">
            <p>
              <strong>Email:</strong> demo@vellora.ai
            </p>
            <p>
              <strong>Password:</strong> demo123456
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">Use these credentials or click "Create Demo Account" below</p>
        </div> */}

        <form onSubmit={handleSignIn} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm font-medium mb-2">
                Sign In Failed
              </p>
              <p className="text-red-600 text-sm">{error}</p>
              {error.includes("Invalid login credentials") && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-blue-700 text-sm font-medium">
                    Need an account?
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    Try creating a demo account or sign up for a new account.
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={createDemoUser}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating Demo User..."
                : // : "🚀 Create & Sign In with Demo Account"}
                  "🚀 Sign In"}
            </button>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  or sign in with your account
                </span>
              </div>
            </div> */}

            {/* <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button> */}
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>

        {/* Debug info */}
        {/* <div className="mt-4 text-center space-y-2">
          <Link
            href="/dealflow"
            className="block text-sm text-blue-500 hover:text-blue-700"
          >
            🔧 Go directly to Dealflow (bypass auth)
          </Link>
          <Link
            href="/test-supabase"
            className="block text-sm text-green-500 hover:text-green-700"
          >
            🧪 Test Supabase Connection
          </Link>
        </div> */}
      </div>
    </div>
  );
}
