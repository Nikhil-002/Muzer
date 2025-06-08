import StreamView from "@/app/components/StreamView";
import type { JSX } from "react";

export default async function Creator({
  params,
}: Readonly<{
  params: Promise<{ creatorId: string }>;
}>) : Promise<JSX.Element> {
  const { creatorId } = await params;

  return (
    <div>
      <StreamView creatorId={creatorId} playVideo={false} />
    </div>
  );
}
