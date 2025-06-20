// "use client";
// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import { useRouter } from "next/navigation";
// import { getSupabaseClient } from "@/lib/supabase/client";

// interface IntegrationCardProps {
//   showButtons?: boolean;
//   onConnect?: (platform: string) => void;
// }

// interface Tenant {
//   id: string;
//   name: string;
//   slug: string;
//   connected_pipedrive: boolean;
//   connected_zoho: boolean;
//   connected_hubspot: boolean;
// }

// const IntegrationCard: React.FC<IntegrationCardProps> = ({
//   showButtons = false,
//   onConnect,
// }) => {
//   const [tenant, setTenant] = useState<Tenant | null>(null);
//   const [currentUser, setCurrentUser] = useState<any>(null);
//   const [isConnecting, setIsConnecting] = useState<{ [key: string]: boolean }>(
//     {}
//   );
//   const [isDisconnecting, setIsDisconnecting] = useState<{
//     [key: string]: boolean;
//   }>({});
//   const [isSyncing, setIsSyncing] = useState<{ [key: string]: boolean }>({});
//   const [supabase, setSupabase] = useState<any>(null);
//   const router = useRouter();

//   // Initialize Supabase client
//   useEffect(() => {
//     const initSupabase = async () => {
//       const client = await getSupabaseClient();
//       setSupabase(client);
//     };
//     initSupabase();
//   }, []);

//   // Get current user and tenant
//   useEffect(() => {
//     if (!supabase) return;

//     const getCurrentUser = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       setCurrentUser(user);

//       if (user) {
//         await fetchTenant();
//       }
//     };
//     getCurrentUser();
//   }, [supabase]);

//   // Refresh tenant when component mounts or when coming back from OAuth
//   useEffect(() => {
//     if (currentUser && showButtons && supabase) {
//       fetchTenant();
//     }
//   }, [currentUser, showButtons, supabase]);

//   const fetchTenant = async () => {
//     if (!supabase) return;

//     try {
//       // For now, we'll use the demo organization tenant ID
//       // You might want to get this from user context or props
//       const tenantId = "00000000-0000-0000-0000-000000000002";

//       const { data: tenantData, error } = await supabase
//         .from("tenants")
//         .select("*")
//         .eq("id", tenantId)
//         .single();

//       if (error) {
//         console.error("Error fetching tenant:", error);
//       } else {
//         setTenant(tenantData);
//         console.log("Tenant data loaded:", tenantData);
//       }
//     } catch (error) {
//       console.error("Error in fetchTenant:", error);
//     }
//   };

//   const handlePipedriveConnect = async () => {
//     if (!currentUser) {
//       router.push("/login");
//       return;
//     }

//     if (tenant?.connected_pipedrive) {
//       console.log(
//         "Tenant already connected to Pipedrive, fetching data from Supabase..."
//       );
//       router.push(
//         "/oauth/callback?platform=pipedrive&connected=true&user_id=" +
//           currentUser.id
//       );
//       return;
//     }

//     setIsConnecting((prev) => ({ ...prev, pipedrive: true }));

//     try {
//       const clientId = "dd9b72a2c0148089";
//       const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/oauth/callback`;
//       const state = btoa(crypto.getRandomValues(new Uint32Array(4)).join("-"));

//       localStorage.setItem("pipedrive_oauth_state", state);
//       localStorage.setItem("oauth_platform", "pipedrive");

//       const oauthUrl = `https://oauth.pipedrive.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
//         redirectUri
//       )}&state=${state}`;

//       window.location.href = oauthUrl;
//     } catch (error) {
//       console.error("Error connecting to Pipedrive:", error);
//     } finally {
//       setIsConnecting((prev) => ({ ...prev, pipedrive: false }));
//     }
//   };

//   const handleZohoConnect = async () => {
//     if (!currentUser) {
//       router.push("/login");
//       return;
//     }

//     if (tenant?.connected_zoho) {
//       console.log(
//         "Tenant already connected to Zoho, fetching data from Supabase..."
//       );
//       router.push(
//         "/oauth/callback?platform=zoho&connected=true&user_id=" + currentUser.id
//       );
//       return;
//     }

//     setIsConnecting((prev) => ({ ...prev, zoho: true }));

//     try {
//       const clientId = "1000.F79UI0TF6GMUHHL5P3Z1U11LYQCVCL";
//       const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/oauth/callback`;
//       const state = btoa(crypto.getRandomValues(new Uint32Array(4)).join("-"));

//       localStorage.setItem("zoho_oauth_state", state);
//       localStorage.setItem("oauth_platform", "zoho");

//       const oauthUrl = `https://accounts.zoho.in/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(
//         redirectUri
//       )}&prompt=consent&state=${state}`;

//       window.location.href = oauthUrl;
//     } catch (error) {
//       console.error("Error connecting to Zoho:", error);
//     } finally {
//       setIsConnecting((prev) => ({ ...prev, zoho: false }));
//     }
//   };

//   const handleHubSpotConnect = async () => {
//     if (!currentUser) {
//       router.push("/login");
//       return;
//     }

//     if (tenant?.connected_hubspot) {
//       console.log(
//         "Tenant already connected to HubSpot, fetching data from Supabase..."
//       );
//       router.push(
//         "/oauth/callback?platform=hubspot&connected=true&user_id=" +
//           currentUser.id
//       );
//       return;
//     }

