import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowRight, Mail, Lock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/ui/Logo';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const defaultEmail = localStorage.getItem('rememberEmail') || '';
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberEmail'));

  const validateForm = (data: { email: string; password?: string }) => {
    const newErrors: FormErrors = {};
    
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!data.password) {
      newErrors.password = 'Password is required';
    } else if (data.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const emailVal = (formData.get('email') as string) || '';
    const passwordVal = (formData.get('password') as string) || '';
    
    const loginData = {
      email: emailVal.trim(),
      password: passwordVal
    };
    
    if (!validateForm(loginData)) {
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login(loginData);
      setAuth(res.data.user, res.data.token);
      
      if (rememberMe) {
        localStorage.setItem('rememberEmail', loginData.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      toast.error(errorMsg);
      if (errorMsg.toLowerCase().includes('credential') || errorMsg.toLowerCase().includes('invalid')) {
        setErrors({ email: errorMsg, password: ' ' });
      } else {
        setErrors({ email: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearError = (field: 'email' | 'password') => {
    if (errors[field]) {
      setErrors(e => ({ ...e, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 animate-scale-in">
        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-2xl transition-shadow duration-300">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6 transform hover:scale-110 transition-transform duration-300">
              <div className="p-3 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-lg shadow-brand-600/20">
                <Logo size="lg" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-sm">Access your meetings and collaborate with your team</p>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-brand-600/10 to-cyan-500/10 border border-brand-500/20 rounded-xl px-4 py-3 mb-8 flex items-start gap-3 animate-slide-in-down">
            <CheckCircle2 size={18} className="text-brand-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="text-brand-300 font-semibold mb-1">Demo Mode Available</p>
              <p className="text-slate-400">Register first, then use your credentials to log in</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600/0 to-cyan-500/0 group-focus-within:from-brand-600/10 group-focus-within:to-cyan-500/10 rounded-lg transition-all duration-300" />
                <div className="relative flex items-center">
                  <Mail size={18} className="absolute left-3.5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    defaultValue={defaultEmail}
                    onChange={() => handleClearError('email')}
                    onFocus={() => handleClearError('email')}
                    autoComplete="email"
                    className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white/10 ${
                      errors.email ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 hover:border-white/20'
                    }`}
                  />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1 animate-slide-in-down">
                  <span className="w-1 h-1 rounded-full bg-red-400" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="animate-slide-in-up" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-200">Password</label>
                <Link to="#" className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600/0 to-cyan-500/0 group-focus-within:from-brand-600/10 group-focus-within:to-cyan-500/10 rounded-lg transition-all duration-300" />
                <div className="relative flex items-center">
                  <Lock size={18} className="absolute left-3.5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    onChange={() => handleClearError('password')}
                    onFocus={() => handleClearError('password')}
                    autoComplete="current-password"
                    className={`w-full pl-11 pr-12 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white/10 ${
                      errors.password ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 hover:border-white/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1 animate-slide-in-down">
                  <span className="w-1 h-1 rounded-full bg-red-400" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2.5 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border border-white/20 bg-white/5 accent-brand-500 cursor-pointer transition-all"
              />
              <label htmlFor="rememberMe" className="text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-6 shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none animate-slide-in-up group"
              style={{ animationDelay: '250ms' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-white/0 to-white/10" />
            <span className="text-xs text-slate-500 font-medium">Don't have an account?</span>
            <div className="flex-1 h-px bg-gradient-to-l from-white/0 to-white/10" />
          </div>

          {/* Sign Up Link */}
          <Link
            to="/register"
            className="w-full py-3 px-4 border border-white/10 hover:border-brand-500/50 bg-white/5 hover:bg-brand-500/10 text-slate-300 hover:text-brand-300 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span>Create Account</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-6">
            By signing in, you agree to our{' '}
            <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-xl font-bold text-brand-400">500+</p>
            <p className="text-xs text-slate-400 mt-1">Active Users</p>
          </div>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-xl font-bold text-cyan-400">99.9%</p>
            <p className="text-xs text-slate-400 mt-1">Uptime</p>
          </div>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-xl font-bold text-purple-400">24/7</p>
            <p className="text-xs text-slate-400 mt-1">Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
