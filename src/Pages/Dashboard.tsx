import MainLayout from '../layout/MainLayout';
import { BarChart3, Clock, Settings, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[70vh] p-4">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-12 h-12 text-primary" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Dashboard
          </h1>

          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm mb-4">
            <Clock size={14} />
            <span>Coming Soon</span>
          </div>

          {/* Description */}
          <p className="text-text-secondary mb-6">
            We're working on building an amazing dashboard experience for you.
            Check back soon for real-time analytics and insights.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <div className="bg-surface p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-2 text-text-secondary">
                <Settings size={16} className="text-primary" />
                <span className="text-sm">In Development</span>
              </div>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-2 text-text-secondary">
                <AlertCircle size={16} className="text-primary" />
                <span className="text-sm">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Animated progress bar */}
          <div className="mt-8 w-full bg-surface-secondary rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full animate-pulse"
              style={{ width: '45%' }}
            />
          </div>

          <p className="mt-3 text-xs text-text-secondary">
            Estimated completion: Q3 2026
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;