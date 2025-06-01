"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"
import { Music, Users, Radio, Heart, Play, Headphones, Mic, Zap } from "lucide-react"

import Link from "next/link"

export function Appbar() {
    const session = useSession();
    return (
        <div className="flex justify-between w-full">
            <div>
                <Link href="/" className="flex items-center justify-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Music className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                    Muzer
                </span>
                </Link>
            </div>
            <div>
                <nav className="ml-auto flex gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-white"
                >
                    {session.data?.user && <button onClick={() => signOut()}>Logout</button>}
                    {!session.data?.user && <button onClick={() => signIn()}>Signin</button>}
                    {/* Sign In */}
                </Button>
                </nav>
            </div>
        </div>
    )
}