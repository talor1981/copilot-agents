/**
 * Chat feature type definitions
 */

/**
 * Represents a single chat message
 */
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
}

/**
 * Chat session metadata
 */
export interface ChatSession {
  id: string;
  userId: string;
  startedAt: string;
  isActive: boolean;
}
