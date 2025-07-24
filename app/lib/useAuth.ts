import { useEffect, useState } from 'react';
import { mockAuth, type User } from './mockAuth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only check auth on client side after mount
    const currentUser = mockAuth.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (role: 'admin' | 'provider') => {
    const newUser = mockAuth.login(role);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    mockAuth.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (role: 'admin' | 'provider') => {
    return user?.role === role;
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole
  };
}