import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  RefreshCw,
  UserPlus,
  Users,
  ChevronRight,
  Edit,
  XCircle,
  CheckCircle,
} from "lucide-react";

interface StationActionsMenuProps {
  isAvailable: boolean;
  isLoading?: boolean;
  isUpdating?: boolean;
  onRefresh: () => void;
  onAddAgent: () => void;
  onViewAgents: () => void;
  onEditStation: () => void;
  onStatusToggle: () => void;
  children?: React.ReactNode;
}

const StationActionsMenu: React.FC<StationActionsMenuProps> = ({
  isAvailable,
  isLoading = false,
  isUpdating = false,
  onRefresh,
  onAddAgent,
  onViewAgents,
  onEditStation,
  onStatusToggle,
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {children ? (
        <div onClick={() => setIsMenuOpen(!isMenuOpen)}>{children}</div>
      ) : (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm"
        >
          <MoreVertical size={18} />
          <span>Actions</span>
        </button>
      )}

      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-surface rounded-lg border border-border shadow-lg py-1 z-50">
          <button
            onClick={() => handleAction(onRefresh)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={() => handleAction(onAddAgent)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <UserPlus size={16} />
            <span>Add Agent</span>
          </button>

          <button
            onClick={() => handleAction(onViewAgents)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <Users size={16} />
            <span>Agent List</span>
            <ChevronRight size={14} className="ml-auto text-text-secondary" />
          </button>

          <button
            onClick={() => handleAction(onEditStation)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <Edit size={16} />
            <span>Edit Station</span>
          </button>

          <div className="my-1 border-t border-border" />

          <button
            onClick={() => handleAction(onStatusToggle)}
            disabled={isUpdating}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
              isAvailable
                ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isUpdating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Updating...</span>
              </>
            ) : isAvailable ? (
              <>
                <XCircle size={16} />
                <span>Mark Unavailable</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                <span>Mark Available</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default StationActionsMenu;