
import { useState, useEffect, useCallback } from 'react';
import { directMessageBus, DMEvent } from '../services/directMessageBus';
import { profileService } from '../services/profile';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen';
}

export interface Conversation {
  id: string;
  participants: { id: string; name: string; avatar: string }[];
  lastMessage?: string;
  lastTimestamp?: string;
  unreadCount: number;
  messages: Message[];
}

export const useDirectMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const currentUser = profileService.getProfile();

  const sendMessage = useCallback((text: string) => {
    if (!activeConvId || !text.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: text,
          lastTimestamp: newMessage.timestamp
        };
      }
      return c;
    }));

    // Simulation removed
  }, [activeConvId]);

  useEffect(() => {
    return directMessageBus.subscribe((event: DMEvent) => {
      if (event.type === 'DM_OPEN') {
        setIsPanelOpen(true);
        // Find if conversation exists
        const existing = conversations.find(c => c.participants.some(p => p.id === event.data.userId));
        if (existing) {
          setActiveConvId(existing.id);
        } else {
          const newId = `conv-${Date.now()}`;
          const newConv: Conversation = {
            id: newId,
            participants: [{ id: event.data.userId, name: event.data.name, avatar: event.data.avatar }],
            unreadCount: 0,
            messages: event.data.context ? [{ id: 'ctx', senderId: 'system', text: `Discussing: ${event.data.context}`, timestamp: 'Now', status: 'seen' }] : []
          };
          setConversations(prev => [newConv, ...prev]);
          setActiveConvId(newId);
        }
      }
    });
  }, [conversations]);

  return {
    conversations,
    activeConversation: conversations.find(c => c.id === activeConvId),
    isPanelOpen,
    setIsPanelOpen,
    setActiveConvId,
    sendMessage,
    isTyping
  };
};
