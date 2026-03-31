import React, { useState, useRef } from 'react';
import { Apple, Flame, Activity, UploadCloud, ScanSearch, X, CheckCircle2, ChevronRight, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';

export const CalorieTrackerPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mealType, setMealType] = useState('lunch');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);

    // Mock API delay for AI processing
    setTimeout(() => {
      const newLog = {
        _id: Date.now(),
        foodName: 'Grilled Chicken Salad with Avocado',
        estimatedCalories: 450,
        estimatedCarbs: 15,
        estimatedProtein: 45,
        estimatedFats: 22,
        date: new Date().toISOString(),
        mealType,
        aiReasoning: 'Identified ~200g of grilled chicken breast (330 kcal, 43g protein), mixed greens, and half an avocado (120 kcal, 11g fat). Dressing appears light.',
        confidence: 92,
      };

      setLogs([newLog, ...logs]);
      clearSelection();
      setLoading(false);
    }, 2500);
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
    <div className='max-w-6xl mx-auto space-y-8 pb-12'>
      <div className='flex flex-col md:flex-row justify-between md:items-end gap-4'>
        <div>
          <h1 className='text-4xl font-extrabold text-neutral-900 tracking-tight'>AI Calorie Tracker</h1>
          <p className='text-lg text-neutral-500 mt-2'>Upload your meal for instant macro analysis powered by Gemini AI</p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        {/* Left Column - Upload Section */}
        <div className='lg:col-span-5 space-y-6'>
          <Card className="border-0 shadow-lg bg-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 opacity-50 z-0"></div>
            <CardHeader className="relative z-10 pb-0">
              <CardTitle className="text-xl font-bold text-primary-900 flex items-center">
                <ScanSearch className="w-5 h-5 mr-2 text-primary-600" />
                Analyze New Meal
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-6">
              <form onSubmit={handleUpload} className='space-y-6'>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ease-in-out ${dragActive ? 'border-primary-500 bg-primary-50 scale-[1.02]' :
                    previewUrl ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => !previewUrl && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleFileSelect}
                    className='hidden'
                  />

                  {previewUrl ? (
                    <div className="relative isolate group/img">
                      <img src={previewUrl} alt="Meal preview" className="mx-auto max-h-48 rounded-lg shadow-sm object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                        className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 shadow-md transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                      <div className="bg-white p-4 rounded-full shadow-sm ring-1 ring-neutral-200">
                        <UploadCloud className="w-8 h-8 text-primary-500" />
                      </div>
                      <div>
                        <p className='text-neutral-700 font-medium'>Drag and drop an image here</p>
                        <p className='text-sm text-neutral-500 mt-1'>or click to browse your files</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-semibold text-neutral-700 mb-1.5'>Meal Type</label>
                    <select
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value)}
                      className='w-full border border-neutral-300 bg-white rounded-lg px-4 py-2.5 text-neutral-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none'
                    >
                      <option value='breakfast'>🥞 Breakfast</option>
                      <option value='lunch'>🥗 Lunch</option>
                      <option value='snack'>🍎 Snack</option>
                      <option value='dinner'>🥩 Dinner</option>
                    </select>
                  </div>
                </div>

                <Button
                  type='submit'
                  disabled={!selectedFile || loading}
                  className='w-full py-4 text-lg font-bold shadow-md rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 relative overflow-hidden'
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <ScanSearch className="animate-pulse w-5 h-5 mr-2" />
                      AI Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center z-10 relative">
                      Extract Macros
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </span>
                  )}
                  {/* Subtle shine effect on button */}
                  {!loading && !(!selectedFile) && <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 hover:animate-shine" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats and Logs */}
        <div className='lg:col-span-7 space-y-8'>
          {/* Daily Summary */}
          <div>
            <h2 className='text-2xl font-bold text-neutral-800 mb-4 flex items-center'>
              <PieChart className="w-6 h-6 mr-2 text-primary-500" />
              Today\'s Summary
            </h2>

            {todayLogs.length > 0 ? (
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='bg-white p-5 rounded-2xl shadow-soft border border-neutral-100 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-red-200 transition-colors'>
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Flame className="w-12 h-12 text-red-500" />
                  </div>
                  <p className='text-neutral-500 text-sm font-medium mb-1 relative z-10'>Calories</p>
                  <p className='text-3xl font-extrabold text-neutral-900 relative z-10'>{dailyTotals.calories}</p>
                  <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full mt-2 relative z-10">kcal</span>
                </div>

                <div className='bg-white p-5 rounded-2xl shadow-soft border border-neutral-100 flex flex-col items-center justify-center text-center'>
                  <p className='text-neutral-500 text-sm font-medium mb-1'>Carbs</p>
                  <p className='text-2xl font-bold text-orange-600'>{dailyTotals.carbs.toFixed(0)}<span className="text-sm font-medium text-orange-400 ml-0.5">g</span></p>
                  <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-3">
                    <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div className='bg-white p-5 rounded-2xl shadow-soft border border-neutral-100 flex flex-col items-center justify-center text-center'>
                  <p className='text-neutral-500 text-sm font-medium mb-1'>Protein</p>
                  <p className='text-2xl font-bold text-green-600'>{dailyTotals.protein.toFixed(0)}<span className="text-sm font-medium text-green-400 ml-0.5">g</span></p>
                  <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-3">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                <div className='bg-white p-5 rounded-2xl shadow-soft border border-neutral-100 flex flex-col items-center justify-center text-center'>
                  <p className='text-neutral-500 text-sm font-medium mb-1'>Fats</p>
                  <p className='text-2xl font-bold text-blue-600'>{dailyTotals.fats.toFixed(0)}<span className="text-sm font-medium text-blue-400 ml-0.5">g</span></p>
                  <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-3">
                    <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-50 border border-neutral-200 border-dashed rounded-2xl p-8 text-center text-neutral-500">
                Log your first meal today to see your macro breakdown.
              </div>
            )}
          </div>

          {/* Calorie Logs */}
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold text-neutral-800 mb-4 flex items-center'>
              <Activity className="w-6 h-6 mr-2 text-primary-500" />
              Recent Logs
            </h2>

            {logs.length === 0 && !loading ? (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-10 text-center">
                <Apple className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-neutral-900">No meals logged yet</h3>
                <p className="text-neutral-500 mt-1">Upload a photo to let AI start tracking your nutrition.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log._id} className='bg-white rounded-xl shadow-soft border border-neutral-100 p-6 transition-all hover:shadow-md group animate-fade-in relative overflow-hidden'>
                    {/* Confidence tag */}
                    {log.confidence && (
                      <div className="absolute top-4 right-4 flex items-center bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-100">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        AI Confidence: {log.confidence}%
                      </div>
                    )}

                    <div className='pr-32'>
                      <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">
                        <span>{log.mealType}</span>
                        <span className="text-neutral-300">•</span>
                        <span className="text-neutral-500">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <h3 className='text-xl font-bold text-neutral-900 leading-tight mb-2'>{log.foodName}</h3>
                      <p className='text-sm text-neutral-600 mb-4 bg-neutral-50 rounded-lg p-3 italic border border-neutral-100'>"{log.aiReasoning}"</p>
                    </div>

                    <div className='grid grid-cols-4 gap-2 pt-4 border-t border-neutral-100'>
                      <div className='text-center'>
                        <p className='text-2xl font-extrabold text-neutral-900'>{log.estimatedCalories}</p>
                        <p className='text-xs font-medium text-neutral-500 uppercase tracking-wider'>kcal</p>
                      </div>
                      <div className='text-center border-l border-neutral-100'>
                        <p className='text-xl font-bold text-orange-600'>{log.estimatedCarbs}<span className="text-sm font-medium">g</span></p>
                        <p className='text-xs font-medium text-neutral-500 uppercase tracking-wider'>Carbs</p>
                      </div>
                      <div className='text-center border-l border-neutral-100'>
                        <p className='text-xl font-bold text-green-600'>{log.estimatedProtein}<span className="text-sm font-medium">g</span></p>
                        <p className='text-xs font-medium text-neutral-500 uppercase tracking-wider'>Protein</p>
                      </div>
                      <div className='text-center border-l border-neutral-100'>
                        <p className='text-xl font-bold text-blue-600'>{log.estimatedFats}<span className="text-sm font-medium">g</span></p>
                        <p className='text-xs font-medium text-neutral-500 uppercase tracking-wider'>Fats</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
