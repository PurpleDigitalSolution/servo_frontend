import { create } from "zustand";
import type { User } from "../interface/user.interface";
import { handleRequest } from "../lib/request";
import api from "../lib/axios";

interface userState {
  loading: boolean;
  error: string | null;
  records: {
    users: User[];
    pagination: {
      totalCustomers: number;
      totalPages: number;
      currentPage: number;
    };
  } | null;
  agentRecords: {
     users: User[];
    pagination: {
      totalAgents: number;
      totalPages: number;
      currentPage: number;
    };
  } | null
}

interface ResponseData {
  success: boolean;
  message: string;
  route?: string;
  data?:any;
  errors?: { field: string; message: string }[];
}

interface UserStateAction {
  getCustomers: (page?: number, limit?: number) => Promise<void>;
  getCustomerProfile: (id: string) => Promise<ResponseData>
  getAgentRecords: (page?: number, limit?: number) => Promise<void>;
  registerAgent: (agentData: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: Date;
    address: string;
  }) => Promise<ResponseData>;
}

const initialState: userState = {
  loading: false,
  error: null,
  records: null,
  agentRecords: null,
};

export const useUserStore = create<UserStateAction & userState>((set, get) => ({
  ...initialState,
  getCustomers: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    return new Promise((resolve) => {
      handleRequest({
        request: () =>
          api.get("/users", {
            params: {
              page,
              limit,
            },
          }),
        onSuccess: (data) => {
          set({ records: data.data as userState["records"] });
          resolve();
        },
        onError: (error) => {
          set({ error: error.response?.data?.message });
        },
        showToast: false,
      });
    });
  },
  getAgentRecords: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    return new Promise((resolve) => {
      handleRequest({
        request: () =>
          api.get("/users/agents", {
            params: {
              page,
              limit,
            },
          }),
        onSuccess: (data) => {
          set({ agentRecords: data.data as userState["agentRecords"] });
          resolve();
        },
        onError: (error) => {
          set({ error: error.response?.data?.message });
        },
        showToast: false,
      });
    });
  },
  getCustomerProfile: async (id: string) => {
    set({ loading: true, error: null });
    return new Promise((resolve) => {
      handleRequest({
        request: () => api.get(`/user-profile/`, { params: { id } }),
        onSuccess: (data) => {
          resolve({
            data:data.data,
            success: true,
            message: "Success",
          });
        },
        onError: (error) => {
          resolve({
            success: false,
            message:
              error.response?.data?.message ||
              "Failed to fetch customer profile",
          });
        },
      });
    });
  },
  registerAgent: async (agentData) => {
    set({ loading: true, error: null });

    return new Promise((resolve) => {
      handleRequest({
        request: () => api.post("/auth/admin/register", agentData),
        onSuccess: async () => {
          const { getAgentRecords } = get();
          await getAgentRecords();
          resolve({
            success: true,
            message: "Agent registered successfully",
          });
        },
        onError: (error) => {
          resolve({
            success: false,
            message:
              error.response?.data?.message ||
              "Failed to register agent",
          });
        },
      });
    });
  }
}));
