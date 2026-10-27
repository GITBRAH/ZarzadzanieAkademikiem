import {
  User,
  Reservation,
  FacilityStatus,
  MaintenanceTicket,
  ApplicationRequest,
  Announcement,
  RoomDetails
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('akanet_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Błąd logowania');
    }
    const data = await res.json();
    localStorage.setItem('akanet_token', data.token);
    localStorage.setItem('akanet_user', JSON.stringify(data.user));
    return data;
  },

  getCurrentStoredUser(): User | null {
    const raw = localStorage.getItem('akanet_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('akanet_token');
    localStorage.removeItem('akanet_user');
  },

  // Reservations
  async getFacilities(type: 'Laundry' | 'Court', date: string): Promise<FacilityStatus[]> {
    const res = await fetch(`${API_BASE}/reservations/facilities?type=${type}&date=${date}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Nie udało się pobrać listy obiektów');
    return res.json();
  },

  async getMyReservations(): Promise<Reservation[]> {
    const res = await fetch(`${API_BASE}/reservations/my`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Nie udało się pobrać rezerwacji');
    return res.json();
  },

  async createReservation(facilityId: number, date: string, timeSlot: string): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ facilityId, date, timeSlot })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Nie udało się zarezerwować terminu');
    }
    return res.json();
  },

  async cancelReservation(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/reservations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Nie udało się anulować rezerwacji');
  },

  // Maintenance
  async getTickets(): Promise<MaintenanceTicket[]> {
    const res = await fetch(`${API_BASE}/maintenance`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Nie udało się pobrać zgłoszeń');
    return res.json();
  },

  async createTicket(data: { title: string; category: string; description: string; priority: string }): Promise<MaintenanceTicket> {
    const res = await fetch(`${API_BASE}/maintenance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Nie udało się utworzyć zgłoszenia');
    return res.json();
  },

  async updateTicketStatus(id: number, status: string, adminResponse?: string): Promise<MaintenanceTicket> {
    const res = await fetch(`${API_BASE}/maintenance/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, adminResponse })
    });
    if (!res.ok) throw new Error('Nie udało się zaktualizować statusu usterki');
    return res.json();
  },

  // Applications
  async getApplications(): Promise<ApplicationRequest[]> {
    const res = await fetch(`${API_BASE}/applications`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Nie udało się pobrać wniosków');
    return res.json();
  },

  async createApplication(data: { type: string; title: string; justification: string }): Promise<ApplicationRequest> {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Nie udało się złożyć wniosku');
    return res.json();
  },

  // Room
  async getMyRoom(): Promise<RoomDetails> {
    const res = await fetch(`${API_BASE}/rooms/my`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Nie udało się pobrać danych pokoju');
    return res.json();
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    const res = await fetch(`${API_BASE}/announcements`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Nie udało się pobrać ogłoszeń');
    return res.json();
  },

  async createAnnouncement(data: { title: string; content: string; category: string; priority: string; dayBadge: string; monthBadge: string }): Promise<Announcement> {
    const res = await fetch(`${API_BASE}/announcements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Nie udało się utworzyć ogłoszenia');
    return res.json();
  }
};
