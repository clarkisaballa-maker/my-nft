"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import * as LucideIcons from "lucide-react"
import Image from "next/image"
import { useUsersContext } from "@/app/AllContext/UsersContext"
import CS from "@/app/Common/CustomerService/CS"
import SupportChat from '@/app/Common/SupportChat/SupportChat'

const ConfettiParticles = ({ isVisible }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10px`,
            animation: `fall ${2 + Math.random() * 1.5}s linear infinite`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        >
          <div
            className={`w-2 h-2 rounded-full ${["bg-amber-400", "bg-orange-400", "bg-amber-500", "bg-orange-500", "bg-yellow-500"][i % 5]
              }`}
            style={{
              boxShadow: `0 0 ${3 + Math.random() * 3}px currentColor`,
            }}
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

const TaskSubmissionDialog = ({
  showTaskSubmissionDialog,
  task,
  setShowTaskSubmissionDialog,
  user,
  setTasksState,
  setTask
}) => {
  const { saveTask, setUser } = useUsersContext()

  const [infoMessage, setInfoMessage] = useState("")
  const [productsWithValue, setProductsWithValue] = useState([])
  const [totalComboValue, setTotalComboValue] = useState(0)
  const isCombo = task?.orderType === "Combo"
  const [submitting, setSubmitting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCSDialog, setShowCSDialog] = useState(false)

  useEffect(() => {
    if (isCombo && task.combo && task.combo.Products?.length > 0 && user) {
      const comboPrice = Number(task.combo.comboPrice || 0)
      const userTotalBalance = Number(user.totalBalance || 0)
      const totalValue = user.walletBalance === 0 ? userTotalBalance : comboPrice + userTotalBalance

      setTotalComboValue(totalValue)

      const perProductValue = totalValue / task.combo.Products.length

      const updatedProducts = task.combo.Products.map((p) => ({
        ...p,
        productValue: perProductValue,
      }))

      setProductsWithValue(updatedProducts)
      setShowConfetti(true)
    }
  }, [task, isCombo, user])

  const commissionPercentage = isCombo
    ? task.combo.commission || 9
    : Number(user?.currentVIPLevel?.commission ?? 0)

  const commission = isCombo
    ? (totalComboValue * commissionPercentage) / 100
    : (task?.product?.productValue || 0) * (commissionPercentage / 100)

  const handleSubmitTask = async () => {
    if (!task || !user) return;

    setSubmitting(true);

    try {
      const result = await saveTask({
        userId: user._id,
        orderType: task.orderType,
        combo: isCombo ? { ...task.combo, Products: productsWithValue } : null,
        product: !isCombo ? task.product : null,
      });

      // ❌ ERROR CASE
      if (!result?.success) {
        setShowCSDialog(true);
        setInfoMessage(result?.error || "Failed to submit task");
        return;
      }

      // ✅ SUCCESS CASE
      const data = result.data;

      setShowTaskSubmissionDialog(false);
      setShowConfetti(false);
      setInfoMessage("");

      if (data?.user) {
        setUser(data.user);
      }

      setTasksState((prev) => prev + 1);

    } catch (err) {
      setShowCSDialog(true);
      setInfoMessage("Failed to submit task. Please try again.");
      console.error("Unexpected error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!task) return null

  const truncateName = (name, maxLength = 20) => {
    if (!name) return ""
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name
  }

  return (
    <>
      <SupportChat userId={user._id} username={user.username} />

      <ConfettiParticles isVisible={showConfetti && isCombo} />

      <Dialog open={showTaskSubmissionDialog} onOpenChange={setShowTaskSubmissionDialog}>
        <DialogContent
          className={`w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl
          ${isCombo
              ? "bg-gradient-to-br from-[#241c12] via-[#1a140c] to-[#241c12] border-2 border-amber-500/40"
              : "bg-[#1a140c] border border-amber-500/20"
            }`}
        >
          {/* Header */}
          <div className="pt-6 px-6 text-center">
            {isCombo && (
              <div className="mb-3 flex justify-center gap-2">
                <LucideIcons.Sparkles className="h-6 w-6 text-amber-400 animate-spin" />
                <LucideIcons.Star className="h-6 w-6 text-orange-400 animate-bounce" />
                <LucideIcons.Sparkles className="h-6 w-6 text-amber-500 animate-spin" />
              </div>
            )}

            <h2
              className={`text-3xl font-black mb-2 ${isCombo ? "text-amber-400" : "text-white"
                }`}
            >
              {isCombo ? "🎁 PREMIUM COMBO!" : "Task Submission"}
            </h2>

            {isCombo && (
              <p className="text-sm font-semibold text-orange-300">
                Congratulations! You won a special combo opportunity
              </p>
            )}
          </div>

          {/* Products */}
          <div className="grid gap-5 py-6 px-6">
            {isCombo && (
              <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-center">
                <p className="text-xs font-bold uppercase text-black/70">
                  Total Combo Value
                </p>
                <h3 className="text-4xl font-black text-[#1a140c]">
                  -${(task.combo?.comboPrice ?? 0).toFixed(2)}
                </h3>
              </div>
            )}

            <div className={`grid ${isCombo ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1"} gap-4`}>
              {(isCombo ? productsWithValue : [task.product]).map((p, idx) => (
                <div key={idx} className="text-center">
                  <div className="relative w-24 h-24 mx-auto rounded-xl overflow-hidden border border-amber-500/30">
                    <Image
                      src={p.productImage?.url || "/placeholder.svg"}
                      alt={p.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <p className="text-white text-sm mt-2 font-semibold">
                    {truncateName(p.productName, 15)}
                  </p>

                  <p className="text-amber-400 font-bold">
                    ${p.productValue}
                  </p>
                </div>
              ))}
            </div>

            {/* Commission */}
            <div className="p-5 rounded-2xl border border-amber-500/30 bg-[#241c12]">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Your Commission</span>
                <span className="text-amber-400 font-black text-lg">
                  Submit To Earn!
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Will Be Added Into Your Balance
              </p>
            </div>

            {infoMessage && (
              <div className="text-red-400 text-center font-semibold">
                {infoMessage}
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmitTask}
              disabled={submitting}
              className="
                w-full h-14 rounded-2xl font-bold text-lg
                bg-gradient-to-r from-amber-500 to-orange-600
                hover:from-orange-500 hover:to-amber-500
                text-[#1a140c]
                transition-all duration-300
                disabled:opacity-70
              "
            >
              <LucideIcons.CheckCircle className="h-5 w-5 mr-2" />
              {submitting ? "Processing..." : isCombo ? "Claim Combo" : "Submit Task"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCSDialog} onOpenChange={setShowCSDialog}>
        <CS userId={user._id} username={user.username} message={infoMessage} />
      </Dialog>
    </>
  )
}

export default TaskSubmissionDialog