//     setIsConnecting((prev) => ({ ...prev, hubspot: true }));

//     try {
//       window.location.href = "/api/auth/hubspot";
//     } catch (error) {
//       console.error("Error connecting to HubSpot:", error);
//     } finally {
//       setIsConnecting((prev) => ({ ...prev, hubspot: false }));
//     }
//   };

//   const handleViewData = (platform: string) => {
//     if (!currentUser) {
//       router.push("/login");
//       return;
//     }

//     router.push(
//       `/oauth/callback?platform=${platform}&connected=true&user_id=${currentUser.id}`
//     );
//   };

//   const updateConnectionStatus = async (
//     platform: string,
//     connected: boolean
//   ) => {
//     if (!tenant || !supabase) return;

//     try {
//       const updateField =
//         platform === "pipedrive"
//           ? "connected_pipedrive"
//           : platform === "zoho"
//           ? "connected_zoho"
//           : platform === "hubspot"
//           ? "connected_hubspot"
//           : null;

//       if (!updateField) return;

//       const { error } = await supabase
//         .from("tenants")
//         .update({ [updateField]: connected })
//         .eq("id", tenant.id);

//       if (error) {
//         console.error(`Error updating ${platform} connection status:`, error);
//       } else {
//         setTenant((prev) =>
//           prev ? { ...prev, [updateField]: connected } : null
//         );
//         console.log(`${platform} connection status updated to: ${connected}`);
//       }
//     } catch (error) {
//       console.error(`Error updating ${platform} connection status:`, error);
//     }
//   };

//   const handleDisconnect = async (platform: string) => {
//     if (!currentUser) return;

//     setIsDisconnecting((prev) => ({ ...prev, [platform]: true }));

//     try {
//       await updateConnectionStatus(platform, false);

//       if (platform === "pipedrive") {
//         localStorage.removeItem("pipedrive_auth_code");
//         localStorage.removeItem("pipedrive_oauth_state");
//       } else if (platform === "zoho") {
//         localStorage.removeItem("zoho_auth_code");
//         localStorage.removeItem("zoho_oauth_state");
//       } else if (platform === "hubspot") {
//         localStorage.removeItem("hubspot_auth_code");
//         localStorage.removeItem("hubspot_oauth_state");
//       }

//       console.log(`Successfully disconnected from ${platform}`);
//       await fetchTenant();
//     } catch (error) {
//       console.error(`Error disconnecting from ${platform}:`, error);
//     } finally {
//       setIsDisconnecting((prev) => ({ ...prev, [platform]: false }));
//     }
//   };

//   const handleConnect = (platform: string) => {
//     if (platform === "Pipedrive") {
//       handlePipedriveConnect();
//     } else if (platform === "Zoho") {
//       handleZohoConnect();
//     } else if (platform === "HubSpot") {
//       handleHubSpotConnect();
//     }
//   };

//   const getPlatformStatus = (platform: string) => {
//     if (!currentUser)
//       return {
//         connected: false,
//         badge: "Login Required",
//         color: "bg-gray-500/20 text-gray-400",
//       };
//     if (tenant === null)
//       return {
//         connected: false,
//         badge: "Loading...",
//         color: "bg-gray-500/20 text-gray-400",
//       };

//     const isConnected =
//       platform === "Pipedrive"
//         ? tenant?.connected_pipedrive === true
//         : platform === "Zoho"
//         ? tenant?.connected_zoho === true
//         : platform === "HubSpot"
//         ? tenant?.connected_hubspot === true
//         : false;

//     if (isConnected)
//       return {
//         connected: true,
//         badge: "Connected",
//         color:
//           platform === "Pipedrive"
//             ? "bg-green-500/20 text-green-400"
//             : platform === "Zoho"
//             ? "bg-blue-500/20 text-blue-400"
//             : "bg-orange-500/20 text-orange-400",
//       };
//     return {
//       connected: false,
//       badge: "Available",
//       color:
//         platform === "Pipedrive"
//           ? "bg-green-500/20 text-green-400"
//           : platform === "Zoho"
//           ? "bg-blue-500/20 text-blue-400"
//           : "bg-orange-500/20 text-orange-400",
//     };
//   };

//   const pipedriveStatus = getPlatformStatus("Pipedrive");
//   const zohoStatus = getPlatformStatus("Zoho");
//   const hubspotStatus = getPlatformStatus("HubSpot");

//   return (
//     <section className="px-6">
//       <div className="mx-auto max-w-6xl">
//         <div className="text-center mb-12">
//           <h3 className="text-4xl font-bold mb-6">
//             {showButtons
//               ? "Connect Your Platforms"
//               : "Powerful Platform Integrations"}
//           </h3>
//           <p className="text-xl text-gray-400 max-w-2xl mx-auto">
//             {showButtons
//               ? "Connect and sync your business tools to streamline workflows and unlock powerful insights"
//               : "Connect with industry-leading platforms and unlock the full potential of your business data"}
//           </p>
//         </div>

