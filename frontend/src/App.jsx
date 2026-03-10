import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './components/layout';
import { Navigation } from './components/Navigation';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { MemberDashboard } from './pages/MemberDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { GymSetupPage } from './pages/GymSetupPage';
import { JoinGymPage } from './pages/JoinGymPage';
import { WorkoutTrackerPage } from './pages/WorkoutTrackerPage';
import { CalorieTrackerPage } from './pages/CalorieTrackerPage';
import { NoticesPage } from './pages/NoticesPage';
import { TrainersPage } from './pages/TrainersPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import './styles/globals.css';

function DashboardRoutes() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <Routes>
        {/* Dashboard routes based on user role */}
        <Route
          path='/dashboard'
          element={
            user?.role === 'gym_owner' ? <OwnerDashboard /> : <MemberDashboard />
          }
        />

        {/* Member routes */}
        <Route path='/member/dashboard' element={<MemberDashboard />} />
        <Route path='/member/join-gym' element={<JoinGymPage />} />
        <Route path='/member/workouts' element={<WorkoutTrackerPage />} />
        <Route path='/member/calories' element={<CalorieTrackerPage />} />
        <Route path='/member/notices' element={<NoticesPage />} />
        <Route path='/member/trainers' element={<TrainersPage />} />
        <Route path='/member/profile' element={<ProfilePage />} />
        <Route path='/member/analytics' element={<AnalyticsPage />} />

        {/* Owner routes */}
        <Route path='/owner/gym-setup' element={<GymSetupPage />} />
        <Route path='/owner/dashboard' element={<OwnerDashboard />} />
        <Route path='/owner/notices' element={<NoticesPage />} />
        <Route path='/owner/trainers' element={<TrainersPage />} />
        <Route path='/owner/profile' element={<ProfilePage />} />
        <Route path='/owner/analytics' element={<AnalyticsPage />} />

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/dashboard' />} />
      </Routes>
    </DashboardLayout>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {!isAuthenticated && <Navigation />}
      <Routes>
        <Route path='/login' element={<LoginPage />} />

        {/* Public routes */}
        <Route path='/' element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />

        {/* Protected routes */}
        <Route
          path='/*'
          element={
            <PrivateRoute>
              <DashboardRoutes />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
