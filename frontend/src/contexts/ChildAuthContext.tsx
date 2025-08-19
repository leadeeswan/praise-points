import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface ChildAuthRequest {
  username: string;
  authKey: string;
}

interface ChildAuthResponse {
  token: string;
  childId: number;
  name: string;
  totalPoints: number;
}

interface ChildAuthContextType {
  isChildAuthenticated: boolean;
  childData: ChildAuthResponse | null;
  loginChild: (credentials: ChildAuthRequest) => Promise<ChildAuthResponse>;
  logoutChild: () => void;
}

const ChildAuthContext = createContext<ChildAuthContextType | undefined>(undefined);

interface ChildAuthProviderProps {
  children: ReactNode;
}

export const ChildAuthProvider: React.FC<ChildAuthProviderProps> = ({ children }) => {
  const [isChildAuthenticated, setIsChildAuthenticated] = useState(false);
  const [childData, setChildData] = useState<ChildAuthResponse | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('childToken');
    const storedChildData = localStorage.getItem('childData');
    
    if (token && storedChildData) {
      setIsChildAuthenticated(true);
      setChildData(JSON.parse(storedChildData));
    }
  }, []);

  const loginChild = async (credentials: ChildAuthRequest): Promise<ChildAuthResponse> => {
    try {
      const response = await axios.post<ChildAuthResponse>(
        'http://localhost:8080/api/child-auth/login',
        credentials
      );
      
      const { token } = response.data;
      
      localStorage.setItem('childToken', token);
      localStorage.setItem('childData', JSON.stringify(response.data));
      
      setIsChildAuthenticated(true);
      setChildData(response.data);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logoutChild = () => {
    localStorage.removeItem('childToken');
    localStorage.removeItem('childData');
    setIsChildAuthenticated(false);
    setChildData(null);
  };

  return (
    <ChildAuthContext.Provider value={{
      isChildAuthenticated,
      childData,
      loginChild,
      logoutChild
    }}>
      {children}
    </ChildAuthContext.Provider>
  );
};

export const useChildAuth = () => {
  const context = useContext(ChildAuthContext);
  if (!context) {
    throw new Error('useChildAuth must be used within a ChildAuthProvider');
  }
  return context;
};