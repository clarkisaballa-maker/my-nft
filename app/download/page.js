"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";

export default function DownloadPage() {
    return (
        <div className="min-h-screen bg-[#2d3e2f] text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#2d3e2f]/95 backdrop-blur-xl border-b border-[#3d4e3f] p-4">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-lime-500 flex items-center justify-center">
                            <LucideIcons.Zap className="h-5 w-5 text-[#2d3e2f]" />
                        </div>
                        <h1 className="text-2xl font-bold">Movee Tech</h1>
                    </Link>
                    <span className="text-gray-400 text-sm ml-2">Download App</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">Download Movee Tech App</h1>
                    <p className="text-xl text-gray-300">
                        Choose your platform to download the latest version
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* === Android Card === */}
                    <Card className="bg-[#3a4a3c] border border-[#4d5e4f] p-8 hover:border-lime-500 transition-all duration-300 group">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-[#2d3e2f] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <LucideIcons.Smartphone className="h-16 w-16 text-lime-500" />
                            </div>

                            <h2 className="text-3xl font-bold mb-2">Android</h2>
                            <p className="text-gray-400 mb-8">.apk File</p>

                            <Link href="/Movee Tech.apk" className="w-full">
                                <Button
                                    size="lg"
                                    className="w-full bg-lime-500 hover:bg-lime-600 text-[#2d3e2f] text-lg py-7 rounded-2xl font-semibold flex items-center gap-3"
                                >
                                    <LucideIcons.Download className="h-6 w-6" />
                                    Download Android App
                                </Button>
                            </Link>

                            <p className="text-xs text-gray-500 mt-4">
                                Compatible with Android 8.0 and above
                            </p>
                        </div>
                    </Card>

                    {/* === iOS Card === */}
                    <Card className="bg-[#3a4a3c] border border-[#4d5e4f] p-8 hover:border-lime-500 transition-all duration-300 group">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-[#2d3e2f] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <LucideIcons.Apple className="h-16 w-16 text-gray-300" />
                            </div>

                            <h2 className="text-3xl font-bold mb-2">iPhone / iOS</h2>
                            <p className="text-gray-400 mb-8">.ipa File</p>

                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full border-2 border-white/70 hover:bg-white hover:text-[#2d3e2f] text-lg py-7 rounded-2xl font-semibold flex items-center gap-3"
                            >
                                Coming Soon...
                            </Button>

                            <p className="text-xs text-gray-500 mt-4">
                                For iOS 14.0 and above • TestFlight / Ad-hoc
                            </p>
                        </div>
                    </Card>
                </div>

                <div className="text-center mt-12 text-gray-400 text-sm">
                    <p>Latest Version: 1.0.0 • Updated Today</p>
                    <p className="mt-2">
                        Having trouble? Contact our support team.
                    </p>
                </div>
            </main>
        </div>
    );
}