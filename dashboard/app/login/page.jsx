"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as LucideIcons from "lucide-react"

const ADMIN_PASSWORD = "Heybro"

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!password.trim()) {
      setError("Please enter password")
      setIsLoading(false)
      return
    }

    // Check hardcoded password
    if (password === ADMIN_PASSWORD) {
      // Save user data with current login time
      const userData = {
        username: "Admin",
        role: "admin",
        loginTime: Date.now(),
        profileimage: "/placeholder.svg?height=32&width=32"
      }

      localStorage.setItem("user", JSON.stringify(userData))

      // Small delay for smooth UX
      setTimeout(() => {
        router.replace("/dashboard")
      }, 300)
    } else {
      setError("Incorrect password")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <LucideIcons.Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-wide">
              Movee Tech
            </h1>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <LucideIcons.Shield className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Login
              </h2>
            </div>
            <p className="text-slate-600 text-lg">Enter admin password to continue</p>
          </div>

          <Card className="p-8 bg-white/70 backdrop-blur-sm shadow-2xl border border-white/20 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <LucideIcons.Lock className="h-4 w-4" />
                  Admin Password
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <LucideIcons.Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setError("")
                    }}
                    className="pl-12 pr-12 h-12 text-base bg-white/80 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <LucideIcons.EyeOff className="h-5 w-5" />
                    ) : (
                      <LucideIcons.Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <LucideIcons.AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LucideIcons.Loader2 className="h-5 w-5 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LucideIcons.LogIn className="h-5 w-5" />
                    Login to Dashboard
                  </div>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}