import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChildAuthProvider, useChildAuth } from './contexts/ChildAuthContext';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ChildLoginPage from './components/auth/ChildLoginPage';
import ParentDashboard from './components/parent/ParentDashboard';
import ChildDashboard from './components/child/ChildDashboard';
import ChildDashboardNew from './components/child/ChildDashboardNew';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const ChildProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isChildAuthenticated } = useChildAuth();
  return isChildAuthenticated ? <>{children}</> : <Navigate to="/child-login" />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isChildAuthenticated } = useChildAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/parent" />} />
      <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/parent" />} />
      <Route path="/child-login" element={!isChildAuthenticated ? <ChildLoginPage /> : <Navigate to={`/child-dashboard/${localStorage.getItem('childData') ? JSON.parse(localStorage.getItem('childData')!).childId : '1'}`} />} />
      <Route path="/parent/*" element={
        <ProtectedRoute>
          <ParentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/child/:childId" element={
        <ProtectedRoute>
          <ChildDashboard />
        </ProtectedRoute>
      } />
      <Route path="/child-dashboard/:childId" element={
        <ChildProtectedRoute>
          <ChildDashboardNew />
        </ChildProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/parent" />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ChildAuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ChildAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
