// Simple auth service for JWT handling
export type AuthTokens = { access: string; refresh: string };

const ACCESS_KEY = 'auth_access_token';
const REFRESH_KEY = 'auth_refresh_token';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://jobsabroad.onrender.com/api';

function saveTokens(tokens: AuthTokens) {
  localStorage.setItem(ACCESS_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function login(usernameOrEmail: string, password: string): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: usernameOrEmail, password }),
  });
  if (!res.ok) {
    throw new Error('Invalid credentials');
  }
  const data = await res.json();
  const tokens: AuthTokens = { access: data.access, refresh: data.refresh };
  saveTokens(tokens);
  return tokens;
}

export function parseJwt(token: string | null): any | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function isAdminToken(token: string | null): boolean {
  const claims = parseJwt(token);
  if (!claims) return false;
  if (claims.is_staff) return true;
  const groups: string[] = claims.groups || [];
  return Array.isArray(groups) && groups.map(g => String(g).toLowerCase()).includes('admin');
}

export async function fetchDashboard(): Promise<any> {
  const access = getAccessToken();
  if (!access) throw new Error('No token');
  const res = await fetch(`${API_BASE}/dashboard/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
}

export function logout() {
  clearTokens();
}
