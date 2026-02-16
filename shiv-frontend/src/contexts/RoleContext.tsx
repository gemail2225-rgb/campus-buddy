import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Role } from "@/types/role";

interface RoleContextType {
  role: Role | null;
  setRole: (role: Role | null) => void;
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  setRole: () => {}
});

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role | null>(null);

  // Initialize from login state, not localStorage for security
  useEffect(() => {
    // TODO: Validate role against backend session/token in production
  }, []);

  const setRole = (newRole: Role | null) => {
    // Don't store in localStorage - keep in session state only
    setRoleState(newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
