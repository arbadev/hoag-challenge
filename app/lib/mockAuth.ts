export interface User {
  id: string;
  name: string;
  role: 'admin' | 'provider';
}

const STORAGE_KEY = 'scheduling_app_user';

const isClientSide = typeof window !== 'undefined';

export const mockAuth = {
  login: (role: 'admin' | 'provider'): User => {
    const user: User = {
      id: `${role}-${Date.now()}`,
      name: role === 'admin' ? 'Admin User' : 'Provider User',
      role
    };
    
    if (isClientSide) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  },

  logout: (): void => {
    if (isClientSide) {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  getCurrentUser: (): User | null => {
    if (!isClientSide) {
      return null;
    }
    
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (!storedUser) return null;
    
    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return mockAuth.getCurrentUser() !== null;
  },

  hasRole: (role: 'admin' | 'provider'): boolean => {
    const user = mockAuth.getCurrentUser();
    return user?.role === role;
  }
};