import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { useStationStore, type Station } from "../store/stationStore";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertCircle,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import Loader from "../components/Loader";

const StationDetails = () => {
  const { getStation, updateStationStatus } = useStationStore();
  const { stationId } = useParams<{ stationId: string }>();
  const [station, setStation] = useState<Station | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  const fetchStationDetails = async (id: string) => {
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
      setError(error instanceof Error ? error.message : "Failed to fetch station details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!station) return;

    setUpdatingStatus(true);
    try {
      const newStatus = !station.isAvailable;
      const res = await updateStationStatus(station.id, newStatus);

      if (res.success) {
        setStation(res.data || { ...station, isAvailable: newStatus });
      } else {
        setError(res.message || "Failed to update station status");
      }
    } catch (error: unknown) {
      setError((error as Error).message || "Failed to update station status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
   setTimeout(()=>{
     if (stationId) {
      fetchStationDetails(stationId);
    } else {
      setError("No station ID provided");
    }
   },0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId]);

  // Helper function to format date
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleString();
    } catch {
      return 'N/A';
    }
  };

  // Helper function to format time
  const formatTime = (time: Date | string | null | undefined) => {
    if (!time) return 'N/A';
    try {
      return new Date(time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  // Helper function to format coordinates
  const formatCoordinate = (coord: number | string | null | undefined) => {
    if (coord === null || coord === undefined) return 'N/A';
    return typeof coord === 'number' ? coord.toFixed(4) : coord;
  };

  if (loading) {
    return (
      <MainLayout>
       <Loader className="my-10" size="xl" text="loading station"/>
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
            <Link
              to="/stations"
              className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Back to Stations
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!station) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-text-secondary">No station found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Link
            to="/stations"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Stations</span>
          </Link>

          {/* Status Toggle Button */}
          <button
            onClick={handleStatusToggle}
            disabled={updatingStatus}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm ${
              station.isAvailable
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {updatingStatus ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Updating...</span>
              </>
            ) : station.isAvailable ? (
              <>
                <XCircle size={18} />
                <span>Mark as Unavailable</span>
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                <span>Mark as Available</span>
              </>
            )}
          </button>
        </div>

        {/* Station Details */}
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  {station.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin size={16} className="text-text-secondary flex-shrink-0" />
                  <span className="text-text-secondary text-sm">
                    {station.addressStreet}, {station.addressCity}, {station.addressState}, {station.addressCountry}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                    station.isAvailable
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {station.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-text-secondary">Coordinates</h3>
                <div className="bg-surface-secondary rounded-lg p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Latitude:</span>
                    <span className="text-text-primary font-mono">
                      {formatCoordinate(station.latitude)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-text-secondary">Longitude:</span>
                    <span className="text-text-primary font-mono">
                      {formatCoordinate(station.longitude)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-text-secondary">Operating Hours</h3>
                <div className="bg-surface-secondary rounded-lg p-3">
                  {station.is24h ? (
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-text-secondary" />
                      <span className="text-text-primary font-medium">24 Hours</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-text-secondary" />
                        <span className="text-text-primary">
                          Open: {formatTime(station.openTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-6">
                        <span className="text-text-primary">
                          Close: {formatTime(station.closeTime)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fuel Types and Prices */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3">Fuel Types & Prices</h3>
              <div className="bg-surface-secondary rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-surface-secondary">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase">Fuel Type</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-text-secondary uppercase">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {station.fuelTypes && station.fuelTypes.length > 0 ? (
                      station.fuelTypes.map((fuel) => (
                        <tr key={fuel}>
                          <td className="px-4 py-3 text-sm text-text-primary">
                            {fuel.replace('_', ' ')}
                          </td>
                          <td className="px-4 py-3 text-sm text-text-primary text-right font-mono">
                            {station.prices && station.prices[fuel] !== undefined
                              ? `₦${station.prices[fuel].toFixed(2)}`
                              : 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-3 text-sm text-text-secondary text-center">
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
                  <span className="font-medium">Created:</span>{' '}
                  {formatDate(station.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-text-secondary" />
                <span>
                  <span className="font-medium">Last Updated:</span>{' '}
                  {formatDate(station.updatedAt)}
                </span>
              </div>
            </div>

            {/* Status Details */}
            <div className="bg-surface-secondary rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-text-secondary">Station ID:</span>
                  <span className="text-text-primary ml-2 font-mono text-xs">
                    {station.id}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Current Status:</span>
                  <span className={`ml-2 font-medium ${
                    station.isAvailable ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {station.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className={`rounded-lg p-4 border ${
              station.isAvailable
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {station.isAvailable ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  )}
                  <div>
                    <p className={`font-medium ${
                      station.isAvailable
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {station.isAvailable
                        ? 'This station is currently available for customers'
                        : 'This station is currently unavailable'
                    }
                    </p>
                    <p className="text-sm text-text-secondary">
                      {station.isAvailable
                        ? 'Customers can find this station and view its prices'
                        : 'Mark this station as available to make it visible to customers'
                    }
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleStatusToggle}
                  disabled={updatingStatus}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    station.isAvailable
                      ? 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                      : 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {updatingStatus ? (
                    <>
                      <RefreshCw size={16} className="animate-spin inline mr-2" />
                      Updating...
                    </>
                  ) : station.isAvailable ? (
                    'Mark as Unavailable'
                  ) : (
                    'Mark as Available'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StationDetails;