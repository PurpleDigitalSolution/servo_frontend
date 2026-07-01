export interface User {
  id: string;
  email: string;
  role: string;
  accountStatus: "ACTIVE" | "SUSPENDED" | "BANNED";
  userProfile: {
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: Date;
    address: string;
  } | null;
  createdAt: Date;
}