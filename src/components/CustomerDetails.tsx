import { User, Mail, Phone, MapPin, UserCircle } from "lucide-react";

interface CustomerDetailsProps {
  customer?: {
    id: string;
    email: string;
    userProfile?: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      address?: string;
    };
  };
  showFullId?: boolean;
  className?: string;
}

const CustomerDetails = ({
  customer,
  showFullId = false,
  className = ""
}: CustomerDetailsProps) => {
  if (!customer) {
    return (
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <User size={18} className="text-primary" />
          <span>Customer</span>
        </h3>
        <p className="text-sm text-text-secondary">No customer information available</p>
      </div>
    );
  }

  const { id, email, userProfile } = customer;
  const fullName = userProfile?.firstName && userProfile?.lastName
    ? `${userProfile.firstName} ${userProfile.lastName}`
    : "N/A";

  return (
    <div className={`bg-surface rounded-lg border border-border p-6 ${className}`}>
      <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center space-x-2">
        <User size={18} className="text-primary" />
        <span>Customer Details</span>
      </h3>

      <div className="space-y-4">
        {/* Customer ID */}
        <div className="flex items-start space-x-3">
          <UserCircle size={18} className="text-text-secondary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-text-secondary">Customer ID</p>
            <p className="text-sm font-mono text-text-primary mt-0.5">
              {showFullId ? id : `${id.slice(0, 8)}...`}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start space-x-3">
          <Mail size={18} className="text-text-secondary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-text-secondary">Email</p>
            <p className="text-sm text-text-primary mt-0.5 break-all">
              {email || "N/A"}
            </p>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex items-start space-x-3">
          <Phone size={18} className="text-text-secondary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-text-secondary">Phone Number</p>
            <p className="text-sm text-text-primary mt-0.5">
              {userProfile?.phoneNumber || "N/A"}
            </p>
          </div>
        </div>

        {/* Full Name (if available) */}
        {userProfile?.firstName && (
          <div className="flex items-start space-x-3">
            <User size={18} className="text-text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-text-secondary">Full Name</p>
              <p className="text-sm text-text-primary mt-0.5">
                {fullName}
              </p>
            </div>
          </div>
        )}

        {/* Address (if available) */}
        {userProfile?.address && (
          <div className="flex items-start space-x-3">
            <MapPin size={18} className="text-text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-text-secondary">Address</p>
              <p className="text-sm text-text-primary mt-0.5">
                {userProfile.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;