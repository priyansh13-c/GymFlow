import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gymService } from '../services/authService';

export const GymSetupPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gymData, setGymData] = useState({
    gymName: '',
    description: '',
    address: '',
    city: '',
    monthlyFee: 0,
    annualFee: 0,
    facilities: [],
    openingTime: '6:00 AM',
    closingTime: '10:00 PM',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingGym, setExistingGym] = useState(null);
  const [facilityInput, setFacilityInput] = useState('');

  useEffect(() => {
    // Check if owner already has a gym
    checkExistingGym();
  }, []);

  const checkExistingGym = async () => {
    try {
      // Try to fetch gym created by this user
      const response = await gymService.getOwnerGyms();
      if (response.data.gym) {
        setExistingGym(response.data.gym);
      }
    } catch (err) {
      console.log('No existing gym found');
    }
  };

  const handleAddFacility = () => {
    if (facilityInput && !gymData.facilities.includes(facilityInput)) {
      setGymData({
        ...gymData,
        facilities: [...gymData.facilities, facilityInput],
      });
      setFacilityInput('');
    }
  };

  const handleRemoveFacility = (facility) => {
    setGymData({
      ...gymData,
      facilities: gymData.facilities.filter((f) => f !== facility),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await gymService.createGym(gymData);
      setSuccess(`✓ Gym created! Your gym code is: ${response.data.gym.gymCode}`);
      setExistingGym(response.data.gym);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create gym');
    } finally {
      setLoading(false);
    }
  };

  if (existingGym) {
    return (
      <div className='max-w-4xl mx-auto p-6'>
        <h1 className='text-4xl font-bold text-neutral-900 mb-8'>Your Gym</h1>

        <div className='bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-lg shadow-xl p-8 mb-6'>
          <h2 className='text-3xl font-bold mb-6'>{existingGym.gymName}</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div className='bg-primary-500 bg-opacity-50 rounded p-4'>
              <p className='text-primary-100 text-sm font-semibold mb-1'>Gym Code</p>
              <p className='text-4xl font-bold'>{existingGym.gymCode}</p>
              <p className='text-primary-100 text-sm mt-2'>Share this code with members</p>
            </div>

            <div className='bg-primary-500 bg-opacity-50 rounded p-4'>
              <p className='text-primary-100 text-sm font-semibold mb-1'>Total Members</p>
              <p className='text-4xl font-bold'>{existingGym.totalMembers || 0}</p>
            </div>

            <div className='bg-primary-500 bg-opacity-50 rounded p-4'>
              <p className='text-primary-100 text-sm font-semibold mb-1'>Monthly Fee</p>
              <p className='text-4xl font-bold'>${existingGym.monthlyFee}</p>
            </div>

            <div className='bg-primary-500 bg-opacity-50 rounded p-4'>
              <p className='text-primary-100 text-sm font-semibold mb-1'>Facilities</p>
              <p className='text-2xl font-bold'>{existingGym.facilities?.length || 0}</p>
            </div>
          </div>

          <div className='bg-primary-500 bg-opacity-30 rounded p-4'>
            <p className='text-primary-100 text-sm font-semibold mb-2'>Location</p>
            <p className='text-white'>{existingGym.address}</p>
            <p className='text-white'>{existingGym.city}</p>
            <p className='text-primary-100 text-sm mt-3'>
              Hours: {existingGym.openingTime} - {existingGym.closingTime}
            </p>
          </div>

          <button
            onClick={() => navigate('/owner/manage-members')}
            className='mt-8 w-full bg-white text-primary-600 font-bold py-3 rounded-lg hover:bg-primary-50'
          >
            Manage Members
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-4xl font-bold text-neutral-900 mb-2'>Create Your Gym</h1>
      <p className='text-neutral-600 mb-8'>Set up your gym profile and get a unique code for members</p>

      {error && <div className='bg-red-100 text-red-700 p-4 rounded mb-6'>{error}</div>}
      {success && <div className='bg-green-100 text-green-700 p-4 rounded mb-6'>{success}</div>}

      <form onSubmit={handleSubmit} className='bg-white rounded-lg shadow-lg p-8 space-y-6'>
        <div>
          <label className='block text-neutral-700 font-semibold mb-2'>Gym Name *</label>
          <input
            type='text'
            value={gymData.gymName}
            onChange={(e) => setGymData({ ...gymData, gymName: e.target.value })}
            className='w-full border border-neutral-300 rounded px-4 py-2'
            required
          />
        </div>

        <div>
          <label className='block text-neutral-700 font-semibold mb-2'>Description</label>
          <textarea
            value={gymData.description}
            onChange={(e) => setGymData({ ...gymData, description: e.target.value })}
            className='w-full border border-neutral-300 rounded px-4 py-2'
            rows='3'
          />
        </div>

        <div>
          <label className='block text-neutral-700 font-semibold mb-2'>Address</label>
          <input
            type='text'
            value={gymData.address}
            onChange={(e) => setGymData({ ...gymData, address: e.target.value })}
            className='w-full border border-neutral-300 rounded px-4 py-2'
          />
        </div>

        <div>
          <label className='block text-neutral-700 font-semibold mb-2'>City</label>
          <input
            type='text'
            value={gymData.city}
            onChange={(e) => setGymData({ ...gymData, city: e.target.value })}
            className='w-full border border-neutral-300 rounded px-4 py-2'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-neutral-700 font-semibold mb-2'>Monthly Fee</label>
            <input
              type='number'
              value={gymData.monthlyFee}
              onChange={(e) => setGymData({ ...gymData, monthlyFee: Number(e.target.value) })}
              className='w-full border border-neutral-300 rounded px-4 py-2'
            />
          </div>
          <div>
            <label className='block text-neutral-700 font-semibold mb-2'>Annual Fee</label>
            <input
              type='number'
              value={gymData.annualFee}
              onChange={(e) => setGymData({ ...gymData, annualFee: Number(e.target.value) })}
              className='w-full border border-neutral-300 rounded px-4 py-2'
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-neutral-700 font-semibold mb-2'>Opening Time</label>
            <input
              type='text'
              value={gymData.openingTime}
              onChange={(e) => setGymData({ ...gymData, openingTime: e.target.value })}
              className='w-full border border-neutral-300 rounded px-4 py-2'
            />
          </div>
          <div>
            <label className='block text-neutral-700 font-semibold mb-2'>Closing Time</label>
            <input
              type='text'
              value={gymData.closingTime}
              onChange={(e) => setGymData({ ...gymData, closingTime: e.target.value })}
              className='w-full border border-neutral-300 rounded px-4 py-2'
            />
          </div>
        </div>

        <div>
          <label className='block text-neutral-700 font-semibold mb-2'>Facilities</label>
          <div className='flex gap-2 mb-3'>
            <input
              type='text'
              value={facilityInput}
              onChange={(e) => setFacilityInput(e.target.value)}
              placeholder='e.g., Cardio, Weights, Yoga'
              className='flex-1 border border-neutral-300 rounded px-4 py-2'
            />
            <button
              type='button'
              onClick={handleAddFacility}
              className='bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700'
            >
              Add
            </button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {gymData.facilities.map((facility) => (
              <span
                key={facility}
                className='bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2'
              >
                {facility}
                <button
                  type='button'
                  onClick={() => handleRemoveFacility(facility)}
                  className='font-bold hover:text-red-600'
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 rounded disabled:opacity-50'
        >
          {loading ? 'Creating...' : 'Create Gym'}
        </button>
      </form>
    </div>
  );
};
