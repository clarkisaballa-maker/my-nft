"use client"

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import * as LucideIcons from "lucide-react"
import { useLiveSupportContext } from "@/app/AllContext/ChatContext"

export default function CS({
  message = "How can we help you today? Choose your preferred contact method.",
  userId,
  username
}) {
  const { setIsChatOpen, connectSSE, fetchChatHistory } = useLiveSupportContext()

  const handleOpenChat = async () => {
    if (!userId) return
    setIsChatOpen(true)
    await fetchChatHistory(userId)
    connectSSE(userId)
  }

  const contactMethods = [
    {
      name: "Live Chat",
      icon: "MessageCircle",
      description: "Chat with our support team",
      onClick: handleOpenChat,
    },
  ]

  return (
    <DialogContent
      className="
        bg-gradient-to-br from-[#241c12] via-[#1a140c] to-[#241c12]
        border border-amber-500/30
        text-white
        max-w-md
        rounded-2xl
        shadow-2xl
      "
    >
      {/* Header */}
      <DialogHeader className="text-center">
        <DialogTitle className="text-2xl font-black text-amber-400">
          Online Support
        </DialogTitle>

        <DialogDescription className="text-gray-300 mt-2">
          {message}
        </DialogDescription>
      </DialogHeader>

      {/* Content */}
      <div className="space-y-4 py-5">
        {contactMethods.map((method) => {
          const IconComponent = LucideIcons[method.icon]

          return (
            <Button
              key={method.name}
              onClick={method.onClick}
              className="
                w-full p-4 h-auto
                flex items-center gap-4
                bg-[#1a140c]
                border border-amber-500/20
                hover:border-amber-500/50
                hover:bg-[#241c12]
                transition-all duration-300
                group rounded-xl
              "
            >
              {/* Icon */}
              <div className="
                p-3 rounded-xl
                bg-gradient-to-br from-amber-500 to-orange-600
                shadow-lg
                flex-shrink-0
              ">
                {IconComponent && (
                  <IconComponent className="h-6 w-6 text-[#1a140c]" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 text-left">
                <h3 className="
                  font-bold text-white
                  group-hover:text-amber-400
                  transition-colors
                ">
                  {method.name}
                </h3>

                <p className="text-sm text-gray-400">
                  {method.description}
                </p>
              </div>

              <LucideIcons.ChevronRight className="
                h-5 w-5 text-gray-400
                group-hover:text-amber-400
                transition-colors
              " />
            </Button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-amber-500/20">
        <p className="text-sm text-gray-400 text-center">
          <LucideIcons.Clock className="h-4 w-4 inline mr-1 text-amber-400" />
          24/7 User support.
        </p>
      </div>
    </DialogContent>
  )
}