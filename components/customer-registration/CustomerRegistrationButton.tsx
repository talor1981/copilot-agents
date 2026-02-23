'use client';

import { useAppDispatch } from '@/lib/hooks';
import { setRegistrationDialogOpen } from './customerSlice';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { CustomerRegistration } from './CustomerRegistration';

export function CustomerRegistrationButton() {
  const dispatch = useAppDispatch();

  return (
    <>
      <Button 
        onClick={() => dispatch(setRegistrationDialogOpen(true))}
        className="gap-2"
      >
        <UserPlus className="h-4 w-4" />
        Register
      </Button>
      <CustomerRegistration />
    </>
  );
}
