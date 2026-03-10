import { useState, useEffect } from 'react';
import { workoutService } from '../services/authService';

export const WorkoutTrackerPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    exercises: [{ exerciseName: '', sets: 0, reps: 0, weight: '', duration: 0 }],
    totalDurationMinutes: 0,
    totalCaloriesBurned: 0,
    notes: '',
  });

  const gymId = 'test-gym-id'; // Replace with actual gym ID from context

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      // const response = await workoutService.getUserWorkouts(gymId);
      // setWorkouts(response.data.workouts);
      
      // Mock data for demo
      setWorkouts([
        {
          _id: '1',
          date: new Date().toISOString(),
          exercises: [
            { exerciseName: 'Push-ups', sets: 3, reps: 15, weight: '0', duration: 0 },
            { exerciseName: 'Running', sets: 1, reps: 0, weight: '0', duration: 30 },
          ],
          totalDurationMinutes: 45,
          totalCaloriesBurned: 350,
          notes: 'Great workout!',
        },
      ]);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { exerciseName: '', sets: 0, reps: 0, weight: '', duration: 0 }],
    });
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index][field] = field === 'exerciseName' ? value : parseFloat(value) || 0;
    setFormData({ ...formData, exercises: newExercises });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await workoutService.addWorkout(gymId, formData);
      setFormData({
        exercises: [{ exerciseName: '', sets: 0, reps: 0, weight: '', duration: 0 }],
        totalDurationMinutes: 0,
        totalCaloriesBurned: 0,
        notes: '',
      });
      setShowForm(false);
      fetchWorkouts();
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  if (loading) return <div className='text-center py-10'>Loading...</div>;

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold text-gray-800'>Workout Tracker</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded'
        >
          {showForm ? 'Cancel' : 'Log Workout'}
        </button>
      </div>

      {showForm && (
        <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
          <h2 className='text-2xl font-bold mb-4'>Add New Workout</h2>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-4'>
              {formData.exercises.map((exercise, index) => (
                <div key={index} className='border p-4 rounded bg-gray-50'>
                  <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                    <input
                      type='text'
                      placeholder='Exercise name'
                      value={exercise.exerciseName}
                      onChange={(e) => handleExerciseChange(index, 'exerciseName', e.target.value)}
                      className='border rounded px-3 py-2'
                    />
                    <input
                      type='number'
                      placeholder='Sets'
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                      className='border rounded px-3 py-2'
                    />
                    <input
                      type='number'
                      placeholder='Reps'
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                      className='border rounded px-3 py-2'
                    />
                    <input
                      type='text'
                      placeholder='Weight'
                      value={exercise.weight}
                      onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                      className='border rounded px-3 py-2'
                    />
                    <input
                      type='number'
                      placeholder='Duration (min)'
                      value={exercise.duration}
                      onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                      className='border rounded px-3 py-2'
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type='button'
              onClick={handleAddExercise}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
            >
              + Add Exercise
            </button>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-gray-700 font-semibold mb-2'>
                  Total Duration (min)
                </label>
                <input
                  type='number'
                  value={formData.totalDurationMinutes}
                  onChange={(e) =>
                    setFormData({ ...formData, totalDurationMinutes: e.target.value })
                  }
                  className='w-full border rounded px-4 py-2'
                />
              </div>
              <div>
                <label className='block text-gray-700 font-semibold mb-2'>
                  Calories Burned
                </label>
                <input
                  type='number'
                  value={formData.totalCaloriesBurned}
                  onChange={(e) =>
                    setFormData({ ...formData, totalCaloriesBurned: e.target.value })
                  }
                  className='w-full border rounded px-4 py-2'
                />
              </div>
            </div>

            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className='w-full border rounded px-4 py-2 h-24'
              />
            </div>

            <button
              type='submit'
              className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded'
            >
              Save Workout
            </button>
          </form>
        </div>
      )}

      {/* Workouts List */}
      <div className='space-y-4'>
        {workouts.map((workout) => (
          <div key={workout._id} className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h3 className='text-xl font-bold'>
                  {new Date(workout.date).toLocaleDateString()}
                </h3>
                <p className='text-gray-600'>{workout.notes}</p>
              </div>
              <div className='text-right text-sm'>
                <p className='text-gray-700'>
                  <strong>{workout.totalDurationMinutes}</strong> min
                </p>
                <p className='text-green-600 font-bold'>
                  {workout.totalCaloriesBurned} kcal
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {workout.exercises.map((exercise, idx) => (
                <div key={idx} className='bg-gray-50 p-3 rounded'>
                  <p className='font-semibold'>{exercise.exerciseName}</p>
                  <p className='text-sm text-gray-600'>
                    {exercise.sets} sets × {exercise.reps} reps
                    {exercise.weight && ` @ ${exercise.weight}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
