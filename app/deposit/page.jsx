"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import * as LucideIcons from "lucide-react"
import Bottom from "@/app/Common/Bottom/Bottom"
import CS from "@/app/Common/CustomerService/CS"
import { useRouter } from "next/navigation"
import Deposit from "./deposit/Index"
import SupportChat from '@/app/Common/SupportChat/SupportChat'
import TransactionHistory from "@/app/withdrawal/history/Index"

export default function DepositPage() {
  const [isCSOpen, setIsCSOpen] = useState(false)

  const router = useRouter()
  const [storedUser, setStoredUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
    } else {
      setStoredUser(JSON.parse(userData))
    }
  }, [])
  // Prevent rendering until localStorage is checked
  if (!storedUser) return null

  return (
    <>
    <SupportChat userId={storedUser._id} username={storedUser.username} />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#241c12] via-[#1a140c] to-[#241c12]">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#2a2016]/90 border-b border-amber-500/20 shadow-lg">
          <div className="flex items-center justify-between p-4">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 text-gray-300 hover:text-amber-400 transition-colors rounded-xl hover:bg-amber-500/10 p-2"
            >
              <LucideIcons.ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-medium text-sm sm:text-base">Back</span>
            </Link>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-amber-400 bg-clip-text text-transparent">
              Deposit
            </h1>
            <div className="w-12 sm:w-16" />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 pb-28 sm:pb-32 lg:pb-48">
          <div className="max-w-7xl mx-auto w-full">
            {/* Hero Section */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 px-4 sm:px-6 py-2 sm:py-3 bg-amber-500/20 border border-amber-500/30 rounded-full">
                <LucideIcons.PlusCircle className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400" />
                <span className="text-amber-400 font-semibold text-sm sm:text-base">Crypto Deposit</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">Deposit Funds</h2>
              <div className="mt-6 max-w-4xl mx-auto">
  <div className="bg-[#2a2016]/70 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-5 sm:p-7 text-left shadow-lg">
    <div className="flex items-center gap-3 mb-5">
      <LucideIcons.Info className="h-6 w-6 text-amber-400" />
      <h3 className="text-xl sm:text-2xl font-bold text-amber-400">
        Deposit Instructions
      </h3>
    </div>

    <div className="space-y-5 text-gray-300">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-[#1a140c] font-bold">
          1
        </div>
        <div>
          <h4 className="font-semibold text-white">
            Copy Any Deposit Address
          </h4>
          <p className="text-sm sm:text-base text-gray-300 mt-1">
            Choose <span className="text-amber-400 font-semibold">any one</span>{" "}
            of the cryptocurrency deposit addresses provided below and copy it.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-[#1a140c] font-bold">
          2
        </div>
        <div>
          <h4 className="font-semibold text-white">
            Deposit the Required Amount
          </h4>
          <p className="text-sm sm:text-base text-gray-300 mt-1">
            Send the <span className="text-amber-400 font-semibold">exact amount</span>{" "}
            required for the package you want to purchase. Make the transaction
            to <span className="text-amber-400 font-semibold">only one</span>{" "}
            of the available deposit addresses.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-[#1a140c] font-bold">
          3
        </div>
        <div>
          <h4 className="font-semibold text-white">
            Upload Your Payment Receipt
          </h4>
          <p className="text-sm sm:text-base text-gray-300 mt-1">
            After completing your payment, click the{" "}
            <span className="text-amber-400 font-semibold">
              "Upload Receipt Picture"
            </span>{" "}
            button below. This will open our Live Support Chat.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-[#1a140c] font-bold">
          4
        </div>
        <div>
          <h4 className="font-semibold text-white">
            Send Your Transaction Screenshot
          </h4>
          <p className="text-sm sm:text-base text-gray-300 mt-1">
            Upload a clear screenshot or receipt of your completed transaction
            in the Live Support Chat for verification.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-[#1a140c] font-bold">
          5
        </div>
        <div>
          <h4 className="font-semibold text-white">
            Package Activation
          </h4>
          <p className="text-sm sm:text-base text-gray-300 mt-1">
            Our support team will verify your transaction. Once confirmed, your
            selected package will be activated according to the amount you
            deposited.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="flex items-start gap-3">
          <LucideIcons.AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
          <p className="text-sm sm:text-base text-gray-200">
            <span className="font-semibold text-amber-400">
              Important:
            </span>{" "}
            Please deposit the exact package amount and upload a clear payment
            screenshot. This helps our support team verify your transaction
            quickly and activate your package without delay.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
            </div>

            <Tabs defaultValue="deposit" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#2a2016]/70 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-1 shadow-lg mb-6 sm:mb-8">
                <TabsTrigger
                  value="deposit"
                  className="rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-[#1a140c] data-[state=active]:shadow-lg text-gray-300 text-sm sm:text-base"
                >
                  <LucideIcons.PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Deposit
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-[#1a140c] data-[state=active]:shadow-lg text-gray-300 text-sm sm:text-base"
                >
                  <LucideIcons.History className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="deposit">
                <Deposit />
              </TabsContent>
              <TabsContent value="history">
                <TransactionHistory page="Deposit" />
              </TabsContent>
            </Tabs>

            <div className="mt-8 mb-6 flex justify-center">
              <Dialog open={isCSOpen} onOpenChange={setIsCSOpen}>
                <DialogTrigger asChild>
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-[#1a140c] font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3">
                    <div className="p-2 bg-[#1a140c]/20 rounded-lg group-hover:bg-[#1a140c]/30 transition-all">
                      <LucideIcons.Headphones className="h-5 w-5" />
                    </div>
                    <span className="text-base sm:text-lg">Upload Receipt Picture</span>
                    <LucideIcons.MessageCircle className="h-5 w-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </button>
                </DialogTrigger>
                <CS userId={storedUser._id} username={storedUser.username} />
              </Dialog>
            </div>
          </div>
        </main>
        <Bottom />
      </div>
    </>
  )
}
