import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { Customer, CustomerFormData } from './types';

interface CustomerState {
  customers: Customer[];
  isRegistrationDialogOpen: boolean;
  isCustomerListDialogOpen: boolean;
}

const initialState: CustomerState = {
  customers: [],
  isRegistrationDialogOpen: false,
  isCustomerListDialogOpen: false,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<CustomerFormData>) => {
      const newCustomer: Customer = {
        id: crypto.randomUUID(),
        ...action.payload,
        address: {
          country: action.payload.country,
          city: action.payload.city,
          street: action.payload.street,
        },
        createdAt: new Date().toISOString(),
      };
      state.customers.push(newCustomer);
    },
    toggleRegistrationDialog: (state) => {
      state.isRegistrationDialogOpen = !state.isRegistrationDialogOpen;
    },
    toggleCustomerListDialog: (state) => {
      state.isCustomerListDialogOpen = !state.isCustomerListDialogOpen;
    },
    setRegistrationDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isRegistrationDialogOpen = action.payload;
    },
    setCustomerListDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isCustomerListDialogOpen = action.payload;
    },
  },
});

export const {
  addCustomer,
  toggleRegistrationDialog,
  toggleCustomerListDialog,
  setRegistrationDialogOpen,
  setCustomerListDialogOpen,
} = customerSlice.actions;

// Selectors
export const selectCustomers = (state: RootState) => state.customer.customers;
export const selectIsRegistrationDialogOpen = (state: RootState) =>
  state.customer.isRegistrationDialogOpen;
export const selectIsCustomerListDialogOpen = (state: RootState) =>
  state.customer.isCustomerListDialogOpen;

export default customerSlice.reducer;
