import { create } from "zustand";
import { handleRequest } from "../lib/request";
import api from "../lib/axios";

interface transactionState {
  loading: boolean;
  error: string | null;
}
interface transactionAction {
  verifyTransaction: (orderId: string) => Promise<{ status: boolean }>;
}

const initialState: transactionState = {
  loading: false,
  error: null,
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
          // handleRequest returns unknown-typed payload; narrow safely
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
  }),
);
