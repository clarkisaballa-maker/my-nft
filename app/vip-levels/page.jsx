"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import * as LucideIcons from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import SupportChat from '@/app/Common/SupportChat/SupportChat'
import CS from "@/app/Common/CustomerService/CS"
import { useUsersContext } from "../AllContext/UsersContext"

export default function VipLevelsPage() {
  const pathname = usePathname()
  const router = useRouter()
  const [storedUser, setStoredUser] = useState(null)
  const [isCSOpen, setIsCSOpen] = useState(false)
  const { vipLevels, isLoadingVipLevels } = useUsersContext()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
    } else {
      setStoredUser(JSON.parse(userData))
    }
  }, [])

  const allVipLevels = [
    {
      level: "VIP1",
      name: "Bronze Tier",
      amount: "1000.00 USD",
      iconName: "Star",
      depositRequired: 1000,
      color: "from-amber-500 to-orange-600",
      bgColor: "from-[#241c12] to-[#1a140c]",
      borderColor: "border-amber-500",
      commission: "0.4%",
      withdrawalLimit: "1300 USD",
      features: ["Basic Support", "Standard Processing", "Mobile Access"],
      badge: "Popular",
    },
    {
      level: "VIP2",
      name: "Silver Tier",
      amount: "2000.00 USD",
      iconName: "Crown",
      depositRequired: 2000,
      color: "from-amber-500 to-orange-600",
      bgColor: "from-[#241c12] to-[#1a140c]",
      borderColor: "border-amber-500",
      commission: "0.6%",
      withdrawalLimit: "4,000 USD",
      features: ["Priority Support", "Fast Processing", "Advanced Tools", "Email Alerts"],
      badge: "Recommended",
    },
    {
      level: "VIP3",
      name: "Gold Tier",
      amount: "3000.00 USD",
      iconName: "Gem",
      depositRequired: 3000,
      color: "from-amber-500 to-orange-600",
      bgColor: "from-[#241c12] to-[#1a140c]",
      borderColor: "border-amber-500",
      commission: "0.8%",
      withdrawalLimit: "8,000 USD",
      features: ["VIP Support", "Instant Processing", "Premium Tools", "SMS Alerts", "Personal Manager"],
      badge: "Best Value",
    },
    {
      level: "VIP4",
      name: "Diamond Tier",
      amount: "5,000.00 USD",
      iconName: "Diamond",
      depositRequired: 5000,
      color: "from-amber-500 to-orange-600",
      bgColor: "from-[#241c12] to-[#1a140c]",
      borderColor: "border-amber-500",
      commission: "1.0%",
      withdrawalLimit: "Unlimited",
      features: [
        "24/7 Dedicated Support",
        "Lightning Processing",
        "Exclusive Tools",
        "All Notifications",
        "Personal Manager",
        "Custom Solutions",
      ],
      badge: "Elite",
    },
  ]

  const currentUserVipLevel = storedUser
    ? "VIP" + JSON.parse(localStorage.getItem("user")).currentVIPLevel.number
    : null

  const supportReps = [
    { name: "Support Representative 1", phone: "1234567890" },
    { name: "Support Representative 2", phone: "1234567891" },
    { name: "Support Representative 3", phone: "1234567892" },
  ]

  const bottomNavLinks = [
    { name: "Home", icon: LucideIcons.Home, href: "/" },
    { name: "Starting", icon: LucideIcons.PlayCircle, href: "/starting" },
    { name: "Records", icon: LucideIcons.ClipboardList, href: "/records" },
  ]

  const benefits = [
    {
      icon: LucideIcons.TrendingUp,
      title: "Higher Commissions",
      description: "Earn more with each transaction as you upgrade your VIP level",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: LucideIcons.Zap,
      title: "Faster Processing",
      description: "Priority processing for all your transactions and requests",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: LucideIcons.Shield,
      title: "Enhanced Security",
      description: "Advanced security features and dedicated account protection",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: LucideIcons.Headphones,
      title: "Premium Support",
      description: "24/7 dedicated support team for VIP members",
      color: "from-amber-500 to-orange-600",
    },
  ]

  if (!storedUser) return null

  return (
    <>
      <SupportChat userId={storedUser._id} username={storedUser.username} />
      <div className="flex flex-col min-h-screen bg-[#1a140c]">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#241c12]/90 border-b border-amber-500/20 shadow-lg">
          <div className="flex items-center justify-between p-4">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 text-gray-300 hover:text-amber-400 transition-colors rounded-xl hover:bg-[#3a2f20] p-2"
            >
              <LucideIcons.ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-medium text-sm sm:text-base">Back</span>
            </Link>
            <h1 className="text-lg sm:text-2xl font-bold text-amber-400">VIP Levels</h1>
            <div className="w-12 sm:w-16" />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 pb-32 lg:pb-48">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 px-4 sm:px-6 py-2 sm:py-3 bg-amber-500/20 rounded-full">
                <LucideIcons.Crown className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400" />
                <span className="text-amber-400 font-semibold text-sm sm:text-base">Premium Membership</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">Exclusive VIP Tiers</h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto px-4">
                Unlock premium benefits and exclusive rewards with our VIP membership tiers designed for your success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <Card
                    key={index}
                    className="p-6 text-center bg-[#241c12] backdrop-blur-sm shadow-xl border border-amber-500/20 rounded-3xl hover:shadow-2xl hover:border-amber-500 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${benefit.color} shadow-lg mb-4`}>
                      <Icon className="h-6 w-6 text-[#1a140c]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{benefit.description}</p>
                  </Card>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
              {vipLevels?.map((vip, index) => {
                const IconComponent = LucideIcons.Crown
                const isSelected = vip.level === storedUser.currentVIPLevel.number

                return (
                  <Card
                    key={vip._id || vip.level}
                    className={`group relative p-6 sm:p-8 text-center bg-gradient-to-br from-[#241c12] to-[#1a140c] shadow-2xl border-2 ${isSelected ? "border-amber-500" : "border-amber-500/20"
                      } rounded-3xl hover:shadow-3xl hover:border-amber-500 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2`}
                  >
                    {/* Active Badge for selected VIP */}
                    {isSelected && (
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                        <LucideIcons.Check className="h-4 w-4 text-[#1a140c]" />
                      </div>
                    )}

                    <div className="relative z-10">
                      <div className="inline-flex p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 shadow-2xl mb-6">
                        <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-[#1a140c]" />
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                        VIP {vip.level}
                      </h3>

                      <div className="text-lg font-semibold text-gray-300 mb-4">{vip.name}</div>

                      <div className="mb-6">
                        <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                          ${vip.packagePrice}
                        </div>
                        <div className="text-sm text-gray-400">Package Price</div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between p-3 bg-[#1a140c]/50 rounded-xl border border-amber-500/20">
                          <span className="text-sm text-gray-300">Daily Products</span>
                          <span className="text-sm font-bold text-amber-400">{vip.dailyProducts}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-[#1a140c]/50 rounded-xl border border-amber-500/20">
                          <span className="text-sm text-gray-300">Daily Profit</span>
                          <span className="text-sm font-bold text-amber-400">{vip.dailyProfitPercent}%</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-[#1a140c]/50 rounded-xl border border-amber-500/20">
                          <span className="text-sm text-gray-300">Status</span>
                          <span
                            className={`text-sm font-bold ${isSelected || vip.isActive ? "text-green-400" : "text-red-400"
                              }`}
                          >
                            {isSelected ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      {/* Show button ONLY if it's NOT the selected VIP */}
                      {!isSelected && (
                        <Dialog open={isCSOpen} onOpenChange={setIsCSOpen}>
                          <DialogTrigger asChild>
                            <Button
                              className="w-full py-3 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-[#1a140c] rounded-2xl"
                            >
                              Upgrade Now
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-md bg-[#241c12] border border-amber-500/20 rounded-2xl p-4">
                            <CS userId={storedUser._id} username={storedUser.username} />
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>

            <Card className="p-6 sm:p-8 text-center bg-gradient-to-r from-[#241c12] to-[#1a140c] shadow-2xl border border-amber-500/20 rounded-3xl">
              <div className="text-white">
                <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 backdrop-blur-sm mb-4">
                  <LucideIcons.Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Upgrade?</h2>
                <p className="text-lg sm:text-xl mb-6 text-gray-300">
                  Join thousands of VIP members and unlock exclusive benefits today
                </p>

                {/* Dialog for Customer Service */}
                <Dialog open={isCSOpen} onOpenChange={setIsCSOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-amber-500 text-[#1a140c] hover:bg-orange-500 font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <LucideIcons.Crown className="h-5 w-5 mr-2" />
                      Contact Support
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md bg-[#241c12] border border-amber-500/20 rounded-2xl p-4">
                    <CS userId={storedUser._id} username={storedUser.username} />
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-[#241c12]/90 backdrop-blur-xl border-t border-amber-500/20 p-3 sm:p-4 shadow-2xl z-40">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {bottomNavLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link key={link.name} href={link.href} className="flex-1">
                  <Button
                    variant="ghost"
                    className={`flex flex-col items-center gap-1 sm:gap-2 w-full p-2 sm:p-3 rounded-2xl transition-all duration-300 ${isActive
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-[#1a140c] shadow-lg transform scale-105"
                      : "text-gray-300 hover:text-amber-400 hover:bg-[#1a140c]"
                      }`}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-xs font-semibold">{link.name}</span>
                    {isActive && <div className="w-1 h-1 bg-[#1a140c] rounded-full"></div>}
                  </Button>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}
