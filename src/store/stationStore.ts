import { create } from "zustand";
import type { FuelType } from "../types/general";
import { handleRequest } from "../lib/request";
import api from "../lib/axios";

// Export this interface
export interface StationFormData {
  name: string;
  addressState: string;
  addressStreet: string;
  addressCity: string;
  addressCountry: string;
  latitude?: number;
  longitude?: number;
  openTime?: string;
  closeTime?: string;
  is24h: boolean;
  fuelTypes: FuelType[];
  prices: Record<FuelType, number>;
}

export interface Station {
  id: string;
  name: string;
  addressState: string;
  addressStreet: string;
  addressCity: string;
  addressCountry: string;
  isAvailable: boolean;
  latitude: number;
  longitude: number;
  openTime: Date | string;
  closeTime: Date | string;
  is24h: boolean;
  fuelTypes: FuelType[];
  prices: Record<FuelType, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface StationList {
  id: string;
  name: string;
  addressCity: string;
  addressState: string;
  fuelTypes: FuelType[];
  isAvailable: boolean;
  is24h: boolean;
  createdAt: Date;
}

interface FetchStationsResponse {
  stations: StationList[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalStations: number;
  };
}

interface StationState {
  fetchStationsResponse: FetchStationsResponse | null;
  loadingStations: boolean;
  error: string | null;
}

interface StationAction {
  fetchStations: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isAvailable?: boolean;
  }) => Promise<void>;
  createStation: (payload: StationFormData) => Promise<{
    success: boolean;
    message?: string;
    data?: StationList;
  }>;
  getStation: (payload: string) => Promise<{
    success: boolean;
    message?: string;
    data?: Station | null;
  }>;
  updateStationStatus: (payload: string, newStatus: boolean) => Promise<{
    success: boolean;
    message?: string;
    data?: Station | null;
  }>;
}

const initialState: StationState = {
  fetchStationsResponse: null,
  loadingStations: false,
  error: null,
};

export const useStationStore = create<StationState & StationAction>(
  (set, get) => ({
    ...initialState,
    fetchStations: async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      isAvailable?: boolean;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", String(params.page));
      if (params?.limit) queryParams.append("limit", String(params.limit));
      if (params?.search) queryParams.append("search", params.search);
      if (params?.isAvailable !== undefined)
        queryParams.append("isAvailable", String(params.isAvailable));

      set({ loadingStations: true, error: null });
      await handleRequest({
        request: () => api.get("/stations", { params: queryParams }),
        onSuccess: (data) => {
          set({
            fetchStationsResponse: data.data as FetchStationsResponse,
            loadingStations: false,
          });
        },
        onError: (error) => {
          set({
            error: error.message || "Failed to fetch stations",
            loadingStations: false,
          });
        },
        showToast: false,
      });
    },
    createStation: async (payload: StationFormData) => {
      set({ loadingStations: true, error: null });

      return new Promise((resolve) => {
        handleRequest({
          request: () => api.post("/stations", payload),
          onSuccess: async (data) => {
            const { fetchStations } = get();
            await fetchStations();
            set({ loadingStations: false });

            resolve({
              success: true,
              message: "Station created successfully",
              data: data.data as StationList,
            });
          },
          onError: (error) => {
            set({
              loadingStations: false,
              error: error.message || "Failed to create station",
            });

            resolve({
              success: false,
              message: error.message || "Failed to create station",
            });
          },
          showToast: true,
        });
      });
    },
    getStation: async (id: string) => {
      set({ loadingStations: true, error: null });

      return new Promise((resolve) => {
        handleRequest({
          request: () => api.get(`/stations/${id}`),
          onSuccess: (data) => {
            set({ loadingStations: false });
            resolve({
              success: true,
              message: "Station fetched successfully",
              data: data.data as Station,
            });
          },
          onError: (error) => {
            set({
              loadingStations: false,
              error: error.message || "Failed to fetch station",
            });
            resolve({
              success: false,
              message: error.message || "Failed to fetch station",
              data: null as Station | null,
            });
          },
          showToast: false,
        });
      });
    },
    updateStationStatus: async (id: string, newStatus: boolean) => {
      set({ loadingStations: true, error: null });

      return new Promise((resolve) => {
        handleRequest({
          request: () => api.patch(`/stations/${id}/status`, { isAvailable: newStatus }),
          onSuccess: (data)=> {
            set({ loadingStations: false });
            resolve({
              success: true,
              message: "Station status updated successfully",
              data: data.data as Station,
            });
          },
          onError: (error) => {
            set({
              loadingStations: false,
              error: error.message || "Failed to update station status",
            });
            resolve({
              success: false,
              message: error.message || "Failed to update station status",
              data: null as Station | null,
            });
          },
          showToast: true,
        });
      });
    }
  }),
);
