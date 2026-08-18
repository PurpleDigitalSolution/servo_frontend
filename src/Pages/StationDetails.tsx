import { useEffect, useState, useCallback } from "react";
import MainLayout from "../layout/MainLayout";
import { useStationStore, type Station } from "../store/stationStore";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  AlertCircle,
  Calendar,
  CheckCircle,
  RefreshCw,
  Fuel,
  Navigation,
  ArrowLeft,
} from "lucide-react";
import Loader from "../components/Loader";
import AssignStationAgent from "../components/modal/AssignStationAgent";
import EditStationModal from "../components/modal/EditStation";
import StationActionsMenu from "../components/StationActionsMenu";

const StationDetails = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { getStation, updateStationStatus } = useStationStore();

  const [station, setStation] = useState<Station | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [showAssignAgentModal, setShowAssignAgentModal] =
    useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Fetch station details
  const fetchStationDetails = useCallback(
    async (id: string) => {
      if (!id) {
        setError("Station ID is required");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await getStation(id);
        if (res.success && res.data) {
          setStation(res.data);
        } else {
          setError(res.message || "Failed to fetch station details");
        }
      } catch (error: unknown) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch station details",
        );
      } finally {
        setLoading(false);
      }
    },
    [getStation],
  );
  const handleNavigateBack = () => {
    navigate(-1);
  };
  // Handle status toggle
  const handleStatusToggle = async () => {
    if (!station) return;

    setUpdatingStatus(true);
    try {
      const newStatus = !station.isAvailable;
      const res = await updateStationStatus(station.id, newStatus);

      if (res.success) {
        setStation(res.data || { ...station, isAvailable: newStatus });
        // Refresh the page data
        setRefreshKey((prev) => prev + 1);
      } else {
        setError(res.message || "Failed to update station status");
      }
    } catch (error: unknown) {
      setError((error as Error).message || "Failed to update station status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (stationId) {
      fetchStationDetails(stationId);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (stationId) {
      setTimeout(() => {
        fetchStationDetails(stationId);
      }, 100);
    } else {
      setTimeout(() => {
        setError("No station ID provided");
      }, 100);
    }
  }, [stationId, fetchStationDetails, refreshKey]);

  // Formatting helpers
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const formatTime = (time: Date | string | null | undefined) => {
    if (!time) return "N/A";
    try {
      return new Date(time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const formatCoordinate = (coord: number | string | null | undefined) => {
    if (coord === null || coord === undefined) return "N/A";
    return typeof coord === "number" ? coord.toFixed(6) : coord;
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader size="xl" text="Loading station details..." />
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Something went wrong
            </h3>
            <p className="text-text-secondary mb-4">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Retry
              </button>
              <Link
                to="/stations"
                className="px-4 py-2 bg-surface border border-border text-text-primary rounded-lg hover:bg-surface-secondary transition-colors"
              >
                Back to Stations
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Not found state
  if (!station) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Station Not Found
            </h3>
            <p className="text-text-secondary mb-4">
              The station you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/stations"
              className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Back to Stations
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-row sm:items-center sm:just justify-between gap-4 mb-6">
          <button
            onClick={handleNavigateBack}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft size={20} />
            <span>Back to Stations</span>
          </button>

          <StationActionsMenu
            isAvailable={station.isAvailable}
            isLoading={loading}
            isUpdating={updatingStatus}
            onRefresh={handleRefresh}
            onAddAgent={() => setShowAssignAgentModal(true)}
            onViewAgents={() => navigate(`/stations/${station.id}/agents`)}
            onEditStation={() => setShowEditModal(true)}
            onStatusToggle={handleStatusToggle}
          />
        </div>

        {/* Station Details Card */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-border bg-surface-secondary/50">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-text-primary truncate">
                    {station.name}
                  </h1>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${
                      station.isAvailable
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {station.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin
                    size={16}
                    className="text-text-secondary flex-shrink-0"
                  />
                  <span className="text-text-secondary text-sm truncate">
                    {station.addressStreet}, {station.addressCity},{" "}
                    {station.addressState}, {station.addressCountry}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() =>
                    window.open(
                      `https://maps.google.com/maps?q=${station.latitude},${station.longitude}`,
                      "_blank",
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  <Navigation size={14} />
                  <span>Directions</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-surface-secondary rounded-lg p-3 text-center">
                <p className="text-xs text-text-secondary">Fuel Types</p>
                <p className="text-lg font-bold text-text-primary mt-0.5">
                  {station.fuelTypes?.length || 0}
                </p>
              </div>
              <div className="bg-surface-secondary rounded-lg p-3 text-center">
                <p className="text-xs text-text-secondary">Status</p>
                <p
                  className={`text-lg font-bold mt-0.5 ${
                    station.isAvailable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {station.isAvailable ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="bg-surface-secondary rounded-lg p-3 text-center">
                <p className="text-xs text-text-secondary">Hours</p>
                <p className="text-sm font-bold text-text-primary mt-0.5">
                  {station.is24h ? "24/7" : "Limited"}
                </p>
              </div>
              <div className="bg-surface-secondary rounded-lg p-3 text-center">
                <p className="text-xs text-text-secondary">Agents</p>
                <p className="text-lg font-bold text-text-primary mt-0.5">
                  {/* {station.agentCount || 0} */}
                </p>
              </div>
            </div>

            {/* Location & Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  Location Details
                </h3>
                <div className="bg-surface-secondary rounded-lg p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Latitude:</span>
                    <span className="text-text-primary font-mono">
                      {formatCoordinate(station.latitude)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Longitude:</span>
                    <span className="text-text-primary font-mono">
                      {formatCoordinate(station.longitude)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-1 border-t border-border">
                    <span className="text-text-secondary">Address:</span>
                    <span className="text-text-primary text-right max-w-[60%]">
                      {station.addressStreet}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  Operating Hours
                </h3>
                <div className="bg-surface-secondary rounded-lg p-3">
                  {station.is24h ? (
                    <div className="flex items-center justify-center gap-2 py-2">
                      <Clock size={20} className="text-primary" />
                      <span className="text-text-primary font-semibold">
                        24 Hours / 7 Days
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Opens:</span>
                        <span className="text-text-primary font-medium">
                          {formatTime(station.openTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Closes:</span>
                        <span className="text-text-primary font-medium">
                          {formatTime(station.closeTime)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fuel Types and Prices */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <Fuel size={16} className="text-primary" />
                Fuel Types & Prices
              </h3>
              <div className="bg-surface-secondary rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-secondary/80">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Fuel Type
                      </th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Price (per liter)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {station.fuelTypes && station.fuelTypes.length > 0 ? (
                      station.fuelTypes.map((fuel) => (
                        <tr
                          key={fuel}
                          className="hover:bg-surface-secondary/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-text-primary font-medium">
                            {fuel.replace("_", " ")}
                          </td>
                          <td className="px-4 py-3 text-sm text-text-primary text-right font-mono">
                            {station.prices &&
                            station.prices[fuel] !== undefined
                              ? formatCurrency(station.prices[fuel])
                              : "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-6 text-sm text-text-secondary text-center"
                        >
                          No fuel types available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-text-secondary" />
                <span>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(station.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-text-secondary" />
                <span>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {formatDate(station.updatedAt)}
                </span>
              </div>
            </div>

            {/* Status Details */}
            <div className="bg-surface-secondary rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Station ID:</span>
                  <span className="text-text-primary font-mono text-xs bg-surface px-2 py-1 rounded">
                    {station.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Current Status:</span>
                  <span
                    className={`font-medium px-2 py-1 rounded ${
                      station.isAvailable
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {station.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div
              className={`rounded-lg p-4 border ${
                station.isAvailable
                  ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                  : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {station.isAvailable ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${
                        station.isAvailable
                          ? "text-green-700 dark:text-green-300"
                          : "text-yellow-700 dark:text-yellow-300"
                      }`}
                    >
                      {station.isAvailable
                        ? " This station is currently available for customers"
                        : " This station is currently unavailable"}
                    </p>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {station.isAvailable
                        ? "Customers can view this station and its prices"
                        : "Mark as available to make it visible to customers"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleStatusToggle}
                  disabled={updatingStatus}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    station.isAvailable
                      ? "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                      : "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {updatingStatus ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="animate-spin inline mr-2"
                      />
                      Updating...
                    </>
                  ) : station.isAvailable ? (
                    "Mark as Unavailable"
                  ) : (
                    "Mark as Available"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showAssignAgentModal && (
          <AssignStationAgent
            isOpen={showAssignAgentModal}
            onClose={() => setShowAssignAgentModal(false)}
            stationId={station.id}
          />
        )}

        {showEditModal && (
          <EditStationModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            station={station}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default StationDetails;
