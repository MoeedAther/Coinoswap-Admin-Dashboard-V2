import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: { email: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const session = sessionStorage.getItem('admin_session');
    if (session) {
      const userData = JSON.parse(session);
      setIsAuthenticated(true);
      setUser(userData);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo credentials - replace with actual API call
    if (email === 'admin@coinoswap.com' && password === 'admin123') {
      const userData = { email };
      sessionStorage.setItem('admin_session', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      toast.success('Login successful!');
      navigate('/dashboard');
      return true;
    }
    toast.error('Invalid credentials');
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
