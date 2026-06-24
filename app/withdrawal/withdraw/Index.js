"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import * as LucideIcons from "lucide-react"
import { useUsersContext } from "@/app/AllContext/UsersContext"
import Wallet from "@/app/payment-method/Wallets/Index"

const Index = () => {
    const { createTransactionAPI, user, updateUserAPI } = useUsersContext()

    const [withdrawAmount, setWithdrawAmount] = useState(user.totalBalance.toFixed(2) || 0)
    const [transactionPassword, setTransactionPassword] = useState("")
    const [walletId, setWalletId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [toast, setToast] = useState({ show: false, message: "", type: "" })

    const showToast = (message, type) => {
        setToast({ show: true, message, type })
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 10000)
    }

    const handleWithdraw = async (e) => {
        e.preventDefault()

        if (user.creditScore < 98) {
            showToast(
                `Your credit score is low. You need to improve your credit score first.`,
                "error"
            )
            return
        }

        if (!walletId) {
            showToast("Please select a wallet address.", "error")
            return
        }

        if (transactionPassword !== user.transactionPassword) {
            showToast("Transaction password is incorrect.", "error")
            return
        }

        if (withdrawAmount > user.totalBalance) {
            showToast("Please enter correct amount to withdraw.", "error")
            return
        }

        if (user.totalBalance <= 0) {
            showToast(`Illegal withdrawal attempt.`, "error")
            return
        }

        if (withdrawAmount < 11) {
            showToast("Minimum Allowed Withdrawal is $11.", "error")
            return
        }

        setLoading(true)

        try {
            const result = await createTransactionAPI({
                userId: user._id,
                transactionAmount: Number.parseFloat(withdrawAmount),
                type: "Debit",
                status: "Pending",
                walletId,
            })

            if (result.error) {
                showToast(result.error, "error")
            } else {
                showToast(`Withdrawal request submitted successfully!`, "success")
                setTransactionPassword("")
            }
        } catch (err) {
            showToast(`Something went wrong. Please try again.`, "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {toast.show && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
                    <div
                        className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
                            toast.type === "success"
                                ? "bg-amber-500 text-[#1a140c]"
                                : "bg-red-500 text-white"
                        }`}
                    >
                        {toast.type === "success" ? (
                            <LucideIcons.CheckCircle className="h-5 w-5" />
                        ) : (
                            <LucideIcons.XCircle className="h-5 w-5" />
                        )}
                        <p className="font-medium">{toast.message}</p>
                    </div>
                </div>
            )}

            <div className="xl:col-span-2 order-1 xl:order-2">
                <Card className="p-4 sm:p-6 lg:p-8 bg-[#2a2016]/70 backdrop-blur-sm shadow-2xl border border-amber-500/20 rounded-3xl">

                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="p-2 sm:p-3 rounded-2xl bg-amber-500">
                            <LucideIcons.ArrowDownCircle className="h-4 w-4 sm:h-6 sm:w-6 text-[#1a140c]" />
                        </div>
                        <h2 className="text-lg sm:text-2xl font-bold text-white">
                            Withdraw Funds
                        </h2>
                    </div>

                    <form onSubmit={handleWithdraw} className="space-y-4 sm:space-y-6">

                        {error && <p className="text-red-400 text-sm sm:text-base">{error}</p>}
                        {success && <p className="text-amber-400 text-sm sm:text-base">{success}</p>}

                        <div className="space-y-2">
                            <Label className="text-white font-semibold text-sm sm:text-base">
                                Withdrawal Amount (USD)
                            </Label>

                            <div className="relative">
                                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                                    <LucideIcons.DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                                </div>

                                <Input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="pl-10 sm:pl-12 h-12 sm:h-14 text-base sm:text-lg font-semibold bg-[#2a2016] border border-amber-500/30 rounded-2xl text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white font-semibold text-sm sm:text-base">
                                Transaction Password
                            </Label>

                            <div className="relative">
                                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                                    <LucideIcons.Lock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                                </div>

                                <Input
                                    type="password"
                                    placeholder="Enter your secure password"
                                    value={transactionPassword}
                                    onChange={(e) => setTransactionPassword(e.target.value)}
                                    disabled={loading}
                                    className="pl-10 sm:pl-12 h-12 sm:h-14 text-base sm:text-lg bg-[#2a2016] border border-amber-500/30 rounded-2xl text-white placeholder:text-white/40"
                                />
                            </div>
                        </div>

                        <Wallet setWalletId={setWalletId} walletId={walletId} page="Withdrawal" />

                        <Button
                            type="submit"
                            className={`w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-amber-500 hover:bg-amber-600 text-[#1a140c] rounded-2xl ${
                                loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                            disabled={loading}
                        >
                            {loading ? (
                                "Processing..."
                            ) : (
                                <>
                                    <LucideIcons.Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                    Process Withdrawal
                                </>
                            )}
                        </Button>
                    </form>

                </Card>
            </div>
        </>
    )
}

export default Index