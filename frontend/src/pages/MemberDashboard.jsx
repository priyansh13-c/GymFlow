import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gymService, memberService, workoutService, noticeService } from '../services/authService';
import { useSocket } from '../services/socketService';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Alert, LoadingPage } from '../components/ui';

export const MemberDashboard = () => {
  const { user } = useAuth();
  const [membership, setMembership] = useState(null);
  const [gymCode, setGymCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [membershipType, setMembershipType] = useState('monthly');
  const [workouts, setWorkouts] = useState([]);
  const [notices, setNotices] = useState([]);
  const [exercise, setExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    date: new Date().toISOString().split('T')[0],
  });
  const socket = useSocket();

  useEffect(() => {
    fetchMembership();
  }, []);

  useEffect(() => {
    if (membership?.gym?._id) {
      fetchWorkouts();
      fetchNotices();

      if (socket) {
        socket.on('notice:received', handleNewNotice);
      }

      return () => {
        if (socket) {
          socket.off('notice:received', handleNewNotice);
        }
      };
    }
  }, [membership?.gym?._id, socket]);

  const fetchMembership = async () => {
    try {
      const response = await memberService.getMembership();
      setMembership(response.data.membership);
    } catch (err) {
      console.log('No membership found');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkouts = async () => {
    try {
      if (membership?.gym?._id) {
        const response = await workoutService.getUserWorkouts();
        setWorkouts(response.data.workouts || []);
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
    }
  };

  const fetchNotices = async () => {
    try {
      if (membership?.gym?._id) {
        const response = await noticeService.getNotices(membership.gym._id);
        setNotices(response.data.notices || []);
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
    }
  };

  const handleNewNotice = (notice) => {
    setNotices([notice, ...notices]);
  };

  const handleJoinGym = async (e) => {
    e.preventDefault();
    if (!gymCode) {
      setError('Please enter a gym code');
      return;
    }

    try {
      const response = await memberService.joinGym({
        gymCode: gymCode.toUpperCase(),
        membershipType,
      });
      setMembership(response.data.membership);
      setGymCode('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join gym');
    }
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    if (!exercise.name) {
      alert('Please enter exercise name');
      return;
    }

    try {
      const response = await workoutService.addWorkout({
        exercises: [exercise],
        date: exercise.date,
      });
      setWorkouts([response.data.workout, ...workouts]);
      setExercise({
        name: '',
        sets: '',
        reps: '',
        weight: '',
        duration: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Error adding exercise:', err);
    }
  };

  if (loading) return <LoadingPage message="Loading your dashboard..." />;

  // If no membership, show join gym form
  if (!membership) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Welcome to GymFlow</h1>
          <p className="text-lg text-neutral-600">Join a gym and start your fitness journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Join Gym Section */}
          <Card hover>
            <CardHeader>
              <CardTitle>Join a Gym</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-6">
                Ask your gym owner for their unique gym code and join!
              </p>

              {error && (
                <Alert type="error" message={error} className="mb-6" onClose={() => setError('')} />
              )}

              <form onSubmit={handleJoinGym} className="space-y-6">
                <Input
                  label="Gym Code"
                  type="text"
                  value={gymCode}
                  onChange={(e) => setGymCode(e.target.value.toUpperCase())}
                  placeholder="e.g., ABC12"
                  className="text-center text-2xl font-mono tracking-wider"
                  maxLength={6}
                />
                <p className="text-sm text-neutral-500 text-center">
                  Enter the code provided by your gym owner
                </p>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-700">
                    Membership Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['monthly', 'quarterly', 'annual'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setMembershipType(type)}
                        className={`p-3 text-center border rounded-lg transition-all capitalize ${
                          membershipType === type
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Join Gym
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="space-y-6">
            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">💪</div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Track Workouts</h3>
                    <p className="text-neutral-600">Log your exercises with sets, reps, and weight details</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">🍎</div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Calorie Tracking</h3>
                    <p className="text-neutral-600">Upload food images and get AI-powered nutrition analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">📋</div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Real-time Notices</h3>
                    <p className="text-neutral-600">Get instant updates and messages from your gym owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">📊</div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Analytics</h3>
                    <p className="text-neutral-600">Monitor your progress and fitness metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const daysRemaining = membership?.daysRemaining || 0;
  const isExpiringSoon = daysRemaining <= 7;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {membership.gym?.gymName}
          </h1>
          <p className="text-neutral-600 mt-1">Welcome back, {user?.name?.split(' ')[0]}!</p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Membership Card */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-primary-100 text-sm font-medium mb-2">Membership Type</p>
              <p className="text-2xl font-bold capitalize">{membership.membershipType}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-primary-100 text-sm font-medium mb-2">Days Remaining</p>
              <p className={`text-2xl font-bold ${isExpiringSoon ? 'text-warning-300' : ''}`}>
                {daysRemaining} days
              </p>
              <p className="text-primary-200 text-sm mt-1">
                Expires {new Date(membership.endDate).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-primary-100 text-sm font-medium mb-2">Status</p>
              <p className={`text-2xl font-bold ${membership.isPaid ? 'text-success-300' : 'text-warning-300'}`}>
                {membership.isPaid ? '✓ Paid' : '⚠ Pending'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workout Logging */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddExercise} className="space-y-4">
                <Input
                  label="Exercise Name"
                  type="text"
                  value={exercise.name}
                  onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
                  placeholder="e.g., Bench Press"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Sets"
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => setExercise({ ...exercise, sets: e.target.value })}
                  />
                  <Input
                    label="Reps"
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => setExercise({ ...exercise, reps: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Weight (kg)"
                    type="number"
                    value={exercise.weight}
                    onChange={(e) => setExercise({ ...exercise, weight: e.target.value })}
                  />
                  <Input
                    label="Duration (min)"
                    type="number"
                    value={exercise.duration}
                    onChange={(e) => setExercise({ ...exercise, duration: e.target.value })}
                  />
                </div>

                <Input
                  label="Date"
                  type="date"
                  value={exercise.date}
                  onChange={(e) => setExercise({ ...exercise, date: e.target.value })}
                />

                <Button type="submit" className="w-full">
                  Log Exercise
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Workouts List & Notices */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workouts */}
          <Card>
            <CardHeader>
              <CardTitle>Your Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {workouts.length === 0 ? (
                  <p className="text-neutral-500 text-center py-8">No workouts logged yet. Start exercising!</p>
                ) : (
                  workouts.map((workout) => (
                    <div key={workout._id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                      <p className="font-semibold text-neutral-900 mb-2">
                        {new Date(workout.date || workout.createdAt).toLocaleDateString()}
                      </p>
                      {workout.exercises?.map((ex, idx) => (
                        <div key={idx} className="text-sm text-neutral-600 ml-4">
                          <p className="font-medium">• {ex.name}</p>
                          <p className="ml-4 text-neutral-500">
                            {ex.sets && `${ex.sets} sets`}
                            {ex.reps && ` × ${ex.reps} reps`}
                            {ex.weight && ` @ ${ex.weight} kg`}
                            {ex.duration && ` (${ex.duration} min)`}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notices from Gym Owner */}
          <Card>
            <CardHeader>
              <CardTitle>Gym Notices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {notices.length === 0 ? (
                  <p className="text-neutral-500 text-center py-8">No notices from your gym yet</p>
                ) : (
                  notices.map((notice) => (
                    <Alert
                      key={notice._id}
                      type={notice.priority === 'high' ? 'error' : notice.priority === 'medium' ? 'warning' : 'info'}
                      title={notice.title}
                      message={notice.content}
                      className="border-l-4"
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Links */}
      {membership?.gym?._id && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/member/calories">
            <Card hover className="cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🍎</div>
                <h3 className="font-semibold text-neutral-900">Calories</h3>
              </CardContent>
            </Card>
          </Link>
          <Link to="/member/trainers">
            <Card hover className="cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">👨‍🏫</div>
                <h3 className="font-semibold text-neutral-900">Trainers</h3>
              </CardContent>
            </Card>
          </Link>
          <Link to="/member/analytics">
            <Card hover className="cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-neutral-900">Analytics</h3>
              </CardContent>
            </Card>
          </Link>
          <Link to="/member/profile">
            <Card hover className="cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">👤</div>
                <h3 className="font-semibold text-neutral-900">Profile</h3>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
};
