import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const NotFound = () => {
  const {user} = useAuthStore();
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10">
            <AlertCircle size={48} className="text-primary" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-text-primary mb-2">404</h1>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-text-primary mb-3">
          Page Not Found
        </h2>

        <p className="text-text-secondary mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Home Button */}
        <Link
          to={user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? "/dashboard" : "/dashboard"}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
        >
          <Home size={18} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;