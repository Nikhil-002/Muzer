import StreamView from "@/app/components/StreamView";
import type { JSX } from "react";


export default async function Creator({
  params,
}: {
  params: { creatorId: string };
}): Promise<JSX.Element> {
  const { creatorId } = params;

  return (
    <div>
      <StreamView creatorId={creatorId} playVideo={false} />
    </div>
  );
}