//         <div className="grid gap-8 md:grid-cols-3">
//           {/* Pipedrive */}
//           <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 group">
//             <CardHeader className="pb-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center space-x-4">
//                   <div className="h-14 w-14 rounded-2xl bg-gray-800/80 border border-gray-600/50 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 group-hover:border-gray-500/70">
//                     <svg
//                       width="32"
//                       height="32"
//                       viewBox="0 0 32 32"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <circle cx="16" cy="16" r="16" fill="#28a745" />
//                       <path
//                         d="M24.9842 13.4564C24.9842 17.8851 22.1247 20.914 18.036 20.914C16.0923 20.914 14.4903 20.1136 13.8906 19.1134L13.9189 20.142V26.4847H9.74512V10.0846C9.74512 9.85644 9.68836 9.79843 9.4304 9.79843H8V6.31321H11.4889C13.0896 6.31321 13.4907 7.68461 13.6042 8.28525C14.2337 7.22834 15.8911 6 18.2359 6C22.2679 5.99871 24.9842 8.99802 24.9842 13.4564ZM20.724 13.4847C20.724 11.1131 19.1801 9.48523 17.2351 9.48523C15.6344 9.48523 13.8325 10.5421 13.8325 13.5144C13.8325 15.4568 14.9186 17.4855 17.1783 17.4855C18.837 17.4842 20.724 16.2843 20.724 13.4847Z"
//                         fill="#FFFFFF"
//                       />
//                     </svg>
//                   </div>
//                   <div>
//                     <CardTitle className="text-white text-xl">
//                       Pipedrive
//                     </CardTitle>
//                     <p className="text-green-400 font-medium">Sales CRM</p>
//                   </div>
//                 </div>
//                 {showButtons && (
//                   <Badge
//                     className={`${pipedriveStatus.color} border-green-500/30 hover:bg-green-500/30`}
//                   >
//                     {pipedriveStatus.badge}
//                   </Badge>
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-300 mb-6 leading-relaxed">
//                 Streamline your sales process with automated contact sync, deal
//                 tracking, and pipeline management.
//               </p>
//               <div className="space-y-3 mb-6">
//                 <div className="flex items-center text-sm text-gray-300">
//                   <div className="mr-3 h-2 w-2 rounded-full bg-green-400"></div>
//                   Real-time contact synchronization
//                 </div>
//                 <div className="flex items-center text-sm text-gray-300">
//                   <div className="mr-3 h-2 w-2 rounded-full bg-green-400"></div>
//                   Automated deal pipeline updates
//                 </div>
//                 <div className="flex items-center text-sm text-gray-300">
//                   <div className="mr-3 h-2 w-2 rounded-full bg-green-400"></div>
//                   Activity tracking and notifications
//                 </div>
//               </div>
//               {showButtons && (
//                 <div className="space-y-3">
//                   {pipedriveStatus.connected ? (
//                     <>
//                       <Button
//                         className="w-full bg-green-600 hover:bg-green-700 shadow-lg"
//                         onClick={() => handleViewData("pipedrive")}
//                         disabled={isConnecting.pipedrive || isSyncing.pipedrive}
//                       >
//                         {isSyncing.pipedrive ? (
//                           <div className="flex items-center">
//                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                             Syncing Data...
//                           </div>
//                         ) : (
//                           <div className="flex items-center">
//                             <svg
//                               width="16"
//                               height="16"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               className="mr-2"
//                             >
//                               <path
//                                 d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               />
//                             </svg>
//                             View My Data
//                           </div>
//                         )}
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="w-full border-red-600/50 text-red-400 hover:bg-red-600/10"
//                         onClick={() => handleDisconnect("pipedrive")}
//                         disabled={
//                           isDisconnecting.pipedrive || isSyncing.pipedrive
//                         }
//                       >
//                         {isDisconnecting.pipedrive ? (
//                           <div className="flex items-center">
//                             <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2"></div>
//                             Disconnecting...
//                           </div>
//                         ) : (
//                           "Disconnect"
//                         )}
//                       </Button>
//                     </>
//                   ) : (
//                     <Button
//                       className="w-full bg-green-600 hover:bg-green-700 shadow-lg"
//                       onClick={() => handleConnect("Pipedrive")}
//                       disabled={isConnecting.pipedrive || !currentUser}
//                     >
//                       {isConnecting.pipedrive ? (
//                         <div className="flex items-center">
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                           Connecting...
//                         </div>
//                       ) : !currentUser ? (
//                         "Login to Connect"
//                       ) : (
//                         <div className="flex items-center">
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             className="mr-2"
//                           >
//                             <path
//                               d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                           Connect Pipedrive
//                         </div>
//                       )}
//                     </Button>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* HubSpot */}
//           <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 group">
//             <CardHeader className="pb-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center space-x-4">
//                   <div className="h-14 w-14 rounded-2xl bg-gray-800/80 border border-gray-600/50 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 group-hover:border-gray-500/70">
//                     <svg
//                       width="32"
//                       height="32"
//                       viewBox="0 0 27 28"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M19.6142 20.1771C17.5228 20.1771 15.8274 18.4993 15.8274 16.43C15.8274 14.3603 17.5228 12.6825 19.6142 12.6825C21.7057 12.6825 23.401 14.3603 23.401 16.43C23.401 18.4993 21.7057 20.1771 19.6142 20.1771ZM20.7479 9.21551V5.88191C21.6272 5.47091 22.2431 4.59068 22.2431 3.56913V3.49218C22.2431 2.08229 21.0774 0.928781 19.6527 0.928781H19.5754C18.1507 0.928781 16.985 2.08229 16.985 3.49218V3.56913C16.985 4.59068 17.6009 5.47127 18.4802 5.88227V9.21551C17.1711 9.4158 15.9749 9.95012 14.9885 10.7365L5.73944 3.61659C5.80048 3.38467 5.84336 3.14591 5.84372 2.89493C5.84518 1.29842 4.5393 0.00215931 2.92531 1.87311e-06C1.31205 -0.0018 0.00181863 1.29087 1.8933e-06 2.88774C-0.00181848 4.4846 1.30406 5.78087 2.91805 5.78266C3.44381 5.78338 3.9307 5.6356 4.35727 5.3954L13.4551 12.3995C12.6816 13.5552 12.2281 14.9396 12.2281 16.43C12.2281 17.9902 12.7263 19.4335 13.5678 20.6205L10.8012 23.3586C10.5825 23.2935 10.3558 23.2482 10.1152 23.2482C8.78938 23.2482 7.71424 24.3119 7.71424 25.6239C7.71424 26.9364 8.78938 28 10.1152 28C11.4415 28 12.5162 26.9364 12.5162 25.6239C12.5162 25.3866 12.4705 25.1619 12.4047 24.9454L15.1414 22.2371C16.3837 23.1752 17.9308 23.7391 19.6142 23.7391C23.6935 23.7391 27 20.4666 27 16.43C27 12.7757 24.2872 9.75667 20.7479 9.21551Z"
//                         fill="#f95c35"
//                       />
//                     </svg>
//                   </div>
//                   <div>
//                     <CardTitle className="text-white text-xl">
//                       HubSpot
//                     </CardTitle>
//                     <p className="text-orange-400 font-medium">Marketing Hub</p>
//                   </div>
//                 </div>
//                 {showButtons && (
//                   <Badge
//                     className={`${hubspotStatus.color} border-orange-500/30 hover:bg-orange-500/30`}
//                   >
//                     {hubspotStatus.badge}
//                   </Badge>
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-300 mb-6 leading-relaxed">
//                 Power your marketing with advanced automation, lead scoring, and
//                 comprehensive customer insights.
//               </p>
//               <div className="space-y-3 mb-6">
//                 <div className="flex items-center text-sm text-gray-300">
//                   <div className="mr-3 h-2 w-2 rounded-full bg-orange-400"></div>
//                   Marketing automation workflows
//                 </div>
//                 <div className="flex items-center text-sm text-gray-300">
//                   <div className="mr-3 h-2 w-2 rounded-full bg-orange-400"></div>
//                   AI-powered lead scoring
//                 </div>
//                 <div className="flex items-center text-sm text-gray-300">
//                   <div className="mr-3 h-2 w-2 rounded-full bg-orange-400"></div>
//                   Customer journey analytics
//                 </div>
//               </div>
//               {showButtons && (
//                 <div className="space-y-3">
//                   {hubspotStatus.connected ? (
//                     <>
//                       <Button
//                         className="w-full bg-orange-600 hover:bg-orange-700 shadow-lg"
//                         onClick={() => handleViewData("hubspot")}
//                         disabled={isConnecting.hubspot || isSyncing.hubspot}
//                       >
//                         {isSyncing.hubspot ? (
//                           <div className="flex items-center">
//                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                             Syncing Data...
//                           </div>
//                         ) : (
//                           <div className="flex items-center">
//                             <svg
//                               width="16"
//                               height="16"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               className="mr-2"
//                             >
//                               <path
//                                 d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               />
//                             </svg>
//                             View My Data
//                           </div>
//                         )}
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="w-full border-red-600/50 text-red-400 hover:bg-red-600/10"
//                         onClick={() => handleDisconnect("hubspot")}
//                         disabled={isDisconnecting.hubspot || isSyncing.hubspot}
//                       >
//                         {isDisconnecting.hubspot ? (
//                           <div className="flex items-center">
//                             <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2"></div>
//                             Disconnecting...
//                           </div>
//                         ) : (
//                           "Disconnect"
//                         )}
//                       </Button>
//                     </>
//                   ) : (
//                     <Button
//                       className="w-full bg-orange-600 hover:bg-orange-700 shadow-lg"
//                       onClick={() => handleConnect("HubSpot")}
//                       disabled={isConnecting.hubspot || !currentUser}
//                     >
//                       {isConnecting.hubspot ? (
//                         <div className="flex items-center">
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                           Connecting...
//                         </div>
//                       ) : !currentUser ? (
//                         "Login to Connect"
//                       ) : (
//                         <div className="flex items-center">
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             className="mr-2"
//                           >
//                             <path
//                               d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                           Connect HubSpot
//                         </div>
//                       )}
//                     </Button>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Zoho */}
//           <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 group">
//             <CardHeader className="pb-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center space-x-4">
//                   <div className="h-14 w-14 rounded-2xl bg-gray-800/80 border border-gray-600/50 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 group-hover:border-gray-500/70">
//                     <img
//                       src="https://www.zohowebstatic.com/sites/zweb/images/commonroot/zoho-logo-web.svg"
//                       alt="Zoho"
//                       className="h-8 w-auto"
//                       onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
//                         const target = e.currentTarget as HTMLImageElement;
//                         target.style.display = "none";
//                       }}
//                     />
//                   </div>
//                   <div>
//                     <CardTitle className="text-white text-xl">
//                       Zoho CRM
//                     </CardTitle>
//                     <p className="text-blue-400 font-medium">Business Suite</p>
//                   </div>
//                 </div>
//                 {showButtons && (
//                   <Badge
//                     className={`${zohoStatus.color} border-blue-500/30 hover:bg-blue-500/30`}
//                   >
//                     {zohoStatus.badge}
//                   </Badge>
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-300 mb-6 leading-relaxed">
//                 Unify your entire business ecosystem with comprehensive
//                 integration across all Zoho CRM modules and deals.
//               </p>
//               <div className="space-y-3 mb-6">
//                 <div className="flex items-center text-sm text-gray-300">
//                   <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
//                   Multi-module synchronization
//                 </div>
//                 <div className="flex items-center text-sm text-gray-300">
//                   <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
//                   Deal pipeline management
//                 </div>
//                 <div className="flex items-center text-sm text-gray-300">
//                   <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
//                   Customer relationship tracking
//                 </div>
//               </div>
//               {showButtons && (
//                 <div className="space-y-3">
//                   {zohoStatus.connected ? (
//                     <>
//                       <Button
//                         className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg"
//                         onClick={() => handleViewData("zoho")}
//                         disabled={isConnecting.zoho || isSyncing.zoho}
//                       >
//                         {isSyncing.zoho ? (
//                           <div className="flex items-center">
//                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                             Syncing Data...
//                           </div>
//                         ) : (
//                           <div className="flex items-center">
//                             <svg
//                               width="16"
//                               height="16"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               className="mr-2"
//                             >
//                               <path
//                                 d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               />
//                             </svg>
//                             View My Data
//                           </div>
//                         )}
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="w-full border-red-600/50 text-red-400 hover:bg-red-600/10"
//                         onClick={() => handleDisconnect("zoho")}
//                         disabled={isDisconnecting.zoho || isSyncing.zoho}
//                       >
//                         {isDisconnecting.zoho ? (
//                           <div className="flex items-center">
//                             <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2"></div>
//                             Disconnecting...
//                           </div>
//                         ) : (
//                           "Disconnect"
//                         )}
//                       </Button>
//                     </>
//                   ) : (
//                     <Button
//                       className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg"
//                       onClick={() => handleConnect("Zoho")}
//                       disabled={isConnecting.zoho || !currentUser}
//                     >
//                       {isConnecting.zoho ? (
//                         <div className="flex items-center">
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                           Connecting...
//                         </div>
//                       ) : !currentUser ? (
//                         "Login to Connect"
//                       ) : (
//                         <div className="flex items-center">
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             className="mr-2"
//                           >
//                             <path
//                               d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                           Connect Zoho CRM
//                         </div>
//                       )}
//                     </Button>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default IntegrationCard;

