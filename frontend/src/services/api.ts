import {
  User,
  Reservation,
  FacilityStatus,
  MaintenanceTicket,
  ApplicationRequest,
  Announcement,
  RoomDetails,
  RoomRecord
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('akanet_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// Initial Mock Seed Data used as reliable fallback when backend is unavailable
const mockUserResident: User = {
  id: 1,
  email: 'jan.makara@student.pl',
  fullName: 'Jan Makara',
  phoneNumber: '+48 600 123 456',
  role: 'Resident',
  roomNumber: 'B-214',
  building: 'Budynek B'
};

const mockUserAdmin: User = {
  id: 3,
  email: 'admin@akanet.pl',
  fullName: 'Administracja Akademika',
  phoneNumber: '+48 22 555 00 00',
  role: 'Admin',
  building: 'Dział Administracji'
};

const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Planowana przerwa w dostawie ciepłej wody',
    content: 'W najbliższy wtorek w godzinach 10:00-14:00 nastąpi przerwa techniczna w dostawie ciepłej wody w Budynku B.',
    category: 'Techniczne',
    priority: 'coral',
    dayBadge: '02',
    monthBadge: 'LIS',
    targetAudience: 'Budynek B',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Zapisy na turniej siatkówki',
    content: 'Rada Mieszkańców zaprasza do udziału w jesiennym turnieju siatkówki na boisku wielofunkcyjnym.',
    category: 'Wydarzenia',
    priority: 'normal',
    dayBadge: '05',
    monthBadge: 'LIS',
    targetAudience: 'Wszyscy mieszkańcy · 412 osób',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Godziny otwarcia administracji w okresie świątecznym',
    content: 'Informujemy, że w dniach 1-3 listopada biuro administracji będzie czynne w trybie dyżuru telefonicznego.',
    category: 'Organizacyjne',
    priority: 'normal',
    dayBadge: '30',
    monthBadge: 'PAŹ',
    targetAudience: 'Wszyscy mieszkańcy · 412 osób',
    createdAt: new Date().toISOString()
  }
];

