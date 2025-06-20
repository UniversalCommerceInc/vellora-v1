// "use client"

// import { Badge } from "@/components/ui/badge"
// import {
//   MoreHorizontal,
//   Calendar,
//   TrendingUp,
//   Plus,
//   Search,
//   Mail,
//   Phone,
//   DollarSign,
//   Users,
//   AlertCircle,
//   CheckCircle,
//   RefreshCw,
// } from "lucide-react"

// import type React from "react"
// import { useState, useEffect, useCallback } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { DealDetailPopup } from "./deal-detail-popup"
// import { NewDealWizard } from "./new-deal-wizard"
// import { dealQueries } from "@/lib/supabase/queries"
// import { useTenant } from "@/contexts/tenant-context"
// import type { DealWithRelations, DealStage } from "@/lib/supabase/types"

// export function DealFlowBoard() {
//   const { tenant, organization, isLoading: tenantLoading } = useTenant()
//   const [deals, setDeals] = useState<DealWithRelations[]>([])
//   const [stages, setStages] = useState<DealStage[]>([])
//   const [selectedDeal, setSelectedDeal] = useState<DealWithRelations | null>(null)
//   const [showNewDealWizard, setShowNewDealWizard] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [draggedDeal, setDraggedDeal] = useState<DealWithRelations | null>(null)

//   const loadData = useCallback(async () => {
//     console.log("🔄 loadData called")

//     if (tenantLoading) {
//       console.log("⏸️ Waiting for tenant context to load...")
//       return
//     }

//     if (!tenant) {
//       console.log("❌ No tenant available")
//       setDeals([])
//       setStages([])
//       return
//     }

//     try {
//       setError(null)
//       console.log("🚀 Loading data for tenant:", tenant.id)

//       // Add timeout to prevent hanging
//       const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 10000))

//       const dataPromise = Promise.all([dealQueries.getDeals(), dealQueries.getDealStages()])

//       const [dealsData, stagesData] = (await Promise.race([dataPromise, timeoutPromise])) as any

//       console.log("✅ Loaded deals:", dealsData?.length || 0)
//       console.log("✅ Loaded stages:", stagesData?.length || 0)

//       // Filter by both tenant_id AND organization_id
//       let filteredDeals = dealsData || []
//       let filteredStages = stagesData || []

//       if (tenant?.id && organization?.id) {
//         filteredDeals =
//           dealsData?.filter((deal: any) => deal.tenant_id === tenant.id && deal.organization_id === organization.id) ||
//           []
//         filteredStages =
//           stagesData?.filter(
//             (stage: any) => stage.tenant_id === tenant.id && stage.organization_id === organization.id,
//           ) || []
//         console.log("🔍 Filtered for tenant:", tenant.id, "organization:", organization.id)
//         console.log("📋 Filtered deals:", filteredDeals.length)
//         console.log("🏷️ Filtered stages:", filteredStages.length)
//       } else if (tenant?.id) {
//         // Fallback to tenant-only filtering if no organization
//         filteredDeals = dealsData?.filter((deal: any) => deal.tenant_id === tenant.id) || []
//         filteredStages = stagesData?.filter((stage: any) => stage.tenant_id === tenant.id) || []
//         console.log("🔍 Filtered for tenant only:", tenant.id)
//       }

//       setDeals(filteredDeals)
//       setStages(filteredStages)

//       console.log("✅ Final deals set:", filteredDeals.length)
//       console.log("✅ Final stages set:", filteredStages.length)
//     } catch (error: any) {
//       console.error("❌ Error loading deals:", error)
//       setError(error.message || "Failed to load deals")
//     }
//   }, [tenant, organization, tenantLoading])

//   useEffect(() => {
//     async function initialLoad() {
//       setIsLoading(true)
//       await loadData()
//       setIsLoading(false)
//     }

//     initialLoad()
//   }, [loadData])

//   const refreshData = async () => {
//     setIsRefreshing(true)
//     await loadData()
//     setIsRefreshing(false)
//   }

//   const handleDealClick = (deal: DealWithRelations) => {
//     setSelectedDeal(deal)
//   }

//   const handleClosePopup = () => {
//     setSelectedDeal(null)
//   }

//   const handleNewDeal = () => {
//     setShowNewDealWizard(true)
//   }

//   const handleCloseNewDealWizard = () => {
//     setShowNewDealWizard(false)
//   }

//   const handleDealCreated = async () => {
//     await refreshData()
//   }

//   const handleDragStart = (e: React.DragEvent, deal: DealWithRelations) => {
//     setDraggedDeal(deal)
//     e.dataTransfer.effectAllowed = "move"
//   }

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault()
//     e.dataTransfer.dropEffect = "move"
//   }

//   const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
//     e.preventDefault()

//     if (!draggedDeal || draggedDeal.stage_id === targetStageId) {
//       setDraggedDeal(null)
//       return
//     }

//     try {
//       const targetStage = stages.find((s) => s.id === targetStageId)
//       if (!targetStage) return

//       await dealQueries.updateDeal(draggedDeal.id, {
//         stage_id: targetStageId,
//         probability: targetStage.probability_percentage || 50,
//       })

//       await refreshData()
//     } catch (error: any) {
//       console.error("Error moving deal:", error)
//       setError("Failed to move deal")
//     } finally {
//       setDraggedDeal(null)
//     }
//   }

//   // Filter deals by stage - Enhanced debugging
//   const getDealsByStage = (stageId: string) => {
//     console.log(`🔍 getDealsByStage called for stage: ${stageId}`)
//     console.log(`🔍 Total deals available: ${deals.length}`)

//     // Log all deals with their stage_id and other key fields
//     deals.forEach((deal, index) => {
//       console.log(
//         `🔍 Deal ${index + 1}: "${deal.title}" - stage_id: "${deal.stage_id}" - tenant: "${deal.tenant_id}" - org: "${deal.organization_id}" - value: ${deal.value} - contact: ${deal.primary_contact?.first_name || "none"}`,
//       )
//     })

//     // Log all available stages
//     console.log(`🏷️ Available stages:`)
//     stages.forEach((stage, index) => {
//       console.log(`🏷️ Stage ${index + 1}: id="${stage.id}" name="${stage.name}"`)
//     })

//     const stageDeals = deals.filter((deal) => {
//       const matches = deal.stage_id === stageId
//       console.log(
//         `🔍 Deal "${deal.title}": stage_id="${deal.stage_id}" vs looking for="${stageId}" - matches: ${matches}`,
//       )
//       return matches
//     })

//     console.log(`📊 Stage ${stageId} (${stages.find((s) => s.id === stageId)?.name}): Found ${stageDeals.length} deals`)

//     // Log which specific deals were found for this stage
//     stageDeals.forEach((deal, index) => {
//       console.log(`📊 Deal ${index + 1} in stage: "${deal.title}"`)
//     })

//     const filteredBySearch = stageDeals.filter((deal) => {
//       if (searchTerm === "") return true

//       const searchLower = searchTerm.toLowerCase()
//       const matchesSearch =
//         deal.title.toLowerCase().includes(searchLower) ||
//         deal.primary_contact?.company?.toLowerCase().includes(searchLower) ||
//         `${deal.primary_contact?.first_name} ${deal.primary_contact?.last_name}`.toLowerCase().includes(searchLower)

