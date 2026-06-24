"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import * as LucideIcons from "lucide-react"
import { useUsersContext } from "../AllContext/UsersContext"
import { PhoneInput } from "react-international-phone"
import "react-international-phone/style.css"
import { useSearchParams } from 'next/navigation'

export default function SignupPage() {
  const { submitNewUser } = useUsersContext()
  const searchParams = useSearchParams()
  const inviteCode = searchParams.get('code')

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    transactionPassword: "",
    loginPassword: "",
    confirmLoginPassword: "",
    gender: "",
    inviteCode: inviteCode || "",
    agreeToTerms: true,
  })

  const [showPasswords, setShowPasswords] = useState({
    transaction: false,
    login: false,
    confirm: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
    if (serverError) {
      setServerError("")
    }
  }

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }))
    if (errors.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: "",
      }))
    }
    if (serverError) {
      setServerError("")
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
    if (serverError) {
      setServerError("")
    }
  }

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: checked,
    }))
    if (errors.agreeToTerms) {
      setErrors((prev) => ({
        ...prev,
        agreeToTerms: "",
      }))
    }
    if (serverError) {
      setServerError("")
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (formData.username.includes(" ")) {
      newErrors.username = "Username cannot contain spaces"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (formData.phone.length < 8) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.transactionPassword) {
      newErrors.transactionPassword = "Transaction password is required"
    } else if (formData.transactionPassword.length < 6) {
      newErrors.transactionPassword = "Transaction password must be at least 6 characters"
    }

    if (!formData.loginPassword) {
      newErrors.loginPassword = "Login password is required"
    } else if (formData.loginPassword.length < 6) {
      newErrors.loginPassword = "Login password must be at least 6 characters"
    }

    if (!formData.confirmLoginPassword) {
      newErrors.confirmLoginPassword = "Please confirm your login password"
    } else if (formData.loginPassword !== formData.confirmLoginPassword) {
      newErrors.confirmLoginPassword = "Passwords do not match"
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setServerError("")

    const result = await submitNewUser(formData)
    if (result.error) {
      setIsLoading(false)
      setServerError(result.error)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a140c] via-[#241c12] to-[#2a1f14]">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#1a140c]/80 border-b border-amber-500/20 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-white/80 hover:text-amber-400 transition-colors rounded-xl hover:bg-[#241c12] p-2"
          >
            <LucideIcons.ChevronLeft className="h-6 w-6" />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-amber-400">Sign Up</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 pb-8">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                <LucideIcons.Film className="h-7 w-7 text-[#1a140c]" />
              </div>
              <h2 className="text-3xl font-bold text-amber-400 tracking-wide">Movee Tech</h2>
            </div>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-amber-500 rounded-full">
              <LucideIcons.UserPlus className="h-5 w-5 text-[#1a140c]" />
              <span className="text-[#1a140c] font-semibold">Create Account</span>
            </div>
            <p className="text-white/80 text-lg">Join our platform today</p>
          </div>

          <Card className="p-6 sm:p-8 bg-[#241c12]/70 backdrop-blur-sm shadow-2xl border border-amber-500/20 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white font-semibold flex items-center gap-2">
                  <LucideIcons.User className="h-4 w-4" />
                  Username *
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <LucideIcons.User className="h-5 w-5 text-white/40" />
                  </div>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`pl-12 h-12 text-base bg-[#1a140c]/80 border-2 rounded-xl focus:ring-4 focus:ring-amber-500/20 transition-all text-white placeholder:text-white/40 ${errors.username
                      ? "border-red-500 focus:border-red-500"
                      : "border-amber-500/30 focus:border-amber-500"
                      }`}
                    required
                  />
                </div>
                {errors.username && <p className="text-red-400 text-sm">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white font-semibold flex items-center gap-2">
                  <LucideIcons.Phone className="h-4 w-4" />
                  Phone Number *
                </Label>

                <div className="relative">
                  <PhoneInput
                    defaultCountry="us"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full"
                    inputClassName={`h-14 w-full pl-12 pr-4 text-base bg-[#1a140c]/80 border-2 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all ${errors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-amber-500/30 focus:border-amber-500"
                      }`}
                    countrySelectorStyleProps={{
                      buttonClassName:
                        "h-14 px-3 bg-[#1a140c]/80 border-2 border-r-0 border-amber-500/30 rounded-l-xl text-white hover:bg-[#241c12]",
                    }}
                    inputProps={{
                      id: "phone",
                      placeholder: "Enter phone number",
                      required: true,
                    }}
                  />
                </div>

                {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
                <p className="text-xs text-white/60">Your phone number with country code</p>
              </div>


              <div className="space-y-2">
                <Label htmlFor="transactionPassword" className="text-white font-semibold flex items-center gap-2">
                  <LucideIcons.CreditCard className="h-4 w-4" />
                  Transaction Password *
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <LucideIcons.CreditCard className="h-5 w-5 text-white/40" />
                  </div>
                  <Input
                    id="transactionPassword"
                    name="transactionPassword"
                    type={showPasswords.transaction ? "text" : "password"}
                    placeholder="Create transaction password"
                    value={formData.transactionPassword}
                    onChange={handleInputChange}
                    className={`pl-12 pr-12 h-12 text-base bg-[#1a140c]/80 border-2 rounded-xl focus:ring-4 focus:ring-amber-500/20 transition-all text-white placeholder:text-white/40 ${errors.transactionPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-amber-500/30 focus:border-amber-500"
                      }`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePasswordVisibility("transaction")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-amber-400"
                  >
                    {showPasswords.transaction ? (
                      <LucideIcons.EyeOff className="h-5 w-5" />
                    ) : (
                      <LucideIcons.Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {errors.transactionPassword && <p className="text-red-400 text-sm">{errors.transactionPassword}</p>}
                <p className="text-xs text-white/60">Used for withdrawals and sensitive operations</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginPassword" className="text-white font-semibold flex items-center gap-2">
                  <LucideIcons.Lock className="h-4 w-4" />
                  Login Password *
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <LucideIcons.Lock className="h-5 w-5 text-white/40" />
                  </div>
                  <Input
                    id="loginPassword"
                    name="loginPassword"
                    type={showPasswords.login ? "text" : "password"}
                    placeholder="Create login password"
                    value={formData.loginPassword}
                    onChange={handleInputChange}
                    className={`pl-12 pr-12 h-12 text-base bg-[#1a140c]/80 border-2 rounded-xl focus:ring-4 focus:ring-amber-500/20 transition-all text-white placeholder:text-white/40 ${errors.loginPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-amber-500/30 focus:border-amber-500"
                      }`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePasswordVisibility("login")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-amber-400"
                  >
                    {showPasswords.login ? (
                      <LucideIcons.EyeOff className="h-5 w-5" />
                    ) : (
                      <LucideIcons.Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {errors.loginPassword && <p className="text-red-400 text-sm">{errors.loginPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmLoginPassword" className="text-white font-semibold flex items-center gap-2">
                  <LucideIcons.Lock className="h-4 w-4" />
                  Confirm Login Password *
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <LucideIcons.Lock className="h-5 w-5 text-white/40" />
                  </div>
                  <Input
                    id="confirmLoginPassword"
                    name="confirmLoginPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirm your login password"
                    value={formData.confirmLoginPassword}
                    onChange={handleInputChange}
                    className={`pl-12 pr-12 h-12 text-base bg-[#1a140c]/80 border-2 rounded-xl focus:ring-4 focus:ring-amber-500/20 transition-all text-white placeholder:text-white/40 ${errors.confirmLoginPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-amber-500/30 focus:border-amber-500"
                      }`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-amber-400"
                  >
                    {showPasswords.confirm ? (
                      <LucideIcons.EyeOff className="h-5 w-5" />
                    ) : (
                      <LucideIcons.Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {errors.confirmLoginPassword && <p className="text-red-400 text-sm">{errors.confirmLoginPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-white font-semibold flex items-center gap-2">
                  <LucideIcons.Users className="h-4 w-4" />
                  Gender *
                </Label>
                <Select onValueChange={(value) => handleSelectChange("gender", value)}>
                  <SelectTrigger
                    className={`h-12 text-base bg-[#1a140c] border-2 rounded-xl focus:ring-4 focus:ring-amber-500/20 transition-all text-white ${errors.gender ? "border-red-500" : "border-amber-500/30"
                      }`}
                  >
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#241c12] border-amber-500/30 text-white">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-400 text-sm">{errors.gender}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inviteCode" className="text-white font-semibold flex items-center gap-2">
                  <LucideIcons.Gift className="h-4 w-4" />
                  Invite Code
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <LucideIcons.Gift className="h-5 w-5 text-white/40" />
                  </div>
                  <Input
                    id="inviteCode"
                    name="inviteCode"
                    type="text"
                    placeholder="Enter invite code if you have one"
                    value={formData.inviteCode}
                    onChange={handleInputChange}
                    className="pl-12 h-12 text-base bg-[#1a140c]/80 border-2 border-amber-500/30 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3 p-4 bg-amber-500/20 rounded-2xl border border-amber-500/40">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={handleCheckboxChange}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="agreeToTerms" className="text-sm text-white cursor-pointer">
                      I agree to the{" "}
                      <Link
                        href="/terms-and-conditions"
                        className="text-amber-400 hover:text-amber-300 font-medium underline"
                      >
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-amber-400 hover:text-amber-300 font-medium underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>
                {errors.agreeToTerms && <p className="text-red-400 text-sm">{errors.agreeToTerms}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-bold bg-amber-500 hover:bg-amber-400 text-[#1a140c] shadow-2xl rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LucideIcons.Loader2 className="h-5 w-5 animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LucideIcons.UserPlus className="h-5 w-5" />
                    Create Account
                  </div>
                )}
              </Button>

              {serverError && (
                <div className="flex items-start gap-3 p-4 bg-red-500/20 border border-red-500/40 rounded-2xl">
                  <LucideIcons.AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm font-medium">{serverError}</p>
                </div>
              )}
            </form>
          </Card>

          <div className="text-center">
            <p className="text-white/80">
              Already have an account?{" "}
              <Link href="/login" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
