
import { useState } from 'react';
import { User, Chat, Message } from '@/types';
import { sendChatMessage } from '@/services/musicApi';

type UseMessageHandlingProps = {
  currentUser: User | null;
};

export const useMessageHandling = ({ currentUser }: UseMessageHandlingProps) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  
 
  const sendMessage = async (content: string) => {
    if (!currentChat || !currentUser) return;
    
    console.log("Sending message:", content);
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: currentChat.users.find(id => id !== currentUser.id) || null,
      content,
      timestamp: new Date(),
    };
    
    const updatedChat: Chat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage]
    };
    
    setCurrentChat(updatedChat);
    
    // If this is a real match (has a UUID match ID), save the message to the database
    if (currentChat.matchId.length > 20) { 
      await sendChatMessage(
        currentChat.matchId, 
        currentUser.id, 
        content
        
      );
    }
  };
  
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  return {
    chatOpen,
    currentChat,
    setChatOpen,
    setCurrentChat,
    sendMessage,
    toggleChat
  };
};