const mockTickets: MaintenanceTicket[] = [
  {
    id: 148,
    ticketNumber: '#0148',
    title: 'Brak ciepłej wody',
    category: 'Hydraulika',
    description: 'Od rana w łazience leci wyłącznie zimna woda.',
    roomNumber: 'A-103',
    priority: 'Pilny',
    status: 'Nowe',
    author: 'Lena Bąk',
    createdAt: new Date().toISOString()
  },
  {
    id: 147,
    ticketNumber: '#0147',
    title: 'Zablokowane drzwi balkonowe',
    category: 'Stolarka',
    description: 'Klamka nie przekręca się do końca, skrzydło zablokowane.',
    roomNumber: 'C-221',
    priority: 'Wysoki',
    status: 'W trakcie',
    adminResponse: 'Hydraulik i ślusarz powiadomieni, wizyta o 14:30.',
    author: 'Jan Nowak',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 146,
    ticketNumber: '#0146',
    title: 'Nie działa lodówka',
    category: 'Elektryka',
    description: 'Lodówka przestała chłodzić, agregat nie startuje.',
    roomNumber: 'B-309',
    priority: 'Średni',
    status: 'Nowe',
    author: 'Iga Wilk',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 145,
    ticketNumber: '#0145',
    title: 'Pęknięta półka w szafie',
    category: 'Meble',
    description: 'Kołek wsporczy wyłamał się ze ścianki.',
    roomNumber: 'A-118',
    priority: 'Niski',
    status: 'Rozwiązane',
    adminResponse: 'Wymieniono półkę na nową.',
    author: 'Maciej Kot',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const mockApplications: ApplicationRequest[] = [
  {
    id: 1,
    type: 'Goście',
    title: 'Zgłoszenie noclegu gościa',
    justification: 'Wizyta siostry na weekend (pt-ndz). Będzie spać na materacu turystycznym.',
    status: 'Zaakceptowane',
    adminComment: 'Zgoda wydana pod warunkiem zachowania ciszy nocnej.',
    applicant: 'Jan Makara',
    createdAt: '2026-10-25T12:00:00Z'
  },
  {
    id: 2,
    type: 'Pokój',
    title: 'Wniosek o zmianę pokoju na 1-osobowy',
    justification: 'Potrzeba cichej przestrzeni ze względu na przygotowanie pracy dyplomowej.',
    status: 'Oczekujące',
    applicant: 'Piotr Nowak',
    createdAt: '2026-10-28T09:30:00Z'
  },
  {
    id: 3,
    type: 'Inwentarz',
    title: 'Prośba o dodatkowe krzesło biurowe',
    justification: 'Dotychczasowe krzesło ma uszkodzoną regulację wysokości.',
    status: 'Oczekujące',
    applicant: 'Julia Lis',
    createdAt: '2026-10-29T14:15:00Z'
  }
];

export const mockRooms: RoomRecord[] = [
  {
    number: 'B-214',
    floor: 'Piętro 2',
    building: 'Budynek B',
    capacity: '2 / 2',
    capacityNum: 2,
    occupancyNum: 2,
    status: 'Zajęty',
    residents: [
      { name: 'Jan Makara', indexNumber: '420184' },
      { name: 'Julia Lis', indexNumber: '421037' }
    ]
  },
  {
    number: 'B-215',
    floor: 'Piętro 2',
    building: 'Budynek B',
    capacity: '1 / 2',
    capacityNum: 2,
    occupancyNum: 1,
    status: 'Wolne miejsca',
    residents: [
      { name: 'Adam Zając', indexNumber: '419822' }
    ]
  },
  {
    number: 'C-103',
    floor: 'Piętro 1',
    building: 'Budynek C',
    capacity: '2 / 2',
    capacityNum: 2,
    occupancyNum: 2,
    status: 'Zajęty',
    residents: [
      { name: 'Ola Król', indexNumber: '423110' },
      { name: 'Emilia Wójcik', indexNumber: '422904' }
    ]
  },
  {
    number: 'A-307',
    floor: 'Piętro 3',
    building: 'Budynek A',
    capacity: '1 / 3',
    capacityNum: 3,
    occupancyNum: 1,
    status: 'Wolne miejsca',
    residents: [
      { name: 'Kacper Mazur', indexNumber: '418501' }
    ]
  },
  {
    number: 'A-103',
    floor: 'Piętro 1',
    building: 'Budynek A',
    capacity: '2 / 2',
    capacityNum: 2,
    occupancyNum: 2,
    status: 'Zajęty',
    residents: [
      { name: 'Lena Bąk', indexNumber: '424099' },
      { name: 'Karolina Szymańska', indexNumber: '424102' }
    ]
  },
  {
    number: 'B-309',
    floor: 'Piętro 3',
    building: 'Budynek B',
    capacity: '1 / 2',
    capacityNum: 2,
    occupancyNum: 1,
    status: 'Wolne miejsca',
    residents: [
      { name: 'Iga Wilk', indexNumber: '422319' }
    ]
  }
];

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('akanet_token', data.token);
        localStorage.setItem('akanet_user', JSON.stringify(data.user));
        return data;
      }
    } catch (e) {
      console.warn('Backend login unavailable, checking local accounts:', e);
    }

    // Offline / Mock fallback
    if (email.toLowerCase().includes('admin') || password === 'admin123') {
      const data = { token: 'mock-admin-jwt-token', user: mockUserAdmin };
      localStorage.setItem('akanet_token', data.token);
      localStorage.setItem('akanet_user', JSON.stringify(data.user));
      return data;
    } else {
      const data = { token: 'mock-resident-jwt-token', user: mockUserResident };
      localStorage.setItem('akanet_token', data.token);
      localStorage.setItem('akanet_user', JSON.stringify(data.user));
      return data;
    }
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
    try {
      const res = await fetch(`${API_BASE}/reservations/facilities?type=${type}&date=${date}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Backend getFacilities error:', e);
    }

    // Mock facilities
    if (type === 'Laundry') {
      return [
        { id: 1, name: 'Pralka 01', location: 'Pralnia · Budynek A', type: 'Laundry', busySlots: ['08:00', '10:00', '18:00'] },
        { id: 2, name: 'Pralka 02', location: 'Pralnia · Budynek A', type: 'Laundry', busySlots: ['09:00', '13:00'] },
        { id: 3, name: 'Pralka 03', location: 'Pralnia · Budynek B', type: 'Laundry', busySlots: ['11:00', '12:00'] },
        { id: 4, name: 'Pralka 04', location: 'Pralnia · Budynek B', type: 'Laundry', busySlots: ['14:00', '15:00', '20:00'] },
        { id: 5, name: 'Suszarka 01', location: 'Pralnia · Budynek B', type: 'Laundry', busySlots: ['10:00', '17:00'] }
      ];
    }
    return [
      { id: 6, name: 'Boisko wielofunkcyjne', location: 'Centrum sportowe · Boisko 1', type: 'Court', busySlots: ['16:00', '18:00'] },
      { id: 7, name: 'Boisko do piłki nożnej', location: 'Centrum sportowe · Boisko 2', type: 'Court', busySlots: ['17:00', '19:00'] }
    ];
  },

  async getMyReservations(): Promise<Reservation[]> {
    try {
      const res = await fetch(`${API_BASE}/reservations/my`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Backend getMyReservations error:', e);
    }

    return [
      {
        id: 101,
        facilityId: 4,
        facilityName: 'Pralka 04',
        facilityLocation: 'Pralnia · Budynek B',
        facilityType: 'Laundry',
        date: '2026-11-01',
        timeSlot: '14:00 - 15:00',
        durationMinutes: 60,
        status: 'Confirmed',
        createdAt: '2026-10-31T10:00:00Z'
      },
      {
        id: 102,
        facilityId: 6,
        facilityName: 'Boisko wielofunkcyjne',
        facilityLocation: 'Centrum sportowe',
        facilityType: 'Court',
        date: '2026-11-02',
        timeSlot: '18:00 - 19:30',
        durationMinutes: 90,
        status: 'Confirmed',
        createdAt: '2026-10-31T11:00:00Z'
      }
    ];
  },

  async createReservation(facilityId: number, date: string, timeSlot: string): Promise<Reservation> {
    try {
      const res = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ facilityId, date, timeSlot })
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Backend createReservation error:', e);
    }

    return {
      id: Date.now(),
      facilityId,
      facilityName: facilityId <= 5 ? 'Pralka / Suszarka' : 'Boisko sportowe',
      facilityLocation: 'Akademik Olimp',
      facilityType: facilityId <= 5 ? 'Laundry' : 'Court',
      date,
      timeSlot,
      durationMinutes: 60,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
  },

  async cancelReservation(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/reservations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {
      console.warn('Backend cancelReservation error:', e);
    }
  },

  // Maintenance
  async getTickets(): Promise<MaintenanceTicket[]> {
    try {
      const res = await fetch(`${API_BASE}/maintenance`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Backend getTickets error:', e);
    }

    const local = localStorage.getItem('akanet_tickets');
    if (local) {
      try { return JSON.parse(local); } catch { /* ignore */ }
    }
    return mockTickets;
  },

  async createTicket(data: { title: string; category: string; description: string; priority: string }): Promise<MaintenanceTicket> {
    try {
      const res = await fetch(`${API_BASE}/maintenance`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Backend createTicket error:', e);
    }

    const current = await this.getTickets();
    const newId = current.length > 0 ? Math.max(...current.map((t) => t.id)) + 1 : 149;
    const newTicket: MaintenanceTicket = {
      id: newId,
      ticketNumber: `#0${newId}`,
      title: data.title,
      category: data.category,
      description: data.description,
      priority: data.priority as any,
      roomNumber: 'B-214',
      status: 'Nowe',
      author: 'Jan Makara',
      createdAt: new Date().toISOString()
    };
    const updated = [newTicket, ...current];
    localStorage.setItem('akanet_tickets', JSON.stringify(updated));
    return newTicket;
  },

  async updateTicketStatus(id: number, status: string, adminResponse?: string): Promise<MaintenanceTicket> {
    try {
      const res = await fetch(`${API_BASE}/maintenance/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, adminResponse })
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Backend updateTicketStatus error:', e);
    }

    const current = await this.getTickets();
    const item = current.find((t) => t.id === id);
    if (item) {
      item.status = status as any;
      if (adminResponse !== undefined) item.adminResponse = adminResponse;
      localStorage.setItem('akanet_tickets', JSON.stringify(current));
      return item;
    }
    throw new Error('Ticket not found');
  },

  // Applications
  async getApplications(): Promise<ApplicationRequest[]> {
    try {
      const res = await fetch(`${API_BASE}/applications`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Backend getApplications error:', e);
    }

    const local = localStorage.getItem('akanet_applications');
    if (local) {
      try { return JSON.parse(local); } catch { /* ignore */ }
    }
    return mockApplications;
  },

  async createApplication(data: { type: string; title: string; justification: string }): Promise<ApplicationRequest> {
    try {
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Backend createApplication error:', e);
    }

    const current = await this.getApplications();
    const newApp: ApplicationRequest = {
      id: current.length + 1,
      type: data.type,
      title: data.title,
      justification: data.justification,
      status: 'Oczekujące',
      applicant: 'Jan Makara',
      createdAt: new Date().toISOString()
    };
    const updated = [newApp, ...current];
    localStorage.setItem('akanet_applications', JSON.stringify(updated));
    return newApp;
  },

  async updateApplicationStatus(id: number, status: string, adminComment?: string): Promise<ApplicationRequest> {
    try {
      const res = await fetch(`${API_BASE}/applications/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, adminComment })
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Backend updateApplicationStatus error:', e);
    }

    const current = await this.getApplications();
    const item = current.find((a) => a.id === id);
    if (item) {
      item.status = status as any;
      if (adminComment !== undefined) item.adminComment = adminComment;
      localStorage.setItem('akanet_applications', JSON.stringify(current));
      return item;
    }
    throw new Error('Application not found');
  },

  // Room
  async getMyRoom(): Promise<RoomDetails> {
    try {
      const res = await fetch(`${API_BASE}/rooms/my`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Backend getMyRoom error:', e);
    }

    return {
      id: 1,
      roomNumber: 'B-214',
      building: 'Budynek B',
      floor: 2,
      capacity: 2,
      currentOccupancy: 2,
      monthlyRent: 650.0,
      deposit: 1000.0,
      depositPaid: true,
      rentStatus: 'Opłacone do 30 listopada',
      roommates: [
        {
          id: 2,
          fullName: 'Julia Lis',
          email: 'julia.lis@student.pl',
          phoneNumber: '+48 502 987 654'
        }
      ]
    };
  },

  async getAllRooms(): Promise<RoomRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/rooms`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const raw = await res.json();
        if (Array.isArray(raw) && raw.length > 0) {
          return raw.map((r: any) => ({
            number: r.roomNumber,
            floor: `Piętro ${r.floor}`,
            building: r.building,
            capacity: `${r.occupancy} / ${r.capacity}`,
            capacityNum: r.capacity,
            occupancyNum: r.occupancy,
            status: r.occupancy >= r.capacity ? 'Zajęty' : r.occupancy === 0 ? 'Pusty' : 'Wolne miejsca',
            residents: (r.residents || []).map((name: string, idx: number) => ({
              name,
              indexNumber: `${420000 + idx * 137}`
            }))
          }));
        }
      }
    } catch (e) {
      console.warn('Backend getAllRooms error:', e);
    }
    return mockRooms;
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    try {
      const res = await fetch(`${API_BASE}/announcements`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Backend getAnnouncements error:', e);
    }

    const local = localStorage.getItem('akanet_announcements');
    if (local) {
      try { return JSON.parse(local); } catch { /* ignore */ }
    }
    return mockAnnouncements;
  },

  async createAnnouncement(data: {
    title: string;
    content: string;
    category: string;
    priority: string;
    dayBadge: string;
    monthBadge: string;
    targetAudience?: string;
  }): Promise<Announcement> {
    try {
      const res = await fetch(`${API_BASE}/announcements`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Backend createAnnouncement error:', e);
    }

    const current = await this.getAnnouncements();
    const newNotice: Announcement = {
      id: current.length + 1,
      title: data.title,
      content: data.content,
      category: data.category,
      priority: data.priority as any,
      dayBadge: data.dayBadge,
      monthBadge: data.monthBadge,
      targetAudience: data.targetAudience || 'Wszyscy mieszkańcy · 412 osób',
      createdAt: new Date().toISOString()
    };
    const updated = [newNotice, ...current];
    localStorage.setItem('akanet_announcements', JSON.stringify(updated));
    return newNotice;
  },

  async deleteAnnouncement(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/announcements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {
      console.warn('Backend deleteAnnouncement error:', e);
    }

    const current = await this.getAnnouncements();
    const filtered = current.filter((a) => a.id !== id);
    localStorage.setItem('akanet_announcements', JSON.stringify(filtered));
  }
};
