import type { IDateValue, IAddressItem, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IInvoiceTableFilters = {
  name: string;
  status: string;
  service: string[];
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
};

export type IInvoiceItem = {
  id: string;
  title: string;
  price: number;
  total: number;
  service: string;
  quantity: number;
  description: string;
};

export type IInvoice = {
  id: string;
  sent: number;
  taxes: number;
  status: string;
  subtotal: number;
  discount: number;
  shipping: number;
  totalAmount: number;
  invoiceNumber: string;
  items: IInvoiceItem[];
  invoiceTo: IAddressItem;
  invoiceFrom: IAddressItem;
  createDate: IDateValue;
  dueDate: IDateValue;
};
