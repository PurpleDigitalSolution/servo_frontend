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
  login: (payload: {
    email: string;
    password: string;
  }) => Promise<ResponseData>;
  logout: () => Promise<ResponseData>;
  reset: () => void;
  checkAuthentication: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<ResponseData>;
  verifyOTP: (
    email: string,
    otp: string,
    purpose: string,
  ) => Promise<ResponseData>;
  resetPassword: (password: string, token: string) => Promise<ResponseData>;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  authenticated: false,
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
    let response: ResponseData = {
      success: false,
      message: "Login failed",
    };

    await handleRequest({
      request: () => api.post("/auth/admin/login", payload),
      onSuccess: (data) => {
        response = {
          success: true,
          message: data.message || "Login successful",
          route: "/dashboard",
        };
        const responseData = data as { data?: { user?: User } };
        set({
          user: responseData.data?.user ?? null,
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
  logout: async () => {
    let response: ResponseData = {
      success: false,
      message: "Logout failed",
    };
    await handleRequest({
      request: () => api.post("/auth/logout"),
      onSuccess: (data) => {
        const { reset } = get();
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
          error:
            error?.response?.data?.message || "Authentication check failed",
        });
      },
      showToast: false,
    });
  },
  requestPasswordReset: async (email: string): Promise<ResponseData> => {
    return await new Promise<ResponseData>((resolve) => {
      handleRequest({
        request: () => api.post("/auth/request-password-reset", { email }),
        onSuccess: (data) => {
          resolve({
            success: true,
            message: data.message || "Password reset request successful",
          });
        },
        onError: (error) => {
          resolve({
            success: false,
            message:
              error?.response?.data?.message || "Password reset request failed",
          });
        },
        showToast: true,
      });
    });
  },
  verifyOTP: async (
    email: string,
    otp: string,
    purpose: string,
  ): Promise<ResponseData> => {
    return await new Promise<ResponseData>((resolve) => {
      handleRequest({
        request: () => api.post("/auth/verify-otp", { email, otp, purpose }),
        onSuccess: (data) => {
          resolve({
            success: true,
            message: data.message || "OTP verification successful",
          });
        },
        onError: (error) => {
          resolve({
            success: false,
            message:
              error?.response?.data?.message || "OTP verification failed",
          });
        },
        showToast: true,
      });
    });
  },
  resetPassword: (newPassword: string, token: string) => {
    return new Promise((resolve) => {
      handleRequest({
        request: () => api.post("/auth/reset-password", { newPassword, token }),
        onSuccess: (data) => {
          resolve({
            success: true,
            message: data.message || "",
          });
        },
        onError: (error) => {
          resolve({
            success: false,
            message: error.response?.data?.message || "Password reset failed",
          });
        },
        showToast: true,
      });
    });
  },
}));