//       console.log(`🔍 Deal "${deal.title}" search match: ${matchesSearch}`)
//       return matchesSearch
//     })

//     console.log(`📊 Stage ${stageId}: ${stageDeals.length} deals total, ${filteredBySearch.length} after search`)
//     return filteredBySearch
//   }

//   const getStageMetrics = (stageId: string) => {
//     const stageDeals = getDealsByStage(stageId)
//     const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)
//     const avgProbability =
//       stageDeals.length > 0 ? stageDeals.reduce((sum, deal) => sum + deal.probability, 0) / stageDeals.length : 0

//     return {
//       count: stageDeals.length,
//       totalValue,
//       avgProbability: Math.round(avgProbability),
//     }
//   }

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount)
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     })
//   }

//   const getOverallMetrics = () => {
//     const totalDeals = deals.length
//     const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0)

//     // Fix: Check for deals in won stages, not just deal.stage?.is_won
//     const wonDeals = deals.filter((deal) => {
//       // First check if the deal has a stage and it's marked as won
//       if (deal.stage?.is_won) {
//         return true
//       }

//       // Also check by stage name as fallback
//       const stageName = deal.stage?.name?.toLowerCase()
//       return stageName === "closed won" || stageName === "won"
//     }).length

//     const avgDealValue = totalDeals > 0 ? totalValue / totalDeals : 0

//     console.log(`📊 Win Rate Calculation:`)
//     console.log(`📊 Total deals: ${totalDeals}`)
//     console.log(`📊 Won deals: ${wonDeals}`)
//     console.log(`📊 Win rate: ${totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0}%`)

//     return {
//       totalDeals,
//       totalValue,
//       wonDeals,
//       avgDealValue,
//       winRate: totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0,
//     }
//   }

//   if (isLoading || tenantLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="flex flex-col items-center gap-4 text-white">
//           <RefreshCw className="w-8 h-8 animate-spin" />
//           <span>Loading deals...</span>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
//           <div className="text-white text-lg mb-2">Error Loading Deals</div>
//           <div className="text-gray-400 mb-4">{error}</div>
//           <Button
//             onClick={() => window.location.reload()}
//             variant="outline"
//             className="bg-gray-800 border-gray-600 text-white"
//           >
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Reload Page
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   if (!tenant) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
//           <div className="text-white text-lg mb-2">No Organization Selected</div>
//           <div className="text-gray-400 mb-4">Please select an organization to view deals</div>
//         </div>
//       </div>
//     )
//   }

//   if (deals.length === 0 && stages.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <div className="text-white text-lg mb-2">No Data Available</div>
//           <div className="text-gray-400 mb-4">No deals or deal stages found for this organization</div>
//           <Button onClick={handleNewDeal} className="bg-purple-600 hover:bg-purple-700 text-white">
//             <Plus className="w-4 h-4 mr-2" />
//             Create First Deal
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   const overallMetrics = getOverallMetrics()

//   return (
//     <div className="space-y-6">
//       {/* Header Section - Cards on left, Controls on right, same line */}
//       <div className="flex items-center justify-between">
//         {/* Left Side - Metrics Cards */}
//         <div className="grid grid-cols-4 gap-3">
//           <Card className="bg-gray-800/30 border-gray-700 w-32">
//             <CardContent className="p-3">
//               <div className="text-center">
//                 <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
//                 <div className="text-lg font-bold text-white">{overallMetrics.totalDeals}</div>
//                 <div className="text-xs text-gray-400">Total Deals</div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gray-800/30 border-gray-700 w-32">
//             <CardContent className="p-3">
//               <div className="text-center">
//                 <DollarSign className="w-4 h-4 text-green-400 mx-auto mb-1" />
//                 <div className="text-lg font-bold text-white">{formatCurrency(overallMetrics.totalValue)}</div>
//                 <div className="text-xs text-gray-400">Pipeline Value</div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gray-800/30 border-gray-700 w-32">
//             <CardContent className="p-3">
//               <div className="text-center">
//                 <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
//                 <div className="text-lg font-bold text-white">{overallMetrics.winRate.toFixed(1)}%</div>
//                 <div className="text-xs text-gray-400">Win Rate</div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gray-800/30 border-gray-700 w-32">
//             <CardContent className="p-3">
//               <div className="text-center">
//                 <TrendingUp className="w-4 h-4 text-purple-400 mx-auto mb-1" />
//                 <div className="text-lg font-bold text-white">{formatCurrency(overallMetrics.avgDealValue)}</div>
//                 <div className="text-xs text-gray-400">Avg Deal Size</div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Side - Controls */}
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search deals, companies, contacts..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 w-80 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
//             />
//           </div>

//           <Button
//             variant="outline"
//             className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700"
//             onClick={refreshData}
//             disabled={isRefreshing}
//           >
//             <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
//             Refresh
//           </Button>

//           <Button onClick={handleNewDeal} className="bg-purple-600 hover:bg-purple-700 text-white">
//             <Plus className="w-4 h-4 mr-2" />
//             New Deal
//           </Button>
//         </div>
//       </div>

//       {/* Deal Pipeline - HTML Table Structure */}
//       {stages.length > 0 ? (
//         <div className="w-full overflow-x-auto">
//           <table className="w-full border-collapse">
//             {/* Table Header - Stage Names (APPEARS ONLY ONCE) */}
//             <thead>
//               <tr>
//                 {stages.map((stage) => {
//                   const metrics = getStageMetrics(stage.id)
//                   return (
//                     <th key={stage.id} className="p-4 bg-gray-800/50 border border-gray-700 align-top">
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="flex items-center gap-2">
//                           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color || "#6B7280" }} />
//                           <h3 className="font-semibold text-white text-base">{stage.name}</h3>
//                         </div>
//                         <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs px-2 py-1">
//                           {metrics.count}
//                         </Badge>
//                       </div>
//                       <div className="text-xs text-gray-400">
//                         {metrics.totalValue > 0 && <div>{formatCurrency(metrics.totalValue)}</div>}
//                         {metrics.avgProbability > 0 && <div>{metrics.avgProbability}% avg probability</div>}
//                       </div>
//                     </th>
//                   )
//                 })}
//               </tr>
//             </thead>

//             {/* Table Body - Deal Cards */}
//             <tbody>
//               <tr>
//                 {stages.map((stage) => {
//                   const stageDeals = getDealsByStage(stage.id)
//                   console.log(`🎨 Rendering stage "${stage.name}" with ${stageDeals.length} deals`)

//                   return (
//                     <td
//                       key={stage.id}
//                       className="p-3 border border-gray-700 align-top bg-gray-800/20"
//                       style={{ width: `${100 / stages.length}%`, minHeight: "600px" }}
//                       onDragOver={handleDragOver}
//                       onDrop={(e) => handleDrop(e, stage.id)}
//                     >
//                       {/* Deal Cards Stacked Vertically */}
//                       <div className="space-y-3">
//                         {stageDeals.map((deal) => {
//                           console.log(`🎨 Rendering deal card: "${deal.title}" in stage "${stage.name}"`)
//                           return (
//                             <Card
//                               key={deal.id}
//                               draggable
//                               onDragStart={(e) => handleDragStart(e, deal)}
//                               className="w-full bg-gray-900/90 border-gray-600 hover:bg-gray-800/90 transition-all duration-200 cursor-pointer hover:shadow-lg"
//                               onClick={() => handleDealClick(deal)}
//                             >
//                               <CardHeader className="pb-3 px-4 pt-4">
//                                 <div className="flex items-start justify-between">
//                                   <div className="min-w-0 flex-1">
//                                     <CardTitle className="text-white text-sm font-semibold leading-tight">
//                                       {deal.title}
//                                     </CardTitle>
//                                     {deal.primary_contact && (
//                                       <p className="text-gray-400 text-xs mt-1">
//                                         {deal.primary_contact.company ||
//                                           `${deal.primary_contact.first_name} ${deal.primary_contact.last_name}`}
//                                       </p>
//                                     )}
//                                   </div>
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-6 w-6 p-0 text-gray-400 hover:text-white ml-2 flex-shrink-0"
//                                     onClick={(e) => e.stopPropagation()}
//                                   >
//                                     <MoreHorizontal className="w-4 h-4" />
//                                   </Button>
//                                 </div>
//                               </CardHeader>

