"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import * as LucideIcons from "lucide-react"

export default function TermsAndConditionsPage() {
  const pathname = usePathname()

  const bottomNavLinks = [
    { name: "Home", icon: LucideIcons.Home, href: "/" },
    { name: "Starting", icon: LucideIcons.PlayCircle, href: "/starting" },
    { name: "Records", icon: LucideIcons.ClipboardList, href: "#" },
  ]

  const sections = [
    {
      id: 1,
      title: "Regulations (Clauses)",
      icon: LucideIcons.FileText,
      color: "from-amber-500 to-amber-600",
      bgColor: "from-[#241c12] to-[#2a1f14]",
      borderColor: "border-amber-500/20",
      content: [
        {
          number: "1.1",
          text: "In order to start the optimization of the application, you must buy a package.",
        },
        {
          number: "1.2",
          text: "After movies optimization is completed, users can withdraw all funds from the account. Additionally, users can optimize their product set and earn only once per day.",
        },
      ],
    },
    {
      id: 2,
      title: "Withdrawal",
      icon: LucideIcons.ArrowDownCircle,
      color: "from-amber-500 to-amber-600",
      bgColor: "from-[#241c12] to-[#2a1f14]",
      borderColor: "border-amber-500/20",
      content: [
        {
          number: "2.1",
          text: "You can withdraw only after completing all the products optimization daily.",
        },
        {
          number: "2.2",
          text: "The full amount can be withdrawn after completing all work.",
        },
        {
          number: "2.3",
          text: "If you don't complete your work for the day, no withdrawal or refund request can be made.",
        },
        {
          number: "2.4",
          text: "We cannot process withdrawals without a user making a withdrawal request.",
        },
      ],
    },
    {
      id: 3,
      title: "Funds",
      icon: LucideIcons.Wallet,
      color: "from-amber-500 to-amber-600",
      bgColor: "from-[#241c12] to-[#2a1f14]",
      borderColor: "border-amber-500/20",
      content: [
        {
          number: "3.1",
          text: "All users' funds will be safely stored in their accounts and full withdrawals can be requested after all movies optimizations are completed.",
        },
        {
          number: "3.2",
          text: "In order to avoid loss of funds, all products orders will be allocated by the system instead of manual allocation.",
        },
        {
          number: "3.3",
          text: "If there is an unexpected loss of funds, the platform will bear all losses.",
        },
      ],
    },
    {
      id: 4,
      title: "Account Security",
      icon: LucideIcons.Shield,
      color: "from-amber-500 to-amber-600",
      bgColor: "from-[#241c12] to-[#2a1f14]",
      borderColor: "border-amber-500/20",
      content: [
        {
          number: "4.1",
          text: "Please do not tell others your login password and withdrawal password. The platform does not assume any responsibility if any loss or damage occurs.",
        },
        {
          number: "4.2",
          text: "It is not recommended that users use birthdays, ID numbers, and mobile phone numbers to set withdrawal passwords or login passwords.",
        },
        {
          number: "4.3",
          text: "If you forget your login password or withdrawal password, please contact online user support to reset it.",
        },
        {
          number: "4.4",
          text: "Confidentiality agreement between the user and the enterprise. The task completed on this platform is to obtain real-time real user data. The user needs to ensure the confidentiality of the task content and the platform.",
        },
      ],
    },
    {
      id: 5,
      title: "Common Applications",
      icon: LucideIcons.Settings,
      color: "from-amber-500 to-amber-600",
      bgColor: "from-[#241c12] to-[#2a1f14]",
      borderColor: "border-amber-500/20",
      content: [
        {
          number: "5.1",
          text: "Please visit VIP levels section to understand the criteria of VIP levels and the associated benefits.",
        },
        {
          number: "5.2",
          text: "After movies optimization is completed, user can withdraw the earnings right away.",
        },
        {
          number: "5.3",
          text: "The system will randomly allocate orders based on the current VIP level in the user's account.",
        },
        {
          number: "5.4",
          text: "Once assigned to a user account, data cannot be canceled or skipped.",
        },
      ],
    },
    {
      id: 6,
      title: "Deposit",
      icon: LucideIcons.ArrowUpCircle,
      color: "from-amber-500 to-amber-600",
      bgColor: "from-[#241c12] to-[#2a1f14]",
      borderColor: "border-amber-500/20",
      content: [
        {
          number: "6.1",
          text: "The deposit amount is determined by the user based on their personal situation. However, for new users, we recommend familiarizing yourself with the platform's rules and reward system before depositing funds to activate a VIP package.",
        },
        {
          number: "6.2",
          text: "Before making a deposit, the customer needs to submit a deposit request to the online customer service and confirm the merchant's digital wallet address and amount.",
        },
        {
          number: "6.3",
          text: "The platform does not bear any responsibility if the money is deposited into the wrong digital wallet address.",
        },
      ],
    },
    {
      id: 7,
      title: "Work with Developers",
      icon: LucideIcons.Code,
      color: "from-amber-500 to-amber-600",
      bgColor: "from-[#241c12] to-[#2a1f14]",
      borderColor: "border-amber-500/20",
      content: [
        {
          number: "7.1",
          text: "Different products will be updated to the platform every minute. If a product is occupied for a long time without promotion, the application data will not be uploaded to the system, thus affecting the data upload progress. In order to maintain the reputation of the merchant, users need to complete the task within 24 hours. If the task is not completed within the deadline, the merchant will file a complaint and the order will be frozen!",
        },
        {
          number: "7.2",
          text: "In order for users to make prepayments, developers will provide digital wallet addresses.",
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a140c] via-[#241c12] to-[#2a1f14]">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#1a140c]/90 border-b border-amber-500/20 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 text-white hover:text-amber-400 transition-colors rounded-xl hover:bg-[#241c12] p-2"
          >
            <LucideIcons.ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </Link>
          <h1 className="text-lg sm:text-2xl font-bold text-amber-400">Terms & Conditions</h1>
          <div className="w-12 sm:w-16" />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6 pb-32 lg:pb-48">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 px-4 sm:px-6 py-2 sm:py-3 bg-[#241c12] rounded-full border border-amber-500/20">
              <LucideIcons.FileText className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400" />
              <span className="text-amber-400 font-semibold text-sm sm:text-base">Legal Agreement</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">Terms & Conditions</h2>
            <p className="text-base sm:text-lg text-gray-300 px-4">
              Please read these terms carefully before using our platform
            </p>
          </div>

          {/* Enhanced Terms Sections */}
          <div className="space-y-6 sm:space-y-8">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Card
                  key={section.id}
                  className={`p-4 sm:p-6 lg:p-8 bg-gradient-to-br ${section.bgColor} shadow-xl border ${section.borderColor} rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className={`p-2 sm:p-3 rounded-2xl bg-gradient-to-r ${section.color} shadow-lg`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#1a140c]" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {section.id}. {section.title}
                    </h2>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {section.content.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 sm:p-4 bg-[#1a140c]/50 backdrop-blur-sm rounded-2xl border border-amber-500/10 hover:bg-[#1a140c]/70 transition-all duration-200"
                      >
                        <div className="flex gap-3 sm:gap-4">
                          <div className="flex-shrink-0">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r ${section.color} text-[#1a140c] text-xs sm:text-sm font-bold`}
                            >
                              {item.number}
                            </span>
                          </div>
                          <p className="text-sm sm:text-base text-gray-200 leading-relaxed flex-1">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Enhanced Footer Notice */}
          <Card className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gradient-to-r from-[#241c12] to-[#1a140c] border border-amber-500/20 rounded-3xl text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600">
                <LucideIcons.Scale className="h-4 w-4 sm:h-5 sm:w-5 text-[#1a140c]" />
              </div>
              <span className="text-base sm:text-lg font-semibold text-white">Legal Notice</span>
            </div>
            <p className="text-sm sm:text-base text-gray-300 font-medium">
              The final right of interpretation belongs to Company Group
            </p>
          </Card>

          {/* Quick Navigation */}
          <Card className="mt-6 sm:mt-8 p-4 sm:p-6 bg-[#241c12] backdrop-blur-sm shadow-xl border border-amber-500/20 rounded-3xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600">
                <LucideIcons.Navigation className="h-4 w-4 sm:h-5 sm:w-5 text-[#1a140c]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Quick Navigation</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {sections.slice(0, 8).map((section) => {
                const Icon = section.icon
                return (
                  <Button
                    key={section.id}
                    variant="ghost"
                    className="group h-auto p-3 sm:p-4 rounded-2xl bg-[#1a140c]/50 hover:bg-[#1a140c]/80 border border-amber-500/10 transition-all duration-200"
                    onClick={() => {
                      const element = document.getElementById(`section-${section.id}`)
                      element?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div
                        className={`p-2 rounded-xl bg-gradient-to-r ${section.color} group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-4 w-4 text-[#1a140c]" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white">
                        {section.title}
                      </span>
                    </div>
                  </Button>
                )
              })}
            </div>
          </Card>
        </div>
      </main>

      {/* Enhanced Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a140c]/90 backdrop-blur-xl border-t border-amber-500/20 p-3 sm:p-4 shadow-2xl z-40">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {bottomNavLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link key={link.name} href={link.href} className="flex-1">
                <Button
                  variant="ghost"
                  className={`flex flex-col items-center gap-1 sm:gap-2 w-full p-2 sm:p-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-[#1a140c] shadow-lg transform scale-105"
                      : "text-gray-300 hover:text-amber-400 hover:bg-[#241c12]"
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
  )
}
