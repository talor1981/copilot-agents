import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { dashboardApi } from '@/app/dashboard/dashboardApi';
import { globalTimeApi } from '@/components/global-time/globalTimeApi';
import { weatherApi } from '@/components/weather/weatherApi';
import alertsReducer from './features/alerts/alertsSlice';

export const store = configureStore({
  reducer: {
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [globalTimeApi.reducerPath]: globalTimeApi.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    alerts: alertsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dashboardApi.middleware, globalTimeApi.middleware, weatherApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
