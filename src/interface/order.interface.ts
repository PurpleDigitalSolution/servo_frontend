import type { FuelType, OrderStatus } from "../types/general";
export interface Order {
  id: string;
  customerId: string;
  stationId: string;
  status: OrderStatus;
  fuelType: FuelType;
  quantity: string;
  fuelSubtotal: string;
  totalAmount: string;
  unitPrice: string;
  assignedAgentId:string;
  completedById:string;
  cancelledById:string;
  deliveryAddress: string;
  VAT: string;
  deliveryFee: string;
  createdAt: string;
  updatedAt: string;
  customer?: User;
  station?: Station;
}

export interface User {
  id: string;
  email: string;
  userProfile: UserProfile;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
}

export interface Station {
  id: string;
  name: string;
  addressState?:string;
  addressCity?:string;
}


export interface OrderResponse {
  page: number;
  limit: number;
  total: number;
  orders: Order[];
}

export interface OrderState {
  loading: boolean;
  error: string | null;
  records: OrderResponse | null;
}

export interface OrderAction {
  fetchOrders: (page?: number, limit?: number, force?: boolean) => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order | null>;
}
