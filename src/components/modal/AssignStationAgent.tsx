import { useEffect, useState, useMemo, useCallback } from "react";
import { useAgentStore } from "../../store/agentStore";
import {
  Search,
  User,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  UserX,
  X,
  Users,
} from "lucide-react";

interface AssignStationAgentProps {
  isOpen: boolean;
  onClose: () => void;
  stationId: string;
}

const AssignStationAgent = ({
  isOpen,
  onClose,
  stationId,
}: AssignStationAgentProps) => {
  const { agents, loading, error, fetchFreeAgents, assignAgentsToStation } =
    useAgentStore();

  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(
    () => new Set(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen) {
        if (stationId) {
          fetchFreeAgents();
        } else {
          console.log("Station ID is required to fetch free agents");
        }

        setSearchTerm("");
        setIsSubmitting(false);
        setSuccess(false);
        setSubmitError(null);
      }
    };
    fetchData();
  }, []);
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  // Memoized search filtering
  const filteredAgents = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return agents;
    return agents.filter(
      (agent) =>
        agent.fullName?.toLowerCase().includes(term) ||
        agent.email?.toLowerCase().includes(term) ||
        agent.phoneNumber?.includes(term),
    );
  }, [agents, searchTerm]);

  const toggleAgent = useCallback((agentId: string) => {
    setSelectedAgents((prev) => {
      const next = new Set(prev);
      if (next.has(agentId)) {
        next.delete(agentId);
      } else {
        next.add(agentId);
      }
      return next;
    });
  }, []);

  const selectAllFiltered = useCallback(() => {
    setSelectedAgents((prev) => {
      const next = new Set(prev);
      filteredAgents.forEach((a) => next.add(a.id));
      return next;
    });
  }, [filteredAgents]);

  const deselectAll = useCallback(() => {
    setSelectedAgents(new Set());
  }, []);

  const handleAssign = async () => {
    if (selectedAgents.size === 0 || !stationId) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSuccess(false);

    try {
      const agentIds = Array.from(selectedAgents);
      const res = await assignAgentsToStation(stationId, agentIds);
      if (res.success) {
        setSuccess(true);
        console.log("Agents assigned successfully", agentIds);
        onClose();
      } else {
        setSubmitError(res.message || "Failed to assign agents");
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to assign agents",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return "AG";
    return fullName
      .split(" ")
      .filter(Boolean)
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStatusBadge = (status: string | null) => {
    if (status === "ACTIVE") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full font-medium">
          <CheckCircle size={10} />
          Active
        </span>
      );
    }
    if (status === "INACTIVE") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 rounded-full font-medium">
          <XCircle size={10} />
          Inactive
        </span>
      );
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative bg-surface rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              Assign Station Agents
            </h2>
            <p className="text-sm text-text-secondary">
              Select agents to assign to this station
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="p-2 hover:bg-surface-secondary rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
                <p className="text-text-secondary">Loading agents...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={() => fetchFreeAgents()}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Feedback Notifications */}
              {success && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                  <p className="text-sm text-green-700 dark:text-green-100 font-medium">
                    {selectedAgents.size} agent
                    {selectedAgents.size !== 1 ? "s" : ""} assigned
                    successfully!
                  </p>
                </div>
              )}

              {submitError && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-100">
                    {submitError}
                  </p>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search agents by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary placeholder-text-secondary"
                    disabled={isSubmitting || success}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllFiltered}
                    disabled={
                      filteredAgents.length === 0 || isSubmitting || success
                    }
                    className="px-3 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAll}
                    disabled={
                      selectedAgents.size === 0 || isSubmitting || success
                    }
                    className="px-3 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Agent List */}
              {filteredAgents.length > 0 ? (
                <div className="bg-surface-secondary rounded-lg border border-border overflow-hidden max-h-[280px] overflow-y-auto">
                  <div className="divide-y divide-border">
                    {filteredAgents.map((agent) => {
                      const isSelected = selectedAgents.has(agent.id);
                      const initials = getInitials(agent.fullName);

                      return (
                        <button
                          key={agent.id}
                          type="button"
                          onClick={() => toggleAgent(agent.id)}
                          disabled={isSubmitting || success}
                          className={`w-full text-left p-3 transition-colors flex items-center justify-between ${
                            isSelected
                              ? "bg-primary/10 dark:bg-primary/20"
                              : "hover:bg-surface-secondary"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-medium text-primary">
                                {initials}
                              </span>
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-text-primary truncate">
                                  {agent.fullName}
                                </p>
                                {renderStatusBadge(agent.workStatus)}
                              </div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary mt-0.5">
                                {agent.email && (
                                  <span className="flex items-center gap-1 truncate">
                                    <Mail size={12} className="shrink-0" />
                                    {agent.email}
                                  </span>
                                )}
                                {agent.phoneNumber && (
                                  <span className="flex items-center gap-1 shrink-0">
                                    <Phone size={12} className="shrink-0" />
                                    {agent.phoneNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 ml-3">
                            {isSelected ? (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            ) : (
                              <User className="w-5 h-5 text-text-secondary" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-surface-secondary rounded-lg border border-border">
                  <UserX className="w-12 h-12 text-text-secondary mx-auto mb-2" />
                  <p className="text-text-secondary font-medium">
                    No agents found
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "No agents are available for assignment"}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-2 text-sm text-primary hover:text-primary-hover font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}

              {/* Counter */}
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  {selectedAgents.size} agent
                  {selectedAgents.size !== 1 ? "s" : ""} selected
                </span>
                <span className="text-text-secondary">
                  {filteredAgents.length} agent
                  {filteredAgents.length !== 1 ? "s" : ""} available
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-surface border-t border-border px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end shrink-0">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 border border-border rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={
              selectedAgents.size === 0 || isSubmitting || success || loading
            }
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
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
                <Users className="w-4 h-4" />
                Assign{" "}
                {selectedAgents.size > 0 ? `(${selectedAgents.size})` : ""}{" "}
                Agent{selectedAgents.size !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignStationAgent;