//                               <CardContent className="pt-0 px-4 pb-4 space-y-3">
//                                 {/* Deal Value and Probability */}
//                                 <div className="flex items-center justify-between">
//                                   {deal.value && (
//                                     <span className="text-green-400 font-semibold text-sm">
//                                       {formatCurrency(deal.value)}
//                                     </span>
//                                   )}
//                                   {deal.probability > 0 && (
//                                     <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs px-2 py-0">
//                                       {deal.probability}%
//                                     </Badge>
//                                   )}
//                                 </div>

//                                 {/* Contact Info */}
//                                 {deal.primary_contact && (
//                                   <div className="text-gray-300 text-xs">
//                                     <div className="font-medium">
//                                       {deal.primary_contact.first_name} {deal.primary_contact.last_name}
//                                     </div>
//                                     {deal.primary_contact.title && (
//                                       <div className="text-gray-400">{deal.primary_contact.title}</div>
//                                     )}
//                                   </div>
//                                 )}

//                                 {/* Expected Close Date - Handle NULL values */}
//                                 {deal.expected_close_date ? (
//                                   <div className="text-gray-400 text-xs flex items-center gap-1">
//                                     <Calendar className="w-3 h-3" />
//                                     Close: {formatDate(deal.expected_close_date)}
//                                   </div>
//                                 ) : (
//                                   <div className="text-gray-500 text-xs flex items-center gap-1">
//                                     <Calendar className="w-3 h-3" />
//                                     Close: Not set
//                                   </div>
//                                 )}

//                                 {/* Action Buttons */}
//                                 <div className="flex items-center justify-between pt-2 border-t border-gray-700">
//                                   <div className="flex gap-1">
//                                     <Button
//                                       variant="ghost"
//                                       size="sm"
//                                       className="h-7 w-7 p-0 text-gray-400 hover:text-white"
//                                       onClick={(e) => e.stopPropagation()}
//                                     >
//                                       <Mail className="w-3 h-3" />
//                                     </Button>
//                                     <Button
//                                       variant="ghost"
//                                       size="sm"
//                                       className="h-7 w-7 p-0 text-gray-400 hover:text-white"
//                                       onClick={(e) => e.stopPropagation()}
//                                     >
//                                       <Phone className="w-3 h-3" />
//                                     </Button>
//                                   </div>
//                                   <div className="text-xs text-gray-500">{formatDate(deal.created_at)}</div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           )
//                         })}

//                         {/* Empty State */}
//                         {stageDeals.length === 0 && (
//                           <div className="text-center py-12 text-gray-500 text-sm">
//                             <div className="mb-2">No deals in this stage</div>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={handleNewDeal}
//                               className="text-gray-400 hover:text-white"
//                             >
//                               <Plus className="w-4 h-4 mr-1" />
//                               Add Deal
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   )
//                 })}
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <div className="text-white text-lg mb-2">No Deal Stages Found</div>
//           <div className="text-gray-400 mb-4">Create deal stages to start managing your pipeline</div>
//           <Button onClick={refreshData} className="bg-purple-600 hover:bg-purple-700 text-white">
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh Data
//           </Button>
//         </div>
//       )}

//       {/* Modals */}
//       {selectedDeal && <DealDetailPopup deal={selectedDeal} onClose={handleClosePopup} />}
//       {showNewDealWizard && <NewDealWizard onClose={handleCloseNewDealWizard} onDealCreated={handleDealCreated} />}
//     </div>
//   )
// }

// v2--------------------------------- without source -------------------------------------------

// "use client";

// import { Badge } from "@/components/ui/badge";
// import {
//   MoreHorizontal,
//   Calendar,
//   TrendingUp,
//   Plus,
//   Search,
//   Mail,
//   Phone,
//   DollarSign,
//   Users,
//   AlertCircle,
//   CheckCircle,
//   RefreshCw,
// } from "lucide-react";

// import type React from "react";
// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { DealDetailPopup } from "./deal-detail-popup";
// import { NewDealWizard } from "./new-deal-wizard";
// import { dealQueries } from "@/lib/supabase/queries";
// import { useTenant } from "@/contexts/tenant-context";
// import type { DealWithRelations, DealStage } from "@/lib/supabase/types";

// export function DealFlowBoard() {
//   const { tenant, organization, isLoading: tenantLoading } = useTenant();
//   const [deals, setDeals] = useState<DealWithRelations[]>([]);
//   const [stages, setStages] = useState<DealStage[]>([]);
//   const [selectedDeal, setSelectedDeal] = useState<DealWithRelations | null>(
//     null
//   );
//   const [showNewDealWizard, setShowNewDealWizard] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [draggedDeal, setDraggedDeal] = useState<DealWithRelations | null>(
//     null
//   );

//   // Track if data has been loaded to prevent unnecessary calls
//   const hasLoadedData = useRef(false);
//   const isLoadingRef = useRef(false);

//   // Stable tenant key for dependency arrays
//   const tenantKey = useMemo(() => {
//     if (!tenant?.id || !organization?.id) return null;
//     return `${tenant.id}-${organization.id}`;
//   }, [tenant?.id, organization?.id]);

//   // Memoized loadData function with proper dependencies
//   const loadData = useCallback(
//     async (forceRefresh = false) => {
//       console.log(
//         "🔄 loadData called - forceRefresh:",
//         forceRefresh,
//         "hasLoadedData:",
//         hasLoadedData.current
//       );

//       // Prevent multiple simultaneous calls
//       if (isLoadingRef.current && !forceRefresh) {
//         console.log("⚠️ Already loading, skipping...");
//         return;
//       }

//       // Don't load if tenant context is still loading
//       if (tenantLoading) {
//         console.log("⏸️ Tenant context still loading...");
//         return;
//       }

//       // Don't load if no tenant/organization
//       if (!tenant?.id || !organization?.id) {
//         console.log("❌ No tenant or organization available");
//         setDeals([]);
//         setStages([]);
//         setIsLoading(false);
//         hasLoadedData.current = false;
//         return;
//       }

//       // For route changes, always load even if data exists
//       if (hasLoadedData.current && !forceRefresh) {
//         console.log(
//           "✅ Data already loaded and not forcing refresh, skipping..."
//         );
//         return;
//       }

//       try {
//         isLoadingRef.current = true;
//         setError(null);

//         console.log(
//           "🚀 Loading data for tenant:",
//           tenant.id,
//           "organization:",
//           organization.id
//         );

