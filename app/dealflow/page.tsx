"use client"

import { Suspense } from "react"
import { Header } from "@/components/header"
import { DealFlowBoard } from "@/components/dealflow-board"

function DealFlowContent() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <DealFlowBoard />
      </main>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p>Loading Vellora AI...</p>
      </div>
    </div>
  )
}

export default function DealFlowPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DealFlowContent />
    </Suspense>
  )
}
