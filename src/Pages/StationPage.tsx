import { useEffect, useState, useMemo, useCallback } from "react";
import MainLayout from "../layout/MainLayout";
import { useStationStore } from "../store/stationStore";
import { Plus, Filter, AlertCircle, Eye } from "lucide-react";
import Loader from "../components/Loader";
import AddStationModal from "../components/modal/CreateStation";
import type { StationList } from "../store/stationStore";
import { useNavigate } from "react-router-dom";
import SearchInput from "../components/SearchInput";

type SearchableStation = StationList &
  Record<string, string | number | boolean | null | undefined>;

const StationPage = () => {
  const navigate = useNavigate();
  const { fetchStations, fetchStationsResponse } = useStationStore();
  // const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailability, setFilterAvailability] = useState<boolean | "all">(
    "all",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [stationToDisplay, setStationToDisplay] = useState<StationList[] | []>(
    [],
  );
  // Get pagination data from API response
  const paginationData = useMemo(
    () =>
      fetchStationsResponse?.pagination || {
        currentPage: 0,
        totalPages: 0,
        totalStations: 0,
      },
    [fetchStationsResponse],
  );

  // Create a stable fetch function with useCallback
  const fetchStationsData = useCallback(
    async (page?: number, limit?: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchStations({
          page: page || currentPage,
          limit: limit || itemsPerPage,
          isAvailable:
            filterAvailability !== "all" ? filterAvailability : undefined,
        });
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage, filterAvailability, fetchStations],
  );

  // Fetch stations when page, itemsPerPage, or filters change
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchStationsData(currentPage, itemsPerPage);
    }, 300); // Debounce to avoid too many requests

    return () => window.clearTimeout(timeoutId);
  }, [currentPage, itemsPerPage, filterAvailability, fetchStationsData]);

  // Initial fetch
  useEffect(() => {
    setTimeout(() => {
      void fetchStationsData(1, itemsPerPage);
    }, 0);
  }, [itemsPerPage]);

  const stations: StationList[] = useMemo(() => {
    return fetchStationsResponse?.stations || [];
  }, [fetchStationsResponse]);

  // Update displayed station when stations change
  useEffect(() => {
    setTimeout(() => {
      setStationToDisplay(fetchStationsResponse?.stations || []);
    }, 0);
  }, [fetchStationsResponse]);

  // Use server-side pagination data
  const totalPages = paginationData.totalPages || 0;
  const totalStations = paginationData.totalStations || 0;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleViewStation = (stationId: string) => {
    if (!stationId) return;
    navigate(`/stations/${stationId}`); // Assuming you have a route for viewing station details
  };

  const handleFilterChange = (value: string) => {
    // Fix: Properly handle the filter value
    if (value === "all") {
      setFilterAvailability("all");
    } else if (value === "available") {
      setFilterAvailability(true);
    } else {
      setFilterAvailability(false);
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle modal close and refresh
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handle successful station addition
  const handleStationAdded = () => {
    // Refresh the current page data
    void fetchStationsData(currentPage, itemsPerPage);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Loader className="my-10" size="xl" text="loading stations" />
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
              onClick={() => {
                void fetchStationsData(currentPage, itemsPerPage);
              }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Stations</h1>
            <p className="text-text-secondary text-sm">
              Manage your fuel stations and their details
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Add Station</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
         <SearchInput<SearchableStation>
        data={stations as SearchableStation[]}
        onFilteredData={(filtered) => setStationToDisplay(filtered as StationList[])}
        searchFields={['name', 'addressCity', 'addressState']}
        placeholder="Search stations by name or location..."
        debounceDelay={300}
        caseSensitive={false}
        showClearButton={true}
        minChars={1}
      />
          <div className="flex gap-2">
            <select
              value={
                filterAvailability === "all"
                  ? "all"
                  : filterAvailability
                    ? "available"
                    : "unavailable"
              }
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-1.5 text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Stations</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {/* Station Count */}
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>
            Showing {stations.length} of {totalStations} station
            {totalStations !== 1 ? "s" : ""}
            {/* {searchTerm && ` (filtered)`} */}
          </span>
          <button className="flex items-center gap-1 hover:text-primary transition-colors">
            <Filter size={14} />
            <span>More filters</span>
          </button>
        </div>

        {/* Stations Table */}
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-secondary">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Station Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Fuel Types
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    24 Hours
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stationToDisplay.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-text-secondary"
                    >
                      {/* {searchTerm || filterAvailability !== "all"
                        ? "No stations found matching your criteria"
                        : "No stations available"} */}
                    </td>
                  </tr>
                ) : (
                  stationToDisplay.map((station) => (
                    <tr
                      key={station.id}
                      className="hover:bg-surface-secondary transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-text-primary">
                        {station.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {station.addressCity}, {station.addressState}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {station.fuelTypes?.map((fuel) => (
                            <span
                              key={fuel}
                              className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
                            >
                              {fuel.replace("_", " ")}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            station.isAvailable
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {station.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {station.is24h ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {new Date(station.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => {
                            handleViewStation(station.id);
                          }}
                          name="view station"
                          aria-label="view-station"
                          className="cursor-pointer text-primary hover:text-primary-hover mr-2"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="text-sm text-text-secondary">
                Page {currentPage} of {totalPages}
                <span className="ml-2">({totalStations} total stations)</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-secondary transition-colors text-text-secondary"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-secondary transition-colors text-text-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddStationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onStationAdded={handleStationAdded}
      />
    </MainLayout>
  );
};

export default StationPage;
