import { create } from "zustand";
import type { User } from "../interface/user.interface";
import api from "../lib/axios";
import { handleRequest } from "../lib/request";

interface ResponseData {
  success: boolean;
  message: string;
  route?: string;
  errors?: { field: string; message: string }[];
}

interface AuthState {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  mustChangePassword?: boolean;
}

interface AuthStateAction {
  login: (payload: { email: string; password: string }) => Promise<ResponseData>;
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
  changeDefaultPassword: (
    userId: string,
    newPassword: string,
  ) => Promise<ResponseData>;
}

const initialState: AuthState = {
  user: null,
  isCheckingAuth: false,
  loading: false,
  authenticated: false,
  error: null,
  mustChangePassword: false,
};

export const useAuthStore = create<AuthState & AuthStateAction>((set, get) => ({
  ...initialState,

  login: (payload) => {
    set({ loading: true, error: null });

    return new Promise<ResponseData>((resolve) => {
      handleRequest({
        request: () => api.post("/auth/admin/login", payload),
        onSuccess: (data) => {
          const responseData = data as {
            data?: { user?: User; mustChangePassword?: boolean };
          };

          const route = responseData.data?.mustChangePassword
            ? "/auth/change-password"
            : "/dashboard";

          set({
            user: responseData.data?.user ?? null,
            authenticated: true,
            loading: false,
            error: null,
            mustChangePassword: responseData.data?.mustChangePassword || false,
          });

          resolve({
            success: true,
            message: data.message || "Login successful",
            route,
          });
        },
        onError: (error) => {
          const failureMsg =
            error?.response?.data?.message || "Login failed";

          set({
            loading: false,
            authenticated: false,
            error: failureMsg,
          });

          resolve({
            success: false,
            message: failureMsg,
            errors: error?.response?.data?.errors,
          });
        },
        showToast: true,
      });
    });
  },

  logout: () => {
    return new Promise<ResponseData>((resolve) => {
      handleRequest({
        request: () => api.post("/auth/logout"),
        onSuccess: (data) => {
          get().reset();
          resolve({
            success: true,
            message: data.message || "Logout successful",
          });
        },
        onError: (error) => {
          resolve({
            success: false,
            message: error?.response?.data?.message || "Logout failed",
          });
        },
        showToast: true,
      });
    });
  },

  reset: () => {
    set({ ...initialState });
  },

  checkAuthentication: () => {
    set({ loading: true, isCheckingAuth: true });

    return new Promise<void>((resolve) => {
      handleRequest({
        request: () => api.get("/auth/authenticated"),
        onSuccess: (data) => {
          const responseData = data as {
            data?: User & { mustChangePassword?: boolean };
          };

          set({
            user: responseData.data as User,
            loading: false,
            authenticated: true,
            isCheckingAuth: false,
            error: null,
            mustChangePassword: responseData.data?.mustChangePassword || false,
          });

          resolve();
        },
        onError: (error) => {
          set({
            user: null,
            loading: false,
            isCheckingAuth: false,
            authenticated: false,
            error:
              error?.response?.data?.message || "Authentication check failed",
          });

          resolve();
        },
        showToast: false,
      });
    });
  },

  requestPasswordReset: (email) => {
    return new Promise<ResponseData>((resolve) => {
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

  verifyOTP: (email, otp, purpose) => {
    return new Promise<ResponseData>((resolve) => {
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

  resetPassword: (newPassword, token) => {
    return new Promise<ResponseData>((resolve) => {
      handleRequest({
        request: () => api.post("/auth/reset-password", { newPassword, token }),
        onSuccess: (data) => {
          resolve({
            success: true,
            message: data.message || "Password reset successful",
          });
        },
        onError: (error) => {
          resolve({
            success: false,
            message: error?.response?.data?.message || "Password reset failed",
          });
        },
        showToast: true,
      });
    });
  },

  changeDefaultPassword: (userId, newPassword) => {
    return new Promise<ResponseData>((resolve) => {
      handleRequest({
        request: () =>
          api.post("/auth/change-default-password", {
            newPassword,
            userId,
          }),
        onSuccess: (data) => {
          resolve({
            success: true,
            message: data.message || "Password change successful",
          });
        },
        onError: (error) => {
          resolve({
            success: false,
            message:
              error?.response?.data?.message || "Password change failed",
          });
        },
        showToast: true,
      });
    });
  },
}));