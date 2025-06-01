"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, ChevronUp, ChevronDown, Plus, Play, Users, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface QueueItem {
  id: string
  title: string
  thumbnail: string
  duration: string
  votes: number
  submittedBy: string
  youtubeId: string
}

// Type for tracking user votes
type UserVotes = {
  [songId: string]: "up" | "down" | null
}

export default function StreamVotingInterface() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [previewVideo, setPreviewVideo] = useState<{
    title: string
    thumbnail: string
    duration: string
    youtubeId: string
  } | null>(null)

  // Track user votes
  const [userVotes, setUserVotes] = useState<UserVotes>({})

  // Mock current playing video
  const currentVideo = {
    title: "Blinding Lights - The Weeknd",
    youtubeId: "4NRXx6U8ABQ",
    submittedBy: "MusicFan23",
  }

  // Mock queue data
  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: "1",
      title: "Good 4 U - Olivia Rodrigo",
      thumbnail: "/placeholder.svg?height=90&width=160",
      duration: "2:58",
      votes: 24,
      submittedBy: "PopLover",
      youtubeId: "gNi_6U5Pm_o",
    },
    {
      id: "2",
      title: "Stay - The Kid LAROI & Justin Bieber",
      thumbnail: "/placeholder.svg?height=90&width=160",
      duration: "2:21",
      votes: 18,
      submittedBy: "BieberFan",
      youtubeId: "kTJczUoc26U",
    },
    {
      id: "3",
      title: "Heat Waves - Glass Animals",
      thumbnail: "/placeholder.svg?height=90&width=160",
      duration: "3:58",
      votes: 15,
      submittedBy: "IndieVibes",
      youtubeId: "mRD0-GxqHVo",
    },
    {
      id: "4",
      title: "As It Was - Harry Styles",
      thumbnail: "/placeholder.svg?height=90&width=160",
      duration: "2:47",
      votes: 12,
      submittedBy: "StylesSupporter",
      youtubeId: "H5v3kku4y6Q",
    },
    {
      id: "5",
      title: "Anti-Hero - Taylor Swift",
      thumbnail: "/placeholder.svg?height=90&width=160",
      duration: "3:20",
      votes: 8,
      submittedBy: "Swiftie13",
      youtubeId: "b1kbLWvqugk",
    },
  ])

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const handleUrlChange = (url: string) => {
    setYoutubeUrl(url)
    const videoId = extractYouTubeId(url)

    if (videoId) {
      // Mock preview data - in real app, you'd fetch from YouTube API
      setPreviewVideo({
        title: "Preview: YouTube Video",
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        duration: "3:45",
        youtubeId: videoId,
      })
    } else {
      setPreviewVideo(null)
    }
  }

  const handleVote = (id: string, direction: "up" | "down") => {
    // Check if user has already voted on this song
    const previousVote = userVotes[id]

    // Calculate vote change based on previous vote
    let voteChange = 0

    if (!previousVote) {
      // First time voting
      voteChange = direction === "up" ? 1 : -1
    } else if (previousVote === direction) {
      // Clicking the same button again - remove vote
      voteChange = direction === "up" ? -1 : 1
    } else {
      // Changing vote direction (from up to down or vice versa)
      voteChange = direction === "up" ? 2 : -2
    }

    // Update user votes
    setUserVotes((prev) => ({
      ...prev,
      [id]: previousVote === direction ? null : direction,
    }))

    // Update queue with new vote count
    setQueue((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, votes: item.votes + voteChange } : item))
        .sort((a, b) => b.votes - a.votes),
    )
  }

  const handleAddToQueue = () => {
    if (previewVideo) {
      const newItemId = Date.now().toString()
      const newItem: QueueItem = {
        id: newItemId,
        title: previewVideo.title,
        thumbnail: previewVideo.thumbnail,
        duration: previewVideo.duration,
        votes: 1,
        submittedBy: "You",
        youtubeId: previewVideo.youtubeId,
      }

      // Auto-upvote your own submission
      setUserVotes((prev) => ({
        ...prev,
        [newItemId]: "up",
      }))

      setQueue((prev) => [...prev, newItem].sort((a, b) => b.votes - a.votes))
      setYoutubeUrl("")
      setPreviewVideo(null)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Music className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            StreamTune
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="h-4 w-4" />
            <span>1,247 viewers</span>
          </div>
          <Badge className="bg-red-900/60 text-red-300 border border-red-700/50">🔴 LIVE</Badge>
        </div>
      </header>

      <main className="flex-1 p-4 gap-6 grid lg:grid-cols-[1fr_400px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Current Video Player */}
          <Card className="border border-gray-800 bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Play className="h-5 w-5 text-violet-400" />
                  Now Playing
                </CardTitle>
                <Badge className="bg-violet-900/60 text-violet-300 border border-violet-700/50">
                  Submitted by {currentVideo.submittedBy}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <h3 className="text-lg font-semibold text-white">{currentVideo.title}</h3>
            </CardContent>
          </Card>

          {/* Add Song Section */}
          <Card className="border border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-pink-400" />
                Add Song to Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Paste YouTube URL here..."
                  value={youtubeUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500"
                />
                <Button
                  onClick={handleAddToQueue}
                  disabled={!previewVideo}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50"
                >
                  Add
                </Button>
              </div>

              {/* Preview */}
              {previewVideo && (
                <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex gap-3">
                    <img
                      src={previewVideo.thumbnail || "/placeholder.svg"}
                      alt="Video thumbnail"
                      className="w-24 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{previewVideo.title}</h4>
                      <p className="text-xs text-gray-400">{previewVideo.duration}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-800/30 p-2 rounded-lg">
                <AlertCircle className="h-4 w-4 text-violet-400" />
                <span>You can vote once per song. Click again to remove your vote.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Queue Sidebar */}
        <div className="space-y-4">
          <Card className="border border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-400" />
                Queue ({queue.length} songs)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {queue.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="absolute top-0 left-0 bg-black/70 text-white text-xs px-1 rounded">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm truncate">{item.title}</h4>
                      <p className="text-xs text-gray-400">{item.duration}</p>
                      <p className="text-xs text-gray-500">by {item.submittedBy}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleVote(item.id, "up")}
                        className={cn(
                          "h-6 w-6 p-0 hover:bg-green-900/20",
                          userVotes[item.id] === "up"
                            ? "text-green-400 bg-green-900/20"
                            : "text-gray-400 hover:text-green-300",
                        )}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium text-white">{item.votes}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleVote(item.id, "down")}
                        className={cn(
                          "h-6 w-6 p-0 hover:bg-red-900/20",
                          userVotes[item.id] === "down"
                            ? "text-red-400 bg-red-900/20"
                            : "text-gray-400 hover:text-red-300",
                        )}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
