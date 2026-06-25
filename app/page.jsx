"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import * as LucideIcons from "lucide-react"
import { useRouter } from "next/navigation"
import Bottom from "@/app/Common/Bottom/Bottom"
import CS from "@/app/Common/CustomerService/CS"
import SupportChat from '@/app/Common/SupportChat/SupportChat'
import VIPLevels from '@/components/VIPLevels'
import NotificationMarquee from "@/components/NotificationMarquee"
import BroadcastModal from "@/app/Common/BroadcastModal"
import { Capacitor } from '@capacitor/core'

export default function HomePage() {
  const [showNotifications, setShowNotifications] = useState(false)
  const router = useRouter()
  const [storedUser, setStoredUser] = useState(null)
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform())
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
    } else {
      setStoredUser(JSON.parse(userData))
    }
  }, [])

  const navTabs = [
    { name: "Service", iconName: "Briefcase", href: "#", color: "from-amber-500 to-orange-600" },
    { name: "Withdrawal", iconName: "Wallet", href: "/withdrawal", color: "from-amber-500 to-orange-600" },
    { name: "Deposit", iconName: "CreditCard", href: "/deposit", color: "from-amber-500 to-orange-600" },
    { name: "T & C", iconName: "FileText", href: "/terms-and-conditions", color: "from-amber-500 to-orange-600" },
    { name: "Certificate", iconName: "Award", href: "/certificate", color: "from-amber-500 to-orange-600" },
    { name: "About", iconName: "Info", href: "/about", color: "from-amber-500 to-orange-600" },
    { name: "Packages", iconName: "Crown", href: "/vip-levels", color: "from-amber-500 to-orange-600" },
  ]

  const vipLevels = [
    {
      level: "VIP1",
      amount: "1000.00 USD",
      iconName: "Star",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-amber-900/20 to-orange-900/20",
    },
    {
      level: "VIP2",
      amount: "2000.00 USD",
      iconName: "Crown",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-amber-900/20 to-orange-900/20",
    },
    {
      level: "VIP3",
      amount: "3000.00 USD",
      iconName: "Gem",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-amber-900/20 to-orange-900/20",
    },
    {
      level: "VIP4",
      amount: "5000.00 USD",
      iconName: "Diamond",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-amber-900/20 to-orange-900/20",
    },
  ]

  if (!storedUser) return null

  return (
    <>
      <SupportChat userId={storedUser._id} username={storedUser.username} />
      <BroadcastModal />
      <div className="flex flex-col min-h-screen bg-[#1a140c]">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#1a140c]/95 border-b border-[#3a2f20] shadow-lg">
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
                <LucideIcons.Film className="h-6 w-6 text-[#1a140c]" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Movee Tech</h1>
            </Link>

            <div className="flex items-center gap-3 relative">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-300 hover:text-amber-400 transition-colors rounded-xl hover:bg-[#3a2f20]"
              >
                <LucideIcons.Bell className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
              </Button>

              {/* Chat Icon */}
              <SupportChat
                userId={storedUser._id}
                username={storedUser.username}
                renderTrigger={({ unseenCount, openChat }) => (
                  <button
                    onClick={openChat}
                    className="relative text-gray-300 hover:text-amber-400 transition-colors rounded-xl hover:bg-[#3a2f20] p-2"
                  >
                    <LucideIcons.MessageCircle className="h-6 w-6" />

                    {unseenCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                        {unseenCount}
                      </span>
                    )}
                  </button>
                )}
              />

              {/* Profile */}
              <Link
                href="/profile"
                className="text-gray-300 hover:text-amber-400 transition-colors rounded-xl hover:bg-[#3a2f20] p-2"
              >
                <LucideIcons.UserCircle className="h-6 w-6" />
              </Link>

              {/* Notification Dropdown */}
              {showNotifications && (
                <Card className="absolute top-full right-0 mt-3 w-80 bg-[#241c12]/95 backdrop-blur-xl border border-[#4a3a28] shadow-2xl rounded-2xl z-50 overflow-hidden">
                  <div className="bg-amber-500 p-4">
                    <h3 className="text-lg font-bold text-[#1a140c] flex items-center gap-2">
                      <LucideIcons.Bell className="h-5 w-5" />
                      Notifications
                    </h3>
                  </div>
                  <div className="p-4">
                    {storedUser.notifications.length > 0 ? (
                      <ul className="space-y-3">
                        {storedUser.notifications.map((notification, index) => {
                          let bgColor = "bg-[#2a1f14]/50 border-[#3a2f20]"
                          let textColor = "text-gray-300"

                          switch (notification.type) {
                            case "success":
                              bgColor = "bg-lime-600/20 border-lime-500"
                              textColor = "text-lime-400"
                              break
                            case "warning":
                              bgColor = "bg-amber-600/20 border-amber-500"
                              textColor = "text-amber-400"
                              break
                            case "error":
                              bgColor = "bg-red-600/20 border-red-500"
                              textColor = "text-red-400"
                              break
                            case "info":
                            default:
                              bgColor = "bg-[#2a1f14]/50 border-[#3a2f20]"
                              textColor = "text-gray-300"
                              break
                          }

                          return (
                            <li
                              key={index}
                              className={`text-sm p-3 rounded-xl ${bgColor} border hover:bg-[#2a1f14] transition-all duration-200 ${textColor}`}
                            >
                              <p>{notification.message}</p>
                              <p className="text-xs opacity-50 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-4">
                        No new notifications.
                      </p>
                    )}

                  </div>
                </Card>
              )}
            </div>
          </div>
        </header>

        <NotificationMarquee notifications={storedUser?.notifications || []} />

        <main className="flex-1 overflow-auto pb-24">
          {/* Enhanced Hero Section */}
          

          {/* Enhanced Navigation Tabs */}
          <section className="w-full py-12 bg-[#241c12]">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-bold text-center mb-8 text-white">
                Premium <span className="text-amber-400">Dashboard</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {navTabs.map((tab) => {
                  const IconComponent = LucideIcons[tab.iconName]

                  const buttonContent = (
                    <Button
                      variant="ghost"
                      className="group relative w-full h-32 p-0 overflow-hidden rounded-2xl bg-[#14100a] shadow-lg hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-105 border-2 border-[#3a2f20] hover:border-amber-500/70 hover:bg-[#0f0c07]"
                    >
                      <div className="relative z-10 flex flex-col items-center justify-center gap-3 p-4">
                        <div
                          className={`p-4 rounded-xl bg-gradient-to-r ${tab.color} shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}
                        >
                          {IconComponent && <IconComponent className="h-7 w-7 text-[#1a140c]" />}
                        </div>
                        <span className="text-sm font-bold text-gray-200 group-hover:text-amber-400 transition-colors">
                          {tab.name}
                        </span>
                      </div>
                    </Button>
                  )

                  // Special case: "Service" tab opens a Dialog
                  if (tab.name === "Service") {
                    return (
                      <div key={tab.name} className="w-full">
                        <Dialog>
                          <DialogTrigger asChild>{buttonContent}</DialogTrigger>
                          <CS userId={storedUser._id} username={storedUser.username} />
                        </Dialog>
                      </div>
                    )
                  }

                  // Special case: "FAQs" opens in a new tab
                  if (tab.name === "FAQs") {
                    return (
                      <a
                        key={tab.name}
                        href={tab.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        {buttonContent}
                      </a>
                    )
                  }

                  // All other tabs use Next.js Link
                  return (
                    <Link key={tab.name} href={tab.href} className="w-full">
                      {buttonContent}
                    </Link>
                  )
                })}
                {!isNative && (
                  <Link href="https://moveetech1.vercel.app/moveetech.apk" className="w-full">
                    <Button
                      variant="ghost"
                      className="group relative w-full h-32 p-0 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 shadow-lg hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-amber-400 hover:border-white"
                    >
                      <div className="relative z-10 flex flex-col items-center justify-center gap-3 p-4">
                        <div className="p-4 rounded-xl bg-white/20 backdrop-blur-md shadow-xl group-hover:scale-110 transition-all duration-300">
                          <LucideIcons.Download className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-sm font-bold text-white text-center leading-tight">
                          Download or Update<br />Android App
                        </span>
                      </div>
                    </Button>
                  </Link>
                )}

              </div>
            </div>
          </section>

          {/* Premium VIP Levels */}
          <VIPLevels vipLevels={vipLevels} selectedVIPLevel={storedUser.currentVIPLevel?.number} />

          {/* Features Section */}
          <section className="w-full py-16 bg-[#241c12]">
            <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">Why Choose Us?</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the future of digital services with our comprehensive platform designed for your success.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="p-6 rounded-2xl bg-[#1a140c] border border-[#3a2f20] shadow-lg hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <LucideIcons.Shield className="h-8 w-8 text-[#1a140c]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Secure & Reliable</h3>
                  <p className="text-gray-300">Bank-level security with 99.9% uptime guarantee</p>
                </div>

                <div className="p-6 rounded-2xl bg-[#1a140c] border border-[#3a2f20] shadow-lg hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <LucideIcons.Zap className="h-8 w-8 text-[#1a140c]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
                  <p className="text-gray-300">Instant transactions and real-time processing</p>
                </div>

                <div className="p-6 rounded-2xl bg-[#1a140c] border border-[#3a2f20] shadow-lg hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <LucideIcons.Users className="h-8 w-8 text-[#1a140c]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">24 Hours</h3>
                  <p className="text-gray-300">24 Hours user support team</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Enhanced Fixed Badge */}
        <div className="fixed bottom-28 right-4 z-50">
          <Button className="group flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl bg-amber-500 hover:bg-amber-600 text-[#1a140c] transition-all duration-300 transform hover:scale-105 border-2 border-amber-400">
            <div className="w-8 h-8 rounded-full bg-[#1a140c]/30 flex items-center justify-center">
              <LucideIcons.UserCircle className="h-5 w-5 text-[#1a140c]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium animate-shimmer">Welcome</p>
              <p className="font-bold text-sm animate-shimmer-username">{storedUser?.username || "User"}</p>
            </div>
            <LucideIcons.ChevronUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </div>

        <Bottom />
      </div>
    </>
  )
}
