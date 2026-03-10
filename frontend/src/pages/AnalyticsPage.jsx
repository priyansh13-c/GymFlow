import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { memberService, gymService, workoutService } from '../services/authService';

export const AnalyticsPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [gymId, setGymId] = useState(null);

  useEffect(() => {
    const loadGym = async () => {
      try {
        if (user.role === 'gym_owner') {
          const res = await gymService.getOwnerGyms();
          setGymId(res.data.gym?._id);
        } else {
          const res = await memberService.getMembership();
          setGymId(res.data.membership?.gym?._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadGym();
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!gymId) return;
      // placeholder: fetch workouts count or other metrics
      try {
        const res = await workoutService.getUserWorkouts();
        setStats({ workouts: res.data.count });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [gymId]);

  return (
    <div className='p-6'>
      <h2 className='text-3xl font-bold mb-4'>Analytics</h2>
      {user.role === 'gym_owner' ? (
        <div>
          <p>Total workouts logged by members: {stats.workouts || 0}</p>
          {/* additional owner stats can be added here */}
        </div>
      ) : (
        <div>
          <p>Your workouts logged: {stats.workouts || 0}</p>
          {/* more member-specific analytics */}
        </div>
      )}
    </div>
  );
};