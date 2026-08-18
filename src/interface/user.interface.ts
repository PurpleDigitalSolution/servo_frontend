export interface User {
  id: string;
  email: string;
  role: string;
  accountStatus: "ACTIVE" | "SUSPENDED" | "BANNED";
  userProfile: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: Date;
    address: string;
  } | null;
  suspensionReason?: string;
  suspendedAt?: string;
  suspendedBy?: string;
  createdAt: Date;
}
