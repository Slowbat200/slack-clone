'use client';

import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { useRouter } from 'next/navigation';

import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { UseGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useCurrentMember } from '@/features/members/api/use-current-member';

import { useEffect, useMemo } from 'react';

import { Loader, TriangleAlert } from 'lucide-react';

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = UseGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role]);

  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      memberLoading ||
      !member ||
      !workspace
    )
      return;
    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    workspaceId,
    workspaceLoading,
    channelsLoading,
    workspace,
    open,
    setOpen,
    router,
    member,
    memberLoading,
    isAdmin,
  ]);

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
        <Loader className='size-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
        <TriangleAlert className='size-6 text-muted-foreground' />
        <span className='text-sm text-muted-foreground'>
          Workspace not found
        </span>
      </div>
    );
  }
  return (
    <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
      <TriangleAlert className='size-6 text-muted-foreground' />
      <span className='text-sm text-muted-foreground'>
        No channel found
      </span>
    </div>
  );};

export default WorkspaceIdPage;