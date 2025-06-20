import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Users, Radio, Heart, Play, Headphones, Mic, Zap } from "lucide-react"
import Link from "next/link"
import { Appbar } from "./components/Appbar"
import { Redirect } from "./components/Redirect"

export default function MusicStreamingLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <Appbar /> 
        <Redirect />
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <Badge className="bg-gradient-to-r from-violet-500 to-pink-500 text-white w-fit">
                    🎵 Fan-Powered Music
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-white">
                    Let your fans {" "}
                    <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      choose the music
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 max-w-[500px]">
                    Go live and let your audience add songs and vote for what plays next — easiest way to stream and connect through music
                  </p>
                </div>
              </div>

              {/* Demo Card */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20"></div>
                  <Card className="relative w-full max-w-sm bg-gray-900/80 backdrop-blur-sm border border-gray-800 shadow-2xl">
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto h-14 w-14 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3">
                        <Radio className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-lg text-white">DJ Alex Live</CardTitle>
                      <Badge variant="secondary" className="bg-green-900/60 text-green-400 border border-green-700/50">
                        🔴 Live Now
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg"></div>
                          <div>
                            <p className="font-medium text-sm text-white">Blinding Lights</p>
                            <p className="text-xs text-gray-400">The Weeknd</p>
                          </div>
                          <Badge className="ml-auto bg-pink-900/60 text-pink-300 text-xs border border-pink-700/50">
                            Fan Pick
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-medium text-gray-300">
                          <span>Next Up</span>
                          <span className="text-violet-400">18 votes</span>
                        </div>
                        <div className="space-y-1">
                          {[
                            {
                              song: "Good 4 U",
                              artist: "Olivia Rodrigo",
                              votes: 12,
                              color: "from-pink-500 to-rose-500",
                            },
                            { song: "Stay", artist: "The Kid LAROI", votes: 8, color: "from-violet-500 to-purple-500" },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-2 bg-gray-800/50 rounded text-xs border border-gray-700/50"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 bg-gradient-to-r ${item.color} rounded-full`}></div>
                                <span className="font-medium text-gray-200">{item.song}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3 text-red-400" />
                                <span className="font-medium text-gray-300">{item.votes}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">Why Creators Choose Muzer</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Turn your streams into interactive experiences that keep fans coming back
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="border border-gray-800 bg-gray-900/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-violet-900/20">
                <CardHeader className="text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-900/30">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Fan Control</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400">Real-time song voting empowers your audience to shape the listening experience</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-800 bg-gray-900/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-pink-900/20">
                <CardHeader className="text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-900/30">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Live Interaction</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400">users can add songs to the queue and upvote/downvote to shape the playlist in real-time</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-800 bg-gray-900/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-900/20">
                <CardHeader className="text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-900/30">
                    <Headphones className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">HD Video</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400">Crystal-clear streaming with embedded youtube video</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
