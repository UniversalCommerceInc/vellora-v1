// "use client"

// import { useState } from "react"
// import Link from "next/link"

// export function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)

//   return (
//     <header className="bg-black/20 border-b border-white/10 p-4">
//       <div className="max-w-6xl mx-auto flex items-center justify-between">
//         {/* Logo */}
//         <Link href="/" className="flex items-center">
//           <span className="text-white font-bold text-xl">VELLORA.AI</span>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex items-center space-x-6">
//           <Link href="/" className="text-gray-300 hover:text-white transition-colors">
//             Home
//           </Link>
//           <Link href="/dealflow" className="text-gray-300 hover:text-white transition-colors">
//             Deal Flow
//           </Link>
//           <Link href="/contacts" className="text-gray-300 hover:text-white transition-colors">
//             Contacts
//           </Link>
//           <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">
//             Analytics
//           </Link>
//           <Link href="/config" className="text-gray-300 hover:text-white transition-colors">
//             Config
//           </Link>
//           <Link href="/settings" className="text-gray-300 hover:text-white transition-colors">
//             Settings
//           </Link>
//         </nav>

//         {/* Desktop Auth Buttons */}
//         <div className="hidden md:flex items-center space-x-4">
//           <Link href="/auth/signin">
//             <button className="text-white hover:bg-white/10 px-4 py-2 rounded transition-colors">Sign In</button>
//           </Link>
//           <Link href="/auth/signup">
//             <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
//               Get Started
//             </button>
//           </Link>
//         </div>

//         {/* Mobile Menu Button */}
//         <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white p-2">
//           {isMenuOpen ? "✕" : "☰"}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-black/90 border-t border-white/10 mt-4">
//           <nav className="flex flex-col space-y-4 p-4">
//             <Link
//               href="/"
//               className="text-gray-300 hover:text-white transition-colors py-2"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Home
//             </Link>
//             <Link
//               href="/dealflow"
//               className="text-gray-300 hover:text-white transition-colors py-2"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Deal Flow
//             </Link>
//             <Link
//               href="/contacts"
//               className="text-gray-300 hover:text-white transition-colors py-2"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Contacts
//             </Link>
//             <Link
//               href="/analytics"
//               className="text-gray-300 hover:text-white transition-colors py-2"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Analytics
//             </Link>
//             <Link
//               href="/config"
//               className="text-gray-300 hover:text-white transition-colors py-2"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Config
//             </Link>
//             <Link
//               href="/settings"
//               className="text-gray-300 hover:text-white transition-colors py-2"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Settings
//             </Link>
//             <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
//               <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
//                 <button className="w-full text-left text-white hover:bg-white/10 px-4 py-2 rounded transition-colors">
//                   Sign In
//                 </button>
//               </Link>
//               <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
//                 <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
//                   Get Started
//                 </button>
//               </Link>
//             </div>
//           </nav>
//         </div>
//       )}
//     </header>
//   )
// }

// ----------------------------------------------------------------------------

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseClient } from "@/lib/supabase/client";
import type {
  User as SupabaseUser,
  Session,
  AuthChangeEvent,
} from "@supabase/supabase-js";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      if (!supabaseConfigured) {
        setLoading(false);
        return;
      }

      const supabase = await getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user || null);
      setLoading(false);

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        (_event: AuthChangeEvent, session: Session | null) => {
          setUser(session?.user || null);
        }
      );

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Auth check error:", error);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
        router.push("/");
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const getUserDisplayName = (): string => {
    if (!user) return "";

    // Try to get full name from user metadata
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (fullName) return fullName;

    // Try to get first name
    const firstName = user.user_metadata?.first_name;
    if (firstName) return firstName;

    // Fall back to email username
    return user.email?.split("@")[0] || "User";
  };

  const getUserInitials = (): string => {
    const name = getUserDisplayName();
    return name
      .split(" ")
      .map((word: string) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-black/20 border-b border-white/10 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-white font-bold text-xl">VELLORA.AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/dealflow"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Deal Flow
          </Link>
          <Link
            href="/contacts"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contacts
          </Link>
          <Link
            href="/analytics"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Analytics
          </Link>
          <Link
            href="/settings"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Settings
          </Link>
          <Link
            href="/integrations"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Integrations
          </Link>
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {loading ? (
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-800/30 px-3 py-2 rounded-lg">
                <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {getUserInitials()}
                  </span>
                </div>
                <span className="text-gray-300 text-sm">
                  Welcome,{" "}
                  <span className="text-white">{getUserDisplayName()}</span>
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white bg-gray-800/30 hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500 px-3 py-2 rounded-lg transition-colors text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/signin">
                <button className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-2"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 border-t border-white/10 mt-4">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dealflow"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Deal Flow
            </Link>
            <Link
              href="/contacts"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacts
            </Link>
            <Link
              href="/analytics"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Analytics
            </Link>
            <Link
              href="/settings"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
            <Link
              href="/integrations"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Integrations
            </Link>

            <div className="border-t border-white/10 pt-4">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-gray-800/30 px-4 py-3 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {getUserInitials()}
                      </span>
                    </div>
                    <div>
                      <div className="text-gray-300 text-sm">
                        Welcome,{" "}
                        <span className="text-white">
                          {getUserDisplayName()}
                        </span>
                      </div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-gray-400 hover:text-white bg-gray-800/30 hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500 px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <button className="w-full text-left text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
                      Sign In
                    </button>
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
