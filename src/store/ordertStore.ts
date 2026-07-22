import { create } from "zustand";
import type { Order } from "../interface/order.interface";
import api from "../lib/axios";
import { handleRequest } from "../lib/request";

interface OrderState {
  loading: boolean;
  error: string | null;
  records: {
    page: number;
    limit: number;
    total: number;
    orders: Order[];
  } | null;
}

interface OrderAction {
  fetchOrders: (
    page?: number,
    limit?: number,
    force?: boolean,
  ) => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: string) => Promise<Order | null>;
}

const initialState: OrderState = {
  loading: false,
  error: null,
  records: null,
};

export const useOrderStore = create<OrderState & OrderAction>((set, get) => ({
  ...initialState,
  fetchOrders: async (page = 1, limit = 10, force = false) => {
    if (!force && get().records) return;
    set({ loading: true, error: null });
    return new Promise<void>((resolve) => {
      handleRequest({
        request: () => api.get(`/orders/list?page=${page}&limit=${limit}`),
        onSuccess: (data) => {
          set({ loading: false, records: data.data as OrderState["records"] });
          resolve();
        },
        onError: (error) => {
          set({ loading: false, error: error.response?.data?.message });
          resolve();
        },
        showToast: false,
      });
    });
  },
  getOrderById: async (orderId: string) => {
    set({ loading: true, error: null });
    return new Promise<Order | null>((resolve) => {
      handleRequest({
        request: () => api.get(`/orders/${orderId}`),
        onSuccess: (data) => {
          set({ loading: false });
          resolve(data.data as Order);
        },
        onError: (error) => {
          set({ error: error.response?.data?.message,loading: false });
          resolve(null);
        },
        showToast: false,
      });
    });
  },
  updateOrderStatus: async (orderId: string, status: string) => {
    set({ loading: true, error: null });
    return new Promise<Order | null>((resolve) => {
      handleRequest({
        request: () => api.put(`/orders/${orderId}/status`, { status }),
        onSuccess: async (data) => {
          await get().fetchOrders(1, 10, true);
          set({ loading: false });
          resolve(data.data as Order);

        },
        onError: (error) => {
          set({ error: error.response?.data?.message, loading: false });
          resolve(null);
        },
        showToast: false,
      });
    });
  }
}));
