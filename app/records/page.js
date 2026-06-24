"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import * as LucideIcons from "lucide-react"
import { useUsersContext } from "../AllContext/UsersContext"
import Bottom from "@/app/Common/Bottom/Bottom"

export default function RecordsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(false)
  const [taskRecords, setTaskRecords] = useState([])
  const [totalTasks, setTotalTasks] = useState(0)
  const { user, fetchTasks, vipLevels, isLoadingVipLevels } = useUsersContext()

  useEffect(() => {
    const loadTasks = async () => {
      if (!user?._id) return
      setLoading(true)

      // ==============================
      // FETCH DATA
      // ==============================
      const tasks = await fetchTasks(user._id)
      const combos = []

      // ==============================
      // VIP LOGIC
      // ==============================
      const vipLevelNumber = user.currentVIPLevel?.number || 0

      const matchedVipLevel = vipLevels?.find(
        (vip) => vip.level === vipLevelNumber
      )

      const totalTasksCount = matchedVipLevel?.dailyProducts || 0

      setTotalTasks(totalTasksCount)

      // ==============================
      // REGULAR TASKS (combo = null)
      // ==============================
      const formattedTasks = tasks
        .filter(t => t.combo == null)
        .map(t => {
          const value = t.product?.productValue || 0
          return {
            id: t._id,
            productName: t.product?.productName || "Unnamed Product",
            taskCode: t.product?.taskCode || "N/A",
            productImage: t.product?.productImage?.url || "/placeholder.svg",
            value,
            status: t.status,
            submittedAt: t.createdAt,
            completedAt: t.updatedAt,
          }
        })

      // ==============================
      // COMBOS - merge consecutive same comboAt
      // ==============================
      let formattedCombos = combos.map(combo => {
        const rate = combo.commission || 0;

        return {
          id: combo._id,
          isCombo: true,
          comboAt: combo.comboAt,
          status: combo.status,
          submittedAt: combo.createdAt,
          comboProducts: combo.Products.map(p => ({
            taskCode: p.taskCode,
            productName: p.productName,
            productImage: p.productImage?.url || "/placeholder.svg",
            value: p.productValue,
            commission: +((p.productValue * rate) / 100).toFixed(2),
            status: combo.status, // ✅ product carries its own status
          })),
          totalValue: combo.comboPrice,
          totalCommission: combo.Products.reduce(
            (sum, p) => sum + +((p.productValue * rate) / 100).toFixed(2),
            0
          ),
        };
      });

      // ✅ Merge consecutive combos with same comboAt
      formattedCombos.sort((a, b) => a.comboAt - b.comboAt);
      const mergedComboGroups = [];

      formattedCombos.forEach(combo => {
        const lastGroup = mergedComboGroups[mergedComboGroups.length - 1];

        if (lastGroup && lastGroup.comboAt === combo.comboAt) {
          // Merge products and sums into last group
          lastGroup.comboProducts.push(...combo.comboProducts);
          lastGroup.totalValue += combo.totalValue;
          lastGroup.totalCommission += combo.totalCommission;
        } else {
          // New group for different comboAt
          mergedComboGroups.push({ ...combo });
        }
      });

      formattedCombos = mergedComboGroups; // Use this merged array for later


      // ==============================
      // MERGE TASKS + COMBOS
      // ==============================
      let mergedRecords = [...formattedTasks]

      formattedCombos.forEach(combo => {
        const insertIndex = Math.max(0, (mergedRecords.length + 1) - combo.comboAt)
        mergedRecords.splice(insertIndex, 0, combo)
      })

      setTaskRecords(mergedRecords)
      setLoading(false)
    }

    loadTasks()
  }, [user, fetchTasks])

  // ==============================
  // FILTERING
  // ==============================
  const filteredRecords = taskRecords.filter(record => {
    if (record.isCombo) {
      const matchesSearch = record.comboProducts.some(
        p =>
          p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.taskCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
      const matchesStatus =
        filterStatus === "all" ||
        record.comboProducts.some(p => p.status === filterStatus)

      return matchesSearch && matchesStatus
    } else {
      const matchesSearch =
        record.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.taskCode.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || record.status === filterStatus
      return matchesSearch && matchesStatus
    }
  })

  const completedTasks =
    // 1️⃣ Regular tasks (combo: null)
    taskRecords.filter(
      r => !r.isCombo && r.status === "completed"
    ).length
    +
    // 2️⃣ Combo tasks (1 combo = 1 task)
    taskRecords.filter(
      r =>
        r.isCombo &&
        r.comboProducts.every(p => p.status === "completed")
    ).length

  const processingTasks = taskRecords.filter((r) => r.status === "processing").length
  const failedTasks = taskRecords.filter((r) => r.status === "failed").length
  const totalEarnings = taskRecords.reduce((sum, r) => {

    // ✅ REGULAR TASK
    if (!r.isCombo) {
      return r.status === "completed"
        ? sum + r.value
        : sum
    }

    // ✅ COMBO TASK → only completed products
    const completedComboCommission = r.comboProducts
      .filter(p => p.status === "completed")
      .reduce((cSum, p) => cSum + p.commission, 0)

    return sum + completedComboCommission

  }, 0)

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-[#1a140c] border-amber-400 hover:from-amber-400 hover:to-orange-500">
            <LucideIcons.CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200 hover:from-yellow-200 hover:to-orange-200">
            <LucideIcons.Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200 hover:from-red-200 hover:to-pink-200">
            <LucideIcons.XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-500 text-white">
            <LucideIcons.AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  if (!user) return null

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#241c12] via-[#1a140c] to-[#241c12]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#2a2016]/95 border-b border-amber-500/20 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <LucideIcons.Zap className="h-6 w-6 text-[#1a140c]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Movee Tech</h1>
          </Link>
          <div className="flex items-center gap-3 relative">
            <Link
              href="/profile"
              className="text-gray-300 hover:text-amber-400 transition-colors rounded-xl hover:bg-[#2a2016] p-2"
            >
              <LucideIcons.UserCircle className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-6 pb-32 lg:pb-48">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <LucideIcons.ClipboardList className="h-6 w-6 text-[#1a140c]" />
            </div>
            <h1 className="text-3xl font-bold text-white">Task Records</h1>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="p-4 bg-[#2a2016] border border-amber-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                  <LucideIcons.Target className="h-4 w-4 text-[#1a140c]" />
                </div>
                <span className="text-sm font-medium text-gray-300">Total Tasks</span>
              </div>
              <p className="text-2xl font-bold text-amber-400">{totalTasks}</p>
            </Card>

            <Card className="p-4 bg-[#2a2016] border border-amber-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                  <LucideIcons.CheckCircle className="h-4 w-4 text-[#1a140c]" />
                </div>
                <span className="text-sm font-medium text-gray-300">Completed</span>
              </div>
              <p className="text-2xl font-bold text-amber-400">{completedTasks}</p>
            </Card>

            <Card className="p-4 bg-[#2a2016] border border-amber-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600">
                  <LucideIcons.Clock className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-300">Processing</span>
              </div>
              <p className="text-2xl font-bold text-yellow-500">{processingTasks}</p>
            </Card>

            <Card className="p-4 bg-[#2a2016] border border-amber-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600">
                  <LucideIcons.XCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-300">Failed</span>
              </div>
              <p className="text-2xl font-bold text-red-500">{failedTasks}</p>
            </Card>

            <Card className="p-4 bg-[#2a2016] border border-amber-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                  <LucideIcons.DollarSign className="h-4 w-4 text-[#1a140c]" />
                </div>
                <span className="text-sm font-medium text-gray-300">Total Earned</span>
              </div>
              <p className="text-2xl font-bold text-amber-400">${totalEarnings.toFixed(2)}</p>
            </Card>
          </div>

          {/* Search & Filter + Records List */}
          <Card className="p-6 bg-[#2a2016] shadow-xl border border-amber-500/20 rounded-3xl">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <LucideIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by product name or task code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-[#1a140c] border-amber-500/30 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className={`rounded-xl ${filterStatus === "all" ? "bg-gradient-to-r from-amber-500 to-orange-600 text-[#1a140c] hover:from-amber-600 hover:to-orange-700" : "border-amber-500/30 text-gray-300 hover:bg-[#2a2016] hover:text-amber-400"}`}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("completed")}
                  className={`rounded-xl ${filterStatus === "completed" ? "bg-gradient-to-r from-amber-500 to-orange-600 text-[#1a140c] hover:from-amber-600 hover:to-orange-700" : "border-amber-500/30 text-gray-300 hover:bg-[#2a2016] hover:text-amber-400"}`}
                >
                  Completed
                </Button>
                <Button
                  variant={filterStatus === "processing" ? "default" : "outline"}
                  onClick={() => setFilterStatus("processing")}
                  className={`rounded-xl ${filterStatus === "processing" ? "bg-gradient-to-r from-amber-500 to-orange-600 text-[#1a140c] hover:from-amber-600 hover:to-orange-700" : "border-amber-500/30 text-gray-300 hover:bg-[#2a2016] hover:text-amber-400"}`}
                >
                  Processing
                </Button>
                <Button
                  variant={filterStatus === "failed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("failed")}
                  className={`rounded-xl ${filterStatus === "failed" ? "bg-gradient-to-r from-amber-500 to-orange-600 text-[#1a140c] hover:from-amber-600 hover:to-orange-700" : "border-amber-500/30 text-gray-300 hover:bg-[#2a2016] hover:text-amber-400"}`}
                >
                  Failed
                </Button>
              </div>
            </div>

            {/* Records List */}
            <div className="space-y-4">
              {loading ? (
                <p className="text-center text-gray-400 py-6">Loading tasks...</p>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record) => {
                  if (record.isCombo) {
                    return (
                      <Card
                        key={record.id}
                        className="p-5 bg-gradient-to-br from-[#2a2016] to-[#1a140c] border-2 border-amber-500/50 rounded-2xl hover:shadow-2xl hover:border-amber-400 transition-all duration-300"
                      >
                        {/* Combo Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-500/20">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                              <LucideIcons.Package className="h-5 w-5 text-[#1a140c]" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">Combo Task Group</h3>
                              <p className="text-sm text-gray-400">{record.comboProducts.length} Products</p>
                            </div>
                          </div>
                          {/* {getStatusBadge(record.status)} */}
                        </div>

                        {/* Combo Products Grid */}
                        <div className="space-y-3 mb-4">
                          {record.comboProducts.map((product, index) => (
                            <div
                              key={`${record.id}-${product.taskCode}`}
                              className="flex items-center gap-3 p-3 bg-[#1a140c] rounded-xl border border-amber-500/20"
                            >
                              <div className="relative overflow-hidden rounded-lg border border-amber-500/30">
                                <Image
                                  src={product.productImage || "/placeholder.svg"}
                                  alt={product.productName}
                                  width={50}
                                  height={50}
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-semibold text-white truncate">
                                    {product.productName}
                                  </h4>
                                  {getStatusBadge(product.status)} {/* ✅ REAL STATUS */}
                                </div>

                                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
                                  <span>
                                    Code: <span className="text-amber-400 font-mono">{product.taskCode}</span>
                                  </span>
                                  <span>
                                    Value: <span className="text-white font-semibold">${product.value.toFixed(2)}</span>
                                  </span>
                                  <span>
                                    Commission:{" "}
                                    <span className="text-amber-400 font-semibold">
                                      ${product.commission.toFixed(2)}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Combo Summary */}
                        <div className="flex items-center justify-between p-4 bg-[#1a140c] rounded-xl border border-amber-500/30">
                          <div className="grid grid-cols-2 gap-4 flex-1">
                            <div>
                              <span className="text-sm font-medium text-gray-300">Total Value:</span>
                              <p className="text-lg font-bold text-white">${record.totalValue.toFixed(2)}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-300">Total Commission:</span>
                              <p className="text-lg font-bold text-amber-400">${record.totalCommission.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-300">Submitted:</span>
                            <p className="text-sm text-gray-400">{new Date(record.submittedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </Card>
                    )
                  }

                  // Regular task card
                  return (
                    <Card
                      key={record.id}
                      className="p-4 bg-[#1a140c] border border-amber-500/20 rounded-2xl hover:shadow-lg hover:border-amber-500/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative overflow-hidden rounded-xl border-2 border-amber-500/30 shadow-md">
                          <Image
                            src={record.productImage || "/placeholder.svg"}
                            alt={record.productName}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-lg font-bold text-white truncate">{record.productName}</h3>
                            {getStatusBadge(record.status)}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <LucideIcons.FileText className="h-4 w-4 text-amber-400" />
                              <span className="font-mono text-amber-400">{record.taskCode}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <LucideIcons.DollarSign className="h-4 w-4 text-white" />
                              <span className="text-white font-semibold">${record.value.toFixed(2)}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <LucideIcons.Clock className="h-3 w-3" />
                              Submitted: {new Date(record.submittedAt).toLocaleDateString()}
                            </span>
                            {record.status === "completed" && record.completedAt && (
                              <span className="flex items-center gap-1">
                                <LucideIcons.CheckCircle className="h-3 w-3" />
                                Completed: {new Date(record.completedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })
              ) : (
                <p className="text-center text-gray-400 py-6">No tasks found matching your criteria.</p>
              )}
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Bottom />
    </div>
  )
}