"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

interface IntegrationCardProps {
  showButtons?: boolean;
  onConnect?: (platform: string) => void;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  connected_pipedrive: boolean;
  connected_zoho: boolean;
  connected_hubspot: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  showButtons = false,
  onConnect,
}) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isDisconnecting, setIsDisconnecting] = useState<{
    [key: string]: boolean;
  }>({});
  const [isSyncing, setIsSyncing] = useState<{ [key: string]: boolean }>({});
  const [supabase, setSupabase] = useState<any>(null);
  const router = useRouter();

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      const client = await getSupabaseClient();
      setSupabase(client);
    };
    initSupabase();
  }, []);

  // Get current user and tenant
  useEffect(() => {
    if (!supabase) return;

    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        await fetchTenant();
      }
    };
    getCurrentUser();
  }, [supabase]);

  // Refresh tenant when component mounts or when coming back from OAuth
  useEffect(() => {
    if (currentUser && showButtons && supabase) {
      fetchTenant();
    }
  }, [currentUser, showButtons, supabase]);

  const fetchTenant = async () => {
    if (!supabase) return;

    try {
      // For now, we'll use the demo organization tenant ID

      const tenantId = "00000000-0000-0000-0000-000000000002";

      const { data: tenantData, error } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", tenantId)
        .single();

      if (error) {
        console.error("Error fetching tenant:", error);
      } else {
        setTenant(tenantData);
        console.log("Tenant data loaded:", tenantData);
      }
    } catch (error) {
      console.error("Error in fetchTenant:", error);
    }
  };

  const handlePipedriveConnect = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (tenant?.connected_pipedrive) {
      console.log(
        "Tenant already connected to Pipedrive, fetching data from Supabase..."
      );
      router.push(
        "/oauth/callback?platform=pipedrive&connected=true&user_id=" +
          currentUser.id
      );
      return;
    }

    setIsConnecting((prev) => ({ ...prev, pipedrive: true }));

    try {
      const clientId = `${process.env.NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID}`;
      // Updated redirect URI to include platform parameter
      const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/oauth/callback?platform=pipedrive`;
      const state = btoa(crypto.getRandomValues(new Uint32Array(4)).join("-"));

      localStorage.setItem("pipedrive_oauth_state", state);
      localStorage.setItem("oauth_platform", "pipedrive");

      const oauthUrl = `https://oauth.pipedrive.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&state=${state}`;

      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Error connecting to Pipedrive:", error);
    } finally {
      setIsConnecting((prev) => ({ ...prev, pipedrive: false }));
    }
  };

  const handleZohoConnect = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (tenant?.connected_zoho) {
      console.log(
        "Tenant already connected to Zoho, fetching data from Supabase..."
      );
      router.push(
        "/oauth/callback?platform=zoho&connected=true&user_id=" + currentUser.id
      );
      return;
    }

    setIsConnecting((prev) => ({ ...prev, zoho: true }));

    try {
      const clientId = `${process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID}`;
      // Updated redirect URI to include platform parameter
      const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/oauth/callback?platform=zoho`;
      const state = btoa(crypto.getRandomValues(new Uint32Array(4)).join("-"));

      localStorage.setItem("zoho_oauth_state", state);
      localStorage.setItem("oauth_platform", "zoho");

      const oauthUrl = `https://accounts.zoho.in/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&prompt=consent&state=${state}`;

      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Error connecting to Zoho:", error);
    } finally {
      setIsConnecting((prev) => ({ ...prev, zoho: false }));
    }
  };

  const handleHubSpotConnect = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (tenant?.connected_hubspot) {
      console.log(
        "Tenant already connected to HubSpot, fetching data from Supabase..."
      );
      router.push(
        "/oauth/callback?platform=hubspot&connected=true&user_id=" +
          currentUser.id
      );
      return;
    }

    setIsConnecting((prev) => ({ ...prev, hubspot: true }));

    try {
      // For HubSpot, you might need to create a separate API endpoint
      // that handles the OAuth flow and redirects properly with platform parameter
      window.location.href = "/api/auth/hubspot?platform=hubspot";
    } catch (error) {
      console.error("Error connecting to HubSpot:", error);
    } finally {
      setIsConnecting((prev) => ({ ...prev, hubspot: false }));
    }
  };

  const updateConnectionStatus = async (
    platform: string,
    connected: boolean
  ) => {
    if (!tenant || !supabase) return;

    try {
      const updateField =
        platform === "pipedrive"
          ? "connected_pipedrive"
          : platform === "zoho"
          ? "connected_zoho"
          : platform === "hubspot"
          ? "connected_hubspot"
          : null;

      if (!updateField) return;

      const { error } = await supabase
        .from("tenants")
        .update({ [updateField]: connected })
        .eq("id", tenant.id);

      if (error) {
        console.error(`Error updating ${platform} connection status:`, error);
      } else {
        setTenant((prev) =>
          prev ? { ...prev, [updateField]: connected } : null
        );
        console.log(`${platform} connection status updated to: ${connected}`);
      }
    } catch (error) {
      console.error(`Error updating ${platform} connection status:`, error);
    }
  };

  const handleDisconnect = async (platform: string) => {
    if (!currentUser) return;

    setIsDisconnecting((prev) => ({ ...prev, [platform]: true }));

    try {
      await updateConnectionStatus(platform, false);

      if (platform === "pipedrive") {
        localStorage.removeItem("pipedrive_auth_code");
        localStorage.removeItem("pipedrive_oauth_state");
      } else if (platform === "zoho") {
        localStorage.removeItem("zoho_auth_code");
        localStorage.removeItem("zoho_oauth_state");
      } else if (platform === "hubspot") {
        localStorage.removeItem("hubspot_auth_code");
        localStorage.removeItem("hubspot_oauth_state");
      }

      console.log(`Successfully disconnected from ${platform}`);
      await fetchTenant();
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
    } finally {
      setIsDisconnecting((prev) => ({ ...prev, [platform]: false }));
    }
  };

  const handleConnect = (platform: string) => {
    if (platform === "Pipedrive") {
      handlePipedriveConnect();
    } else if (platform === "Zoho") {
      handleZohoConnect();
    } else if (platform === "HubSpot") {
      handleHubSpotConnect();
    }
  };

  const getPlatformStatus = (platform: string) => {
    if (!currentUser)
      return {
        connected: false,
        badge: "Login Required",
        color: "bg-gray-500/20 text-gray-400",
      };
    if (tenant === null)
      return {
        connected: false,
        badge: "Loading...",
        color: "bg-gray-500/20 text-gray-400",
      };

    const isConnected =
      platform === "Pipedrive"
        ? tenant?.connected_pipedrive === true
        : platform === "Zoho"
        ? tenant?.connected_zoho === true
        : platform === "HubSpot"
        ? tenant?.connected_hubspot === true
        : false;

    if (isConnected)
      return {
        connected: true,
        badge: "Connected",
        color:
          platform === "Pipedrive"
            ? "bg-green-500/20 text-green-400"
            : platform === "Zoho"
            ? "bg-blue-500/20 text-blue-400"
            : "bg-orange-500/20 text-orange-400",
      };
    return {
      connected: false,
      badge: "Available",
      color:
        platform === "Pipedrive"
          ? "bg-green-500/20 text-green-400"
          : platform === "Zoho"
          ? "bg-blue-500/20 text-blue-400"
          : "bg-orange-500/20 text-orange-400",
    };
  };

  const pipedriveStatus = getPlatformStatus("Pipedrive");
  const zohoStatus = getPlatformStatus("Zoho");
  const hubspotStatus = getPlatformStatus("HubSpot");
  return (
    <section className="px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-6">
            {showButtons
              ? "Connect Your Platforms"
              : "Powerful Platform Integrations"}
          </h3>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {showButtons
              ? "Connect and sync your business tools to streamline workflows and unlock powerful insights"
              : "Connect with industry-leading platforms and unlock the full potential of your business data"}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Pipedrive */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-2xl bg-gray-800/80 border border-gray-600/50 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 group-hover:border-gray-500/70">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="16" cy="16" r="16" fill="#28a745" />
                      <path
                        d="M24.9842 13.4564C24.9842 17.8851 22.1247 20.914 18.036 20.914C16.0923 20.914 14.4903 20.1136 13.8906 19.1134L13.9189 20.142V26.4847H9.74512V10.0846C9.74512 9.85644 9.68836 9.79843 9.4304 9.79843H8V6.31321H11.4889C13.0896 6.31321 13.4907 7.68461 13.6042 8.28525C14.2337 7.22834 15.8911 6 18.2359 6C22.2679 5.99871 24.9842 8.99802 24.9842 13.4564ZM20.724 13.4847C20.724 11.1131 19.1801 9.48523 17.2351 9.48523C15.6344 9.48523 13.8325 10.5421 13.8325 13.5144C13.8325 15.4568 14.9186 17.4855 17.1783 17.4855C18.837 17.4842 20.724 16.2843 20.724 13.4847Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">
                      Pipedrive
                    </CardTitle>
                    <p className="text-green-400 font-medium">Sales CRM</p>
                  </div>
                </div>
                {showButtons && (
                  <Badge
                    className={`${pipedriveStatus.color} border-green-500/30 hover:bg-green-500/30`}
                  >
                    {pipedriveStatus.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Streamline your sales process with automated contact sync, deal
                tracking, and pipeline management.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-300">
                  <div className="mr-3 h-2 w-2 rounded-full bg-green-400"></div>
                  Real-time contact synchronization
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="mr-3 h-2 w-2 rounded-full bg-green-400"></div>
                  Automated deal pipeline updates
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="mr-3 h-2 w-2 rounded-full bg-green-400"></div>
                  Activity tracking and notifications
                </div>
              </div>
              {showButtons && (
                <div className="space-y-3">
                  {pipedriveStatus.connected ? (
                    <Button
                      variant="outline"
                      className="w-full border-red-600/50 text-red-400 hover:bg-red-600/10"
                      onClick={() => handleDisconnect("pipedrive")}
                      disabled={
                        isDisconnecting.pipedrive || isSyncing.pipedrive
                      }
                    >
                      {isDisconnecting.pipedrive ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Disconnecting...
                        </div>
                      ) : (
                        "Disconnect"
                      )}
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 shadow-lg"
                      onClick={() => handleConnect("Pipedrive")}
                      disabled={isConnecting.pipedrive || !currentUser}
                    >
                      {isConnecting.pipedrive ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Connecting...
                        </div>
                      ) : !currentUser ? (
                        "Login to Connect"
                      ) : (
                        <div className="flex items-center">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="mr-2"
                          >
                            <path
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Connect Pipedrive
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* HubSpot */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-2xl bg-gray-800/80 border border-gray-600/50 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 group-hover:border-gray-500/70">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 27 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.6142 20.1771C17.5228 20.1771 15.8274 18.4993 15.8274 16.43C15.8274 14.3603 17.5228 12.6825 19.6142 12.6825C21.7057 12.6825 23.401 14.3603 23.401 16.43C23.401 18.4993 21.7057 20.1771 19.6142 20.1771ZM20.7479 9.21551V5.88191C21.6272 5.47091 22.2431 4.59068 22.2431 3.56913V3.49218C22.2431 2.08229 21.0774 0.928781 19.6527 0.928781H19.5754C18.1507 0.928781 16.985 2.08229 16.985 3.49218V3.56913C16.985 4.59068 17.6009 5.47127 18.4802 5.88227V9.21551C17.1711 9.4158 15.9749 9.95012 14.9885 10.7365L5.73944 3.61659C5.80048 3.38467 5.84336 3.14591 5.84372 2.89493C5.84518 1.29842 4.5393 0.00215931 2.92531 1.87311e-06C1.31205 -0.0018 0.00181863 1.29087 1.8933e-06 2.88774C-0.00181848 4.4846 1.30406 5.78087 2.91805 5.78266C3.44381 5.78338 3.9307 5.6356 4.35727 5.3954L13.4551 12.3995C12.6816 13.5552 12.2281 14.9396 12.2281 16.43C12.2281 17.9902 12.7263 19.4335 13.5678 20.6205L10.8012 23.3586C10.5825 23.2935 10.3558 23.2482 10.1152 23.2482C8.78938 23.2482 7.71424 24.3119 7.71424 25.6239C7.71424 26.9364 8.78938 28 10.1152 28C11.4415 28 12.5162 26.9364 12.5162 25.6239C12.5162 25.3866 12.4705 25.1619 12.4047 24.9454L15.1414 22.2371C16.3837 23.1752 17.9308 23.7391 19.6142 23.7391C23.6935 23.7391 27 20.4666 27 16.43C27 12.7757 24.2872 9.75667 20.7479 9.21551Z"
                        fill="#f95c35"
                      />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">
                      HubSpot
                    </CardTitle>
                    <p className="text-orange-400 font-medium">Sales CRM</p>
                  </div>
                </div>
                {showButtons && (
                  <Badge
                    className={`${hubspotStatus.color} border-orange-500/30 hover:bg-orange-500/30`}
                  >
                    {hubspotStatus.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Power your marketing with advanced automation, lead scoring, and
                comprehensive customer insights.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-300">
                  <div className="mr-3 h-2 w-2 rounded-full bg-orange-400"></div>
                  Marketing automation workflows
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="mr-3 h-2 w-2 rounded-full bg-orange-400"></div>
                  AI-powered lead scoring
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="mr-3 h-2 w-2 rounded-full bg-orange-400"></div>
                  Customer journey analytics
                </div>
              </div>
              {showButtons && (
                <div className="space-y-3">
                  {hubspotStatus.connected ? (
                    <Button
                      variant="outline"
                      className="w-full border-red-600/50 text-red-400 hover:bg-red-600/10"
                      onClick={() => handleDisconnect("hubspot")}
                      disabled={isDisconnecting.hubspot || isSyncing.hubspot}
                    >
                      {isDisconnecting.hubspot ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Disconnecting...
                        </div>
                      ) : (
                        "Disconnect"
                      )}
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700 shadow-lg"
                      onClick={() => handleConnect("HubSpot")}
                      disabled={isConnecting.hubspot || !currentUser}
                    >
                      {isConnecting.hubspot ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Connecting...
                        </div>
                      ) : !currentUser ? (
                        "Login to Connect"
                      ) : (
                        <div className="flex items-center">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="mr-2"
                          >
                            <path
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Connect HubSpot
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Zoho */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-2xl bg-gray-800/80 border border-gray-600/50 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 group-hover:border-gray-500/70">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 300 300"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8"
                    >
                      <defs>
                        <style>{`.cls-1{fill:#006eb9;}`}</style>
                      </defs>
                      <g id="logo">
                        <path
                          className="cls-1"
                          d="m204.26,239.24c-24.19,0-46.98-9.37-64.17-26.38l-50.24-50.24c-5.85-5.85-9.06-13.63-9.03-21.9.03-8.27,3.28-16.03,9.16-21.84,12.02-11.88,31.53-11.82,43.48.13l46.01,46.01c5.39,5.39,14.18,5.41,19.59.05,2.65-2.62,4.11-6.11,4.12-9.84.01-3.72-1.43-7.23-4.07-9.86l-50.17-50.17c-14.02-13.87-32.64-21.51-52.38-21.45-20.14.05-38.94,7.96-52.94,22.27-14.02,14.33-21.52,33.32-21.12,53.47.79,40.11,34.09,72.75,74.23,72.75,7.18,0,14.27-1.02,21.08-3.03,4.5-1.33,9.23,1.24,10.55,5.74,1.33,4.5-1.24,9.23-5.74,10.56-8.37,2.47-17.08,3.73-25.89,3.73-49.33,0-90.25-40.11-91.22-89.41-.49-24.75,8.73-48.08,25.96-65.69,17.22-17.6,40.32-27.33,65.05-27.38,24.15-.06,47.14,9.31,64.39,26.38l50.22,50.22c5.85,5.86,9.07,13.64,9.05,21.92-.02,8.28-3.28,16.05-9.16,21.87-12.04,11.91-31.58,11.86-43.56-.12l-46.01-46.01c-5.37-5.37-14.12-5.39-19.52-.06-2.64,2.61-4.1,6.09-4.11,9.81-.01,3.71,1.43,7.21,4.05,9.83l50.19,50.2c13.97,13.82,32.52,21.45,52.2,21.45,40.9,0,74.21-33.27,74.25-74.17.02-19.82-7.7-38.48-21.74-52.54-14.04-14.06-32.69-21.8-52.51-21.8-6.32,0-12.59.79-18.65,2.36-.88.23-1.76.47-2.63.73-4.5,1.34-9.23-1.22-10.57-5.71-1.34-4.5,1.22-9.23,5.71-10.57,1.07-.32,2.15-.62,3.23-.9,7.44-1.92,15.15-2.9,22.9-2.9,24.36,0,47.28,9.51,64.53,26.78,17.25,17.27,26.74,40.2,26.71,64.56-.05,50.26-40.99,91.14-91.24,91.14Z"
                        />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">
                      Zoho CRM
                    </CardTitle>
                    <p className="text-blue-400 font-medium">Sales CRM</p>
                  </div>
                </div>
                {showButtons && (
                  <Badge
                    className={`${zohoStatus.color} border-blue-500/30 hover:bg-blue-500/30`}
                  >
                    {zohoStatus.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Unify your entire business ecosystem with comprehensive
                integration across all Zoho CRM modules and deals.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-300">
                  <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
                  Multi-module synchronization
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
                  Deal pipeline management
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="mr-3 h-2 w-2 rounded-full bg-blue-400"></div>
                  Customer relationship tracking
                </div>
              </div>
              {showButtons && (
                <div className="space-y-3">
                  {zohoStatus.connected ? (
                    <Button
                      variant="outline"
                      className="w-full border-red-600/50 text-red-400 hover:bg-red-600/10"
                      onClick={() => handleDisconnect("zoho")}
                      disabled={isDisconnecting.zoho || isSyncing.zoho}
                    >
                      {isDisconnecting.zoho ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Disconnecting...
                        </div>
                      ) : (
                        "Disconnect"
                      )}
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg"
                      onClick={() => handleConnect("Zoho")}
                      disabled={isConnecting.zoho || !currentUser}
                    >
                      {isConnecting.zoho ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Connecting...
                        </div>
                      ) : !currentUser ? (
                        "Login to Connect"
                      ) : (
                        <div className="flex items-center">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="mr-2"
                          >
                            <path
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Connect Zoho CRM
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default IntegrationCard;
