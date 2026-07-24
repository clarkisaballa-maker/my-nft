"use client"
import Link from "next/link"
import * as LucideIcons from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { useUsersContext } from "../AllContext/UsersContext"
import { useRouter } from "next/navigation"
import Bottom from "@/app/Common/Bottom/Bottom"

// ─── measure how many leaf-columns each subtree needs ───────────────────────
function countLeaves(node) {
    if (!node.children || node.children.length === 0) return 1
    return node.children.reduce((sum, c) => sum + countLeaves(c), 0)
}

// ─── recursive org-chart node rendered with SVG connectors ──────────────────
function OrgNode({ node, getVipName, isRoot = false }) {
    const [collapsed, setCollapsed] = useState(false)
    const hasChildren = node.children && node.children.length > 0
    const vipNumber = node.currentVIPLevel?.number ?? 0

    // width of one column in px
    const COL_W = 100
    const totalLeaves = countLeaves(node)
    const nodeWidth = totalLeaves * COL_W

    // vertical gap between parent circle and children row
    const V_GAP = 64

    return (
        <div className="flex flex-col items-center" style={{ width: nodeWidth }}>
            {/* ── node bubble ─────────────────────────────────────────────── */}
            <div className="flex flex-col items-center group">
                {isRoot && (
                    <span className="mb-1 text-[10px] font-bold text-amber-400 tracking-widest uppercase">
                        You
                    </span>
                )}
                <button
                    onClick={() => hasChildren && setCollapsed(p => !p)}
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center
                        font-bold text-base shadow-lg transition-transform duration-150
                        ${isRoot
                            ? "bg-gradient-to-br from-amber-400 to-orange-500 text-[#1a140c] ring-4 ring-amber-400/40 scale-110"
                            : "bg-[#2e2010] border-2 border-amber-500/60 text-amber-300 hover:border-amber-400"
                        }
                        ${hasChildren ? "cursor-pointer active:scale-95" : "cursor-default"}`}
                    title={node.username}
                >
                    {node.username?.charAt(0).toUpperCase()}
                    {hasChildren && (
                        <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full
                            flex items-center justify-center text-[9px] font-bold
                            bg-amber-500 text-[#1a140c] shadow transition-transform duration-200
                            ${collapsed ? "rotate-180" : ""}`}>
                            {collapsed ? "+" : "−"}
                        </span>
                    )}
                </button>

                {/* username label */}
                <span className="mt-1.5 text-[11px] font-semibold text-gray-300 max-w-[88px] truncate text-center leading-tight">
                    {node.username}
                </span>

                {/* VIP badge */}
                <span className="mt-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold
                    bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    VIP {vipNumber}
                </span>
            </div>

            {/* ── connector lines + children ───────────────────────────────── */}
            {hasChildren && !collapsed && (
                <div className="flex flex-col items-center w-full">
                    {/* vertical stem down from parent */}
                    <div className="w-px bg-amber-500/40" style={{ height: V_GAP / 2 }} />

                    {/* horizontal bar spanning all children */}
                    {node.children.length > 1 ? (
                        <ChildrenRow node={node} getVipName={getVipName} COL_W={COL_W} V_GAP={V_GAP} />
                    ) : (
                        // single child – straight line
                        <div className="flex flex-col items-center">
                            <div className="w-px bg-amber-500/40" style={{ height: V_GAP / 2 }} />
                            <OrgNode node={node.children[0]} getVipName={getVipName} />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// renders the horizontal connector bar + all children side-by-side
function ChildrenRow({ node, getVipName, COL_W, V_GAP }) {
    const children = node.children
    const leaves = children.map(countLeaves)
    const totalLeaves = leaves.reduce((a, b) => a + b, 0)
    const totalWidth = totalLeaves * COL_W

    // cumulative offsets for each child's center
    let cumulative = 0
    const centers = leaves.map(l => {
        const center = (cumulative + l / 2) * COL_W
        cumulative += l
        return center
    })

    const firstCenter = centers[0]
    const lastCenter = centers[centers.length - 1]
    const barWidth = lastCenter - firstCenter

    return (
        <div className="relative flex flex-col items-center" style={{ width: totalWidth }}>
            {/* SVG for the T-junction connector */}
            <svg
                width={totalWidth}
                height={V_GAP / 2}
                style={{ display: "block", overflow: "visible" }}
            >
                {/* horizontal bar */}
                <line
                    x1={firstCenter} y1={V_GAP / 4}
                    x2={lastCenter} y2={V_GAP / 4}
                    stroke="rgba(245,158,11,0.4)" strokeWidth="1.5"
                />
                {/* vertical drop to each child */}
                {centers.map((cx, i) => (
                    <line
                        key={i}
                        x1={cx} y1={V_GAP / 4}
                        x2={cx} y2={V_GAP / 2}
                        stroke="rgba(245,158,11,0.4)" strokeWidth="1.5"
                    />
                ))}
            </svg>

            {/* children row */}
            <div className="flex items-start">
                {children.map((child, i) => (
                    <OrgNode key={child._id} node={child} getVipName={getVipName} />
                ))}
            </div>
        </div>
    )
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function countTreeMembers(node) {
    if (!node) return 0
    let count = 1
    if (node.children) node.children.forEach(c => { count += countTreeMembers(c) })
    return count
}

function getTreeDepth(node, d = 0) {
    if (!node?.children?.length) return d
    return Math.max(...node.children.map(c => getTreeDepth(c, d + 1)))
}

// ─── page ────────────────────────────────────────────────────────────────────
export default function MyTeamPage() {
    const { getReferralsAPI, vipLevels } = useUsersContext()
    const router = useRouter()

    const [treeData, setTreeData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem("user")
        if (!stored) { router.push("/login"); return }

        const userData = JSON.parse(stored)

        const load = async () => {
            setLoading(true)
            const result = await getReferralsAPI(userData._id)
            if (!result.error && result.tree) setTreeData(result.tree)
            setLoading(false)
        }
        load()
    }, [])

    const getVipName = (n) => vipLevels?.find(l => l.level === n)?.name || "—"

    const totalMembers = treeData ? countTreeMembers(treeData) - 1 : 0   // exclude self
    const treeDepth = treeData ? getTreeDepth(treeData) : 0

    return (
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

            <main className="flex-1 p-4 md:p-6 pb-32">
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-5 bg-[#241c12]/80 border border-amber-500/20 rounded-3xl shadow-xl">
                            <div className="flex flex-col gap-2">
                                <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 w-fit">
                                    <LucideIcons.Users className="h-5 w-5 text-[#1a140c]" />
                                </div>
                                <p className="text-gray-400 text-sm">Total Members</p>
                                <p className="text-3xl font-extrabold text-amber-400">{loading ? "…" : totalMembers}</p>
                            </div>
                        </Card>
                        <Card className="p-5 bg-[#241c12]/80 border border-amber-500/20 rounded-3xl shadow-xl">
                            <div className="flex flex-col gap-2">
                                <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 w-fit">
                                    <LucideIcons.Layers className="h-5 w-5 text-[#1a140c]" />
                                </div>
                                <p className="text-gray-400 text-sm">Tree Levels</p>
                                <p className="text-3xl font-extrabold text-emerald-400">{loading ? "…" : treeDepth}</p>
                            </div>
                        </Card>
                    </div>

                    {/* Org-chart tree */}
                    <Card className="p-6 bg-[#241c12]/80 border border-amber-500/20 rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600">
                                <LucideIcons.GitBranch className="h-5 w-5 text-[#1a140c]" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Team Tree</h3>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-12 h-12 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin" />
                                <p className="text-gray-400">Loading your team tree…</p>
                            </div>
                        ) : !treeData ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <LucideIcons.UserPlus className="h-12 w-12 text-amber-500/30" />
                                <p className="text-gray-400">No team data found.</p>
                            </div>
                        ) : (
                            /* horizontally scrollable so wide trees don't break layout */
                            <div className="overflow-x-auto overflow-y-visible pb-4">
                                <div className="inline-flex justify-center min-w-full py-2">
                                    <OrgNode node={treeData} getVipName={getVipName} isRoot />
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Invite CTA */}
                    {treeData && totalMembers < 5 && (
                        <Card className="p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-amber-500/20">
                                    <LucideIcons.Share2 className="h-5 w-5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Grow Your Team</p>
                                    <p className="text-gray-400 text-sm">Share your invite code to earn more rewards!</p>
                                </div>
                            </div>
                        </Card>
                    )}

                </div>
            </main>

            <Bottom />
        </div>
    )
}
