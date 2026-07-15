import React, { useState } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import type { FuelType } from "../../types/general";
import { useStationStore, type StationFormData } from "../../store/stationStore";

interface AddStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStationAdded?: () => void; // Add this optional prop
}

export interface FormData {
  name: string;
  addressState: string;
  addressStreet: string;
  addressCity: string;
  addressCountry: string;
  latitude: string;
  longitude: string;
  openTime: string;
  closeTime: string;
  is24h: boolean;
  fuelTypes: FuelType[];
  prices: {
    PETROL: string;
    DIESEL: string;
    COOKING_GAS: string;
  };
}

const FUEL_TYPES: Array<{ value: FuelType; label: string }> = [
  { value: "PETROL", label: "Petrol" },
  { value: "DIESEL", label: "Diesel" },
  { value: "COOKING_GAS", label: "Cooking Gas" },
];

const AddStationModal: React.FC<AddStationModalProps> = ({
  isOpen,
  onClose,
  onStationAdded, // Destructure the new prop
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    addressState: "",
    addressStreet: "",
    addressCity: "",
    addressCountry: "",
    latitude: "",
    longitude: "",
    openTime: "08:00",
    closeTime: "20:00",
    is24h: false,
    fuelTypes: [],
    prices: {
      PETROL: "",
      DIESEL: "",
      COOKING_GAS: "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { createStation } = useStationStore();

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

    // Validate prices for selected fuel types
    formData.fuelTypes.forEach((fuel) => {
      const price = formData.prices[fuel as keyof typeof formData.prices];
      if (!price || parseFloat(price) <= 0) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const stationData: StationFormData = {
        name: formData.name.trim(),
        addressState: formData.addressState.trim(),
        addressStreet: formData.addressStreet.trim(),
        addressCity: formData.addressCity.trim(),
        addressCountry: formData.addressCountry.trim(),
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        openTime: formData.is24h ? undefined : formData.openTime,
        closeTime: formData.is24h ? undefined : formData.closeTime,
        is24h: formData.is24h,
        fuelTypes: formData.fuelTypes,
        prices: Object.fromEntries(
          Object.entries(formData.prices)
            .filter(([key]) => formData.fuelTypes.includes(key as FuelType))
            .map(([key, value]) => [key, parseFloat(value)])
        ) as Record<FuelType, number>,
      };

      const res = await createStation(stationData);

      if (res.success) {
        setSubmitSuccess(true);

        // Call the onStationAdded callback if provided
        if (onStationAdded) {
          onStationAdded();
        }

        // Reset form after success
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1500);
      } else {
        console.log(res)
        setSubmitError(res.message || "Failed to add station");
        setIsSubmitting(false);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to add station");
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      addressState: "",
      addressStreet: "",
      addressCity: "",
      addressCountry: "",
      latitude: "",
      longitude: "",
      openTime: "08:00",
      closeTime: "20:00",
      is24h: false,
      fuelTypes: [],
      prices: {
        PETROL: "",
        DIESEL: "",
        COOKING_GAS: "",
      },
    });
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

  const handleFuelTypeToggle = (fuelType: string) => {
    setFormData((prev) => {
      const typedFuelType = fuelType as FuelType;
      const newFuelTypes = prev.fuelTypes.includes(typedFuelType)
        ? prev.fuelTypes.filter((f) => f !== typedFuelType)
        : [...prev.fuelTypes, typedFuelType];

      // Clear price error when unselecting fuel type
      if (!newFuelTypes.includes(typedFuelType)) {
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

  if (!isOpen) return null;

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
              <h2 className="text-xl font-bold text-text-primary">Add New Station</h2>
              <p className="text-sm text-text-secondary">Fill in the details to add a new fuel station</p>
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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Success Message */}
            {submitSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Station added successfully!
                </p>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                  errors.name ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Enter station name"
                disabled={isSubmitting}
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
                onChange={(e) => setFormData({ ...formData, addressStreet: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                  errors.addressStreet ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Street address"
                disabled={isSubmitting}
              />
              {errors.addressStreet && (
                <p className="mt-1 text-sm text-red-500">{errors.addressStreet}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={formData.addressCity}
                    onChange={(e) => setFormData({ ...formData, addressCity: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                      errors.addressCity ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="City"
                    disabled={isSubmitting}
                  />
                  {errors.addressCity && (
                    <p className="mt-1 text-sm text-red-500">{errors.addressCity}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.addressState}
                    onChange={(e) => setFormData({ ...formData, addressState: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                      errors.addressState ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="State"
                    disabled={isSubmitting}
                  />
                  {errors.addressState && (
                    <p className="mt-1 text-sm text-red-500">{errors.addressState}</p>
                  )}
                </div>
              </div>

              <input
                type="text"
                value={formData.addressCountry}
                onChange={(e) => setFormData({ ...formData, addressCountry: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                  errors.addressCountry ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Country"
                disabled={isSubmitting}
              />
              {errors.addressCountry && (
                <p className="mt-1 text-sm text-red-500">{errors.addressCountry}</p>
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
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
                  placeholder="e.g., 34.0522"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
                  placeholder="e.g., -118.2437"
                  disabled={isSubmitting}
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
                    onChange={(e) => setFormData({ ...formData, is24h: e.target.checked })}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    disabled={isSubmitting}
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
                      onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                        errors.openTime ? 'border-red-500' : 'border-border'
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.openTime && (
                      <p className="mt-1 text-sm text-red-500">{errors.openTime}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">
                      Close Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.closeTime}
                      onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                        errors.closeTime ? 'border-red-500' : 'border-border'
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.closeTime && (
                      <p className="mt-1 text-sm text-red-500">{errors.closeTime}</p>
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
                    key={fuel.value}
                    type="button"
                    onClick={() => handleFuelTypeToggle(fuel.value)}
                    disabled={isSubmitting}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      formData.fuelTypes.includes(fuel.value)
                        ? 'bg-primary text-white border-primary hover:bg-primary-hover'
                        : 'bg-surface border-border text-text-secondary hover:bg-surface-secondary'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {fuel.label}
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
                  Prices (per liter/gallon) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.fuelTypes.map((fuel) => (
                    <div key={fuel}>
                      <label className="block text-xs text-text-secondary mb-1">
                        {fuel.replace('_', ' ')}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.prices[fuel as keyof typeof formData.prices]}
                        onChange={(e) => setFormData({
                          ...formData,
                          prices: {
                            ...formData.prices,
                            [fuel]: e.target.value,
                          }
                        })}
                        className={`w-full px-4 py-2 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary ${
                          errors[`price_${fuel}`] ? 'border-red-500' : 'border-border'
                        }`}
                        placeholder="0.00"
                        disabled={isSubmitting}
                      />
                      {errors[`price_${fuel}`] && (
                        <p className="mt-1 text-sm text-red-500">{errors[`price_${fuel}`]}</p>
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
                disabled={isSubmitting}
                className="px-6 py-2 border border-border rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle size={18} />
                    Added!
                  </>
                ) : (
                  'Add Station'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStationModal;