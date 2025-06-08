"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Music,
  ChevronUp,
  ChevronDown,
  Plus,
  Play,
  Pause,
  Users,
  Clock,
  AlertCircle,
  Share,
  Copy,
  Check,
  SkipForward,
  SkipBack,
  Volume2,
  Heart,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import axios from "axios"
import { signIn, signOut, useSession } from "next-auth/react"
import { Appbar } from "../components/Appbar"
import { Redirect } from "../components/Redirect"
import StreamView from "../components/StreamView";

interface QueueItem {
  id: string
  url: string
  extractedId: string
  title: string
  smallImg: string
  bigImg: string
  votes: number
  userId: string
  haveUpvoted: boolean
}

const creatorId = "ee784d97-6f60-4c3c-a741-84481a02d854"

export default function MusicStreamingInterface() {
    return (
        <div>
            <StreamView creatorId={creatorId} />
        </div>
    )
}

