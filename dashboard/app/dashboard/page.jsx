"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import * as LucideIcons from "lucide-react"
import { DashboardProvider, useDashboard } from "@/app/AllContext/DashboardContext"
import UsersManagement from "@/components/dashboard/users-management"
import ProductsManagement from "@/components/dashboard/products-management"
import WalletsManagement from "@/components/dashboard/wallets-management"
import LiveChat from "@/components/dashboard/live-chat"
import VIPLevels from "@/components/dashboard/vip-levels-management"
import Referrel from "@/components/dashboard/referrel"
import { useChatContext } from "@/app/AllContext/ChatContext"

// Session kitne hours mein expire ho (aap change kar sakte hain)
const SESSION_DURATION_HOURS = 4;

function DashboardContent() {
  const { activeTab, setActiveTab } = useDashboard()
  const [showLogout, setShowLogout] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [chatUser, setChatUser] = useState({ id: null, username: null })

  const [pendingUsersCount, setPendingUsersCount] = useState(0);
  const { users } = useChatContext()

  const audioRef = useRef(null)

  // Audio Setup
  useEffect(() => {
    audioRef.current = new Audio("/notification-sound.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!audioRef.current) return
    if (pendingUsersCount > 0) {
      audioRef.current.play().catch(err => console.log("Audio play failed:", err))
    } else {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [pendingUsersCount])

  useEffect(() => {
    if (users) {
      const count = users.filter(u => u.pendingMessages > 0).length;
      setPendingUsersCount(count);
    }
  }, [users]);

  // ================== AUTH & SESSION MANAGEMENT ==================
  useEffect(() => {
    const checkAndRefreshSession = () => {
      const storedUser = localStorage.getItem("user")

      if (!storedUser) {
        router.replace("/login")
        return
      }

      try {
        let user = JSON.parse(storedUser)

        // === NEW SESSION START LOGIC ===
        const now = Date.now()

        // Agar loginTime nahi hai ya purana hai, to abhi se fresh start karo
        if (!user.loginTime) {
          user.loginTime = now
          localStorage.setItem("user", JSON.stringify(user))
          console.log("✅ New session started (loginTime added)")
        }
        else {
          const sessionAge = now - user.loginTime
          const maxSessionMs = SESSION_DURATION_HOURS * 60 * 60 * 1000

          if (sessionAge > maxSessionMs) {
            console.log("⛔ Session expired")
            localStorage.removeItem("user")
            router.replace("/login")
            return
          }
          else if (sessionAge > 1000 * 60 * 30) { // 30 minutes se zyada purana hai
            // Refresh loginTime to start fresh now
            user.loginTime = now
            localStorage.setItem("user", JSON.stringify(user))
            console.log("🔄 Session refreshed - timer restarted from now")
          }
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Auth error:", err)
        localStorage.removeItem("user")
        router.replace("/login")
      }
    }

    checkAndRefreshSession()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.replace("/login")
  }

  const user = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : {}

  const sidebarItems = [
    { id: "users", label: "Users", icon: "Users", color: "from-blue-500 to-cyan-500" },
    { id: "products", label: "Products", icon: "Package", color: "from-purple-500 to-pink-500" },
    { id: "wallets", label: "Wallets", icon: "Wallet", color: "from-green-500 to-emerald-500" },
    {
      id: "live-chat",
      label: "Live Chat",
      icon: "MessageSquare",
      color: "from-cyan-500 to-blue-500",
      badge: pendingUsersCount
    },
    { id: "viplevels", label: "VIP Levels", icon: "Award", color: "from-green-800 to-emerald-800" },
    { id: "referrel", label: "Referral", icon: "Users", color: "from-blue-800 to-emerald-800" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header - same as before */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50 shadow-lg">
        <div className="flex items-center justify-between p-4 md:p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <LucideIcons.LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
              Admin Dashboard
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <img
                src={user.profileimage || "/placeholder.svg?height=32&width=32"}
                alt="profile"
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-sm font-semibold text-slate-200">{user.username || "Admin"}</span>
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLogout(!showLogout)}
                className="text-slate-300 hover:text-red-400 transition-colors rounded-xl hover:bg-red-950/20"
              >
                <LucideIcons.LogOut className="h-5 w-5" />
              </Button>

              {showLogout && (
                <Card className="absolute right-0 mt-2 p-3 bg-slate-800 shadow-lg rounded-xl border border-slate-700 w-48 z-50">
                  <p className="text-sm text-slate-300 mb-3">Sure you want to logout?</p>
                  <div className="flex gap-2">
                    <Button onClick={() => setShowLogout(false)} className="flex-1 bg-slate-700 text-slate-100 hover:bg-slate-600 rounded-lg" size="sm">
                      Cancel
                    </Button>
                    <Button onClick={handleLogout} className="flex-1 bg-red-600 text-white hover:bg-red-700 rounded-lg" size="sm">
                      Logout
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar, Mobile Tabs, and Main Content (same as before) */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex flex-col w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/50 shadow-lg overflow-y-auto">
          <nav className="p-6 space-y-3">
            {sidebarItems.map((item) => {
              const IconComponent = LucideIcons[item.icon]
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative ${isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100"
                    }`}
                >
                  {IconComponent && <IconComponent className="h-5 w-5" />}
                  <span className="font-semibold">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5">{item.badge}</Badge>
                  )}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Mobile Tab Selector */}
        <div className="md:hidden fixed top-20 left-0 right-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 px-4 py-3 flex gap-2 overflow-x-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition-all ${activeTab === item.id
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
            >
              {item.label}
              {item.badge && item.badge > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>

        <main className="flex-1 overflow-auto pt-4 md:pt-0">
          <div className="md:p-8 p-4 md:mt-0 mt-16">
            {activeTab === "users" && <UsersManagement setActiveTab={setActiveTab} setChatUser={setChatUser} />}
            {activeTab === "products" && <ProductsManagement />}
            {activeTab === "wallets" && <WalletsManagement />}
            {activeTab === "live-chat" && <LiveChat id={chatUser.id} username={chatUser.username} />}
            {activeTab === "viplevels" && <VIPLevels />}
            {activeTab === "referrel" && <Referrel />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  )
}