"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import * as LucideIcons from "lucide-react"
import { useLiveSupportContext } from "@/app/AllContext/ChatContext"

export default function BroadcastModal() {
    const { broadcastMessages } = useLiveSupportContext()
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    // Auto open modal jab naya broadcast aaye
    useEffect(() => {
        if (broadcastMessages?.length > 0) {
            const hasNew = broadcastMessages.length > 0
            if (hasNew && !isOpen) {
                setIsOpen(true)
            }
            setUnreadCount(broadcastMessages.length)
        }
    }, [broadcastMessages])

    const formatBroadcastText = (text) => {
        return text
            .replace(/\[📢 Broadcast\]\s*/i, "") // Remove prefix if exists
            .split('\n')
            .map((line, index) => (
                <p key={index} className="mb-2 last:mb-0">
                    {line}
                </p>
            ))
    }

    if (broadcastMessages?.length === 0) return null

    return (
        <>
            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-5 py-3 rounded-full shadow-2xl shadow-violet-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
                <div className="relative">
                    <LucideIcons.Megaphone className="h-3 w-3" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <span className="font-semibold text-sm">Announcements</span>
            </button>

            {/* Beautiful Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-violet-500/30 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                                    <LucideIcons.Megaphone className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Broadcast Announcements</h2>
                                    <p className="text-violet-200 text-sm">Official messages from Support</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/20 rounded-full"
                            >
                                <LucideIcons.X className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {broadcastMessages
                                .slice()
                                .reverse()
                                .map((msg, index) => (
                                    <div
                                        key={msg.id || index}
                                        className="bg-slate-800/70 border border-slate-700 rounded-2xl p-5 hover:border-violet-400/50 transition-all group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                                <LucideIcons.Volume2 className="h-4 w-4 text-white" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs uppercase tracking-widest text-violet-400 font-medium">
                                                        Official Broadcast
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {new Date(msg.timestamp).toLocaleDateString()} •{" "}
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                <div className="text-slate-100 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                                                    {formatBroadcastText(msg.text)}
                                                </div>

                                                {msg.text.includes("🔥") || msg.text.includes("🚀") || msg.text.includes("📢") ? (
                                                    <div className="mt-4 text-3xl opacity-75">
                                                        {msg.text.match(/[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu)}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-slate-800 flex justify-center">
                            <Button
                                onClick={() => setIsOpen(false)}
                                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-2.5 rounded-2xl"
                            >
                                Close Announcements
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}