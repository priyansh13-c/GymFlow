import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { gymService, memberService, trainerService } from '../services/authService';

export const TrainersPage = () => {
  const { user } = useAuth();
  const [gymId, setGymId] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [formData, setFormData] = useState({
    specialization: '',
    experience: '',
    qualification: '',
    hourlyRate: '',
    bio: '',
  });

  useEffect(() => {
    const loadGym = async () => {
      try {
        if (user?.role === 'gym_owner') {
          const res = await gymService.getOwnerGyms();
          setGymId(res.data.gym?._id);
        } else if (user?.role === 'gym_member') {
          const res = await memberService.getMembership();
          setGymId(res.data.membership?.gym?._id);
        }
      } catch (err) {
        console.error('Failed to load gym id', err);
      }
    };
    loadGym();
  }, [user]);

  useEffect(() => {
    const fetchTrainers = async () => {
      if (!gymId) return;
      try {
        const res = await trainerService.getTrainers(gymId);
        setTrainers(res.data.trainers || []);
      } catch (err) {
        console.error('Error fetching trainers', err);
      }
    };
    fetchTrainers();
  }, [gymId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // convert specialization comma-separated to array if needed
    const payload = { ...formData };
    if (typeof payload.specialization === 'string') {
      payload.specialization = payload.specialization
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);
    }
    await trainerService.createTrainer(gymId, payload);
      setFormData({
        specialization: '',
        experience: '',
        qualification: '',
        hourlyRate: '',
        bio: '',
      });
      // refresh list
      const res = await trainerService.getTrainers(gymId);
      setTrainers(res.data.trainers || []);
    } catch (err) {
      console.error('Error creating trainer', err);
    }
  };

  const handleBook = async (trainerId) => {
    const bookingDate = prompt('Enter booking date (YYYY-MM-DD):');
    if (!bookingDate) return;
    try {
      await trainerService.bookTrainer(trainerId, { bookingDate });
      alert('Booking request sent');
    } catch (err) {
      console.error('Error booking trainer', err);
      alert('Failed to send booking');
    }
  };

  return (
    <div className='p-6'>
      <h2 className='text-3xl font-bold mb-4'>Trainers</h2>
      {user?.role === 'gym_owner' && (
        <form onSubmit={handleCreate} className='mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <input
              placeholder='Specialization (comma separated)'
              value={formData.specialization}
              onChange={(e) =>
                setFormData({ ...formData, specialization: e.target.value })
              }
              className='border p-2 rounded'
            />
            <input
              type='number'
              placeholder='Experience (years)'
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              className='border p-2 rounded'
            />
            <input
              placeholder='Qualification'
              value={formData.qualification}
              onChange={(e) =>
                setFormData({ ...formData, qualification: e.target.value })
              }
              className='border p-2 rounded'
            />
            <input
              type='number'
              placeholder='Hourly Rate'
              value={formData.hourlyRate}
              onChange={(e) =>
                setFormData({ ...formData, hourlyRate: e.target.value })
              }
              className='border p-2 rounded'
            />
            <textarea
              placeholder='Bio'
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className='border p-2 rounded md:col-span-2'
            />
          </div>
          <button
            type='submit'
            className='mt-4 bg-blue-600 text-white px-4 py-2 rounded'
          >
            Add Trainer
          </button>
        </form>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {trainers.map((t) => (
          <div
            key={t._id}
            className='border rounded p-4 flex flex-col justify-between'
          >
            <div>
              <p className='font-semibold'>Specializations: {t.specialization?.join(', ')}</p>
              <p className='text-sm'>Bio: {t.bio}</p>
              {t.hourlyRate && <p className='text-sm'>Rate: ${t.hourlyRate}/hr</p>}
            </div>
            {user?.role === 'gym_member' && (
              <button
                onClick={() => handleBook(t._id)}
                className='mt-2 bg-green-600 text-white px-3 py-1 rounded'
              >
                Book
              </button>
            )}
          </div>
        ))}
        {trainers.length === 0 && <p>No trainers available</p>}
      </div>
    </div>
  );
};
