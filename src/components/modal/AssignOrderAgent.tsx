import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  User,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAgentStore } from "../../store/agentStore";

interface AssignAgentModalProps {
  stationId: string;
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  currentAgentId?: string | null;
  onAssign: (orderId: string, agentId: string) => Promise<boolean | undefined>;
  loading?: boolean;
}

interface Agent {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  workStatus: string | null;
}

const AssignAgentModal = ({
  stationId,
  isOpen,
  onClose,
  orderId,
  currentAgentId,
  onAssign,
  loading = false,
}: AssignAgentModalProps) => {
  const {
    getStationAvailableAgents,
    loading: storeLoading,
    error: storeError,
  } = useAgentStore();
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(
    currentAgentId || null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);

  const fetchAgents = async () => {
    if (!stationId) return;
    setIsLoadingAgents(true);
    setError(null);
    try {
      const response = await getStationAvailableAgents(stationId);
      if (response.success && response.data) {
        // Extract agents from the response data
        const agents =
          response.data.availableAgents ||
          response.data.agents ||
          response.data;
        setAvailableAgents(Array.isArray(agents) ? agents : []);
      } else {
        setAvailableAgents([]);
        setError(response.message || "Failed to fetch available agents");
      }
    } catch (err) {
      console.error("Error fetching agents:", err);
      setError("Failed to fetch available agents");
      setAvailableAgents([]);
    } finally {
      setIsLoadingAgents(false);
    }
  };

  useEffect(() => {
    if (isOpen && stationId) {
      setTimeout(() => {
        fetchAgents();
      }, 100);
    }
  }, [isOpen, stationId]);

  const filteredAgents = availableAgents.filter((agent) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      agent.fullName?.toLowerCase().includes(term) ||
      agent.email?.toLowerCase().includes(term) ||
      agent.phoneNumber?.includes(term)
    );
  });

  const handleAssign = async () => {
    if (!selectedAgentId) {
      setError("Please select an agent");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await onAssign(orderId, selectedAgentId);
      if (response) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign agent");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedAgentId(currentAgentId || null);
    setSearchTerm("");
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    if (!isSubmitting && !loading) {
      resetForm();
      onClose();
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string | null) => {
    if (status === "AVAILABLE" || status === "ACTIVE") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
          <CheckCircle size={10} />
          Available
        </span>
      );
    }
    return null;
  };

  if (!isOpen) return null;

  const isLoading = isLoadingAgents || storeLoading;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="relative bg-surface rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-surface border-b border-border z-10 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Assign Agent
              </h2>
              <p className="text-sm text-text-secondary">
                Select an available agent to assign to this order
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-surface-secondary rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={20} className="text-text-secondary" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Agent assigned successfully!
                </p>
              </div>
            )}

            {/* Error Message */}
            {(error || storeError) && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error || storeError || "Failed to assign agent"}
                </p>
              </div>
            )}

            {/* Current Assignment */}
            {currentAgentId && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Currently assigned agent will be replaced
                </p>
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
              />
              <input
                type="text"
                placeholder="Search agents by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary placeholder-text-secondary"
                disabled={isLoading || isSubmitting}
              />
            </div>

            {/* Agents List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredAgents.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredAgents.map((agent) => {
                  const isSelected = selectedAgentId === agent.id;
                  const isCurrent = currentAgentId === agent.id;
                  const initials = getInitials(agent.fullName || "");

                  return (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgentId(agent.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-surface-secondary"
                      }`}
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {initials}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {agent.fullName}
                            {isCurrent && (
                              <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-normal">
                                (Current)
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-text-secondary">
                            <span className="flex items-center gap-1">
                              <Mail size={12} />
                              {agent.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={12} />
                              {agent.phoneNumber || "N/A"}
                            </span>
                          </div>
                          {getStatusBadge(agent.workStatus)}
                        </div>
                      </div>
                      {isSelected ? (
                        <UserCheck className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <User className="w-5 h-5 text-text-secondary flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserX className="w-12 h-12 text-text-secondary mx-auto mb-2" />
                <p className="text-text-secondary">
                  {searchTerm
                    ? "No agents found matching your search"
                    : "No available agents at this station"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-sm text-primary hover:text-primary-hover"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-surface border-t border-border px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-border rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAssign}
              disabled={
                !selectedAgentId || isSubmitting || success || isLoading
              }
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Assigning...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Assigned!
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  Assign Agent
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignAgentModal;
