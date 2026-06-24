"use client"
import Link from "next/link"
import * as LucideIcons from "lucide-react"
import { useRouter } from "next/navigation"
import Bottom from "@/app/Common/Bottom/Bottom"
import Wallets from "./Wallets/Index"
import { useEffect, useState } from "react"

export default function PaymentMethodPage() {
  const router = useRouter()
  const [storedUser, setStoredUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
    } else {
      setStoredUser(JSON.parse(userData))
    }
  }, [])
  // Prevent rendering until localStorage is checked
  if (!storedUser) return null

  return (
    <div className="flex flex-col min-h-screen bg-[#1a140c]">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#241c12]/80 border-b border-amber-500/20 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <Link
            href="/profile"
            className="flex items-center gap-2 sm:gap-3 text-gray-300 hover:text-amber-400 transition-colors rounded-xl hover:bg-[#3a2f20] p-2"
          >
            <LucideIcons.ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </Link>
          <h1 className="text-lg sm:text-2xl font-bold text-amber-400">Payment Method</h1>
          <div className="w-12 sm:w-16" />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6 pb-32 lg:pb-48">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Hero Section */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 px-4 sm:px-6 py-2 sm:py-3 bg-amber-500/20 border border-amber-500/30 rounded-full">
              <LucideIcons.Wallet className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400" />
              <span className="text-amber-400 font-semibold text-sm sm:text-base">Crypto Wallets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">Manage Payment Methods</h2>
            <p className="text-base sm:text-lg text-gray-300 px-4">
              Add and manage your cryptocurrency wallet addresses for secure transactions
            </p>
          </div>

          <Wallets />
        </div>
      </main>

      {/* Enhanced Bottom Navigation */}
      <Bottom />
    </div>
  )
}
