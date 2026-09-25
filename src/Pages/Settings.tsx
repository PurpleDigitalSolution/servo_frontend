import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../layout/MainLayout";
import {
  Percent,
  Truck,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings as SettingsIcon,
  Info,
} from "lucide-react";
import { usePricingSettingStore } from "../store/pricingStore";
import { useAuthStore } from "../store/authStore";
import UnderConstruction from "./UnderConstruction";

// ============ Types ============
export interface PriceSettingValue {
  id: string;
  isEnable: boolean;
  value: string;
}

export interface PriceSettings {
  id: string;
  deliveryFeeId: string;
  vatId: string;
  deliveryFee: PriceSettingValue;
  vat: PriceSettingValue;
}

// ============ Constants ============
const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];
const SAMPLE_SUBTOTAL = 10000;

// ============ Helpers ============
const naira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// ============ Sub-components ============
const Toggle = ({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    disabled={disabled}
    className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${
      checked ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

const NumberField = ({
  label,
  hint,
  value,
  onChange,
  disabled,
  prefix,
  suffix,
  step,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  prefix?: string;
  suffix?: React.ReactNode;
  step?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-text-primary mb-1.5">
      {label}
    </label>
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
          {prefix}
        </span>
      )}
      <input
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full py-2.5 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed ${
          prefix ? "pl-8" : "pl-4"
        } ${suffix ? "pr-10" : "pr-4"}`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
          {suffix}
        </span>
      )}
    </div>
    <p className="mt-1 text-xs text-text-secondary">{hint}</p>
  </div>
);

const SettingsCard = ({
  icon,
  iconClass,
  title,
  description,
  enabled,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div
    className={`bg-surface rounded-xl border border-border overflow-hidden transition-opacity ${
      enabled ? "" : "opacity-70"
    }`}
  >
    <div className="p-6 border-b border-border flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>
      <Toggle checked={enabled} onChange={onToggle} label={`Toggle ${title}`} />
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

const Banner = ({
  kind,
  message,
}: {
  kind: "success" | "error";
  message: string;
}) => {
  const isSuccess = kind === "success";
  return (
    <div
      className={`mb-4 p-4 rounded-lg flex items-center gap-3 border ${
        isSuccess
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      }`}
    >
      {isSuccess ? (
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
      )}
      <p
        className={`text-sm ${
          isSuccess
            ? "text-green-700 dark:text-green-300"
            : "text-red-700 dark:text-red-300"
        }`}
      >
        {message}
      </p>
    </div>
  );
};

// ============ Main Component ============
const Settings = () => {
  const { user } = useAuthStore();
  const getPriceSettings = usePricingSettingStore(
    (state) => state.getPriceSettings,
  );
  const updatePriceSettings = usePricingSettingStore(
    (state) => state.updatePriceSettings,
  );
  const priceSettings = usePricingSettingStore((state) => state.priceSetting);

  const [settings, setSettings] = useState<PriceSettings | null>(null);
  const [originalSettings, setOriginalSettings] =
    useState<PriceSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasAccess = ALLOWED_ROLES.includes(user?.role as string);

  // Fetch settings
  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await getPriceSettings();
    } catch {
      setError("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  // Sync store data with local state
  useEffect(() => {
    if (priceSettings) {
      setTimeout(() => {
        setSettings(priceSettings as unknown as PriceSettings);
        setOriginalSettings(priceSettings as unknown as PriceSettings);
      }, 100);
    }
  }, [priceSettings]);

  useEffect(() => {
    if (!hasAccess) return;
    const timeout = setTimeout(fetchSettings, 100);
    return () => clearTimeout(timeout);
  }, [hasAccess]);

  // Update handlers
  const updateVat = (updates: Partial<PriceSettingValue>) => {
    if (!settings) return;
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            vat: { ...prev.vat, ...updates },
          }
        : prev,
    );
  };

  const updateDeliveryFee = (updates: Partial<PriceSettingValue>) => {
    if (!settings) return;
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            deliveryFee: { ...prev.deliveryFee, ...updates },
          }
        : prev,
    );
  };

  // Change detection
  const hasChanges = useMemo(
    () =>
      originalSettings != null &&
      settings != null &&
      JSON.stringify(settings) !== JSON.stringify(originalSettings),
    [settings, originalSettings],
  );

  // Save handler
  const handleSave = async () => {
    if (!hasChanges || isSaving || !settings) return;

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        deliveryFee: {
          id: settings.deliveryFee.id,
          isEnable: settings.deliveryFee.isEnable,
          value: Number(settings.deliveryFee.value),
        },
        vat: {
          id: settings.vat.id,
          isEnable: settings.vat.isEnable,
          value: Number(settings.vat.value),
        },
      };

      await updatePriceSettings(payload);
      setOriginalSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset handler
  const handleReset = () => {
    if (originalSettings) {
      setSettings(originalSettings);
      setError(null);
    }
  };

  // Preview calculation
  const preview = useMemo(() => {
    if (!settings) {
      return {
        subtotal: SAMPLE_SUBTOTAL,
        vat: 0,
        delivery: 0,
        total: SAMPLE_SUBTOTAL,
      };
    }

    const vatValue = parseFloat(settings.vat.value) || 0;
    const deliveryValue = parseFloat(settings.deliveryFee.value) || 0;

    const vat = settings.vat.isEnable ? (SAMPLE_SUBTOTAL * vatValue) / 100 : 0;
    const delivery = settings.deliveryFee.isEnable ? deliveryValue : 0;

    return {
      subtotal: SAMPLE_SUBTOTAL,
      vat,
      delivery,
      total: SAMPLE_SUBTOTAL + vat + delivery,
    };
  }, [settings]);

  // Access check
  if (!hasAccess) {
    return <UnderConstruction />;
  }

  // Loading state
  if (isLoading || !settings) {
    return (
      <MainLayout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
            <p className="text-text-secondary">Loading settings...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Pricing Settings
              </h1>
              <p className="text-text-secondary text-sm">
                Manage VAT and delivery fee configurations
              </p>
            </div>
          </div>
          <button
            onClick={fetchSettings}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Notifications */}
        {success && (
          <Banner kind="success" message="Settings updated successfully!" />
        )}
        {error && <Banner kind="error" message={error} />}

        <div className="space-y-6">
          {/* VAT Settings */}
          <SettingsCard
            icon={
              <Percent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            }
            iconClass="bg-blue-100 dark:bg-blue-900/30"
            title="VAT Settings"
            description="Configure value added tax for orders"
            enabled={settings.vat.isEnable}
            onToggle={() => updateVat({ isEnable: !settings.vat.isEnable })}
          >
            <NumberField
              label="VAT Percentage (%)"
              hint="Applied to the fuel subtotal on all orders"
              value={settings.vat.value}
              onChange={(v) => updateVat({ value: v })}
              disabled={!settings.vat.isEnable}
              suffix={<Percent size={18} />}
              step="0.1"
            />
          </SettingsCard>

          {/* Delivery Fee Settings */}
          <SettingsCard
            icon={
              <Truck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            }
            iconClass="bg-orange-100 dark:bg-orange-900/30"
            title="Delivery Fee Settings"
            description="Configure delivery charges for orders"
            enabled={settings.deliveryFee.isEnable}
            onToggle={() =>
              updateDeliveryFee({ isEnable: !settings.deliveryFee.isEnable })
            }
          >
            <NumberField
              label="Delivery Fee Amount (₦)"
              hint="Standard delivery fee per order"
              value={settings.deliveryFee.value}
              onChange={(v) => updateDeliveryFee({ value: v })}
              disabled={!settings.deliveryFee.isEnable}
              prefix="₦"
              step="0.01"
            />
          </SettingsCard>

          {/* Preview */}
          <div className="bg-surface-secondary rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-text-primary mb-2">
                  Order Price Preview
                </h3>
                <div className="text-sm text-text-secondary space-y-1">
                  <div className="flex justify-between">
                    <span>Fuel Subtotal</span>
                    <span>{naira(preview.subtotal)}</span>
                  </div>
                  {settings.vat.isEnable && (
                    <div className="flex justify-between">
                      <span>VAT ({settings.vat.value}%)</span>
                      <span>{naira(preview.vat)}</span>
                    </div>
                  )}
                  {settings.deliveryFee.isEnable && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{naira(preview.delivery)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-border font-semibold text-text-primary">
                    <span>Total</span>
                    <span>{naira(preview.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={handleReset}
              disabled={!hasChanges || isSaving}
              className="px-6 py-2.5 border border-border rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
