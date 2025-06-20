"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  transformDeals,
  insertTransformedData,
  TransformResult,
} from "@/lib/utils/dataTransform";
import DataImportDialog from "@/components/data-import-dialog";

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [transformedData, setTransformedData] = useState<TransformResult>({
    contacts: [],
    deals: [],
  });
  const [supabase, setSupabase] = useState<any>(null);

  // Initialize Supabase
  useEffect(() => {
    const initSupabase = async () => {
      const client = await getSupabaseClient();
      setSupabase(client);
    };
    initSupabase();
  }, []);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get platform from URL params first, then fallback to localStorage
        let platform = searchParams.get("platform");

        if (!platform) {
          // Fallback to localStorage if platform not in URL
          platform = localStorage.getItem("oauth_platform");
          console.log("Platform from localStorage:", platform);
        }

        if (!platform) {
          // Try to determine platform from the URL or other indicators
          const currentUrl = window.location.href;
          if (currentUrl.includes("pipedrive")) {
            platform = "pipedrive";
          } else if (currentUrl.includes("zoho")) {
            platform = "zoho";
          } else if (currentUrl.includes("hubspot")) {
            platform = "hubspot";
          }
        }

        console.log("Determined platform:", platform);

        if (!platform) {
          throw new Error(
            "Unable to determine the platform. Please try connecting again."
          );
        }

        const code = searchParams.get("code");
        const connected = searchParams.get("connected");
        const userId = searchParams.get("user_id");

        if (connected === "true") {
          // User is already connected, fetch existing data
          console.log(`Fetching existing ${platform} data...`);
          // You can implement fetching existing data from Supabase here
          setLoading(false);
          return;
        }

        if (!code) {
          throw new Error(
            "Authorization code is missing. Please try connecting again."
          );
        }

        // Call N8N flow API to get data - Updated to use generic endpoint
        console.log(`Calling N8N flow for ${platform}...`);
        const n8nResponse = await fetch("/api/n8n/crm-flow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            platform,
            code,
          }),
        });

        if (!n8nResponse.ok) {
          const errorText = await n8nResponse.text();
          console.error("N8N API error:", errorText);
          throw new Error(
            `Failed to fetch data from ${platform}: ${n8nResponse.statusText}`
          );
        }

        const apiData = await n8nResponse.json();
        console.log("N8N API Response:", apiData);

        if (
          !apiData.data ||
          (Array.isArray(apiData.data) && apiData.data.length === 0)
        ) {
          console.log("No data received from N8N");
          setTransformedData({ contacts: [], deals: [] });
          setShowImportDialog(true);
          setLoading(false);
          return;
        }

        // Transform the data
        console.log("Transforming data...");
        const transformed = transformDeals(apiData.data || [], platform);
        setTransformedData(transformed);

        console.log(
          `Transformed ${transformed.deals.length} deals and ${transformed.contacts.length} contacts`
        );

        // Show import dialog
        setShowImportDialog(true);
        setLoading(false);
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred during authentication"
        );
        setLoading(false);
      }
    };

    if (searchParams && supabase) {
      handleCallback();
    }
  }, [searchParams, supabase]);

  const handleImport = async (selectedDeals: any[]) => {
    try {
      setLoading(true);

      // Get contact IDs from selected deals
      const selectedContactIds = new Set(
        selectedDeals.map((deal) => deal.primary_contact_id).filter((id) => id)
      );

      // Filter contacts to only include those needed for selected deals
      const filteredContacts = transformedData.contacts.filter((contact) =>
        selectedContactIds.has(contact.id)
      );

      console.log(
        `Importing ${selectedDeals.length} deals and ${filteredContacts.length} contacts...`
      );

      // Insert data into Supabase
      await insertTransformedData(
        { contacts: filteredContacts, deals: selectedDeals },
        supabase
      );

      console.log("✅ Import completed successfully!");

      // Get platform and user info
      let platform = searchParams.get("platform");
      if (!platform) {
        platform = localStorage.getItem("oauth_platform");
      }

      console.log(`Platform: ${platform}`);
      const userId = searchParams.get("user_id");

      if (platform) {
        // Update tenant table to mark platform as connected
        const tenantId =
          selectedDeals[0]?.organization_id ||
          "00000000-0000-0000-0000-000000000002"; // fallback to demo org
        console.log(`Tenant ID: ${tenantId}`);

        // Use the correct platform name for the field
        const tenantUpdateField = `connected_${platform.toLowerCase()}`;

        const { error: tenantError } = await supabase
          .from("tenants")
          .update({ [tenantUpdateField]: true })
          .eq("id", tenantId);

        if (tenantError) {
          console.error("❌ Failed to update tenant:", tenantError);
          // Don't throw error here, just log it since the main import was successful
        } else {
          console.log(
            `✅ Updated tenant: ${tenantUpdateField} = true for tenant ${tenantId}`
          );
        }
      }

      // Clean up localStorage
      localStorage.removeItem("oauth_platform");
      localStorage.removeItem(`${platform}_oauth_state`);

      // Redirect to dashboard or success page
      router.push("/dealflow?import=success");
    } catch (err) {
      console.error("Import error:", err);
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold mb-2">
            Processing Your Data
          </h2>
          <p className="text-gray-400">
            Please wait while we fetch and prepare your data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">
            Connection Failed
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                // Clean up and try again
                localStorage.removeItem("oauth_platform");
                router.push("/integrations");
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/integrations")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Integration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">
            Data Ready for Import
          </h2>
          <p className="text-gray-400">
            {transformedData.deals.length === 0
              ? "No deals found to import, but the connection was successful."
              : "Review and select the data you want to import."}
          </p>
        </div>
      </div>

      {showImportDialog && (
        <DataImportDialog
          deals={transformedData.deals}
          isOpen={showImportDialog}
          onClose={() => setShowImportDialog(false)}
          onImport={handleImport}
        />
      )}
    </>
  );
}
