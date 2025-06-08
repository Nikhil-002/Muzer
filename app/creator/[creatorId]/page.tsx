import StreamView from "@/app/components/StreamView";

export default async function ({params}: {params: {creatorId : string}}){
    const {creatorId} = await params;
    return(
        <div>
            <StreamView creatorId={creatorId} />
        </div>
    )
}