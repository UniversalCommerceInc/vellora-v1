// "use client"

// import { useState } from "react"
// import { Header } from "@/components/header"
// import { UserManagement } from "@/components/user-management"
// import { OrganizationSettings } from "@/components/organization-settings"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Users, Building, Settings, Bell } from "lucide-react"

// export default function SettingsPage() {
//   const [activeTab, setActiveTab] = useState("organization")

//   const tabs = [
//     { id: "organization", label: "Organization", icon: Building },
//     { id: "users", label: "Users & Roles", icon: Users },
//     { id: "notifications", label: "Notifications", icon: Bell },
//     { id: "general", label: "General", icon: Settings },
//   ]

//   return (
//     <div className="min-h-screen bg-black">
//       <Header />
//       <div className="px-6 py-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
//             <p className="text-gray-300 text-lg">Manage your organization and preferences</p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             {/* Sidebar */}
//             <div className="lg:col-span-1">
//               <Card className="bg-gray-900 border-gray-700">
//                 <CardContent className="p-0">
//                   <nav className="space-y-1">
//                     {tabs.map((tab) => {
//                       const Icon = tab.icon
//                       return (
//                         <Button
//                           key={tab.id}
//                           variant="ghost"
//                           className={`w-full justify-start rounded-none px-4 py-3 ${
//                             activeTab === tab.id
//                               ? "bg-purple-600 text-white"
//                               : "text-gray-300 hover:bg-gray-800 hover:text-white"
//                           }`}
//                           onClick={() => setActiveTab(tab.id)}
//                         >
//                           <Icon className="w-4 h-4 mr-3" />
//                           {tab.label}
//                         </Button>
//                       )
//                     })}
//                   </nav>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Main Content */}
//             <div className="lg:col-span-3">
//               {activeTab === "organization" && <OrganizationSettings />}
//               {activeTab === "users" && <UserManagement />}
//               {activeTab === "notifications" && (
//                 <Card className="bg-gray-900 border-gray-700">
//                   <CardHeader>
//                     <CardTitle className="text-white">Notification Settings</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-gray-400">Notification settings coming soon...</p>
//                   </CardContent>
//                 </Card>
//               )}
//               {activeTab === "general" && (
//                 <Card className="bg-gray-900 border-gray-700">
//                   <CardHeader>
//                     <CardTitle className="text-white">General Settings</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-gray-400">General settings coming soon...</p>
//                   </CardContent>
//                 </Card>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { UserManagement } from "@/components/user-management";
import { OrganizationSettings } from "@/components/organization-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, Settings, Bell, Database } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("organization");
  const router = useRouter();
  const tabs = [
    { id: "organization", label: "Organization", icon: Building },
    { id: "users", label: "Users & Roles", icon: Users },
    { id: "config", label: "Config", icon: Database },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "general", label: "General", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-300 text-lg">
              Manage your organization and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <Button
                          key={tab.id}
                          variant="ghost"
                          className={`w-full justify-start rounded-none px-4 py-3 ${
                            activeTab === tab.id
                              ? "bg-purple-600 text-white"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }`}
                          onClick={() => setActiveTab(tab.id)}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {tab.label}
                        </Button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "organization" && <OrganizationSettings />}
              {activeTab === "users" && <UserManagement />}
              {activeTab === "config" && (
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Database & System Configuration
                        </h3>
                        <p className="text-gray-400 mb-4">
                          Manage tenants, organizations, users, and database
                          setup for your Vellora.AI instance.
                        </p>
                        <Button
                          // onClick={() => window.open("/config", "_blank")}
                          onClick={() => router.push("/config")}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Open Configuration Dashboard
                        </Button>
                      </div>

                      <div className="border-t border-gray-700 pt-6">
                        <h4 className="text-md font-medium text-white mb-2">
                          Configuration Features
                        </h4>
                        <ul className="space-y-2 text-gray-400">
                          <li>• Tenant Management</li>
                          <li>• Organization Setup</li>
                          <li>• User Management</li>
                          <li>• Database Schema Setup</li>
                          <li>• System Health Monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {activeTab === "notifications" && (
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">
                      Notification settings coming soon...
                    </p>
                  </CardContent>
                </Card>
              )}
              {activeTab === "general" && (
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      General Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">
                      General settings coming soon...
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
