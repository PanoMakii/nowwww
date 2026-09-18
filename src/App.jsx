import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './api/queryClient.js';
import { AuthProvider } from './context/AuthContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Layouts
import AppLayout from './layouts/AppLayout/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout/AuthLayout.jsx';

// Lazy load pages for code splitting & optimum performance
const LandingPage = lazy(() => import('./pages/Landing/LandingPage.jsx'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/Auth/SignupPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage.jsx'));
const VerifyEmailPage = lazy(() => import('./pages/Auth/VerifyEmailPage.jsx'));

const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage.jsx'));
const MealsPage = lazy(() => import('./pages/Meals/MealsPage.jsx'));
const RecipesPage = lazy(() => import('./pages/Recipes/RecipesPage.jsx'));
const PlansPage = lazy(() => import('./pages/Plans/PlansPage.jsx'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage.jsx'));
const WearablesPage = lazy(() => import('./pages/Wearables/WearablesPage.jsx'));
const CommunityPage = lazy(() => import('./pages/Community/CommunityPage.jsx'));

function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: '#F4C430',
        fontFamily: "'Hanken Grotesk', sans-serif",
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(244, 196, 48, 0.2)',
            borderTopColor: '#F4C430',
            borderRadius: '50%',
            animation: 'appSpin 0.8s linear infinite',
            margin: '0 auto 12px',
          }}
        />
        <style>{`@keyframes appSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* 1. Landing Page (Default Public Route) */}
                <Route path="/" element={<LandingPage />} />

                {/* 2. Authentication Flow */}
                <Route path="/auth" element={<AuthLayout />}>
                  <Route index element={<Navigate to="/auth/login" replace />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="signup" element={<SignupPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="verify-email" element={<VerifyEmailPage />} />
                </Route>

                {/* 3. Protected Application Shell */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/meals" element={<MealsPage />} />
                  <Route path="/recipes" element={<RecipesPage />} />
                  <Route path="/plans" element={<PlansPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/wearables" element={<WearablesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>


                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