//         // Add timeout to prevent hanging
//         const timeoutPromise = new Promise<never>((_, reject) =>
//           setTimeout(() => reject(new Error("Request timeout")), 15000)
//         );

//         const dataPromise = Promise.all([
//           dealQueries.getDeals(),
//           dealQueries.getDealStages(),
//         ]);

//         const [dealsData, stagesData] = (await Promise.race([
//           dataPromise,
//           timeoutPromise,
//         ])) as [DealWithRelations[], DealStage[]];

//         console.log(
//           "✅ Raw data loaded - deals:",
//           dealsData?.length || 0,
//           "stages:",
//           stagesData?.length || 0
//         );

//         // Filter by both tenant_id AND organization_id
//         const filteredDeals =
//           dealsData?.filter(
//             (deal: DealWithRelations) =>
//               deal.tenant_id === tenant.id &&
//               deal.organization_id === organization.id
//           ) || [];

//         const filteredStages =
//           stagesData?.filter(
//             (stage: DealStage) =>
//               stage.tenant_id === tenant.id &&
//               stage.organization_id === organization.id
//           ) || [];

//         console.log(
//           "🔍 Filtered data - deals:",
//           filteredDeals.length,
//           "stages:",
//           filteredStages.length
//         );

//         setDeals(filteredDeals);
//         setStages(filteredStages);
//         hasLoadedData.current = true;

//         console.log("✅ Data loading complete");
//       } catch (error: any) {
//         console.error("❌ Error loading deals:", error);
//         setError(error.message || "Failed to load deals");
//         hasLoadedData.current = false;
//       } finally {
//         isLoadingRef.current = false;
//       }
//     },
//     [tenantKey, tenantLoading, tenant?.id, organization?.id]
//   ); // Include tenant/org IDs directly

//   // Single effect for initial load - only runs when tenantKey changes
//   useEffect(() => {
//     console.log(
//       "🎯 useEffect triggered - tenantKey:",
//       tenantKey,
//       "tenantLoading:",
//       tenantLoading
//     );

//     if (tenantLoading) {
//       console.log("⏸️ Tenant still loading...");
//       return;
//     }

//     const initialLoad = async () => {
//       setIsLoading(true);
//       // Always reset and reload when component mounts or tenant changes
//       hasLoadedData.current = false;
//       await loadData(true); // Force refresh on route change
//       setIsLoading(false);
//     };

//     if (tenantKey) {
//       initialLoad();
//     } else {
//       setIsLoading(false);
//       setDeals([]);
//       setStages([]);
//     }
//   }, [tenantKey, tenantLoading, loadData]);

//   // Additional effect to handle route changes - reset state when component mounts
//   useEffect(() => {
//     console.log("🔄 Component mounted/remounted - resetting state");
//     hasLoadedData.current = false;
//     isLoadingRef.current = false;
//   }, []);

//   // Manual refresh function
//   const refreshData = useCallback(async () => {
//     console.log("🔄 Manual refresh triggered");
//     setIsRefreshing(true);
//     hasLoadedData.current = false; // Force reload
//     await loadData(true); // Force refresh
//     setIsRefreshing(false);
//   }, [loadData]);

//   const handleDealClick = useCallback((deal: DealWithRelations) => {
//     setSelectedDeal(deal);
//   }, []);

//   const handleClosePopup = useCallback(() => {
//     setSelectedDeal(null);
//   }, []);

//   const handleNewDeal = useCallback(() => {
//     setShowNewDealWizard(true);
//   }, []);

//   const handleCloseNewDealWizard = useCallback(() => {
//     setShowNewDealWizard(false);
//   }, []);

//   const handleDealCreated = useCallback(async () => {
//     console.log("🆕 New deal created, refreshing data...");
//     await refreshData();
//   }, [refreshData]);

//   const handleDragStart = useCallback(
//     (e: React.DragEvent, deal: DealWithRelations) => {
//       setDraggedDeal(deal);
//       e.dataTransfer.effectAllowed = "move";
//     },
//     []
//   );

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//   }, []);

//   const handleDrop = useCallback(
//     async (e: React.DragEvent, targetStageId: string) => {
//       e.preventDefault();

//       if (!draggedDeal || draggedDeal.stage_id === targetStageId) {
//         setDraggedDeal(null);
//         return;
//       }

//       try {
//         const targetStage = stages.find((s) => s.id === targetStageId);
//         if (!targetStage) return;

//         console.log("🎯 Moving deal to new stage...");

//         await dealQueries.updateDeal(draggedDeal.id, {
//           stage_id: targetStageId,
//           probability: targetStage.probability_percentage || 50,
//         });

//         // Only refresh after successful update
//         await refreshData();
//       } catch (error: any) {
//         console.error("Error moving deal:", error);
//         setError("Failed to move deal");
//       } finally {
//         setDraggedDeal(null);
//       }
//     },
//     [draggedDeal, stages, refreshData]
//   );

//   // Memoize filtered deals to prevent unnecessary recalculations
//   const getDealsByStage = useMemo(() => {
//     const dealsByStage: { [stageId: string]: DealWithRelations[] } = {};

//     stages.forEach((stage) => {
//       const stageDeals = deals.filter((deal) => deal.stage_id === stage.id);

//       const filteredBySearch = stageDeals.filter((deal) => {
//         if (searchTerm === "") return true;

//         const searchLower = searchTerm.toLowerCase();
//         return (
//           deal.title.toLowerCase().includes(searchLower) ||
//           deal.primary_contact?.company?.toLowerCase().includes(searchLower) ||
//           `${deal.primary_contact?.first_name} ${deal.primary_contact?.last_name}`
//             .toLowerCase()
//             .includes(searchLower)
//         );
//       });

//       dealsByStage[stage.id] = filteredBySearch;
//     });

//     return dealsByStage;
//   }, [deals, stages, searchTerm]);

//   // Memoize stage metrics
//   const stageMetrics = useMemo(() => {
//     const metrics: {
//       [stageId: string]: {
//         count: number;
//         totalValue: number;
//         avgProbability: number;
//       };
//     } = {};

//     Object.entries(getDealsByStage).forEach(([stageId, stageDeals]) => {
//       const totalValue = stageDeals.reduce(
//         (sum, deal) => sum + (deal.value || 0),
//         0
//       );
//       const avgProbability =
//         stageDeals.length > 0
//           ? stageDeals.reduce((sum, deal) => sum + deal.probability, 0) /
//             stageDeals.length
//           : 0;

//       metrics[stageId] = {
//         count: stageDeals.length,
//         totalValue,
//         avgProbability: Math.round(avgProbability),
//       };
//     });

//     return metrics;
//   }, [getDealsByStage]);

//   // Memoize utility functions
//   const formatCurrency = useCallback((amount: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   }, []);

//   const formatDate = useCallback((dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   }, []);

//   // Memoize overall metrics
//   const overallMetrics = useMemo(() => {
//     const totalDeals = deals.length;
//     const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

//     const wonDeals = deals.filter((deal) => {
//       if (deal.stage?.is_won) return true;
//       const stageName = deal.stage?.name?.toLowerCase();
//       return stageName === "closed won" || stageName === "won";
//     }).length;

//     const avgDealValue = totalDeals > 0 ? totalValue / totalDeals : 0;

//     return {
//       totalDeals,
//       totalValue,
//       wonDeals,
//       avgDealValue,
//       winRate: totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0,
//     };
//   }, [deals]);

