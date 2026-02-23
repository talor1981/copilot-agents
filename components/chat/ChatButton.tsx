'use client';

import { useAppDispatch } from '@/lib/hooks';
import { openChat } from './chatSlice';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Chat } from './Chat';

export function ChatButton() {
  const dispatch = useAppDispatch();

  return (
    <>
      <Button
        onClick={() => dispatch(openChat())}
        size="lg"
        className="gap-2"
      >
        <MessageCircle className="h-5 w-5" />
        Chat with Support
      </Button>
      <Chat />
    </>
  );
}
