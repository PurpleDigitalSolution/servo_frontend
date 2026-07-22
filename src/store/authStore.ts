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
  changeDefaultPassword: (userId: string,newPassword: string) => Promise<ResponseData>;
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

  login: async (payload) => {
    set({ loading: true, error: null });

    let response: ResponseData = {
      success: false,
      message: "Login failed",
    };

    await handleRequest({
      request: () => api.post("/auth/admin/login", payload),
      onSuccess: (data) => {
        const responseData = data as {
          data?: { user?: User; mustChangePassword?: boolean };
        };

        const route = responseData.data?.mustChangePassword
          ? "/auth/change-password"
          : responseData.data?.user?.role === "ADMIN" ||
              responseData.data?.user?.role === "SUPER_ADMIN"
            ? "/dashboard"
            : "/dashboard";
        response = {
          success: true,
          message: data.message || "Login successful",
          route: route,
        };
        set({
          user: responseData.data?.user ?? null,
          authenticated: true,
          loading: false,
          error: null,
          mustChangePassword: responseData.data?.mustChangePassword || false,
        });
      },
      onError: (error) => {
        response = {
          success: false,
          message: error?.response?.data?.message || "Login failed",
          errors: error?.response?.data?.errors,
        };
        set({
          loading: false,
          authenticated: false,
          error: response.message,
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
        get().reset();
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
    set({ ...initialState });
  },

  checkAuthentication: async () => {
    set({ loading: true, isCheckingAuth: true });

    await handleRequest({
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
      },
      showToast: false,
    });
  },

  requestPasswordReset: async (email) => {
    let response: ResponseData = {
      success: false,
      message: "Password reset request failed",
    };

    await handleRequest({
      request: () => api.post("/auth/request-password-reset", { email }),
      onSuccess: (data) => {
        response = {
          success: true,
          message: data.message || "Password reset request successful",
        };
      },
      onError: (error) => {
        response = {
          success: false,
          message:
            error?.response?.data?.message || "Password reset request failed",
        };
      },
      showToast: true,
    });

    return response;
  },

  verifyOTP: async (email, otp, purpose) => {
    let response: ResponseData = {
      success: false,
      message: "OTP verification failed",
    };

    await handleRequest({
      request: () => api.post("/auth/verify-otp", { email, otp, purpose }),
      onSuccess: (data) => {
        response = {
          success: true,
          message: data.message || "OTP verification successful",
        };
      },
      onError: (error) => {
        response = {
          success: false,
          message: error?.response?.data?.message || "OTP verification failed",
        };
      },
      showToast: true,
    });

    return response;
  },

  resetPassword: async (newPassword, token) => {
    let response: ResponseData = {
      success: false,
      message: "Password reset failed",
    };

    await handleRequest({
      request: () => api.post("/auth/reset-password", { newPassword, token }),
      onSuccess: (data) => {
        response = {
          success: true,
          message: data.message || "Password reset successful",
        };
      },
      onError: (error) => {
        response = {
          success: false,
          message: error?.response?.data?.message || "Password reset failed",
        };
      },
      showToast: true,
    });

    return response;
  },
  changeDefaultPassword: async (userId: string, newPassword: string) => {
    let response: ResponseData = {
      success: false,
      message: "Password change failed",
    };
    await handleRequest({
      request: () =>
        api.post("/auth/change-default-password", {
          newPassword,
          userId,
        }),
      onSuccess: (data) => {
        response = {
          success: true,
          message: data.message || "Password change successful",
        };
      },
      onError: (error) => {
        response = {
          success: false,
          message: error?.response?.data?.message || "Password change failed",
        };
      },
      showToast: true,
    });
    return response;
  },
}));
