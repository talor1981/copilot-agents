/**
 * Customer registration types
 */

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    country: string;
    city: string;
    street: string;
  };
  gender: 'male' | 'female' | 'other';
  createdAt: string;
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  gender: 'male' | 'female' | 'other';
}
