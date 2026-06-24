"use client"
import { X, Receipt, Calendar, DollarSign, CreditCard, Wallet, CheckCircle, XCircle, Clock } from "lucide-react"

const TransactionReceiptModal = ({ transaction, onClose }) => {
  if (!transaction) return null

  const getStatusConfig = (status) => {
    const configs = {
      Successful: {
        color: "text-amber-400",
        bg: "bg-amber-500/20",
        icon: CheckCircle,
        label: "Successful",
      },
      Pending: {
        color: "text-orange-400",
        bg: "bg-orange-500/20",
        icon: Clock,
        label: "Pending",
      },
      Failed: {
        color: "text-red-400",
        bg: "bg-red-500/20",
        icon: XCircle,
        label: "Failed",
      },
    }
    return configs[status] || configs.Pending
  }

  const statusConfig = getStatusConfig(transaction.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">

      <div className="bg-[#2a2016] rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-amber-500/20">

        {/* Header */}
        <div className="sticky top-0 bg-[#2a2016] p-6 rounded-t-3xl border-b border-amber-500/20">

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-xl backdrop-blur-sm">
                <Receipt className="h-6 w-6 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Transaction Receipt</h2>
            </div>

            <button onClick={onClose} className="p-2 hover:bg-amber-500/10 rounded-xl transition-colors">
              <X className="h-5 w-5 text-gray-300" />
            </button>
          </div>

          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
            <StatusIcon className="h-4 w-4" />
            <span className="font-semibold">{statusConfig.label}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Amount */}
          <div className="text-center py-4 bg-[#2a2016] rounded-2xl border border-amber-500/20">
            <p className="text-sm text-gray-300 mb-1">Transaction Amount</p>
            <p className="text-4xl font-bold text-amber-400">
              ${transaction.transactionAmount.toFixed(2)}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-4">

            <div className="flex items-start gap-3 p-3 bg-[#2a2016] rounded-xl border border-amber-500/10">
              <Calendar className="h-5 w-5 text-amber-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-0.5">Date & Time</p>
                <p className="text-sm font-semibold text-white">
                  {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-300">
                  {new Date(transaction.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#2a2016] rounded-xl border border-amber-500/10">
              <CreditCard className="h-5 w-5 text-amber-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-0.5">Transaction Type</p>
                <p className={`text-sm font-semibold ${transaction.type === "Credit" ? "text-amber-400" : "text-orange-400"}`}>
                  {transaction.type === "Credit" ? "Deposit" : "Withdrawal"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#2a2016] rounded-xl border border-amber-500/10">
              <DollarSign className="h-5 w-5 text-amber-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-0.5">Transaction ID</p>
                <p className="text-xs font-mono text-gray-300 break-all">
                  {transaction._id}
                </p>
              </div>
            </div>

            {/* Wallet */}
            {transaction.walletId && (
              <div className="border-t border-amber-500/20 pt-4 mt-4">

                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="h-5 w-5 text-amber-400" />
                  <h3 className="font-semibold text-white">Wallet Information</h3>
                </div>

                <div className="space-y-3">

                  <div className="p-3 bg-[#2a2016] rounded-xl border border-amber-500/10">
                    <p className="text-xs text-amber-400 mb-0.5">Wallet Label</p>
                    <p className="text-sm font-semibold text-white">
                      {transaction.walletId.walletLabel}
                    </p>
                  </div>

                  <div className="p-3 bg-[#2a2016] rounded-xl border border-amber-500/10">
                    <p className="text-xs text-amber-400 mb-0.5">Wallet Address</p>
                    <p className="text-xs font-mono text-white break-all">
                      {transaction.walletId.walletAddress}
                    </p>
                  </div>

                </div>
              </div>
            )}

            <div className="text-center text-xs text-gray-400 pt-4 border-t border-amber-500/20">
              Last updated: {new Date(transaction.updatedAt).toLocaleString()}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#2a2016] rounded-b-3xl border-t border-amber-500/20">
          <button
            onClick={onClose}
            className="w-full py-3 bg-amber-500 text-[#1a140c] font-semibold rounded-xl hover:bg-orange-500 transition-all duration-200 shadow-lg"
          >
            Close Receipt
          </button>
        </div>

      </div>
    </div>
  )
}

export default TransactionReceiptModal