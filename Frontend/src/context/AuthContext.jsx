import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

/* ── Pick the correct /me endpoint based on role ── */
const getProfileUrl = (role) => {
  if (role === 'ngo')   return 'http://127.0.0.1:3000/api/receiver/me';
  if (role === 'admin') return null; // admins have no separate profile endpoint
  return 'http://127.0.0.1:3000/api/donor/me';   // default: donor
};

/* ── Extract profile object regardless of response shape ── */
const extractProfile = (data, role) => {
  if (role === 'ngo')   return data?.data?.receiver ?? null;
  return data?.donor ?? null;
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  /* ── Rehydrate from localStorage on mount ── */
  useEffect(() => {
    const token    = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setIsAuthenticated(true);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setProfile(null);
  };

  /* ── Fetch profile — role-aware ── */
  const fetchProfile = async (role) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const url = getProfileUrl(role);
      if (!url) return; // admin — skip

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setProfile(extractProfile(data, role));
      } else {
        console.error('Failed to fetch profile:', data.message);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  /* ── Update profile — donor only ── */
  const updateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:3000/api/donor/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      if (data.success) {
        setProfile(data.donor);
        return data;
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  /* ── Re-fetch profile whenever auth state changes ── */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isAuthenticated && user?.role) {
      fetchProfile(user.role);
    }
  }, [isAuthenticated, user?.role]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, profile, login, logout, updateProfile, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}