"use client"
import Link from "next/link"
import * as LucideIcons from "lucide-react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useUsersContext } from "../AllContext/UsersContext"
import { useRouter } from "next/navigation"
import Bottom from "@/app/Common/Bottom/Bottom"

export default function MyTeamPage() {
    const { getReferralsAPI, vipLevels } = useUsersContext()
    const router = useRouter()

    const [referrals, setReferrals] = useState([])
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        const stored = localStorage.getItem("user")
        if (!stored) {
            router.push("/login")
            return
        }

        const userData = JSON.parse(stored)
        setUserId(userData._id)

        const loadReferrals = async () => {
            setLoading(true)
            const result = await getReferralsAPI(userData._id)
            if (!result.error) {
                setReferrals(result.referrals || [])
            }
            setLoading(false)
        }

        loadReferrals()
    }, [])

    const getVipName = (vipNumber) => {
        const matched = vipLevels?.find((level) => level.level === vipNumber)
        return matched?.name || "—"
    }

    return (
        <>
            <div className="flex flex-col min-h-screen bg-[#1a140c]">
                {/* Header */}
                <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#241c12]/80 border-b border-amber-500/20 shadow-lg">
                    <div className="flex items-center justify-between p-4">
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 text-gray-300 hover:text-amber-400 transition-colors rounded-xl hover:bg-amber-500/10 p-2"
                        >
                            <LucideIcons.ChevronLeft className="h-6 w-6" />
                            <span className="font-medium">Back</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-white">My Team</h1>
                        <div className="w-16" />
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-6 pb-32">
                    <div className="max-w-4xl mx-auto space-y-6">

                        {/* Summary Card */}
                        <Card className="p-6 bg-[#241c12]/80 border border-amber-500/20 rounded-3xl shadow-xl backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg">
                                        <LucideIcons.Users className="h-8 w-8 text-[#1a140c]" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Total Members</p>
                                        <p className="text-4xl font-extrabold text-amber-400">
                                            {loading ? "..." : referrals.length}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                                    <LucideIcons.TrendingUp className="h-6 w-6 text-amber-400" />
                                </div>
                            </div>
                        </Card>

                        {/* Team List */}
                        <Card className="p-6 bg-[#241c12]/80 border border-amber-500/20 rounded-3xl shadow-xl backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600">
                                    <LucideIcons.UserCheck className="h-6 w-6 text-[#1a140c]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Team Members</h3>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-4">
                                    <div className="w-12 h-12 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin" />
                                    <p className="text-gray-400">Loading your team...</p>
                                </div>
                            ) : referrals.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-4">
                                    <div className="p-6 rounded-3xl bg-[#1a140c]/60 border border-amber-500/10">
                                        <LucideIcons.UserPlus className="h-12 w-12 text-amber-500/40" />
                                    </div>
                                    <p className="text-gray-400 text-center">No team members yet.</p>
                                    <p className="text-gray-500 text-sm text-center">Share your invite code to grow your team!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {referrals.map((member, index) => {
                                        const vipNumber = member.currentVIPLevel?.number ?? 0
                                        const vipName = getVipName(vipNumber)

                                        const joinDate = new Date(member.createdAt).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })

                                        return (
                                            <div
                                                key={member._id}
                                                className="flex items-center justify-between p-4 rounded-2xl bg-[#1a140c]/60 border border-amber-500/10 hover:border-amber-500/30 hover:bg-[#1a140c]/80 transition-all duration-200"
                                            >
                                                {/* Left: Avatar + Info */}
                                                <div className="flex items-center gap-4">
                                                    {/* Avatar */}
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                                        <span className="text-[#1a140c] font-bold text-lg">
                                                            {member.username?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>

                                                    {/* Name + Date */}
                                                    <div>
                                                        <p className="text-white font-bold text-base">{member.username}</p>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <LucideIcons.Calendar className="h-3 w-3 text-gray-500" />
                                                            <p className="text-gray-500 text-xs">Joined {joinDate}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: VIP Badge */}
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow">
                                                        <LucideIcons.Crown className="h-3.5 w-3.5 text-[#1a140c]" />
                                                        <span className="text-xs font-bold text-[#1a140c]">VIP {vipNumber}</span>
                                                    </div>
                                                    {vipName && (
                                                        <span className="text-xs text-gray-400">{vipName}</span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </Card>

                    </div>
                </main>

                <Bottom />
            </div>
        </>
    )
}
