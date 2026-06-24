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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Crown, Plus, Pencil, Trash2, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useDashboard } from "../../app/AllContext/DashboardContext"

const dailyProfit = (price, percent) => ((Number(price) * Number(percent)) / 100).toFixed(2)

export default function VipLevelsManagement() {
    const {
        vipLevels,
        isLoadingVipLevels,
        fetchVipLevels,
        createVipLevel,
        updateVipLevel,
        deleteVipLevel,
    } = useDashboard()

    const { toast } = useToast()

    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        level: "",
        name: "",
        packagePrice: "",
        dailyProducts: "",
        dailyProfitPercent: "",
        isActive: true,
    })
    const [editingVip, setEditingVip] = useState(null)
    const [deletingVip, setDeletingVip] = useState(null)

    useEffect(() => {
        fetchVipLevels()
    }, [])

    const resetForm = () => {
        setFormData({
            level: "",
            name: "",
            packagePrice: "",
            dailyProducts: "",
            dailyProfitPercent: "",
            isActive: true,
        })
    }

    const handleAddVip = async () => {
        if (!formData.level || !formData.name || !formData.packagePrice || !formData.dailyProducts || !formData.dailyProfitPercent) {
            toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" })
            return
        }

        setIsSaving(true)
        const result = await createVipLevel({
            ...formData,
            level: Number(formData.level),
            packagePrice: Number(formData.packagePrice),
            dailyProducts: Number(formData.dailyProducts),
            dailyProfitPercent: Number(formData.dailyProfitPercent),
        })
        setIsSaving(false)

        if (result) {
            toast({ title: "Success", description: "VIP Level created successfully" })
            setIsAddDialogOpen(false)
            resetForm()
            fetchVipLevels()
        } else {
            toast({ title: "Error", description: "Failed to create VIP level", variant: "destructive" })
        }
    }

    const handleEditVip = async () => {
        if (!formData.level || !formData.name || !formData.packagePrice || !formData.dailyProducts || !formData.dailyProfitPercent) {
            toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" })
            return
        }

        setIsSaving(true)
        const result = await updateVipLevel(editingVip._id, {
            ...formData,
            level: Number(formData.level),
            packagePrice: Number(formData.packagePrice),
            dailyProducts: Number(formData.dailyProducts),
            dailyProfitPercent: Number(formData.dailyProfitPercent),
        })
        setIsSaving(false)

        if (result) {
            toast({ title: "Success", description: "VIP Level updated successfully" })
            setIsEditDialogOpen(false)
            setEditingVip(null)
            resetForm()
            fetchVipLevels()
        } else {
            toast({ title: "Error", description: "Failed to update VIP level", variant: "destructive" })
        }
    }

    const handleDeleteVip = async () => {
        setIsSaving(true)
        const result = await deleteVipLevel(deletingVip._id)
        setIsSaving(false)

        if (result) {
            toast({ title: "Success", description: "VIP Level deleted successfully" })
            setIsDeleteDialogOpen(false)
            setDeletingVip(null)
            fetchVipLevels()
        } else {
            toast({ title: "Error", description: "Failed to delete VIP level", variant: "destructive" })
        }
    }

    const openEditDialog = (vip) => {
        setEditingVip(vip)
        setFormData({
            level: String(vip.level),
            name: vip.name,
            packagePrice: String(vip.packagePrice),
            dailyProducts: String(vip.dailyProducts),
            dailyProfitPercent: String(vip.dailyProfitPercent),
            isActive: vip.isActive,
        })
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (vip) => {
        setDeletingVip(vip)
        setIsDeleteDialogOpen(true)
    }

    const filteredVipLevels = (vipLevels || []).filter(
        (vip) =>
            vip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(vip.level).includes(searchQuery)
    )

    const formFields = (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-slate-300">VIP Level *</Label>
                    <Input
                        type="number"
                        placeholder="e.g., 1"
                        value={formData.level}
                        onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
                        className="bg-slate-800/60 border-slate-700 text-slate-100"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Level Name *</Label>
                    <Input
                        placeholder="e.g., Gold"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className="bg-slate-800/60 border-slate-700 text-slate-100"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-slate-300">Package Price ($) *</Label>
                <Input
                    type="number"
                    placeholder="e.g., 1000"
                    value={formData.packagePrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, packagePrice: e.target.value }))}
                    className="bg-slate-800/60 border-slate-700 text-slate-100"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-slate-300">Daily Products *</Label>
                    <Input
                        type="number"
                        placeholder="e.g., 40"
                        value={formData.dailyProducts}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dailyProducts: e.target.value }))}
                        className="bg-slate-800/60 border-slate-700 text-slate-100"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Daily Profit % *</Label>
                    <Input
                        type="number"
                        placeholder="e.g., 4"
                        value={formData.dailyProfitPercent}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dailyProfitPercent: e.target.value }))}
                        className="bg-slate-800/60 border-slate-700 text-slate-100"
                    />
                </div>
            </div>
            {formData.packagePrice && formData.dailyProfitPercent && (
                <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3 text-sm text-slate-300">
                    Daily Profit:{" "}
                    <span className="text-green-400 font-semibold">
                        ${dailyProfit(formData.packagePrice, formData.dailyProfitPercent)}
                    </span>
                </div>
            )}
        </div>
    )

    return (
        <div className="space-y-6">

            {/* Header */}
            <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/20 rounded-lg">
                                <Crown className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl text-slate-100">Manage VIP Levels</CardTitle>
                                <CardDescription className="text-slate-400">Add, edit, and manage VIP packages</CardDescription>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add VIP Level
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Table */}
            <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by name or level number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-800/60 border-slate-700 text-slate-100"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoadingVipLevels ? (
                        <div className="text-center py-8 text-slate-400">Loading VIP levels...</div>
                    ) : filteredVipLevels.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            {searchQuery ? "No VIP levels found matching your search" : "No VIP levels added yet"}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-slate-800 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-800/60 hover:bg-slate-800/60">
                                        <TableHead className="text-slate-300">Level</TableHead>
                                        <TableHead className="text-slate-300">Name</TableHead>
                                        <TableHead className="text-slate-300">Package Price</TableHead>
                                        <TableHead className="text-slate-300">Daily Products</TableHead>
                                        <TableHead className="text-slate-300">Daily Profit %</TableHead>
                                        <TableHead className="text-slate-300">Daily Profit ($)</TableHead>
                                        <TableHead className="text-slate-300">Status</TableHead>
                                        <TableHead className="text-right text-slate-300">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredVipLevels.map((vip) => (
                                        <TableRow key={vip._id} className="border-slate-800 hover:bg-slate-800/40">
                                            <TableCell className="font-bold text-yellow-400">VIP {vip.level}</TableCell>
                                            <TableCell className="font-medium text-slate-100">{vip.name}</TableCell>
                                            <TableCell className="text-slate-300">${vip.packagePrice.toLocaleString()}</TableCell>
                                            <TableCell className="text-slate-300">{vip.dailyProducts}</TableCell>
                                            <TableCell className="text-slate-300">{vip.dailyProfitPercent}%</TableCell>
                                            <TableCell className="text-green-400 font-semibold">
                                                ${dailyProfit(vip.packagePrice, vip.dailyProfitPercent)}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    vip.isActive
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-red-500/20 text-red-400"
                                                }`}>
                                                    {vip.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(vip)}
                                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/20"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openDeleteDialog(vip)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-slate-100">Add New VIP Level</DialogTitle>
                        <DialogDescription className="text-slate-400">Enter the VIP level details below</DialogDescription>
                    </DialogHeader>
                    {formFields}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => { setIsAddDialogOpen(false); resetForm() }}
                            className="bg-slate-800 border-slate-700 text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddVip}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-yellow-500 to-amber-600"
                        >
                            {isSaving ? "Adding..." : "Add VIP Level"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-slate-100">Edit VIP Level</DialogTitle>
                        <DialogDescription className="text-slate-400">Update the VIP level details below</DialogDescription>
                    </DialogHeader>
                    {formFields}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => { setIsEditDialogOpen(false); setEditingVip(null); resetForm() }}
                            className="bg-slate-800 border-slate-700 text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditVip}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-blue-500 to-blue-600"
                        >
                            {isSaving ? "Updating..." : "Update VIP Level"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-slate-100">Delete VIP Level</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Are you sure you want to delete this VIP level? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {deletingVip && (
                        <div className="bg-slate-800/60 p-4 rounded-lg space-y-2">
                            <p className="text-slate-300"><span className="font-semibold">Level:</span> VIP {deletingVip.level}</p>
                            <p className="text-slate-300"><span className="font-semibold">Name:</span> {deletingVip.name}</p>
                            <p className="text-slate-300"><span className="font-semibold">Package Price:</span> ${deletingVip.packagePrice.toLocaleString()}</p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => { setIsDeleteDialogOpen(false); setDeletingVip(null) }}
                            className="bg-slate-800 border-slate-700 text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteVip}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        >
                            {isSaving ? "Deleting..." : "Delete VIP Level"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}