"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import * as LucideIcons from "lucide-react"
import { useUsersContext } from "@/app/AllContext/UsersContext"

export default function Transactions() {
    const { fetchTransactionHistory } = useUsersContext()

    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    const loadTransactions = async (page) => {
        setLoading(true)
        const result = await fetchTransactionHistory(page)
        if (result.success) {
            setTransactions(result.transactions)
            setTotalPages(result.totalPages)
            setTotal(result.total)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadTransactions(currentPage)
    }, [currentPage])

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
    }

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0)

    const formatDate = (date) =>
        new Date(date).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })

    const getStatusStyle = (status) => {
        switch (status) {
            case "Successful":
                return "bg-green-900/30 text-green-400 border-green-600/40"
            case "Pending":
                return "bg-yellow-900/30 text-yellow-400 border-yellow-600/40"
            case "Failed":
                return "bg-red-900/30 text-red-400 border-red-600/40"
            default:
                return "bg-slate-800 text-slate-400 border-slate-600"
        }
    }

    const getTypeStyle = (type) => {
        return type === "Credit"
            ? "bg-blue-900/30 text-blue-400 border-blue-600/40"
            : "bg-rose-900/30 text-rose-400 border-rose-600/40"
    }

    return (
        <div className="space-y-6 mt-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Transaction History
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Total <span className="text-white font-semibold">{total}</span> transactions
                    </p>
                </div>
                <Button
                    onClick={() => loadTransactions(currentPage)}
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl bg-slate-900/40 text-slate-300 border-slate-700 hover:bg-slate-800"
                >
                    <LucideIcons.RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Table Card */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <LucideIcons.Loader className="h-10 w-10 animate-spin text-slate-400 mx-auto" />
                        <p className="text-slate-400 mt-4 font-semibold">Loading transactions...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-semibold">
                        No transactions found.
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-slate-300">

                                {/* Head */}
                                <thead>
                                    <tr className="bg-slate-800/60 border-b border-slate-700">
                                        <th className="px-6 py-4 text-left font-bold text-slate-200">User</th>
                                        <th className="px-6 py-4 text-left font-bold text-slate-200">Amount</th>
                                        <th className="px-6 py-4 text-left font-bold text-slate-200">Type</th>
                                        <th className="px-6 py-4 text-left font-bold text-slate-200">Status</th>
                                        <th className="px-6 py-4 text-left font-bold text-slate-200">Wallet</th>
                                        <th className="px-6 py-4 text-left font-bold text-slate-200">Date</th>
                                    </tr>
                                </thead>

                                {/* Body */}
                                <tbody>
                                    {transactions.map((txn) => (
                                        <tr
                                            key={txn._id}
                                            className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-all duration-200"
                                        >
                                            {/* User */}
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-200">
                                                    {txn.userId?.username || "—"}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {txn.userId?.phone || ""}
                                                </div>
                                            </td>

                                            {/* Amount */}
                                            <td className="px-6 py-4 font-bold text-white">
                                                {formatCurrency(txn.transactionAmount)}
                                            </td>

                                            {/* Type */}
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeStyle(txn.type)}`}>
                                                    {txn.type}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(txn.status)}`}>
                                                    {txn.status}
                                                </span>
                                            </td>

                                            {/* Wallet */}
                                            <td className="px-6 py-4">
                                                {txn.walletId ? (
                                                    <div>
                                                        <div className="text-slate-300 text-xs font-medium">
                                                            {txn.walletId.walletLabel || "—"}
                                                        </div>
                                                        <div className="text-slate-500 text-xs truncate max-w-[140px]">
                                                            {txn.walletId.walletAddress}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-500 text-xs">No wallet</span>
                                                )}
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                                                {formatDate(txn.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center py-4 gap-3">
                            <Button
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="rounded-xl bg-slate-900/40 text-slate-300 border-slate-700"
                            >
                                Previous
                            </Button>

                            <span className="text-slate-300 font-semibold">
                                Page {currentPage} of {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="rounded-xl bg-slate-900/40 text-slate-300 border-slate-700"
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}