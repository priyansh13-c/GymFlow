import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className='bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div
            className='text-2xl font-bold cursor-pointer'
            onClick={() => navigate('/')}
          >
            GymFlow
          </div>

          <div className='flex items-center gap-4'>
            {isAuthenticated && (
              <>
                <span className='text-sm'>{user?.name}</span>
                <span className='text-xs bg-blue-700 px-3 py-1 rounded-full'>
                  {user?.role === 'gym_owner' ? 'Gym Owner' : 'Member'}
                </span>
                <button
                  onClick={handleLogout}
                  className='bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm'
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
