export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'Resident' | 'Admin' | 'Staff';
  roomNumber?: string;
  building?: string;
}

export interface Reservation {
  id: number;
  facilityId: number;
  facilityName: string;
  facilityLocation: string;
  facilityType: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  status: 'Confirmed' | 'Cancelled' | 'Completed';
  createdAt: string;
}

export interface FacilityStatus {
  id: number;
  name: string;
  location: string;
  type: string;
  busySlots: string[];
}

export interface MaintenanceTicket {
  id: number;
  title: string;
  category: string;
  description: string;
  roomNumber: string;
  priority: 'Niski' | 'Średni' | 'Wysoki' | 'Pilny';
  status: 'Nowe' | 'W trakcie' | 'Rozwiązane' | 'Odrzucone';
  adminResponse?: string;
  author: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ApplicationRequest {
  id: number;
  type: string;
  title: string;
  justification: string;
  status: 'Oczekujące' | 'Zaakceptowane' | 'Odrzucone';
  adminComment?: string;
  applicant: string;
  createdAt: string;
  processedAt?: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  priority: 'normal' | 'coral';
  dayBadge: string;
  monthBadge: string;
  createdAt: string;
}

export interface RoomDetails {
  id: number;
  roomNumber: string;
  building: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  monthlyRent: number;
  deposit: number;
  depositPaid: boolean;
  rentStatus: string;
  roommates: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
  }[];
}
