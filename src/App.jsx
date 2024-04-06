import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { ThemeProvider } from './ThemeContext';
import { auth } from './firebase-config'; 
import HomePage from './pages/HomePage'; 
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import NotFoundPage from './pages/NotFoundPage';
import SettingsPage from './pages/SettingsPage';

const AuthenticatedRoute = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
    });
    return () => unsubscribe();
  }, [navigate]);

  return children;
};

function App() {
  return (
    <ThemeProvider>
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <AuthenticatedRoute>
              <HomePage />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <AuthenticatedRoute>
              <HistoryPage />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthenticatedRoute>
              <SettingsPage />
            </AuthenticatedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
