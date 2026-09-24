import { create } from "zustand";
import { handleRequest } from "../lib/request";
import api from "../lib/axios";

export interface PriceSettingValue {
  isEnable: boolean;
  value: number;
}

export interface PriceSettings {
  deliveryFee: PriceSettingValue;
  vat: PriceSettingValue;
}

interface PricingStoreState {
  loading: boolean;
  priceSetting: PriceSettings | null;
  error: string | null;

  // Actions
  getPriceSettings: () => Promise<void>;
  updatePriceSettings: (payload: Partial<PriceSettings>) => Promise<void>;
}


const initialState = {
  loading: false,
  priceSetting: null,
  error: null,
};


export const usePricingSettingStore = create<PricingStoreState>((set) => ({
  ...initialState,

  getPriceSettings: async () => {
    set({ loading: true, error: null });

    await handleRequest({
      request: () => api.get("/pricing/settings"),
      onSuccess: (response) => {
        set({
          loading: false,
          priceSetting: response.data as PriceSettings,
        });
      },
      onError: (error) => {
        set({
          loading: false,
          error: error.response?.data?.message || "Failed to fetch pricing settings",
        });
      },
      showToast: false,
    });
  },

  updatePriceSettings: async (payload: Partial<PriceSettings>) => {
    set({ loading: true, error: null });

    await handleRequest({
      request: () => api.put("/pricing/settings", payload),
      onSuccess: (response) => {
        set({
          loading: false,
          priceSetting: response.data as PriceSettings,
        });
      },
      onError: (error) => {
        set({
          loading: false,
          error: error.response?.data?.message || "Failed to update pricing settings",
        });
      },
      showToast: true,
    });
  },
}));