//   // Early returns for loading states
//   if (tenantLoading || (isLoading && !hasLoadedData.current)) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="flex flex-col items-center gap-4 text-white">
//           <RefreshCw className="w-8 h-8 animate-spin" />
//           <span>Loading deals...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
//           <div className="text-white text-lg mb-2">Error Loading Deals</div>
//           <div className="text-gray-400 mb-4">{error}</div>
//           <Button
//             onClick={refreshData}
//             variant="outline"
//             className="bg-gray-800 border-gray-600 text-white"
//           >
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Try Again
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   if (!tenant || !organization) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
//           <div className="text-white text-lg mb-2">
//             No Organization Selected
//           </div>
//           <div className="text-gray-400 mb-4">
//             Please select an organization to view deals
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (deals.length === 0 && stages.length === 0 && hasLoadedData.current) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <div className="text-white text-lg mb-2">No Data Available</div>
//           <div className="text-gray-400 mb-4">
//             No deals or deal stages found for this organization
//           </div>
//           <Button
//             onClick={handleNewDeal}
//             className="bg-purple-600 hover:bg-purple-700 text-white"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Create First Deal
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="flex items-center justify-between">
//         {/* Metrics Cards */}
//         <div className="grid grid-cols-4 gap-3">
//           <Card className="bg-gray-800/30 border-gray-700 w-32">
//             <CardContent className="p-3">
//               <div className="text-center">
//                 <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
//                 <div className="text-lg font-bold text-white">
//                   {overallMetrics.totalDeals}
//                 </div>
//                 <div className="text-xs text-gray-400">Total Deals</div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gray-800/30 border-gray-700 w-32">
//             <CardContent className="p-3">
//               <div className="text-center">
//                 <DollarSign className="w-4 h-4 text-green-400 mx-auto mb-1" />
//                 <div className="text-lg font-bold text-white">
//                   {formatCurrency(overallMetrics.totalValue)}
//                 </div>
//                 <div className="text-xs text-gray-400">Pipeline Value</div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gray-800/30 border-gray-700 w-32">
//             <CardContent className="p-3">
//               <div className="text-center">
//                 <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
//                 <div className="text-lg font-bold text-white">
//                   {overallMetrics.winRate.toFixed(1)}%
//                 </div>
//                 <div className="text-xs text-gray-400">Win Rate</div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gray-800/30 border-gray-700 w-32">
//             <CardContent className="p-3">
//               <div className="text-center">
//                 <TrendingUp className="w-4 h-4 text-purple-400 mx-auto mb-1" />
//                 <div className="text-lg font-bold text-white">
//                   {formatCurrency(overallMetrics.avgDealValue)}
//                 </div>
//                 <div className="text-xs text-gray-400">Avg Deal Size</div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Controls */}
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search deals, companies, contacts..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 w-80 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
//             />
//           </div>

//           <Button
//             variant="outline"
//             className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700"
//             onClick={refreshData}
//             disabled={isRefreshing}
//           >
//             <RefreshCw
//               className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
//             />
//             Refresh
//           </Button>

//           <Button
//             onClick={handleNewDeal}
//             className="bg-purple-600 hover:bg-purple-700 text-white"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             New Deal
//           </Button>
//         </div>
//       </div>

//       {/* Deal Pipeline */}
//       {stages.length > 0 ? (
//         <div className="w-full overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr>
//                 {stages.map((stage) => {
//                   const metrics = stageMetrics[stage.id] || {
//                     count: 0,
//                     totalValue: 0,
//                     avgProbability: 0,
//                   };
//                   return (
//                     <th
//                       key={stage.id}
//                       className="p-4 bg-gray-800/50 border border-gray-700 align-top"
//                     >
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="flex items-center gap-2">
//                           <div
//                             className="w-3 h-3 rounded-full"
//                             style={{
//                               backgroundColor: stage.color || "#6B7280",
//                             }}
//                           />
//                           <h3 className="font-semibold text-white text-base">
//                             {stage.name}
//                           </h3>
//                         </div>
//                         <Badge
//                           variant="secondary"
//                           className="bg-gray-700 text-gray-300 text-xs px-2 py-1"
//                         >
//                           {metrics.count}
//                         </Badge>
//                       </div>
//                       <div className="text-xs text-gray-400">
//                         {metrics.totalValue > 0 && (
//                           <div>{formatCurrency(metrics.totalValue)}</div>
//                         )}
//                         {metrics.avgProbability > 0 && (
//                           <div>{metrics.avgProbability}% avg probability</div>
//                         )}
//                       </div>
//                     </th>
//                   );
//                 })}
//               </tr>
//             </thead>

//             <tbody>
//               <tr>
//                 {stages.map((stage) => {
//                   const stageDeals = getDealsByStage[stage.id] || [];

//                   return (
//                     <td
//                       key={stage.id}
//                       className="p-3 border border-gray-700 align-top bg-gray-800/20"
//                       style={{
//                         width: `${100 / stages.length}%`,
//                         minHeight: "600px",
//                       }}
//                       onDragOver={handleDragOver}
//                       onDrop={(e) => handleDrop(e, stage.id)}
//                     >
//                       <div className="space-y-3">
//                         {stageDeals.map((deal) => (
//                           <Card
//                             key={deal.id}
//                             draggable
//                             onDragStart={(e) => handleDragStart(e, deal)}
//                             className="w-full bg-gray-900/90 border-gray-600 hover:bg-gray-800/90 transition-all duration-200 cursor-pointer hover:shadow-lg"
//                             onClick={() => handleDealClick(deal)}
//                           >
//                             <CardHeader className="pb-3 px-4 pt-4">
//                               <div className="flex items-start justify-between">
//                                 <div className="min-w-0 flex-1">
//                                   <CardTitle className="text-white text-sm font-semibold leading-tight">
//                                     {deal.title}
//                                   </CardTitle>
//                                   {deal.primary_contact && (
//                                     <p className="text-gray-400 text-xs mt-1">
//                                       {deal.primary_contact.company ||
//                                         `${deal.primary_contact.first_name} ${deal.primary_contact.last_name}`}
//                                     </p>
//                                   )}
//                                 </div>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="h-6 w-6 p-0 text-gray-400 hover:text-white ml-2 flex-shrink-0"
//                                   onClick={(e) => e.stopPropagation()}
//                                 >
//                                   <MoreHorizontal className="w-4 h-4" />
//                                 </Button>
//                               </div>
//                             </CardHeader>

//                             <CardContent className="pt-0 px-4 pb-4 space-y-3">
//                               <div className="flex items-center justify-between">
//                                 {deal.value && (
//                                   <span className="text-green-400 font-semibold text-sm">
//                                     {formatCurrency(deal.value)}
//                                   </span>
//                                 )}
//                                 {deal.probability > 0 && (
//                                   <Badge
//                                     variant="secondary"
//                                     className="bg-gray-700 text-gray-300 text-xs px-2 py-0"
//                                   >
//                                     {deal.probability}%
//                                   </Badge>
//                                 )}
//                               </div>

//                               {deal.primary_contact && (
//                                 <div className="text-gray-300 text-xs">
//                                   <div className="font-medium">
//                                     {deal.primary_contact.first_name}{" "}
//                                     {deal.primary_contact.last_name}
//                                   </div>
//                                   {deal.primary_contact.title && (
//                                     <div className="text-gray-400">
//                                       {deal.primary_contact.title}
//                                     </div>
//                                   )}
//                                 </div>
//                               )}

