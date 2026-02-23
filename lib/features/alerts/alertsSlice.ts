import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Alert {
  id: string;
  title: string;
  description: string;
}

interface AlertsState {
  items: Alert[];
}

const initialState: AlertsState = {
  items: [],
};

export const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Omit<Alert, 'id'>>) => {
      state.items.push({
        id: crypto.randomUUID(),
        ...action.payload,
      });
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((alert) => alert.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.items = [];
    },
  },
});

export const { addAlert, removeAlert, clearAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
