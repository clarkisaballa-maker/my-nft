"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { GitBranch, Pencil, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useDashboard } from "../../app/AllContext/DashboardContext"

export default function ReferralManagement() {
    const {
        referralSettings,
        isLoadingReferral,
        fetchReferralSettings,
        createReferralSettings,
        updateReferralSettings,
        deleteReferralSettings,
    } = useDashboard()

    const { toast } = useToast()

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        depositRewardPercent: "",
        perProductCommissionPercent: "",
    })

    useEffect(() => {
        fetchReferralSettings()
    }, [])

    const resetForm = () => {
        setFormData({
            depositRewardPercent: "",
            perProductCommissionPercent: "",
        })
    }

    const handleCreate = async () => {
        if (!formData.depositRewardPercent || !formData.perProductCommissionPercent) {
            toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" })
            return
        }

        setIsSaving(true)
        const result = await createReferralSettings({
            depositRewardPercent: Number(formData.depositRewardPercent),
            perProductCommissionPercent: Number(formData.perProductCommissionPercent),
        })
        setIsSaving(false)

        if (result) {
            toast({ title: "Success", description: "Referral settings created successfully" })
            setIsCreateDialogOpen(false)
            resetForm()
        } else {
            toast({ title: "Error", description: "Failed to create referral settings", variant: "destructive" })
        }
    }

    const handleUpdate = async () => {
        if (!formData.depositRewardPercent || !formData.perProductCommissionPercent) {
            toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" })
            return
        }

        setIsSaving(true)
        const result = await updateReferralSettings(referralSettings._id, {
            depositRewardPercent: Number(formData.depositRewardPercent),
            perProductCommissionPercent: Number(formData.perProductCommissionPercent),
        })
        setIsSaving(false)

        if (result) {
            toast({ title: "Success", description: "Referral settings updated successfully" })
            setIsEditDialogOpen(false)
            resetForm()
        } else {
            toast({ title: "Error", description: "Failed to update referral settings", variant: "destructive" })
        }
    }

    const handleDelete = async () => {
        setIsSaving(true)
        const result = await deleteReferralSettings(referralSettings._id)
        setIsSaving(false)

        if (result) {
            toast({ title: "Success", description: "Referral settings deleted successfully" })
            setIsDeleteDialogOpen(false)
        } else {
            toast({ title: "Error", description: "Failed to delete referral settings", variant: "destructive" })
        }
    }

    const openEditDialog = () => {
        setFormData({
            depositRewardPercent: String(referralSettings.depositRewardPercent),
            perProductCommissionPercent: String(referralSettings.perProductCommissionPercent),
        })
        setIsEditDialogOpen(true)
    }

    const formFields = (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-slate-300">Deposit Reward % *</Label>
                <Input
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.depositRewardPercent}
                    onChange={(e) => setFormData((prev) => ({ ...prev, depositRewardPercent: e.target.value }))}
                    className="bg-slate-800/60 border-slate-700 text-slate-100"
                />
                <p className="text-xs text-slate-500">User ko deposit karne par kitna % reward milega</p>
            </div>
            <div className="space-y-2">
                <Label className="text-slate-300">Per Product Commission % *</Label>
                <Input
                    type="number"
                    placeholder="e.g., 2"
                    value={formData.perProductCommissionPercent}
                    onChange={(e) => setFormData((prev) => ({ ...prev, perProductCommissionPercent: e.target.value }))}
                    className="bg-slate-800/60 border-slate-700 text-slate-100"
                />
                <p className="text-xs text-slate-500">Har product optimize karne par kitna % commission milega</p>
            </div>
        </div>
    )

    return (
        <div className="space-y-6">

            {/* Header */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <GitBranch className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl text-slate-100">Referral Settings</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Manage deposit reward and product commission percentages
                                </CardDescription>
                            </div>
                        </div>
                        {!referralSettings && !isLoadingReferral && (
                            <Button
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Settings
                            </Button>
                        )}
                    </div>
                </CardHeader>
            </Card>

            {/* Content */}
            <Card className="bg-slate-900/60 border-slate-800">
                <CardContent className="pt-6">
                    {isLoadingReferral ? (
                        <div className="text-center py-8 text-slate-400">Loading referral settings...</div>
                    ) : !referralSettings ? (
                        <div className="text-center py-8 text-slate-400">
                            No referral settings found. Click "Create Settings" to add one.
                        </div>
                    ) : (
                        <div className="space-y-4">

                            {/* Settings Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-5">
                                    <p className="text-sm text-slate-400 mb-1">Deposit Reward</p>
                                    <p className="text-3xl font-bold text-purple-400">
                                        {referralSettings.depositRewardPercent}%
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        User ko deposit karne par milega
                                    </p>
                                </div>

                                <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-5">
                                    <p className="text-sm text-slate-400 mb-1">Per Product Commission</p>
                                    <p className="text-3xl font-bold text-green-400">
                                        {referralSettings.perProductCommissionPercent}%
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Har product optimize karne par milega
                                    </p>
                                </div>

                            </div>

                            {/* Last Updated */}
                            <p className="text-xs text-slate-500 text-right">
                                Last updated: {new Date(referralSettings.updatedAt).toLocaleString()}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    variant="ghost"
                                    onClick={openEditDialog}
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/20"
                                >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>

                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-slate-100">Create Referral Settings</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Enter the referral percentages below
                        </DialogDescription>
                    </DialogHeader>
                    {formFields}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => { setIsCreateDialogOpen(false); resetForm() }}
                            className="bg-slate-800 border-slate-700 text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-purple-500 to-violet-600"
                        >
                            {isSaving ? "Creating..." : "Create Settings"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-slate-100">Edit Referral Settings</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Update the referral percentages below
                        </DialogDescription>
                    </DialogHeader>
                    {formFields}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => { setIsEditDialogOpen(false); resetForm() }}
                            className="bg-slate-800 border-slate-700 text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-blue-500 to-blue-600"
                        >
                            {isSaving ? "Updating..." : "Update Settings"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-slate-100">Delete Referral Settings</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Are you sure you want to delete referral settings? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {referralSettings && (
                        <div className="bg-slate-800/60 p-4 rounded-lg space-y-2">
                            <p className="text-slate-300">
                                <span className="font-semibold">Deposit Reward:</span> {referralSettings.depositRewardPercent}%
                            </p>
                            <p className="text-slate-300">
                                <span className="font-semibold">Per Product Commission:</span> {referralSettings.perProductCommissionPercent}%
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="bg-slate-800 border-slate-700 text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        >
                            {isSaving ? "Deleting..." : "Delete Settings"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}