//                               {deal.expected_close_date ? (
//                                 <div className="text-gray-400 text-xs flex items-center gap-1">
//                                   <Calendar className="w-3 h-3" />
//                                   Close: {formatDate(deal.expected_close_date)}
//                                 </div>
//                               ) : (
//                                 <div className="text-gray-500 text-xs flex items-center gap-1">
//                                   <Calendar className="w-3 h-3" />
//                                   Close: Not set
//                                 </div>
//                               )}

//                               <div className="flex items-center justify-between pt-2 border-t border-gray-700">
//                                 <div className="flex gap-1">
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-7 w-7 p-0 text-gray-400 hover:text-white"
//                                     onClick={(e) => e.stopPropagation()}
//                                   >
//                                     <Mail className="w-3 h-3" />
//                                   </Button>
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-7 w-7 p-0 text-gray-400 hover:text-white"
//                                     onClick={(e) => e.stopPropagation()}
//                                   >
//                                     <Phone className="w-3 h-3" />
//                                   </Button>
//                                 </div>
//                                 <div className="text-xs text-gray-500">
//                                   {formatDate(deal.created_at)}
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}

//                         {stageDeals.length === 0 && (
//                           <div className="text-center py-12 text-gray-500 text-sm">
//                             <div className="mb-2">No deals in this stage</div>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={handleNewDeal}
//                               className="text-gray-400 hover:text-white"
//                             >
//                               <Plus className="w-4 h-4 mr-1" />
//                               Add Deal
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   );
//                 })}
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <div className="text-white text-lg mb-2">No Deal Stages Found</div>
//           <div className="text-gray-400 mb-4">
//             Create deal stages to start managing your pipeline
//           </div>
//           <Button
//             onClick={refreshData}
//             className="bg-purple-600 hover:bg-purple-700 text-white"
//           >
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh Data
//           </Button>
//         </div>
//       )}

//       {/* Modals */}
//       {selectedDeal && (
//         <DealDetailPopup deal={selectedDeal} onClose={handleClosePopup} />
//       )}
//       {showNewDealWizard && (
//         <NewDealWizard
//           onClose={handleCloseNewDealWizard}
//           onDealCreated={handleDealCreated}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Calendar,
  TrendingUp,
  Plus,
  Search,
  Mail,
  Phone,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

import type React from "react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DealDetailPopup } from "./deal-detail-popup";
import { NewDealWizard } from "./new-deal-wizard";
import { dealQueries } from "@/lib/supabase/queries";
import { useTenant } from "@/contexts/tenant-context";
import type { DealWithRelations, DealStage } from "@/lib/supabase/types";

