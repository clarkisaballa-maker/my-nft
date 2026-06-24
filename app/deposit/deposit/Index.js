"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import * as LucideIcons from "lucide-react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { useUsersContext } from "@/app/AllContext/UsersContext"

const Index = () => {
  const { getWallets } = useUsersContext()
  const [wallets, setWallets] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWallets()
      setWallets(data)
    }
    fetchData()
  }, [])

  const copyToClipboard = (address) => {
    navigator.clipboard.writeText(address)
  }

  const iconMapping = {
    ETH: LucideIcons.Zap,
    Ethereum: LucideIcons.Zap,

    BTC: LucideIcons.Bitcoin,
    Bitcoin: LucideIcons.Bitcoin,

    USDT: LucideIcons.DollarSign,
    Tether: LucideIcons.DollarSign,
    "Tether USD": LucideIcons.DollarSign,
  }

  const colorMapping = {
    ETH: "from-amber-500 to-orange-600",
    BTC: "from-amber-400 to-orange-500",
    USDT: "from-amber-500 to-amber-600",
  }

  const bgColorMapping = {
    ETH: "from-amber-500/10 to-orange-600/10",
    BTC: "from-amber-400/10 to-orange-500/10",
    USDT: "from-amber-500/10 to-amber-600/10",
  }

  return (
    <Tabs defaultValue="deposit">
      <TabsContent value="deposit" className="mt-0">
        <div className="grid gap-6 sm:gap-8">
          <Card className="p-4 sm:p-6 lg:p-8 bg-[#2a2016]/70 backdrop-blur-sm shadow-2xl border border-amber-500/20 rounded-3xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600">
                <LucideIcons.Wallet className="h-4 w-4 sm:h-6 sm:w-6 text-[#1a140c]" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-white">Deposit Addresses</h2>
            </div>

            <div className="grid gap-6 sm:gap-8 mb-8">
              {wallets.map((wallet) => {
                const Icon = iconMapping[wallet.walletName] || LucideIcons.Wallet

                const color = colorMapping[wallet.walletName] || "from-amber-500 to-orange-600"

                const bgColor = bgColorMapping[wallet.walletName] || "from-amber-500/10 to-orange-600/10"

                return (
                  <div
                    key={wallet._id}
                    className="p-4 sm:p-6 bg-[#1a140c] border border-amber-500/30 rounded-2xl hover:shadow-xl hover:border-amber-500/50 transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-4">
                      <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#1a140c]" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white">{wallet.walletName}</h3>
                        <p className="text-xs sm:text-sm text-gray-400">{wallet.walletName}</p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                      <p className="text-xs sm:text-sm font-semibold text-gray-300 mb-2">Deposit Address:</p>
                      <div className="flex items-center gap-2 p-3 bg-[#2a2016] rounded-xl border border-amber-500/30">
                        <code className="text-xs sm:text-sm font-mono text-gray-200 flex-1 truncate">
                          {wallet.walletAddress}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(wallet.walletAddress)}
                          className="flex-shrink-0 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                        >
                          <LucideIcons.Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className={`p-3 sm:p-4 bg-gradient-to-br ${bgColor} rounded-xl border-l-4 border-l-amber-500`}>
                      <div className="flex gap-2 sm:gap-3">
                        <LucideIcons.AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 text-amber-400" />
                        <p className="text-xs sm:text-sm text-gray-300">
                          Send funds to the address above. After sending, please upload the receipt to the live support so that they can review and process your payment. Thank you!
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default Index
