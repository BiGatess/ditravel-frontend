import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axios';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (token: string) => Promise<any>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axiosClient.get('/auth/me');
      setUser(res.data);
      setIsAuthenticated(true);
      return res.data;
    } catch (err) {
      localStorage.removeItem('admin_token');
      setIsAuthenticated(false);
      setUser(null);
      return null;
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      fetchUser();
    } else {
      setIsInitializing(false);
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('admin_token', token);
    setUser(null); // Clear old user immediately
    return await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isInitializing) return null;

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
