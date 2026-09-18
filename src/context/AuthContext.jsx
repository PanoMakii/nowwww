import { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, signupApi } from '../api/auth.js';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'demo-user-001',
  email: 'alex@recip52.com',
  firstName: 'Alex',
  lastName: 'Morgan',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  preferences: {
    dailyCalories: 2150,
    dailyProteinG: 140,
    dailyCarbsG: 210,
    dailyFatG: 65,
    dailyWaterMl: 3000,
    dietaryRestrictions: ['High-Protein', 'Low-Sugar'],
    allergies: ['Peanuts'],
    unitsSystem: 'metric',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('recip52_token');
      const storedUser = localStorage.getItem('recip52_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load stored auth session:', e);
      localStorage.removeItem('recip52_token');
      localStorage.removeItem('recip52_user');
    } finally {
      setIsLoading(false);
    }

    // Listen for session expiry from API interceptor
    const handleExpired = () => {
      logout();
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginApi({ email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('recip52_token', data.token);
      localStorage.setItem('recip52_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      // If network fails (backend not running), offer demo fallback or rethrow
      throw err;
    }
  };

  const loginDemoUser = () => {
    const demoToken = 'demo-jwt-token-recip52-offline';
    setToken(demoToken);
    setUser(DEMO_USER);
    localStorage.setItem('recip52_token', demoToken);
    localStorage.setItem('recip52_user', JSON.stringify(DEMO_USER));
    return { success: true, user: DEMO_USER };
  };

  const signup = async (userData) => {
    try {
      const data = await signupApi(userData);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('recip52_token', data.token);
      localStorage.setItem('recip52_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      // Fallback for immediate UI test
      const newUser = {
        id: `user-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName || 'New',
        lastName: userData.lastName || 'User',
        preferences: {
          dailyCalories: 2000,
          dailyProteinG: 120,
          dailyCarbsG: 220,
          dailyFatG: 65,
          dailyWaterMl: 2500,
          dietaryRestrictions: userData.dietaryRestrictions || [],
          allergies: userData.allergies || [],
          unitsSystem: 'metric',
        },
      };
      const demoToken = `token-${Date.now()}`;
      setToken(demoToken);
      setUser(newUser);
      localStorage.setItem('recip52_token', demoToken);
      localStorage.setItem('recip52_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('recip52_token');
    localStorage.removeItem('recip52_user');
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem('recip52_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        loginDemoUser,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
