import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Alert, Card, CardContent } from '../components/ui';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username: '',
  });
  const [role, setRole] = useState('gym_member');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.username, formData.email, formData.password, role);
        setIsLogin(true);
        setFormData({
          email: '',
          password: '',
          name: '',
          username: '',
        });
        setError('Signup successful! Please login.');
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">GymFlow</h1>
          <p className="text-neutral-600">Your fitness journey starts here</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-large">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-neutral-900">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-neutral-600 mt-1">
                {isLogin ? 'Sign in to your account' : 'Join the GymFlow community'}
              </p>
            </div>

            {error && (
              <Alert
                type={error.includes('successful') ? 'success' : 'error'}
                message={error}
                className="mb-6"
                onClose={() => setError('')}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <Input
                    label="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required={!isLogin}
                    placeholder="Enter your full name"
                  />

                  <Input
                    label="Username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required={!isLogin}
                    placeholder="Choose a unique username"
                  />
                </>
              )}

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="Enter your email"
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                placeholder="Enter your password"
              />

              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('gym_member')}
                      className={`p-3 text-center border rounded-lg transition-all ${
                        role === 'gym_member'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      <div className="text-lg mb-1">👤</div>
                      <div className="text-sm font-medium">Gym Member</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('gym_owner')}
                      className={`p-3 text-center border rounded-lg transition-all ${
                        role === 'gym_owner'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      <div className="text-lg mb-1">🏢</div>
                      <div className="text-sm font-medium">Gym Owner</div>
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    email: '',
                    password: '',
                    name: '',
                    username: '',
                  });
                }}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-neutral-500">
          <p>© 2024 GymFlow. Built for fitness enthusiasts.</p>
        </div>
      </div>
    </div>
  );
};
