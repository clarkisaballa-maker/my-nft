import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import * as LucideIcons from "lucide-react"
import { useUsersContext } from "@/app/AllContext/UsersContext"
import TransactionReceiptModal from "./transaction-receipt-modal"

const Index = ({ page }) => {
  const { getUserTransactionsAPI, user } = useUsersContext()
  const [transactions, setTransactions] = useState([])
  const [rawTransactions, setRawTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?._id) return
      setLoading(true)
      setError("")

      const result = await getUserTransactionsAPI(user._id)

      if (result.error) {
        setError(result.error)
      } else {
        setRawTransactions(result)

        const formatted = result.map((tx) => ({
          id: tx._id,
          date: new Date(tx.createdAt).toLocaleDateString(),
          amount: tx.transactionAmount.toFixed(2),
          status:
            tx.status === "Successful"
              ? "Completed"
              : tx.status === "Pending"
              ? "Pending"
              : "Failed",
          transactionId: tx._id,
          method: tx.type === "Debit" ? "Withdraw" : "Deposit",
          fee: "0.00",
          hasWallet: tx.walletId !== null,
        }))

        setTransactions(formatted)
      }

      setLoading(false)
    }

    fetchTransactions()
  }, [user])

  const handleViewReceipt = (transactionId) => {
    const transaction = rawTransactions.find((tx) => tx._id === transactionId)
    if (transaction) {
      setSelectedTransaction(transaction)
      setIsModalOpen(true)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      Completed: {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        icon: LucideIcons.CheckCircle,
      },
      Pending: {
        bg: "bg-orange-500/20",
        text: "text-orange-400",
        icon: LucideIcons.Clock,
      },
      Failed: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        icon: LucideIcons.XCircle,
      },
    }

    const config = statusConfig[status] || statusConfig.Pending
    const Icon = config.icon

    return (
      <div
        className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
      >
        <Icon className="h-3 w-3" />
        <span className="hidden sm:inline">{status}</span>
        <span className="sm:hidden">{status.charAt(0)}</span>
      </div>
    )
  }

  if (loading)
    return (
      <Card className="p-4 sm:p-6 bg-[#2a2016]/70 backdrop-blur-sm shadow-2xl border border-amber-500/20 rounded-3xl text-center text-white">
        Loading transactions...
      </Card>
    )

  if (error)
    return (
      <Card className="p-4 sm:p-6 bg-[#2a2016]/70 backdrop-blur-sm shadow-2xl border border-amber-500/20 rounded-3xl text-center text-red-400">
        {error}
      </Card>
    )

  const filteredTransactions = transactions.filter((txn) => {
    if (page === "Deposit") return txn.method === "Deposit"
    if (page === "Withdrawal") return txn.method === "Withdraw"
    return true
  })

  return (
    <Tabs defaultValue="history" className="mt-0">
      <TabsContent value="history" className="mt-0">

        <Card className="p-4 sm:p-6 bg-[#2a2016]/70 backdrop-blur-sm shadow-2xl border border-amber-500/20 rounded-3xl">

          {/* HEADER */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600">
              <LucideIcons.History className="h-4 w-4 sm:h-6 sm:w-6 text-[#1a140c]" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              Transaction History
            </h2>
          </div>

          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <div className="inline-block min-w-full align-middle">

                <Table className="min-w-full">

                  {/* TABLE HEADER */}
                  <TableHeader>
                    <TableRow className="bg-[#2a2016]/70 hover:bg-[#2a2016] border-b border-amber-500/30">
                      <TableHead className="text-gray-300 font-bold">Date</TableHead>
                      <TableHead className="text-gray-300 font-bold">Amount</TableHead>
                      <TableHead className="text-gray-300 font-bold">Status</TableHead>
                      <TableHead className="text-gray-300 font-bold">Type</TableHead>
                      <TableHead className="text-gray-300 hidden sm:table-cell">Fee</TableHead>
                      <TableHead className="text-gray-300 hidden lg:table-cell">Transaction ID</TableHead>
                      <TableHead className="text-gray-300 text-center font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  {/* TABLE BODY */}
                  <TableBody>
                    {filteredTransactions.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-b border-amber-500/20 hover:bg-[#2a2016]/50 transition-all"
                      >

                        <TableCell className="text-white">
                          <div className="flex items-center gap-2">
                            <LucideIcons.Calendar className="h-3 w-3 text-amber-400" />
                            <span className="text-sm">{item.date}</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-white font-bold">
                          ${item.amount}
                        </TableCell>

                        <TableCell>
                          {getStatusBadge(item.status)}
                        </TableCell>

                        <TableCell className="text-white">
                          {item.method}
                        </TableCell>

                        <TableCell className="hidden sm:table-cell text-white">
                          <div className="flex items-center gap-1 text-sm">
                            <LucideIcons.Minus className="h-3 w-3" />
                            {item.status === "Completed" ? "6%" : "N/A"}
                          </div>
                        </TableCell>

                        <TableCell className="hidden lg:table-cell text-gray-300 font-mono text-xs">
                          {item.transactionId}
                        </TableCell>

                        <TableCell className="text-center">
                          {item.hasWallet ? (
                            <button
                              onClick={() => handleViewReceipt(item.id)}
                              className="p-2 rounded-lg bg-amber-500 hover:bg-orange-500 transition-all"
                            >
                              <LucideIcons.Eye className="h-4 w-4 text-[#1a140c]" />
                            </button>
                          ) : (
                            <span className="text-gray-500 text-xs">-</span>
                          )}
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>

                </Table>

              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#2a2016] rounded-2xl mb-3 sm:mb-4 border border-amber-500/20">
                <LucideIcons.FileX className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-base sm:text-lg">
                No withdrawal history found
              </p>
            </div>
          )}

        </Card>

        {isModalOpen && (
          <TransactionReceiptModal
            transaction={selectedTransaction}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedTransaction(null)
            }}
          />
        )}

      </TabsContent>
    </Tabs>
  )
}

export default Index