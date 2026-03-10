import { useState, useRef } from 'react';
import { calorieService } from '../services/authService';

export const CalorieTrackerPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mealType, setMealType] = useState('lunch');
  const [quantity, setQuantity] = useState('1 serving');
  const fileInputRef = useRef(null);

  const gymId = 'test-gym-id'; // Replace with actual gym ID

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files?.[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('foodImage', selectedFile);
      formData.append('mealType', mealType);
      formData.append('quantity', quantity);

      // const response = await calorieService.uploadFoodImage(gymId, formData);
      // const newLog = response.data.calorieLog;
      
      // Mock response
      const newLog = {
        _id: Date.now(),
        foodName: 'Uploaded Food',
        estimatedCalories: 450,
        estimatedCarbs: 55,
        estimatedProtein: 25,
        estimatedFats: 12,
        date: new Date().toISOString(),
        mealType,
        quantity,
      };

      setLogs([newLog, ...logs]);
      setSelectedFile(null);
      setQuantity('1 serving');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  // Calculate daily totals
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter((log) => new Date(log.date).toISOString().split('T')[0] === today);
  const dailyTotals = todayLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + (log.estimatedCalories || 0),
      carbs: acc.carbs + (log.estimatedCarbs || 0),
      protein: acc.protein + (log.estimatedProtein || 0),
      fats: acc.fats + (log.estimatedFats || 0),
    }),
    { calories: 0, carbs: 0, protein: 0, fats: 0 }
  );

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h1 className='text-4xl font-bold text-gray-800 mb-8'>Calorie Tracker</h1>

      {/* Upload Section */}
      <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
        <h2 className='text-2xl font-bold mb-4'>Upload Food Image</h2>
        <form onSubmit={handleUpload} className='space-y-4'>
          <div className='border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleFileSelect}
              className='hidden'
            />
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='text-blue-600 font-semibold hover:text-blue-800'
            >
              {selectedFile ? `Selected: ${selectedFile.name}` : 'Click to upload image or drag & drop'}
            </button>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className='w-full border rounded px-4 py-2'
              >
                <option value='breakfast'>Breakfast</option>
                <option value='lunch'>Lunch</option>
                <option value='dinner'>Dinner</option>
                <option value='snack'>Snack</option>
              </select>
            </div>
            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Quantity</label>
              <input
                type='text'
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder='e.g., 1 serving'
                className='w-full border rounded px-4 py-2'
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={!selectedFile || loading}
            className='w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded disabled:opacity-50'
          >
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        </form>
      </div>

      {/* Daily Summary */}
      {todayLogs.length > 0 && (
        <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
          <h2 className='text-2xl font-bold mb-4'>Today\'s Summary</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-red-50 p-4 rounded text-center'>
              <p className='text-gray-600 text-sm'>Calories</p>
              <p className='text-2xl font-bold text-red-600'>{dailyTotals.calories}</p>
              <p className='text-xs text-gray-500'>kcal</p>
            </div>
            <div className='bg-orange-50 p-4 rounded text-center'>
              <p className='text-gray-600 text-sm'>Carbs</p>
              <p className='text-2xl font-bold text-orange-600'>{dailyTotals.carbs.toFixed(1)}</p>
              <p className='text-xs text-gray-500'>g</p>
            </div>
            <div className='bg-green-50 p-4 rounded text-center'>
              <p className='text-gray-600 text-sm'>Protein</p>
              <p className='text-2xl font-bold text-green-600'>{dailyTotals.protein.toFixed(1)}</p>
              <p className='text-xs text-gray-500'>g</p>
            </div>
            <div className='bg-blue-50 p-4 rounded text-center'>
              <p className='text-gray-600 text-sm'>Fats</p>
              <p className='text-2xl font-bold text-blue-600'>{dailyTotals.fats.toFixed(1)}</p>
              <p className='text-xs text-gray-500'>g</p>
            </div>
          </div>
        </div>
      )}

      {/* Calorie Logs */}
      <div className='space-y-4'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Food Logs</h2>
        {logs.map((log) => (
          <div key={log._id} className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h3 className='text-xl font-bold capitalize'>{log.foodName}</h3>
                <p className='text-sm text-gray-600'>
                  {new Date(log.date).toLocaleDateString()} • {log.mealType} • {log.quantity}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-2xl font-bold text-red-600'>{log.estimatedCalories} kcal</p>
              </div>
            </div>
            <div className='grid grid-cols-3 gap-4 text-sm'>
              <div className='bg-orange-50 p-3 rounded text-center'>
                <p className='text-gray-600'>Carbs</p>
                <p className='font-bold text-orange-600'>{log.estimatedCarbs?.toFixed(1)} g</p>
              </div>
              <div className='bg-green-50 p-3 rounded text-center'>
                <p className='text-gray-600'>Protein</p>
                <p className='font-bold text-green-600'>{log.estimatedProtein?.toFixed(1)} g</p>
              </div>
              <div className='bg-blue-50 p-3 rounded text-center'>
                <p className='text-gray-600'>Fats</p>
                <p className='font-bold text-blue-600'>{log.estimatedFats?.toFixed(1)} g</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
