import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChatMessage, ChatSession } from './types';

/**
 * Mock data for chat messages
 */
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    sender: 'support',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    status: 'sent',
  },
];

/**
 * RTK Query API for chat operations
 * Currently using mock data
 */
export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['ChatMessages'],
  endpoints: (builder) => ({
    getChatMessages: builder.query<ChatMessage[], void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: mockMessages };
      },
      providesTags: ['ChatMessages'],
    }),
    
    sendMessage: builder.mutation<ChatMessage, { content: string }>({
      queryFn: async ({ content }) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          content,
          sender: 'user',
          timestamp: new Date().toISOString(),
          status: 'sent',
        };
        
        // Simulate support response
        const supportMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: 'Thank you for your message! A support team member will respond shortly.',
          sender: 'support',
          timestamp: new Date(Date.now() + 1000).toISOString(),
          status: 'sent',
        };
        
        return { data: userMessage };
      },
      invalidatesTags: ['ChatMessages'],
    }),
  }),
});

export const { useGetChatMessagesQuery, useSendMessageMutation } = chatApi;
