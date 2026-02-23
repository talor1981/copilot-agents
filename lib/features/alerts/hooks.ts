import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addAlert, removeAlert, clearAlerts } from './alertsSlice';
import { useCallback } from 'react';

export function useAlerts() {
  const dispatch = useAppDispatch();
  const alerts = useAppSelector((state) => state.alerts.items);

  const handleAddAlert = useCallback(
    (title: string, description: string) => {
      dispatch(addAlert({ title, description }));
    },
    [dispatch]
  );

  const handleRemoveAlert = useCallback(
    (id: string) => {
      dispatch(removeAlert(id));
    },
    [dispatch]
  );

  const handleClearAlerts = useCallback(() => {
    dispatch(clearAlerts());
  }, [dispatch]);

  return {
    alerts,
    addAlert: handleAddAlert,
    removeAlert: handleRemoveAlert,
    clearAlerts: handleClearAlerts,
  };
}
