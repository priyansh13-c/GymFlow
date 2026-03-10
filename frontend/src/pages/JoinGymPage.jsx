import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memberService } from '../services/authService';

export const JoinGymPage = () => {
  const [gymCode, setGymCode] = useState('');
  const [membershipType, setMembershipType] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await memberService.joinGym(gymCode, membershipType);
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/member/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join gym');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-xl p-8 w-full max-w-md'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Join a Gym</h1>
        <p className='text-gray-600 mb-6'>Enter your gym code to join</p>

        {error && <div className='bg-red-100 text-red-700 p-4 rounded mb-6'>{error}</div>}
        {success && (
          <div className='bg-green-100 text-green-700 p-4 rounded mb-6'>{success}</div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Gym Code</label>
            <input
              type='text'
              value={gymCode}
              onChange={(e) => setGymCode(e.target.value.toUpperCase())}
              placeholder='e.g., GYM123'
              className='w-full border border-gray-300 rounded px-4 py-3 text-lg tracking-widest text-center'
              required
            />
            <p className='text-sm text-gray-500 mt-2'>Ask your gym owner for the code</p>
          </div>

          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Membership Type</label>
            <select
              value={membershipType}
              onChange={(e) => setMembershipType(e.target.value)}
              className='w-full border border-gray-300 rounded px-4 py-2'
            >
              <option value='monthly'>Monthly</option>
              <option value='quarterly'>Quarterly (10% off)</option>
              <option value='annual'>Annual (15% off)</option>
            </select>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded disabled:opacity-50'
          >
            {loading ? 'Joining...' : 'Join Gym'}
          </button>
        </form>
      </div>
    </div>
  );
};
