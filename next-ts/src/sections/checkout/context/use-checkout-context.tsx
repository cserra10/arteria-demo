'use client';

import { useContext } from 'react';

import { CheckoutContext } from './checkout-provider';

// ----------------------------------------------------------------------

export function useCheckoutContext() {
  const context = useContext(CheckoutContext);

  if (!context) throw new Error('useCheckoutContext must be use inside CheckoutProvider');

  return context;
}