export function DealFlowBoard() {
  const { tenant, organization, isLoading: tenantLoading } = useTenant();
  const [deals, setDeals] = useState<DealWithRelations[]>([]);
  const [stages, setStages] = useState<DealStage[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<DealWithRelations | null>(
    null
  );
  const [showNewDealWizard, setShowNewDealWizard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedDeal, setDraggedDeal] = useState<DealWithRelations | null>(
    null
  );

  // Track if data has been loaded to prevent unnecessary calls
  const hasLoadedData = useRef(false);
  const isLoadingRef = useRef(false);

  // Stable tenant key for dependency arrays
  const tenantKey = useMemo(() => {
    if (!tenant?.id || !organization?.id) return null;
    return `${tenant.id}-${organization.id}`;
  }, [tenant?.id, organization?.id]);

  // Memoized loadData function with proper dependencies
  const loadData = useCallback(
    async (forceRefresh = false) => {
      console.log(
        "🔄 loadData called - forceRefresh:",
        forceRefresh,
        "hasLoadedData:",
        hasLoadedData.current
      );

      // Prevent multiple simultaneous calls
      if (isLoadingRef.current && !forceRefresh) {
        console.log("⚠️ Already loading, skipping...");
        return;
      }

      // Don't load if tenant context is still loading
      if (tenantLoading) {
        console.log("⏸️ Tenant context still loading...");
        return;
      }

      // Don't load if no tenant/organization
      if (!tenant?.id || !organization?.id) {
        console.log("❌ No tenant or organization available");
        setDeals([]);
        setStages([]);
        setIsLoading(false);
        hasLoadedData.current = false;
        return;
      }

      // For route changes, always load even if data exists
      if (hasLoadedData.current && !forceRefresh) {
        console.log(
          "✅ Data already loaded and not forcing refresh, skipping..."
        );
        return;
      }

      try {
        isLoadingRef.current = true;
        setError(null);

        console.log(
          "🚀 Loading data for tenant:",
          tenant.id,
          "organization:",
          organization.id
        );

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 15000)
        );

        const dataPromise = Promise.all([
          dealQueries.getDeals(),
          dealQueries.getDealStages(),
        ]);

        const [dealsData, stagesData] = (await Promise.race([
          dataPromise,
          timeoutPromise,
        ])) as [DealWithRelations[], DealStage[]];

        console.log(
          "✅ Raw data loaded - deals:",
          dealsData?.length || 0,
          "stages:",
          stagesData?.length || 0
        );

        // Filter by both tenant_id AND organization_id
        const filteredDeals =
          dealsData?.filter(
            (deal: DealWithRelations) =>
              deal.tenant_id === tenant.id &&
              deal.organization_id === organization.id
          ) || [];

        const filteredStages =
          stagesData?.filter(
            (stage: DealStage) =>
              stage.tenant_id === tenant.id &&
              stage.organization_id === organization.id
          ) || [];

        console.log(
          "🔍 Filtered data - deals:",
          filteredDeals.length,
          "stages:",
          filteredStages.length
        );

        setDeals(filteredDeals);
        setStages(filteredStages);
        hasLoadedData.current = true;

        console.log("✅ Data loading complete");
      } catch (error: any) {
        console.error("❌ Error loading deals:", error);
        setError(error.message || "Failed to load deals");
        hasLoadedData.current = false;
      } finally {
        isLoadingRef.current = false;
      }
    },
    [tenantKey, tenantLoading, tenant?.id, organization?.id]
  ); // Include tenant/org IDs directly

  // Single effect for initial load - only runs when tenantKey changes
  useEffect(() => {
    console.log(
      "🎯 useEffect triggered - tenantKey:",
      tenantKey,
      "tenantLoading:",
      tenantLoading
    );

    if (tenantLoading) {
      console.log("⏸️ Tenant still loading...");
      return;
    }

    const initialLoad = async () => {
      setIsLoading(true);
      // Always reset and reload when component mounts or tenant changes
      hasLoadedData.current = false;
      await loadData(true); // Force refresh on route change
      setIsLoading(false);
    };

    if (tenantKey) {
      initialLoad();
    } else {
      setIsLoading(false);
      setDeals([]);
      setStages([]);
    }
  }, [tenantKey, tenantLoading, loadData]);

  // Additional effect to handle route changes - reset state when component mounts
  useEffect(() => {
    console.log("🔄 Component mounted/remounted - resetting state");
    hasLoadedData.current = false;
    isLoadingRef.current = false;
  }, []);

  // Manual refresh function
  const refreshData = useCallback(async () => {
    console.log("🔄 Manual refresh triggered");
    setIsRefreshing(true);
    hasLoadedData.current = false; // Force reload
    await loadData(true); // Force refresh
    setIsRefreshing(false);
  }, [loadData]);

  const handleDealClick = useCallback((deal: DealWithRelations) => {
    setSelectedDeal(deal);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedDeal(null);
  }, []);

  const handleNewDeal = useCallback(() => {
    setShowNewDealWizard(true);
  }, []);

  const handleCloseNewDealWizard = useCallback(() => {
    setShowNewDealWizard(false);
  }, []);

  const handleDealCreated = useCallback(async () => {
    console.log("🆕 New deal created, refreshing data...");
    await refreshData();
  }, [refreshData]);

  const handleDragStart = useCallback(
    (e: React.DragEvent, deal: DealWithRelations) => {
      setDraggedDeal(deal);
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, targetStageId: string) => {
      e.preventDefault();

      if (!draggedDeal || draggedDeal.stage_id === targetStageId) {
        setDraggedDeal(null);
        return;
      }

      try {
        const targetStage = stages.find((s) => s.id === targetStageId);
        if (!targetStage) return;

        console.log("🎯 Moving deal to new stage...");

        await dealQueries.updateDeal(draggedDeal.id, {
          stage_id: targetStageId,
          probability: targetStage.probability_percentage || 50,
        });

        // Only refresh after successful update
        await refreshData();
      } catch (error: any) {
        console.error("Error moving deal:", error);
        setError("Failed to move deal");
      } finally {
        setDraggedDeal(null);
      }
    },
    [draggedDeal, stages, refreshData]
  );

  // Memoize filtered deals to prevent unnecessary recalculations
  const getDealsByStage = useMemo(() => {
    const dealsByStage: { [stageId: string]: DealWithRelations[] } = {};

    stages.forEach((stage) => {
      const stageDeals = deals.filter((deal) => deal.stage_id === stage.id);

      const filteredBySearch = stageDeals.filter((deal) => {
        if (searchTerm === "") return true;

        const searchLower = searchTerm.toLowerCase();
        return (
          deal.title.toLowerCase().includes(searchLower) ||
          deal.primary_contact?.company?.toLowerCase().includes(searchLower) ||
          `${deal.primary_contact?.first_name} ${deal.primary_contact?.last_name}`
            .toLowerCase()
            .includes(searchLower) ||
          deal.source?.toLowerCase().includes(searchLower)
        );
      });

      dealsByStage[stage.id] = filteredBySearch;
    });

    return dealsByStage;
  }, [deals, stages, searchTerm]);

  // Memoize stage metrics
  const stageMetrics = useMemo(() => {
    const metrics: {
      [stageId: string]: {
        count: number;
        totalValue: number;
        avgProbability: number;
      };
    } = {};

    Object.entries(getDealsByStage).forEach(([stageId, stageDeals]) => {
      const totalValue = stageDeals.reduce(
        (sum, deal) => sum + (deal.value || 0),
        0
      );
      const avgProbability =
        stageDeals.length > 0
          ? stageDeals.reduce((sum, deal) => sum + deal.probability, 0) /
            stageDeals.length
          : 0;

      metrics[stageId] = {
        count: stageDeals.length,
        totalValue,
        avgProbability: Math.round(avgProbability),
      };
    });

    return metrics;
  }, [getDealsByStage]);

  // Memoize utility functions
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  // Function to get source badge color
  const getSourceBadgeColor = useCallback((source: string | null) => {
    if (!source) return "bg-gray-600 text-gray-300";

    const lowerSource = source.toLowerCase();
    if (lowerSource === "pipedrive") {
      return "bg-green-600 text-white";
    }
    if (lowerSource === "zoho") {
      return "bg-blue-500 text-white";
    }
    if (lowerSource === "hubspot") {
      return "bg-orange-600 text-white";
    }
    if (lowerSource.includes("ai") || lowerSource.includes("wizard")) {
      return "bg-purple-600 text-purple-100";
    }
    if (lowerSource.includes("referral")) {
      return "bg-blue-600 text-blue-100";
    }
    if (lowerSource.includes("website") || lowerSource.includes("web")) {
      return "bg-green-600 text-green-100";
    }
    if (lowerSource.includes("social") || lowerSource.includes("linkedin")) {
      return "bg-indigo-600 text-indigo-100";
    }
    if (lowerSource.includes("email") || lowerSource.includes("marketing")) {
      return "bg-orange-600 text-orange-100";
    }
    if (lowerSource.includes("cold") || lowerSource.includes("outbound")) {
      return "bg-red-600 text-red-100";
    }

    return "bg-gray-600 text-gray-300";
  }, []);

  // Function to render source icon
  const renderSourceIcon = useCallback((source: string) => {
    const lowerSource = source.toLowerCase();

    if (lowerSource === "hubspot") {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 27 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <path
            d="M19.6142 20.1771C17.5228 20.1771 15.8274 18.4993 15.8274 16.43C15.8274 14.3603 17.5228 12.6825 19.6142 12.6825C21.7057 12.6825 23.401 14.3603 23.401 16.43C23.401 18.4993 21.7057 20.1771 19.6142 20.1771ZM20.7479 9.21551V5.88191C21.6272 5.47091 22.2431 4.59068 22.2431 3.56913V3.49218C22.2431 2.08229 21.0774 0.928781 19.6527 0.928781H19.5754C18.1507 0.928781 16.985 2.08229 16.985 3.49218V3.56913C16.985 4.59068 17.6009 5.47127 18.4802 5.88227V9.21551C17.1711 9.4158 15.9749 9.95012 14.9885 10.7365L5.73944 3.61659C5.80048 3.38467 5.84336 3.14591 5.84372 2.89493C5.84518 1.29842 4.5393 0.00215931 2.92531 1.87311e-06C1.31205 -0.0018 0.00181863 1.29087 1.8933e-06 2.88774C-0.00181848 4.4846 1.30406 5.78087 2.91805 5.78266C3.44381 5.78338 3.9307 5.6356 4.35727 5.3954L13.4551 12.3995C12.6816 13.5552 12.2281 14.9396 12.2281 16.43C12.2281 17.9902 12.7263 19.4335 13.5678 20.6205L10.8012 23.3586C10.5825 23.2935 10.3558 23.2482 10.1152 23.2482C8.78938 23.2482 7.71424 24.3119 7.71424 25.6239C7.71424 26.9364 8.78938 28 10.1152 28C11.4415 28 12.5162 26.9364 12.5162 25.6239C12.5162 25.3866 12.4705 25.1619 12.4047 24.9454L15.1414 22.2371C16.3837 23.1752 17.9308 23.7391 19.6142 23.7391C23.6935 23.7391 27 20.4666 27 16.43C27 12.7757 24.2872 9.75667 20.7479 9.21551Z"
            fill="#f95c35"
          />
        </svg>
      );
    }

    if (lowerSource === "pipedrive") {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <circle cx="16" cy="16" r="16" fill="#28a745" />
          <path
            d="M24.9842 13.4564C24.9842 17.8851 22.1247 20.914 18.036 20.914C16.0923 20.914 14.4903 20.1136 13.8906 19.1134L13.9189 20.142V26.4847H9.74512V10.0846C9.74512 9.85644 9.68836 9.79843 9.4304 9.79843H8V6.31321H11.4889C13.0896 6.31321 13.4907 7.68461 13.6042 8.28525C14.2337 7.22834 15.8911 6 18.2359 6C22.2679 5.99871 24.9842 8.99802 24.9842 13.4564ZM20.724 13.4847C20.724 11.1131 19.1801 9.48523 17.2351 9.48523C15.6344 9.48523 13.8325 10.5421 13.8325 13.5144C13.8325 15.4568 14.9186 17.4855 17.1783 17.4855C18.837 17.4842 20.724 16.2843 20.724 13.4847Z"
            fill="#FFFFFF"
          />
        </svg>
      );
    }

    if (lowerSource === "zoho") {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 300 300"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
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
      );
    }

    // Default icon for other sources
    return <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />;
  }, []);

  // Memoize overall metrics
  const overallMetrics = useMemo(() => {
    const totalDeals = deals.length;
    const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

    const wonDeals = deals.filter((deal) => {
      if (deal.stage?.is_won) return true;
      const stageName = deal.stage?.name?.toLowerCase();
      return stageName === "closed won" || stageName === "won";
    }).length;

    const avgDealValue = totalDeals > 0 ? totalValue / totalDeals : 0;

    return {
      totalDeals,
      totalValue,
      wonDeals,
      avgDealValue,
      winRate: totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0,
    };
  }, [deals]);

  // Early returns for loading states
  if (tenantLoading || (isLoading && !hasLoadedData.current)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4 text-white">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span>Loading deals...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <div className="text-white text-lg mb-2">Error Loading Deals</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <Button
            onClick={refreshData}
            variant="outline"
            className="bg-gray-800 border-gray-600 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!tenant || !organization) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <div className="text-white text-lg mb-2">
            No Organization Selected
          </div>
          <div className="text-gray-400 mb-4">
            Please select an organization to view deals
          </div>
        </div>
      </div>
    );
  }

  if (deals.length === 0 && stages.length === 0 && hasLoadedData.current) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="text-white text-lg mb-2">No Data Available</div>
          <div className="text-gray-400 mb-4">
            No deals or deal stages found for this organization
          </div>
          <Button
            onClick={handleNewDeal}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Deal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-gray-800/30 border-gray-700 w-32">
            <CardContent className="p-3">
              <div className="text-center">
                <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">
                  {overallMetrics.totalDeals}
                </div>
                <div className="text-xs text-gray-400">Total Deals</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700 w-32">
            <CardContent className="p-3">
              <div className="text-center">
                <DollarSign className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">
                  {formatCurrency(overallMetrics.totalValue)}
                </div>
                <div className="text-xs text-gray-400">Pipeline Value</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700 w-32">
            <CardContent className="p-3">
              <div className="text-center">
                <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">
                  {overallMetrics.winRate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">Win Rate</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700 w-32">
            <CardContent className="p-3">
              <div className="text-center">
                <TrendingUp className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">
                  {formatCurrency(overallMetrics.avgDealValue)}
                </div>
                <div className="text-xs text-gray-400">Avg Deal Size</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search deals, companies, contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>

          <Button
            variant="outline"
            className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            onClick={handleNewDeal}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Deal Pipeline */}
      {stages.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {stages.map((stage) => {
                  const metrics = stageMetrics[stage.id] || {
                    count: 0,
                    totalValue: 0,
                    avgProbability: 0,
                  };
                  return (
                    <th
                      key={stage.id}
                      className="p-4 bg-gray-800/50 border border-gray-700 align-top"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: stage.color || "#6B7280",
                            }}
                          />
                          <h3 className="font-semibold text-white text-base">
                            {stage.name}
                          </h3>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-gray-700 text-gray-300 text-xs px-2 py-1"
                        >
                          {metrics.count}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400">
                        {metrics.totalValue > 0 && (
                          <div>{formatCurrency(metrics.totalValue)}</div>
                        )}
                        {metrics.avgProbability > 0 && (
                          <div>{metrics.avgProbability}% avg probability</div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              <tr>
                {stages.map((stage) => {
                  const stageDeals = getDealsByStage[stage.id] || [];

                  return (
                    <td
                      key={stage.id}
                      className="p-3 border border-gray-700 align-top bg-gray-800/20"
                      style={{
                        width: `${100 / stages.length}%`,
                        minHeight: "600px",
                      }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, stage.id)}
                    >
                      <div className="space-y-3">
                        {stageDeals.map((deal) => (
                          <Card
                            key={deal.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, deal)}
                            className="w-full bg-gray-900/90 border-gray-600 hover:bg-gray-800/90 transition-all duration-200 cursor-pointer hover:shadow-lg"
                            onClick={() => handleDealClick(deal)}
                          >
                            <CardHeader className="pb-3 px-4 pt-4">
                              <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                  <CardTitle className="text-white text-sm font-semibold leading-tight">
                                    {deal.title}
                                  </CardTitle>
                                  {deal.primary_contact && (
                                    <p className="text-gray-400 text-xs mt-1">
                                      {deal.primary_contact.company ||
                                        `${deal.primary_contact.first_name} ${deal.primary_contact.last_name}`}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-white ml-2 flex-shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardHeader>

                            <CardContent className="pt-0 px-4 pb-4 space-y-3">
                              <div className="flex items-center justify-between">
                                {deal.value && (
                                  <span className="text-green-400 font-semibold text-sm">
                                    {formatCurrency(deal.value)}
                                  </span>
                                )}
                                {deal.probability > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-gray-700 text-gray-300 text-xs px-2 py-0"
                                  >
                                    {deal.probability}%
                                  </Badge>
                                )}
                              </div>

                              {deal.primary_contact && (
                                <div className="text-gray-300 text-xs">
                                  <div className="font-medium">
                                    {deal.primary_contact.first_name}{" "}
                                    {deal.primary_contact.last_name}
                                  </div>
                                  {deal.primary_contact.title && (
                                    <div className="text-gray-400">
                                      {deal.primary_contact.title}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Source Badge - better position */}
                              {deal.source && (
                                <div className="flex items-center gap-1">
                                  {renderSourceIcon(deal.source)}
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs px-2 py-0.5 ${getSourceBadgeColor(
                                      deal.source
                                    )}`}
                                  >
                                    {deal.source}
                                  </Badge>
                                </div>
                              )}

                              {deal.expected_close_date ? (
                                <div className="text-gray-400 text-xs flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Close: {formatDate(deal.expected_close_date)}
                                </div>
                              ) : (
                                <div className="text-gray-500 text-xs flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Close: Not set
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-gray-400 hover:text-white"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Mail className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-gray-400 hover:text-white"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Phone className="w-3 h-3" />
                                  </Button>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(deal.created_at)}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {stageDeals.length === 0 && (
                          <div className="text-center py-12 text-gray-500 text-sm">
                            <div className="mb-2">No deals in this stage</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleNewDeal}
                              className="text-gray-400 hover:text-white"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Deal
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-white text-lg mb-2">No Deal Stages Found</div>
          <div className="text-gray-400 mb-4">
            Create deal stages to start managing your pipeline
          </div>
          <Button
            onClick={refreshData}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      )}

      {/* Modals */}
      {selectedDeal && (
        <DealDetailPopup deal={selectedDeal} onClose={handleClosePopup} />
      )}
      {showNewDealWizard && (
        <NewDealWizard
          onClose={handleCloseNewDealWizard}
          onDealCreated={handleDealCreated}
        />
      )}
    </div>
  );
}
