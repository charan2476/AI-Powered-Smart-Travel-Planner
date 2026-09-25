import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PlanTripPage from './pages/PlanTripPage';
import TripDetailsPage from './pages/TripDetailsPage';
import EditTripPage from './pages/EditTripPage';
import ExplorePage from './pages/ExplorePage';
import DestinationDetailsPage from './pages/DestinationDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

export const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/explore/:id" element={<DestinationDetailsPage />} />

                {/* Protected Authenticated Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/plan"
                  element={
                    <ProtectedRoute>
                      <PlanTripPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trips/:id"
                  element={
                    <ProtectedRoute>
                      <TripDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trips/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EditTripPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
