import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Role } from "@/types/role";
import { users } from "@/data/mockData";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, selectedRole: Role) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for saved user on mount
  useEffect(() => {
    // Restore user from localStorage on mount
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, selectedRole: Role): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user with matching email and role
    const foundUser = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.role === selectedRole
    );

    if (foundUser) {
      // In a real app, you'd verify password here
      // For demo, any password works
      setUser(foundUser);
      // Save user to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }

    setError("Invalid email or role combination");
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};