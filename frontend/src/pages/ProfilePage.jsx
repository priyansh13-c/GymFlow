import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.updateProfile(formData);
      setUser(res.data.user);
      setMessage('Profile updated successfully');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-6 max-w-md mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>Your Profile</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-semibold'>Name</label>
          <input
            type='text'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className='w-full border p-2 rounded'
          />
        </div>
        <div>
          <label className='block text-sm font-semibold'>Phone</label>
          <input
            type='text'
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className='w-full border p-2 rounded'
          />
        </div>
        <button
          type='submit'
          disabled={loading}
          className='bg-blue-600 text-white px-4 py-2 rounded'
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
      {message && <p className='mt-2 text-sm'>{message}</p>}
    </div>
  );
};