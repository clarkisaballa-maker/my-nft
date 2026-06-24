"use client"
import { useEffect, useState } from "react"
import * as LucideIcons from "lucide-react"

export default function NotificationMarquee({ notifications = [] }) {
    const [marqueeItems, setMarqueeItems] = useState([])

    useEffect(() => {
        if (!notifications || notifications.length === 0) {
            setMarqueeItems([])
            return
        }

        prepareMarquee(notifications)
    }, [notifications])

    const prepareMarquee = (notifs) => {
        const unread = notifs.filter(n => !n.read)
        const read = notifs.filter(n => n.read)

        let selected = [...unread]

        if (read.length > 0) {
            const shuffledRead = [...read].sort(() => 0.5 - Math.random())
            const randomOld = shuffledRead.slice(0, Math.min(4, read.length))
            selected = [...selected, ...randomOld]
        }

        if (selected.length === 1) {
            selected = [...selected, ...selected]
        }

        setMarqueeItems(selected)
    }

    if (marqueeItems.length === 0) return null

    return (
        <div className="bg-[#241c12] border-b border-amber-500/30 py-3 overflow-hidden">
            <div className="flex items-center gap-4 max-w-7xl mx-auto px-4">
                {/* Left Label */}
                <div className="bg-amber-500 text-[#1a140c] px-3 py-1 text-[10px] font-bold tracking-widest whitespace-nowrap rounded-md flex items-center gap-1.5 shadow-sm">
                    <LucideIcons.Bell className="w-3.5 h-3.5" />
                    LIVE
                </div>

                {/* Marquee */}
                <div className="overflow-hidden flex-1">
                    <div className="marquee flex items-center gap-10 text-sm whitespace-nowrap">
                        {marqueeItems.map((notif, index) => (
                            <span
                                key={`${index}-${notif.createdAt}`}
                                className={`inline-flex items-center gap-3 px-2 ${getColorClass(notif.type)}`}
                            >
                                {getIcon(notif.type)}
                                <span className="font-medium">{notif.message}</span>
                                <span className="text-xs opacity-70 ml-2">
                                    {new Date(notif.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* Helper Functions */
const getColorClass = (type) => {
    switch (type?.toLowerCase()) {
        case "success": return "text-lime-400"
        case "warning": return "text-amber-400"
        case "error": return "text-red-400"
        default: return "text-amber-300"
    }
}

const getIcon = (type) => {
    switch (type?.toLowerCase()) {
        case "success": return "✅"
        case "warning": return "⚠️"
        case "error": return "❌"
        default: return "🎬"
    }
}
