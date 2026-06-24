"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import * as LucideIcons from "lucide-react"

export default function AboutPage() {
  const pathname = usePathname()

  const bottomNavLinks = [
    { name: "Home", icon: LucideIcons.Home, href: "/" },
    { name: "Starting", icon: LucideIcons.PlayCircle, href: "/starting" },
    { name: "Records", icon: LucideIcons.ClipboardList, href: "#" },
  ]

  const features = [
    {
      icon: LucideIcons.Shield,
      title: "Secure Platform",
      description: "Bank-level security with advanced encryption to protect your data and funds",
      color: "from-amber-500 to-amber-600",
      bgColor: "from-[#241c12] to-[#1a140c]",
    },
    {
      icon: LucideIcons.Zap,
      title: "Lightning Fast",
      description: "Instant transactions and real-time processing for seamless user experience",
      color: "from-amber-500 to-amber-600",
      bgColor: "from-[#241c12] to-[#1a140c]",
    },
    {
      icon: LucideIcons.Users,
      title: "24/7 Support",
      description: "Round-the-clock customer support team ready to assist you anytime",
      color: "from-amber-500 to-amber-600",
      bgColor: "from-[#241c12] to-[#1a140c]",
    },
    {
      icon: LucideIcons.TrendingUp,
      title: "Growth Focused",
      description: "Helping businesses scale and reach new heights in the digital landscape",
      color: "from-amber-500 to-amber-600",
      bgColor: "from-[#241c12] to-[#1a140c]",
    },
  ]

  const stats = [
    {
      icon: LucideIcons.Users,
      value: "50K+",
      label: "Active Users",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: LucideIcons.Globe,
      value: "100+",
      label: "Countries",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: LucideIcons.DollarSign,
      value: "$10M+",
      label: "Processed",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: LucideIcons.Award,
      value: "99.9%",
      label: "Uptime",
      color: "from-amber-500 to-amber-600",
    },
  ]

  const teamMembers = [
    {
      name: "Ofer Druker",
      role: "Chairman",
      description: "Visionary leader driving innovation in digital transformation",
      icon: LucideIcons.Crown,
      color: "from-amber-500 to-amber-600",
    },
    {
      name: "Tech Team",
      role: "Development",
      description: "Expert developers building cutting-edge solutions",
      icon: LucideIcons.Code,
      color: "from-amber-500 to-amber-600",
    },
    {
      name: "Support Team",
      role: "Customer Success",
      description: "Dedicated professionals ensuring customer satisfaction",
      icon: LucideIcons.Headphones,
      color: "from-amber-500 to-amber-600",
    },
    {
      name: "Security Team",
      role: "Platform Security",
      description: "Cybersecurity experts protecting your digital assets",
      icon: LucideIcons.Shield,
      color: "from-amber-500 to-amber-600",
    },
  ]

  const values = [
    {
      icon: LucideIcons.Target,
      title: "Innovation",
      description: "Constantly pushing boundaries with cutting-edge technology",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: LucideIcons.Heart,
      title: "Trust",
      description: "Building lasting relationships through transparency and reliability",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: LucideIcons.Rocket,
      title: "Excellence",
      description: "Delivering exceptional quality in everything we do",
      color: "from-amber-500 to-amber-600",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#1a140c]">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#241c12]/90 border-b border-amber-500/20 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 text-white hover:text-amber-400 transition-colors rounded-xl hover:bg-[#1a140c] p-2"
          >
            <LucideIcons.ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </Link>
          <h1 className="text-lg sm:text-2xl font-bold text-amber-400">About Us</h1>
          <div className="w-12 sm:w-16" />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6 pb-32 lg:pb-48">
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 px-4 sm:px-6 py-2 sm:py-3 bg-amber-500/20 rounded-full">
              <LucideIcons.Info className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400" />
              <span className="text-amber-400 font-semibold text-sm sm:text-base">Our Story</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              Empowering Digital Innovation
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto px-4">
              We're on a mission to revolutionize digital experiences and help businesses thrive in the modern economy
            </p>
          </div>

          {/* Mission Section */}
          <Card className="relative p-6 sm:p-8 lg:p-12 bg-[#241c12] shadow-2xl border border-amber-500/20 rounded-3xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/5"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg">
                  <LucideIcons.Target className="h-6 w-6 sm:h-8 sm:w-8 text-[#1a140c]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
                Our mission: <span className="font-bold text-amber-400">grow your business</span>. We help our partners
                reach new markets, revolutionize digital interactions, and forge new paths for enterprise success in the
                digital age.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-[#1a140c]/50 rounded-2xl border border-amber-500/20">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600">
                    <LucideIcons.CheckCircle className="h-5 w-5 text-[#1a140c]" />
                  </div>
                  <span className="text-gray-300 font-medium">Market Expansion</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#1a140c]/50 rounded-2xl border border-amber-500/20">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600">
                    <LucideIcons.CheckCircle className="h-5 w-5 text-[#1a140c]" />
                  </div>
                  <span className="text-gray-300 font-medium">Digital Innovation</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  className="p-4 sm:p-6 text-center bg-[#241c12] backdrop-blur-sm shadow-xl border border-amber-500/20 rounded-3xl hover:shadow-2xl hover:border-amber-500 transition-all duration-300 transform hover:scale-105"
                >
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg mb-4`}>
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#1a140c]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm sm:text-base text-gray-300 font-medium">{stat.label}</div>
                </Card>
              )
            })}
          </div>

          {/* Jellyfish Family Section */}
          <Card className="p-6 sm:p-8 bg-[#241c12] shadow-2xl border border-amber-500/20 rounded-3xl">
            <div className="flex items-center gap-3 sm:gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg">
                <LucideIcons.Users className="h-6 w-6 sm:h-8 sm:w-8 text-[#1a140c]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Part of the Jellyfish Family</h2>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                We are a proud member of the <span className="font-bold text-amber-400">Jellyfish family</span>, led by
                Chairman Ofer Druker, bringing together innovative minds to shape the future of digital business.
              </p>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Jellyfish works with leading brands to shape the next era of the internet; leveraging{" "}
                <span className="font-semibold text-amber-400">AR, blockchain, AI</span>, and immersive digital
                experiences to future-proof your business.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
                {["AR", "Blockchain", "AI", "Digital"].map((tech, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 text-center bg-[#1a140c]/50 rounded-2xl border border-amber-500/20"
                  >
                    <div className="text-sm sm:text-base font-bold text-amber-400">{tech}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Features Section */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Why Choose Us</h2>
              <p className="text-base sm:text-lg text-gray-300">
                Discover what makes our platform the preferred choice for businesses worldwide
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={index}
                    className={`p-6 sm:p-8 bg-gradient-to-br ${feature.bgColor} shadow-xl border border-amber-500/20 rounded-3xl hover:shadow-2xl hover:border-amber-500 transition-all duration-300 transform hover:scale-105`}
                  >
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg mb-4`}>
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#1a140c]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{feature.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Team Section */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Our Team</h2>
              <p className="text-base sm:text-lg text-gray-300">Meet the dedicated professionals behind our success</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => {
                const Icon = member.icon
                return (
                  <Card
                    key={index}
                    className="p-6 text-center bg-[#241c12] backdrop-blur-sm shadow-xl border border-amber-500/20 rounded-3xl hover:shadow-2xl hover:border-amber-500 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${member.color} shadow-lg mb-4`}>
                      <Icon className="h-8 w-8 text-[#1a140c]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{member.name}</h3>
                    <div className="text-sm font-medium text-gray-400 mb-3">{member.role}</div>
                    <p className="text-sm text-gray-300 leading-relaxed">{member.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Values Section */}
          <Card className="p-6 sm:p-8 bg-[#241c12] shadow-2xl border border-amber-500/20 rounded-3xl">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg mb-4">
                <LucideIcons.Star className="h-6 w-6 sm:h-8 sm:w-8 text-[#1a140c]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Our Values</h2>
              <p className="text-base sm:text-lg text-gray-300">The principles that guide everything we do</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="text-center p-6 bg-[#1a140c]/50 rounded-2xl border border-amber-500/20">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${value.color} shadow-lg mb-4`}>
                      <Icon className="h-6 w-6 text-[#1a140c]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </main>

      {/* Enhanced Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#241c12]/90 backdrop-blur-xl border-t border-amber-500/20 p-3 sm:p-4 shadow-2xl z-40">
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
  )
}
