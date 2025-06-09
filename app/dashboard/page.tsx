
import { authOptions } from "../api/auth/[...nextauth]/route";
import StreamView from "../components/StreamView";
import { getServerSession } from "next-auth";

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

