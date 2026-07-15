export interface RequestOTPRequest {
  email: string;
}

export interface RequestOTPResponse {
  message: string;
  email: string;
  expiresIn: number; // in seconds
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  token: string;
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface PasswordResetState {
  loading: boolean;
  error: string | null;
  email: string;
  token: string;
  step: 'request' | 'verify' | 'reset';
}