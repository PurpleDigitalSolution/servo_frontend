import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAgentStore } from "../store/agentStore";
import {
  ArrowLeft,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,

  Users,
  MapPin,
} from "lucide-react";

interface Agent {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  workStatus: string | null;
}

interface Station {
  id: string;
  name: string;
  addressStreet: string;
  addressCity: string;
}

const StationAgent = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { loading, error, getStationAgents, removeAgentFromStation } =
    useAgentStore();
  const [stationAgents, setStationAgents] = useState<Agent[]>([]);

  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [station, setStation] = useState<Station | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      if (stationId) {
        const res = await getStationAgents(stationId);
        if (res.success) {
          setStationAgents(res.data?.agents || []);
          // Extract station info from the response
          if (res.data?.station) {
            setStation({
              id: stationId,
              name: res.data.station.name || "Unknown Station",
              addressStreet: res.data.station.addressStreet || "",
              addressCity: res.data.station.addressCity || "",
            });
          }
        }
      }
    };
    fetchAgents();
  }, [stationId]);

  const handleRemoveAgent = async (agentId: string) => {
    if (!stationId) return;

    setIsRemoving(agentId);
    try {
      await removeAgentFromStation(stationId, agentId);
      // Refresh agents after removal
      const res = await getStationAgents(stationId);
      if (res.success) {
        setStationAgents(res.data?.agents || []);
      }
    } catch (err) {
      console.error("Error removing agent:", err);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleRefresh = async () => {
    if (stationId) {
      const res = await getStationAgents(stationId);
      if (res.success) {
        setStationAgents(res.data?.agents || []);
        if (res.data?.station) {
          setStation({
            id: stationId,
            name: res.data.station.name || "Unknown Station",
            addressStreet: res.data.station.addressStreet || "",
            addressCity: res.data.station.addressCity || "",
          });
        }
      }
    }
  };

  const getStatusBadge = (status: string | null) => {
    if (status === "AVAILABLE" || status === "ACTIVE") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
          <CheckCircle size={12} />
          Available
        </span>
      );
    } else if (status === "BUSY" || status === "INACTIVE") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
          <XCircle size={12} />
          Busy
        </span>
      );
    } else if (status === "OFFLINE") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 rounded-full">
          <XCircle size={12} />
          Offline
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 rounded-full">
        <XCircle size={12} />
        Unknown
      </span>
    );
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Loading station agents...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <p className="mt-4 text-red-600 font-medium">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">


        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/stations/${stationId}`)}
              className="p-2 hover:bg-surface-secondary rounded-lg transition-colors text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                {station?.name || "Station Agents"}
              </h1>
              {station && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={14} className="text-text-secondary" />
                  <p className="text-sm text-text-secondary">
                    {station.addressStreet}, {station.addressCity}
                  </p>
                </div>
              )}
              <p className="text-sm text-text-secondary mt-0.5">
                Manage agents assigned to this station
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-sm text-text-secondary">Total Agents</p>
            <p className="text-2xl font-bold text-text-primary">
              {stationAgents.length}
            </p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-sm text-text-secondary">Available</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {
                stationAgents.filter(
                  (a) =>
                    a.workStatus === "AVAILABLE" || a.workStatus === "ACTIVE",
                ).length
              }
            </p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-sm text-text-secondary">Busy</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {
                stationAgents.filter(
                  (a) => a.workStatus === "BUSY" || a.workStatus === "INACTIVE",
                ).length
              }
            </p>
          </div>
        </div>

        {/* Agents List */}
        {stationAgents.length > 0 ? (
          <div className="bg-surface rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stationAgents.map((agent) => (
                    <tr
                      key={agent.id}
                      className="hover:bg-surface-secondary transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-primary">
                              {getInitials(agent.fullName)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">
                              {agent.fullName}
                            </p>
                            <p className="text-xs text-text-secondary">
                              ID: {agent.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-text-secondary">
                            <Mail size={14} className="text-text-secondary" />
                            <span>{agent.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-text-secondary">
                            <Phone size={14} className="text-text-secondary" />
                            <span>{agent.phoneNumber}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(agent.workStatus)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRemoveAgent(agent.id)}
                          disabled={isRemoving === agent.id}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 ml-auto"
                        >
                          {isRemoving === agent.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle size={16} />
                          )}
                          <span className="text-xs">
                            {isRemoving === agent.id ? "Removing..." : "Remove"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-border bg-surface-secondary flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {stationAgents.length} agent
                {stationAgents.length !== 1 ? "s" : ""} assigned
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-surface rounded-lg border border-border">
            <Users className="w-12 h-12 text-text-secondary mx-auto mb-3" />
            <p className="text-text-secondary font-medium">
              No agents assigned
            </p>
            <p className="text-sm text-text-secondary mt-1">
              This station doesn't have any agents assigned yet.
            </p>

          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StationAgent;