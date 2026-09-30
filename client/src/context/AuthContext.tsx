import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import api from '../services/api';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN';

export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  preferredLanguage?: string;
  location?: {
    city?: string;
    state?: string;
    area?: string;
    pincode?: string;
  };
};

type AuthContextValue = {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('bma_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('bma_token');
    if (storedToken) {
      setToken(storedToken);
      refreshProfile().catch(() => logout()).finally(() => setLoading(false));
      return;
    }
    setLoading(false);
  }, []);

  async function refreshProfile() {
    const response = await api.get('/users/profile');
    setUser(response.data);
  }

  function login(nextToken: string, nextUser: UserProfile) {
    localStorage.setItem('bma_token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }

  function logout() {
    localStorage.removeItem('bma_token');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, token, loading, login, logout, refreshProfile }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
