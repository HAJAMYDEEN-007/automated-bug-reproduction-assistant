import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organisation, RoleType } from '../types';
import { fetchUsers, fetchOrganisations } from '../api';

interface AuthContextType {
  currentUser: User | null;
  currentOrg: Organisation | null;
  users: User[];
  orgs: Organisation[];
  switchUser: (userId: string) => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentOrg, setCurrentOrg] = useState<Organisation | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const uList = await fetchUsers();
        const oList = await fetchOrganisations();
        setUsers(uList);
        setOrgs(oList);

        // Default to David Chen (Analyst) or first user
        if (uList.length > 0) {
          const defaultUser = uList.find(u => u.email === 'analyst@example.gov') || uList[0];
          setCurrentUser(defaultUser);
          const userOrg = oList.find(o => o.id === defaultUser.organisation_id) || oList[0];
          setCurrentOrg(userOrg);
        }
      } catch (err) {
        console.error('Failed to load auth context', err);
      }
    }
    init();
  }, []);

  const switchUser = (userId: string) => {
    const foundUser = users.find(u => u.id === userId);
    if (foundUser) {
      setCurrentUser(foundUser);
      const foundOrg = orgs.find(o => o.id === foundUser.organisation_id) || null;
      setCurrentOrg(foundOrg);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    const role = currentUser.role;

    if (role === 'ADMIN') return true; // Admin has all permissions

    switch (permission) {
      case 'create_bug':
        return ['ADMIN', 'TRIAGE_ANALYST', 'EXTERNAL_PARTNER'].includes(role);
      case 'run_analysis':
        return ['ADMIN', 'TRIAGE_ANALYST'].includes(role);
      case 'generate_scenario':
        return ['ADMIN', 'TRIAGE_ANALYST'].includes(role);
      case 'approve_scenario':
        return ['ADMIN', 'TRIAGE_ANALYST', 'QA_ENGINEER'].includes(role);
      case 'override_scenario':
        return ['ADMIN', 'TRIAGE_ANALYST', 'QA_ENGINEER'].includes(role);
      case 'execute_scenario':
        return ['ADMIN', 'QA_ENGINEER'].includes(role);
      case 'view_audit':
        return ['ADMIN', 'TRIAGE_ANALYST', 'QA_ENGINEER', 'AUDITOR'].includes(role); // Partner excluded
      case 'view_metrics':
        return ['ADMIN', 'TRIAGE_ANALYST', 'AUDITOR'].includes(role);
      case 'manage_users':
        return role === 'ADMIN';
      default:
        return true;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, currentOrg, users, orgs, switchUser, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
