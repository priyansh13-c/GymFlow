import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children, requiredRole = null }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Wait for auth check to complete
    if (loading) return;

    if (!isAuthenticated) {
      navigate('/login');
    } else if (requiredRole && user?.role !== requiredRole) {
      navigate('/');
    }
  }, [isAuthenticated, user, requiredRole, navigate, loading]);

  // Show loading while checking authentication
  if (loading) {
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
  }

  if (!isAuthenticated) return null;
  if (requiredRole && user?.role !== requiredRole) return null;

  return children;
};
