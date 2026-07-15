import { Construction, Clock, Settings } from 'lucide-react';
import MainLayout from '../layout/MainLayout';

const UnderConstruction = () => {
  return (
   <MainLayout>
     <div className=" bg-background dark:bg-background-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction className="w-12 h-12 text-primary" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Under Construction
        </h1>

        {/* Description */}
        <p className="text-text-secondary mb-6">
          This page is currently being built. We'll be back soon!
        </p>

        {/* Status indicators */}
        <div className="flex items-center justify-center space-x-6 text-sm text-text-secondary">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-primary" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <Settings size={16} className="text-primary" />
            <span>Coming Soon</span>
          </div>
        </div>

        {/* Animated progress bar */}
        <div className="mt-8 w-full bg-surface-secondary rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse"
               style={{ width: '60%' }} />
        </div>

        <p className="mt-4 text-xs text-text-secondary">
          Estimated completion: Soon
        </p>
      </div>
    </div>
   </MainLayout>
  );
};

export default UnderConstruction;