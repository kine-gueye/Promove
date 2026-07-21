/**
 * PROMOVE — client API partage par toute l'application React.
 * Centralise l'appel au backend NestJS, le stockage du token JWT
 * et les types de donnees echangees avec l'API.
 */

// Modifiez cette URL si votre API tourne ailleurs qu'en local.
export const API_BASE_URL = "http://localhost:3000/api/v1";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export type Role = "client" | "manager" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export const Auth = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },
  setUser(user: AuthUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },
  hasRole(...roles: Role[]): boolean {
    const user = this.getUser();
    return !!user && roles.includes(user.role);
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

/** Appelle l'API et renvoie directement `data`. Leve une Error en cas d'echec. */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  const token = Auth.getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      "Impossible de joindre le serveur PROMOVE. Vérifiez que l'API est démarrée.",
    );
  }

  let body: { data?: T; message?: string | string[] } | null = null;
  try {
    body = await response.json();
  } catch {
    // reponse vide (204) - ignore
  }

  if (!response.ok) {
    const message = body?.message ?? "Une erreur est survenue";
    const text = Array.isArray(message) ? message.join(", ") : message;
    if (response.status === 401) Auth.logout();
    throw new Error(text);
  }

  return body?.data as T;
}

// --- Types metier ---

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  transmission: string;
  fuelType: string;
  seats: number;
  pricePerDay: number;
  currency: string;
  description?: string;
  imageUrl?: string;
  available: boolean;
  mileageLimitKm?: number;
}

export interface Booking {
  id: string;
  carId: string;
  car?: Car;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation?: string;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  totalPrice: number;
  currency: string;
}

export interface Review {
  id: string;
  carId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { firstName: string; lastName: string };
}

export interface ParkingSpot {
  id: string;
  spotNumber: number;
  zone: string;
  isOccupied: boolean;
  carPlate?: string;
  ownerName?: string;
  vehicleModel?: string;
}

// --- Endpoints ---

export const AuthApi = {
  login: (email: string, password: string) =>
    apiFetch<{ accessToken: string; user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) =>
    apiFetch<{ accessToken: string; user: AuthUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  me: () => apiFetch<AuthUser>("/auth/me"),
};

export const CarsApi = {
  list: (params?: Record<string, string>) =>
    apiFetch<Car[]>(`/cars${params ? "?" + new URLSearchParams(params) : ""}`),
  get: (id: string) => apiFetch<Car>(`/cars/${id}`),
};

export const BookingsApi = {
  create: (payload: {
    carId: string;
    startDate: string;
    endDate: string;
    pickupLocation: string;
  }) => apiFetch<Booking>("/bookings", { method: "POST", body: JSON.stringify(payload) }),
  list: () => apiFetch<Booking[]>("/bookings"),
  cancel: (id: string) => apiFetch<Booking>(`/bookings/${id}/cancel`, { method: "PATCH" }),
};

export const WeatherApi = {
  get: (city: string) =>
    apiFetch<{
      city: string;
      country?: string;
      temperature: number;
      humidity: number;
      description?: string;
    }>(`/weather?city=${encodeURIComponent(city)}`),
};

export const CurrencyApi = {
  rates: (base = "XOF") =>
    apiFetch<{ base: string; rates: Record<string, number>; lastUpdate: string }>(
      `/currency/rates?base=${base}`,
    ),
};

export const ReviewsApi = {
  listByCar: (carId: string) => apiFetch<Review[]>(`/reviews/car/${carId}`),
  create: (payload: { carId: string; rating: number; comment?: string }) =>
    apiFetch<Review>("/reviews", { method: "POST", body: JSON.stringify(payload) }),
  remove: (id: string) => apiFetch<void>(`/reviews/${id}`, { method: "DELETE" }),
};

export const ParkingApi = {
  list: () => apiFetch<ParkingSpot[]>("/parking"),
  stats: () => apiFetch<{ total: number; occupied: number; free: number }>("/parking/stats"),
  occupy: (id: string, payload: { carPlate: string; ownerName: string; vehicleModel?: string }) =>
    apiFetch<ParkingSpot>(`/parking/${id}/occupy`, { method: "PATCH", body: JSON.stringify(payload) }),
  release: (id: string) => apiFetch<ParkingSpot>(`/parking/${id}/release`, { method: "PATCH" }),
};
