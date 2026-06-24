import React from "react"
import * as LucideIcons from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useUsersContext } from "@/app/AllContext/UsersContext"

const VIPLevels = ({ selectedVIPLevel }) => {
    const { vipLevels, isLoadingVipLevels } = useUsersContext()

    if (isLoadingVipLevels) {
        return (
            <section className="w-full py-16 bg-[#1a140c]">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Exclusive VIP Levels
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-80 rounded-3xl bg-[#241c12] animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="w-full py-16 bg-[#1a140c] relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Exclusive VIP Levels
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Unlock premium benefits and exclusive rewards with our VIP membership tiers
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {vipLevels?.map((vip, index) => {
                        const colors = [
                            "from-yellow-400 to-amber-600",
                            "from-amber-500 to-orange-600",
                            "from-orange-400 to-red-600",
                            "from-amber-400 to-yellow-700",
                            "from-orange-500 to-amber-700",
                        ]

                        return (
                            <Card
                                key={vip._id}
                                className="group relative p-6 text-center bg-[#241c12] border border-[#3a2f20] rounded-3xl hover:border-amber-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                            >
                                {/* VIP Number Badge */}
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-[#1a140c] font-bold text-sm">
                                    {vip.level}
                                </div>

                                <div className="relative z-10">
                                    <div
                                        className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${colors[index % colors.length]
                                            } mb-6`}
                                    >
                                        <LucideIcons.Crown className="h-10 w-10 text-[#1a140c]" />
                                    </div>

                                    <h3 className="text-3xl font-extrabold text-white mb-2">
                                        {vip.name}
                                    </h3>

                                    <p className="text-gray-400 mb-4">
                                        VIP Level {vip.level}
                                    </p>

                                    <div className="mb-6">
                                        <p className="text-2xl font-bold text-amber-400">
                                            ${vip.packagePrice}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Package Price
                                        </p>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-300">
                                        <div className="flex items-center justify-center gap-2">
                                            <LucideIcons.Package className="h-4 w-4 text-amber-400" />
                                            <span>
                                                {vip.dailyProducts} Products / Day
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-center gap-2">
                                            <LucideIcons.TrendingUp className="h-4 w-4 text-amber-400" />
                                            <span>
                                                {vip.dailyProfitPercent}% Daily Profit
                                            </span>
                                        </div>

                                        {vip.level === selectedVIPLevel && (
                                            <div className="flex items-center justify-center gap-2">
                                                <LucideIcons.Check className="h-4 w-4 text-amber-400" />
                                                <span>
                                                    {vip.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>

                <div className="flex justify-center mt-12">
                    <Link href="/vip-levels">
                        <Button className="bg-amber-500 hover:bg-amber-600 text-[#1a140c] font-bold px-8 py-4 rounded-full">
                            View All VIP Levels
                            <LucideIcons.Crown className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default VIPLevels
