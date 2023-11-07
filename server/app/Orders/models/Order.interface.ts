export enum Statuses {
  approved = 'Approved',
  cancelled = 'Cancelled',
  pending = 'Pending',
}

export type OrderStatus = keyof typeof Statuses;

export interface IOrder {
  id: number;
  name: string;
  phone: string;
  address: string;
  status: OrderStatus;
}