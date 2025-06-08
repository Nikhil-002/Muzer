"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "../components/Appbar";
import { Redirect } from "../components/Redirect";

interface QueueItem {
  id: string;
  url: string;
  extractedId: string;
  title: string;
  smallImg: string;
  bigImg: string;
  votes: number;
  userId: string;
  haveUpvoted: boolean;
}

// Type for tracking user votes
type UserVotes = {
  [songId: string]: "up" | "down" | null;
};

// Type for preview data that will be stored in DB
interface PreviewData {
  url: string;
  extractedId: string;
  title: string;
  smallImg: string;
  bigImg: string;
  userId: string;
}

export default function StreamView({ creatorId }: { creatorId: string }) {
  const [musicUrl, setMusicUrl] = useState("");
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  // Track user votes
  const [userVotes, setUserVotes] = useState<UserVotes>({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(142); // 2:22
  const [totalTime] = useState(198); // 3:18
  const [isValidYT, setIsValidYT] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);

  //Refresh the stream every 5 seconds
  const REFRESH_INTERVAL_MS = 5 * 1000;

  async function refreshStream() {
    try {
      const res = await axios.get(`/api/streams/?creatorId=${creatorId}`);
      if (res.data?.streams) {
        setQueue(
          res.data.streams
            .map((stream: any) => ({
              id: stream.id,
              url: stream.url,
              extractedId: stream.extractedId,
              title: stream.title,
              smallImg: stream.smallImg,
              bigImg: stream.bigImg, // match your backend casing
              votes: stream.upvotes ?? 0,
              haveUpvoted: stream.haveUpvoted,
              userId: stream.userId,
            }))
            .sort((a: any, b: any) => b.votes - a.votes)
        );
      }
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  }

  useEffect(() => {
    refreshStream();
    const interval = setInterval(refreshStream, REFRESH_INTERVAL_MS);
    // return () => clearInterval(interval);
  }, []);

  const session = useSession();

  //Mock current user ID (in real app, this would come from auth)
  //   const currentUserId = res.data.user.id;
  const currentUserId = session?.data?.user?.id;
  // Mock current playing track
  const currentTrack = {
    // title: "Blinding Lights",
    // artist: "The Weeknd",
    // album: "After Hours",
    // bigImg: "/placeholder.svg?height=300&width=300",
    // submittedBy: "MusicFan23",
    // duration: "3:18",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareModal && !(event.target as Element).closest(".relative")) {
        setShowShareModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showShareModal]);

  // Simulate progress
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => (prev < totalTime ? prev + 1 : prev));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, totalTime]);

  const extractYouTubeId = (url: string): string | null => {
    // Extract YouTube ID
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleUrlChange = (url: string) => {
    setMusicUrl(url);
    const ytId = extractYouTubeId(url);
    setIsValidYT(!!ytId);
  };

  const handleVote = async(id: string, direction: "up" | "down") => {
    const stream = queue.find((item) => item.id === id);
    if (!stream) return;

    // const alreadyVoted = stream.haveUpvoted;
    let voteChange = 0;
    if (direction === "up" && !stream.haveUpvoted) {
      voteChange = 1;
    } else if (direction === "down" && stream.haveUpvoted) {
      voteChange = -1;
    } else {
      // Invalid action
      return;
    }

    try {
      await fetch(
        `/api/streams/${direction === "up" ? "upvote" : "downvote"}`,
        {
          method: "POST",
          body: JSON.stringify({ streamId: id }),
        }
      );
      setQueue((prev) =>
        prev
          .map((item) =>
            item.id === id
              ? {
                  ...item,
                  votes: item.votes + voteChange,
                  haveUpvoted: direction === "up" ? true : false,
                }
              : item
          )
          .sort((a, b) => b.votes - a.votes)
      );
    } catch (error) {
      console.error("Vote failed", error);
    }
  };

  const handleAddToQueue = async () => {
    try {
      const response = await axios.post("/api/streams", {
        creatorId: currentUserId,
        url: musicUrl,
      });
      if (response.status === 200 && response.data.stream) {
        setQueue((prev) =>
          [...prev, response.data.stream].sort((a, b) => b.votes - a.votes)
        );
        setMusicUrl("");
        setIsValidYT(false);
        console.log(response.data.stream);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = () => {
    const shareableLink = `${window.location.hostname}/creator/${currentUserId}`;
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        toast.success("Link copied to clipboard", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },
      (err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy text", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Music className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Muzer
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          {/* Share Button */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare()}
              className="border-gray-800 bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600"
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <div>
            <nav className="ml-auto flex gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-white"
                onClick={() =>{
                  session.data?.user ? signOut() : signIn();
                }}
              >
                {session.data?.user ? "Logout" : "Signin"}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 gap-6 grid lg:grid-cols-[1fr_400px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Current Track Player */}
          <Card className="border border-gray-800 bg-gray-900/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                {/* Album Art */}
                <div className="relative">
                  <img
                    src={currentTrack.bigImg || "/placeholder.svg"}
                    alt={`${currentTrack.album} cover`}
                    className="w-32 h-32 rounded-lg object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                </div>

                {/* Track Info & Controls */}
                <div className="flex-1 space-y-4">
                  <div>
                    <Badge className="bg-violet-900/60 text-violet-300 border border-violet-700/50 mb-2">
                      Now Playing
                    </Badge>
                    <h2 className="text-2xl font-bold text-white">
                      {currentTrack.title}
                    </h2>
                    {/* <p className="text-lg text-gray-300">{currentTrack.artist}</p>
                    <p className="text-sm text-gray-400">{currentTrack.album}</p> */}
                    {/* <p className="text-xs text-gray-500 mt-1">Submitted by {currentTrack.submittedBy}</p> */}
                  </div>

                  {/* Player Controls */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-violet-600 hover:bg-violet-500 rounded-full h-12 w-12"
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-pink-400"
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white ml-auto"
                      >
                        <Volume2 className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {formatTime(currentTime)}
                        </span>
                        <div className="flex-1 bg-gray-700 rounded-full h-1">
                          <div
                            className="bg-violet-500 h-1 rounded-full transition-all duration-1000"
                            style={{
                              width: `${(currentTime / totalTime) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatTime(totalTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                  value={musicUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500"
                />
                <Button
                  onClick={handleAddToQueue}
                  disabled={!isValidYT}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50"
                >
                  Add
                </Button>
              </div>

              {/* Preview */}
              {previewData && (
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 space-y-3">
                  {/* <div className="flex items-center gap-2 text-sm text-violet-400">
                    <Eye className="h-4 w-4" />
                    <span>Preview (Data to be stored in DB)</span>
                  </div> */}

                  <div className="flex gap-3">
                    <div className="space-y-2">
                      <img
                        src={previewData.smallImg || "/placeholder.svg"}
                        alt="Small thumbnail"
                        className="w-16 h-12 object-cover rounded"
                      />
                      <p className="text-xs text-gray-500">Small Image</p>
                    </div>
                    <div className="space-y-2">
                      <img
                        src={previewData.bigImg || "/placeholder.svg"}
                        alt="Large thumbnail"
                        className="w-24 h-16 object-cover rounded"
                      />
                      <p className="text-xs text-gray-500">Big Image</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-white text-sm">
                        {previewData.title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {previewData.artist}
                      </p>
                      <p className="text-xs text-gray-500">
                        {previewData.duration}
                      </p>
                      <div className="text-xs text-gray-500 space-y-1 mt-2">
                        <p>
                          <span className="text-violet-400">URL:</span>{" "}
                          {previewData.url}
                        </p>
                        <p>
                          <span className="text-violet-400">ID:</span>{" "}
                          {previewData.extractedId}
                        </p>
                        <p>
                          <span className="text-violet-400">User ID:</span>{" "}
                          {previewData.userId}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-800/30 p-2 rounded-lg">
                <AlertCircle className="h-4 w-4 text-violet-400" />
                <span>
                  New songs start with 0 votes. You can vote once per song.
                </span>
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
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <img
                        src={item.smallImg}
                        alt={`${item.title} thumbnail`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm truncate">
                        {item.title}
                      </h4>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={item.haveUpvoted}
                        className={cn(
                          "h-6 w-6 p-0 hover:bg-green-900/20",
                          item.haveUpvoted
                          ? "text-gray-400":
                            "text-green-400 bg-black-900/20 hover:text-green-300"
                        )}
                        onClick={() => handleVote(item.id, "up")}
                      >
                        <ChevronUp className="h-4 w-4" />
                        {/* {item.haveUpvoted} */}
                      </Button>
                      <span className="text-sm font-medium text-white">
                        {item.votes}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={!item.haveUpvoted}
                        onClick={() => handleVote(item.id, "down")}
                        className={cn(
                          "h-6 w-6 p-0 hover:bg-red-900/20",
                          item.haveUpvoted
                            ? "text-red-400 bg-red-900/20"
                            : "text-gray-400 hover:text-red-300"
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
  );
}
