// store/transactionStore.ts
import { create } from "zustand";
import { handleRequest } from "../lib/request";
import api from "../lib/axios";

interface Transaction {
  id: string;
  orderId: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  status: string;
  reference: string;
  gatewayReference: string | null;
  authorizationUrl: string | null;
  accessCode: string | null;
  paidAt: string | null;
  gatewayResponse: string | null;
  createdAt: string;
  updatedAt: string;
}

interface transactionState {
  loading: boolean;
  error: string | null;
  transactions: Transaction[] | null;
}

interface transactionAction {
  verifyTransaction: (orderId: string) => Promise<{ status: boolean }>;
  getOrderTransaction: (orderId: string) => Promise<{
    success: boolean;
    transaction: Transaction[] | null;
    message?: string;
  }>;
}

const initialState: transactionState = {
  loading: false,
  error: null,
  transactions: null,
};

export const useTransactionStore = create<transactionState & transactionAction>(
  (set) => ({
    ...initialState,
    verifyTransaction: async (orderId) => {
      set({ loading: true, error: null });
      let response = {
        status: false,
      };
      await handleRequest({
        request: () => api.get(`/transactions/verify?orderId=${orderId}`),
        onSuccess: (data) => {
          const payload = (data as any)?.data;
          response = { status: Boolean(payload?.status) };
          set({
            loading: false,
            error: null,
          });
        },
        onError: (error) => {
          response = { status: false };
          set({
            loading: false,
            error:
              error?.response?.data?.message ||
              "An error occurred while verifying the transaction.",
          });
        },
        showToast: true,
      });
      return response;
    },
    getOrderTransaction: async (orderId) => {
      set({ loading: true, error: null });
      let response = {
        success: false,
        transaction: null as Transaction[] | null,
        message: "",
      };
      await handleRequest({
        request: () => api.get(`/transactions/orders/${orderId}/all`),
        onSuccess: (data) => {
          // Extract the transactions array from the response
          const payload = (data as any)?.data;
          // Check if payload is an array or has a transactions property
          const transactions = Array.isArray(payload)
            ? payload
            : payload?.transactions || payload?.data || [];

          response = {
            success: true,
            transaction: transactions,
            message: "Transaction fetched successfully",
          };
          set({
            loading: false,
            error: null,
            transactions: transactions,
          });
        },
        onError: (error) => {
          response = {
            success: false,
            transaction: null,
            message: error?.response?.data?.message || "Failed to fetch transactions",
          };
          set({
            loading: false,
            error:
              error?.response?.data?.message ||
              "An error occurred while fetching the transaction.",
            transactions: null,
          });
        },
        showToast: false,
      });
      return response;
    },
  }),
);