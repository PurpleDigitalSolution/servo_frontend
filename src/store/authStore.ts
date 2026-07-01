import { create } from "zustand";
import type { User } from "../interface/user.interface";
import api from "../lib/axios";
import { handleRequest } from "../lib/request";

interface AuthState {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  authenticating: boolean;
  error: string | null;
}
interface AuthStateAction {
  login: (payload: { email: string; password: string }) => Promise<ResponseData>;
  logout: () => Promise<ResponseData>;
  reset: () => void;
  checkAuthentication: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  authenticated:false,
  authenticating: false,
  error: null,
};
interface ResponseData {
  success: boolean;
  message: string;
  route?: string;
  errors?: { field: string; message: string }[];
}
export const useAuthStore = create<AuthState & AuthStateAction>((set, get) => ({
  ...initialState,
  login: async (payload) => {
    let response:ResponseData ={
      success:false,
      message:"Login failed",
    }

    await handleRequest({
      request: () => api.post("/auth/admin/login", payload),
      onSuccess: (data) => {
        response = {
          success: true,
          message: data.message || "Login successful",
          route: "/dashboard",
        };
        set({
          user: data.data as User,
          authenticating: false,
          error: null,
        });
      },
      onError: (error) => {
        response = {
          success: false,
          message: error?.response?.data?.message || "Login failed",
          errors: error?.response?.data?.errors,
        };
        set({
          authenticating: false,
          error: error?.response?.data?.message || "Login failed",
        });
      },
      showToast: true,
    });
    return response;
  },
  logout: async() => {
    let response:ResponseData ={
      success:false,
      message:"Logout failed",
    }
    await handleRequest({
      request: () => api.post("/auth/logout"),
      onSuccess: (data) => {
        const {reset} = get();
        reset();
        response = {
          success: true,
          message: data.message || "Logout successful",
        };
      },
      onError: (error) => {
        response = {
          success: false,
          message: error?.response?.data?.message || "Logout failed",
        };
      },
      showToast: true,
    });
    return response;
  },
  reset: () => {
    set({
      ...initialState,
    });
  },
  checkAuthentication: async () => {
    await handleRequest({
      request: () => api.get("/auth/authenticated"),
      onSuccess: (data) => {
        set({
          user: data.data as User,
          authenticating: false,
          error: null,
        });
      },
      onError: (error) => {
        set({
          user: null,
          authenticating: false,
          error: error?.response?.data?.message || "Authentication check failed",
        });
      },
      showToast: false,
    });
  },
}));
