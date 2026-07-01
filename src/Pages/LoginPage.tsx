import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fuel, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorState, setErrorState] = useState<{ field: string; message: string }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear field-specific error when user types
    if (errorState.length > 0) {
      setErrorState(prev => prev.filter(err => err.field !== name));
    }
  };

  const getErrorField = (fieldName: string) => {
    return errorState.find(err => err.field === fieldName)?.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorState([]);
    setIsLoading(true);

    try {
      const res = await login({
        email: formData.email,
        password: formData.password
      });

      if (res.success) {
        navigate(res.route || '/dashboard');
      } else {
        if (res.errors && res.errors.length > 0) {
          setErrorState(res.errors);
          // Set the first error as the main error message
          setError(res.errors[0].message);
        } else {
          setError(res.message || 'Login failed. Please try again.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Fuel size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Servo</h1>
          </div>
          <p className="text-text-secondary text-sm">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface rounded-lg shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-text-secondary" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`
                    w-full pl-10 pr-3 py-2.5 bg-surface-secondary border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                    text-text-primary placeholder-text-secondary
                    ${getErrorField('email')
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-border'
                    }
                  `}
                  placeholder="admin@example.com"
                />
              </div>
              {getErrorField('email') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {getErrorField('email')}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-text-secondary" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`
                    w-full pl-10 pr-10 py-2.5 bg-surface-secondary border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                    text-text-primary placeholder-text-secondary
                    ${getErrorField('password')
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-border'
                    }
                  `}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {getErrorField('password') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {getErrorField('password')}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50"
                />
                Remember me
              </label>
              <a href="#" className="text-sm text-primary hover:text-primary-hover">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-text-secondary mt-6">
            Don't have an account?{' '}
            <a href="#" className="text-primary hover:text-primary-hover font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;