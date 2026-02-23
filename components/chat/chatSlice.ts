import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';

interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
}

const initialState: ChatState = {
  isOpen: false,
  isMinimized: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    openChat: (state) => {
      state.isOpen = true;
      state.isMinimized = false;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
      if (state.isOpen) {
        state.isMinimized = false;
      }
    },
    minimizeChat: (state) => {
      state.isMinimized = true;
    },
    maximizeChat: (state) => {
      state.isMinimized = false;
    },
  },
});

export const { openChat, closeChat, toggleChat, minimizeChat, maximizeChat } = chatSlice.actions;

export const selectIsChatOpen = (state: RootState) => state.chat.isOpen;
export const selectIsChatMinimized = (state: RootState) => state.chat.isMinimized;

export default chatSlice.reducer;
