"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Deal {
  id: string;
  title?: string | null | undefined;
  value?: number | null | undefined;
  currency?: string | null | undefined;
  stage_name?: string | null | undefined;
  stage_id?: string | null | undefined;
  primary_contact_id?: string | null | undefined;
  expected_close_date?: string | null | undefined;
  created_at?: string | null | undefined;
  description?: string | null | undefined;
}

interface DataImportDialogProps {
  deals: Deal[];
  isOpen: boolean;
  onClose: () => void;
  onImport: (selectedDeals: Deal[]) => void;
}

const stageColors = {
  Lead: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  Qualified: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Proposal: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Negotiation: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Closed Won": "bg-green-500/20 text-green-300 border-green-500/30",
  "Closed Lost": "bg-red-500/20 text-red-300 border-red-500/30",
};

const DataImportDialog: React.FC<DataImportDialogProps> = ({
  deals,
  isOpen,
  onClose,
  onImport,
}) => {
  const [selectedDeals, setSelectedDeals] = useState<Set<string>>(new Set());
  const [selectedStages, setSelectedStages] = useState<Set<string>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "category">("all");

  // Group deals by stage
  const dealsByStage = deals.reduce((acc, deal) => {
    const stageName = deal.stage_name || "Lead";
    if (!acc[stageName]) {
      acc[stageName] = [];
    }
    acc[stageName].push(deal);
    return acc;
  }, {} as Record<string, Deal[]>);

  // Initialize all deals as selected
  useEffect(() => {
    const allDealIds = new Set(deals.map((deal) => deal.id));
    const allStages = new Set(Object.keys(dealsByStage));
    setSelectedDeals(allDealIds);
    setSelectedStages(allStages);
  }, [deals]);

  const handleDealToggle = (dealId: string) => {
    const newSelected = new Set(selectedDeals);
    if (newSelected.has(dealId)) {
      newSelected.delete(dealId);
    } else {
      newSelected.add(dealId);
    }
    setSelectedDeals(newSelected);
  };

  const handleStageToggle = (stageName: string) => {
    const newSelectedStages = new Set(selectedStages);
    const newSelectedDeals = new Set(selectedDeals);

    if (newSelectedStages.has(stageName)) {
      // Unselect stage and all its deals
      newSelectedStages.delete(stageName);
      dealsByStage[stageName]?.forEach((deal) => {
        newSelectedDeals.delete(deal.id);
      });
    } else {
      // Select stage and all its deals
      newSelectedStages.add(stageName);
      dealsByStage[stageName]?.forEach((deal) => {
        newSelectedDeals.add(deal.id);
      });
    }

    setSelectedStages(newSelectedStages);
    setSelectedDeals(newSelectedDeals);
  };

  const handleSelectAll = () => {
    const allDealIds = new Set(deals.map((deal) => deal.id));
    const allStages = new Set(Object.keys(dealsByStage));
    setSelectedDeals(allDealIds);
    setSelectedStages(allStages);
  };

  const handleDeselectAll = () => {
    setSelectedDeals(new Set());
    setSelectedStages(new Set());
  };

  const handleImport = async () => {
    setIsImporting(true);
    const selectedDealsArray = deals.filter((deal) =>
      selectedDeals.has(deal.id)
    );
    await onImport(selectedDealsArray);
    setIsImporting(false);
  };

  const formatCurrency = (value: number, currency: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    });
    return formatter.format(value);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black/90 backdrop-blur-xl border border-gray-800/60 rounded-2xl w-full max-w-6xl h-[95vh] max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-lg font-bold">Import Your Data</h2>
              <p className="text-gray-400 text-xs">
                Review and select deals to import
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <svg
                className="w-4 h-4"
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
            </button>
          </div>
        </div>

        {/* Stats and Controls */}
        <div className="flex-shrink-0 px-6 py-3 border-b border-gray-800/60 bg-gray-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Total:</span>
                <span className="text-lg font-semibold text-white">
                  {deals.length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Selected:</span>
                <span className="text-lg font-semibold text-blue-400">
                  {selectedDeals.size}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Value:</span>
                <span className="text-lg font-semibold text-green-400">
                  $
                  {deals
                    .filter((deal) => selectedDeals.has(deal.id))
                    .reduce((sum, deal) => sum + (deal.value || 0), 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-800/60 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("all")}
                  className={`px-3 py-1.5 text-sm rounded transition-colors ${
                    viewMode === "all"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  All Deals
                </button>
                <button
                  onClick={() => setViewMode("category")}
                  className={`px-3 py-1.5 text-sm rounded transition-colors ${
                    viewMode === "category"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  By Stages
                </button>
              </div>

              <Button
                onClick={handleSelectAll}
                variant="outline"
                size="sm"
                className={`border-gray-600 text-sm px-3 ${
                  selectedDeals.size === deals.length
                    ? "bg-blue-600/20 border-blue-500 text-blue-300"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Select All
              </Button>
              <Button
                onClick={handleDeselectAll}
                variant="outline"
                size="sm"
                className={`border-gray-600 text-sm px-3 ${
                  selectedDeals.size === 0
                    ? "bg-red-600/20 border-red-500 text-red-300"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Deselect All
              </Button>
            </div>
          </div>
        </div>

        {/* Content - Now with proper flex-1 and overflow */}
        <div className="flex-1 p-3 overflow-y-auto min-h-0">
          {viewMode === "category" ? (
            // Category view
            <div className="space-y-6">
              {Object.entries(dealsByStage).map(([stageName, stageDeals]) => (
                <Card
                  key={stageName}
                  className="bg-gray-900/40 border-gray-700/60"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedStages.has(stageName)}
                          onCheckedChange={() => handleStageToggle(stageName)}
                          className="border-gray-500"
                        />
                        <CardTitle className="text-white text-lg">
                          {stageName}
                        </CardTitle>
                        <Badge
                          className={
                            stageColors[
                              stageName as keyof typeof stageColors
                            ] || stageColors.Lead
                          }
                        >
                          {stageDeals.length} deals
                        </Badge>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {formatCurrency(
                          stageDeals.reduce(
                            (sum, deal) => sum + (deal.value || 0),
                            0
                          ),
                          stageDeals[0]?.currency || "USD"
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                      {stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            selectedDeals.has(deal.id)
                              ? "border-blue-500/50 bg-blue-500/10"
                              : "border-gray-700/60 bg-gray-800/40 hover:border-gray-600/80"
                          }`}
                          onClick={() => handleDealToggle(deal.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Checkbox
                              checked={selectedDeals.has(deal.id)}
                              onCheckedChange={() => handleDealToggle(deal.id)}
                              className="border-gray-500 mt-0.5"
                            />
                            <div className="flex-1 ml-3">
                              <h4 className="text-white font-medium text-sm mb-1 truncate">
                                {deal.title || "Untitled Deal"}
                              </h4>
                              <div className="text-xs text-gray-400 space-y-1">
                                <div>
                                  Value:{" "}
                                  {formatCurrency(
                                    deal.value || 0,
                                    deal.currency || "USD"
                                  )}
                                </div>
                                <div>
                                  Expected:{" "}
                                  {formatDate(deal.expected_close_date)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // All deals view
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {deals.map((deal) => (
                <Card
                  key={deal.id}
                  className={`cursor-pointer transition-all ${
                    selectedDeals.has(deal.id)
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-gray-700/60 bg-gray-800/40 hover:border-gray-600/80"
                  }`}
                  onClick={() => handleDealToggle(deal.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-3">
                      <Checkbox
                        checked={selectedDeals.has(deal.id)}
                        onCheckedChange={() => handleDealToggle(deal.id)}
                        className="border-gray-500 mt-0.5"
                      />
                      <Badge
                        className={
                          stageColors[
                            (deal.stage_name as keyof typeof stageColors) ||
                              "Lead"
                          ]
                        }
                      >
                        {deal.stage_name || "Lead"}
                      </Badge>
                    </div>

                    <h4 className="text-white font-medium mb-2 line-clamp-2">
                      {deal.title || "Untitled Deal"}
                    </h4>

                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span>Value:</span>
                        <span className="text-green-400 font-medium">
                          {formatCurrency(
                            deal.value || 0,
                            deal.currency || "USD"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected:</span>
                        <span>{formatDate(deal.expected_close_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{formatDate(deal.created_at)}</span>
                      </div>
                    </div>

                    {deal.description && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {deal.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Now properly pinned to bottom */}
        <div className="flex-shrink-0 px-4 py-2 border-t border-gray-800/60 bg-gray-900/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400">
              {selectedDeals.size} of {deals.length} deals selected
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={onClose}
                variant="outline"
                disabled={isImporting}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs px-3 py-1 h-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={selectedDeals.size === 0 || isImporting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 text-xs h-8"
              >
                {isImporting ? (
                  <div className="flex items-center">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                    Importing...
                  </div>
                ) : (
                  `Import ${selectedDeals.size} Deals`
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataImportDialog;
