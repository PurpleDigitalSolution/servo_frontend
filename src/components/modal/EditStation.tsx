import React, { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import {
  useStationStore,
  type Station,
  type StationFormData,
} from "../../store/stationStore";
import type { FuelType } from "../../types/general";

interface EditStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: Station | null;
  onUpdate?: (data: Partial<StationFormData>) => Promise<void>;
}

const FUEL_TYPES: FuelType[] = ["PETROL", "DIESEL", "COOKING_GAS"];

const EditStationModal = ({
  isOpen,
  onClose,
  station,
}: EditStationModalProps) => {
  const { updateStation } = useStationStore();
  const [formData, setFormData] = useState<StationFormData>({
    name: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressCountry: "",
    latitude: 0,
    longitude: 0,
    openTime: "08:00",
    closeTime: "20:00",
    is24h: false,
    fuelTypes: [],
    prices: {} as Record<FuelType, number>,
  });

  const [originalData, setOriginalData] = useState<StationFormData | null>(
    null,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (station) {
      const data: StationFormData = {
        name: station.name || "",
        addressStreet: station.addressStreet || "",
        addressCity: station.addressCity || "",
        addressState: station.addressState || "",
        addressCountry: station.addressCountry || "",
        latitude: station.latitude || 0,
        longitude: station.longitude || 0,
        openTime:
          typeof station.openTime === "string"
            ? station.openTime
            : station.openTime instanceof Date
              ? station.openTime.toTimeString().slice(0, 5)
              : "08:00",
        closeTime:
          typeof station.closeTime === "string"
            ? station.closeTime
            : station.closeTime instanceof Date
              ? station.closeTime.toTimeString().slice(0, 5)
              : "20:00",
        is24h: station.is24h || false,
        fuelTypes: station.fuelTypes || [],
        prices: Object.fromEntries(
          Object.entries(station.prices || {}).map(([key, value]) => [
            key as FuelType,
            typeof value === "string" ? parseFloat(value) : value,
          ]),
        ) as Record<FuelType, number>,
      };
      setTimeout(() => {
        setFormData(data);
        setOriginalData(data);
      }, 100);
    }
  }, [station]);

  const getChangedFields = (): Partial<StationFormData> => {
    if (!originalData) return {};

    const changed: Partial<StationFormData> = {};

    // Check each field for changes
    if (formData.name !== originalData.name) {
      changed.name = formData.name;
    }

    if (formData.addressStreet !== originalData.addressStreet) {
      changed.addressStreet = formData.addressStreet;
    }

    if (formData.addressCity !== originalData.addressCity) {
      changed.addressCity = formData.addressCity;
    }

    if (formData.addressState !== originalData.addressState) {
      changed.addressState = formData.addressState;
    }

    if (formData.addressCountry !== originalData.addressCountry) {
      changed.addressCountry = formData.addressCountry;
    }

    if (formData.latitude !== originalData.latitude) {
      changed.latitude = formData.latitude;
    }

    if (formData.longitude !== originalData.longitude) {
      changed.longitude = formData.longitude;
    }

    if (formData.is24h !== originalData.is24h) {
      changed.is24h = formData.is24h;
    }

    if (!formData.is24h) {
      if (formData.openTime !== originalData.openTime) {
        changed.openTime = formData.openTime;
      }
      if (formData.closeTime !== originalData.closeTime) {
        changed.closeTime = formData.closeTime;
      }
    }

    // Check fuel types changes
    if (
      JSON.stringify(formData.fuelTypes) !==
      JSON.stringify(originalData.fuelTypes)
    ) {
      changed.fuelTypes = formData.fuelTypes;
    }

    // Check prices changes
    const pricesChanged = Object.keys(formData.prices).some(
      (key) =>
        formData.prices[key as FuelType] !==
        originalData.prices[key as FuelType],
    );
    if (pricesChanged) {
      changed.prices = formData.prices;
    }

    return changed;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Station name is required";
    }
    if (!formData.addressStreet.trim()) {
      newErrors.addressStreet = "Street address is required";
    }
    if (!formData.addressCity.trim()) {
      newErrors.addressCity = "City is required";
    }
    if (!formData.addressState.trim()) {
      newErrors.addressState = "State is required";
    }
    if (!formData.addressCountry.trim()) {
      newErrors.addressCountry = "Country is required";
    }
    if (formData.fuelTypes.length === 0) {
      newErrors.fuelTypes = "At least one fuel type is required";
    }

    formData.fuelTypes.forEach((fuel) => {
      const price = formData.prices[fuel];
      if (price === undefined || price === null || price <= 0) {
        newErrors[`price_${fuel}`] = `Valid price for ${fuel} is required`;
      }
    });

    if (!formData.is24h) {
      if (!formData.openTime) {
        newErrors.openTime = "Opening time is required";
      }
      if (!formData.closeTime) {
        newErrors.closeTime = "Closing time is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFuelTypeToggle = (fuelType: FuelType) => {
    setFormData((prev) => {
      const newFuelTypes = prev.fuelTypes.includes(fuelType)
        ? prev.fuelTypes.filter((f) => f !== fuelType)
        : [...prev.fuelTypes, fuelType];

      if (!newFuelTypes.includes(fuelType)) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[`price_${fuelType}`];
          return newErrors;
        });
      }

      return {
        ...prev,
        fuelTypes: newFuelTypes,
      };
    });
  };

  const handlePriceChange = (fuel: FuelType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      prices: {
        ...prev.prices,
        [fuel]: value ? parseFloat(value) : 0,
      },
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`price_${fuel}`];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const changedData = getChangedFields();

    // Check if anything changed
    if (Object.keys(changedData).length === 0) {
      setSubmitError("No changes were made to update");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const res = await updateStation(station!.id, changedData);
      if (res.success) {
        setSubmitSuccess(true);
        // Update original data to prevent re-submitting same changes
        setOriginalData(formData);
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1500);
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to update station",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      addressStreet: "",
      addressCity: "",
      addressState: "",
      addressCountry: "",
      latitude: 0,
      longitude: 0,
      openTime: "08:00",
      closeTime: "20:00",
      is24h: false,
      fuelTypes: [],
      prices: {} as Record<FuelType, number>,
    });
    setOriginalData(null);
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  const isLoading = isSubmitting;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="relative bg-surface rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-surface border-b border-border z-10 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Edit Station
              </h2>
              <p className="text-sm text-text-secondary">
                Update station details and information
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 hover:bg-surface-secondary rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={20} className="text-text-secondary" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Success Message */}
            {submitSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Station updated successfully!
                </p>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {submitError}
                </p>
              </div>
            )}

            {/* Station Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Station Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: "" });
                }}
                className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                  errors.name ? "border-red-500" : "border-border"
                }`}
                placeholder="Enter station name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">
                Address <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={formData.addressStreet}
                onChange={(e) => {
                  setFormData({ ...formData, addressStreet: e.target.value });
                  setErrors({ ...errors, addressStreet: "" });
                }}
                className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                  errors.addressStreet ? "border-red-500" : "border-border"
                }`}
                placeholder="Street address"
                disabled={isLoading}
              />
              {errors.addressStreet && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.addressStreet}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={formData.addressCity}
                    onChange={(e) => {
                      setFormData({ ...formData, addressCity: e.target.value });
                      setErrors({ ...errors, addressCity: "" });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                      errors.addressCity ? "border-red-500" : "border-border"
                    }`}
                    placeholder="City"
                    disabled={isLoading}
                  />
                  {errors.addressCity && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.addressCity}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.addressState}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        addressState: e.target.value,
                      });
                      setErrors({ ...errors, addressState: "" });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                      errors.addressState ? "border-red-500" : "border-border"
                    }`}
                    placeholder="State"
                    disabled={isLoading}
                  />
                  {errors.addressState && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.addressState}
                    </p>
                  )}
                </div>
              </div>

              <input
                type="text"
                value={formData.addressCountry}
                onChange={(e) => {
                  setFormData({ ...formData, addressCountry: e.target.value });
                  setErrors({ ...errors, addressCountry: "" });
                }}
                className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                  errors.addressCountry ? "border-red-500" : "border-border"
                }`}
                placeholder="Country"
                disabled={isLoading}
              />
              {errors.addressCountry && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.addressCountry}
                </p>
              )}
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latitude: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
                  placeholder="e.g., 34.0522"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longitude: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
                  placeholder="e.g., -118.2437"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Operating Hours */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-primary">
                  Operating Hours
                </label>
                <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is24h}
                    onChange={(e) =>
                      setFormData({ ...formData, is24h: e.target.checked })
                    }
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    disabled={isLoading}
                  />
                  24 Hours
                </label>
              </div>

              {!formData.is24h && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">
                      Open Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.openTime}
                      onChange={(e) =>
                        setFormData({ ...formData, openTime: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                        errors.openTime ? "border-red-500" : "border-border"
                      }`}
                      disabled={isLoading}
                    />
                    {errors.openTime && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.openTime}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">
                      Close Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.closeTime}
                      onChange={(e) =>
                        setFormData({ ...formData, closeTime: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                        errors.closeTime ? "border-red-500" : "border-border"
                      }`}
                      disabled={isLoading}
                    />
                    {errors.closeTime && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.closeTime}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Fuel Types */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Fuel Types <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {FUEL_TYPES.map((fuel) => (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => handleFuelTypeToggle(fuel)}
                    disabled={isLoading}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      formData.fuelTypes.includes(fuel)
                        ? "bg-primary text-white border-primary hover:bg-primary-hover"
                        : "bg-surface border-border text-text-secondary hover:bg-surface-secondary"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {fuel.replace("_", " ")}
                  </button>
                ))}
              </div>
              {errors.fuelTypes && (
                <p className="mt-1 text-sm text-red-500">{errors.fuelTypes}</p>
              )}
            </div>

            {/* Prices */}
            {formData.fuelTypes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Prices (per liter/gallon){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.fuelTypes.map((fuel) => (
                    <div key={fuel}>
                      <label className="block text-xs text-text-secondary mb-1">
                        {fuel.replace("_", " ")}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.prices[fuel] || ""}
                        onChange={(e) =>
                          handlePriceChange(fuel, e.target.value)
                        }
                        className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                          errors[`price_${fuel}`]
                            ? "border-red-500"
                            : "border-border"
                        }`}
                        placeholder="0.00"
                        disabled={isLoading}
                      />
                      {errors[`price_${fuel}`] && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[`price_${fuel}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="sticky bottom-0 bg-surface border-t border-border -mx-6 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 py-2 border border-border rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || submitSuccess}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle size={18} />
                    Updated!
                  </>
                ) : (
                  "Update Station"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStationModal;
