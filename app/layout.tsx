import type React from "react"
import "./globals.css"
import { TenantProvider } from "@/contexts/tenant-context"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TenantProvider>{children}</TenantProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
