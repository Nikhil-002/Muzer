
import StreamView from "../components/StreamView";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/next-auth";

export default async function MusicStreamingInterface() {
  const session = await getServerSession(authOptions)
  //Mock current user ID (in real app, this come from auth)
  const creatorId = session?.user?.id ?? "";
    return (
        <div>
            <StreamView creatorId={creatorId} playVideo={true}/>
        </div>
    )
}

