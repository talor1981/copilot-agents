'use client';

import { useAppDispatch } from '@/lib/hooks';
import { setCustomerListDialogOpen } from './customerSlice';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { CustomerList } from './CustomerList';

export function CustomerListButton() {
  const dispatch = useAppDispatch();

  return (
    <>
      <Button 
        onClick={() => dispatch(setCustomerListDialogOpen(true))}
        variant="outline"
        className="gap-2"
      >
        <Users className="h-4 w-4" />
        Customer List
      </Button>
      <CustomerList />
    </>
  );
}
