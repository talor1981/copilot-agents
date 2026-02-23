'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  selectCustomers,
  selectIsCustomerListDialogOpen,
  setCustomerListDialogOpen,
} from './customerSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

export function CustomerList() {
  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);
  const isOpen = useAppSelector(selectIsCustomerListDialogOpen);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => dispatch(setCustomerListDialogOpen(open))}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer List</DialogTitle>
        </DialogHeader>

        {customers.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-10">
              <p className="text-muted-foreground">
                No customers registered yet. Click &quot;Register&quot; to add your first customer.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Street</TableHead>
                  <TableHead>Gender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.firstName}</TableCell>
                    <TableCell>{customer.lastName}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.address.country}</TableCell>
                    <TableCell>{customer.address.city}</TableCell>
                    <TableCell>{customer.address.street}</TableCell>
                    <TableCell className="capitalize">{customer.gender}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
