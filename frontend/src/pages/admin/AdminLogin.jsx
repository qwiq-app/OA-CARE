import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Shield, Mail, Lock, Eye, EyeOff,
  Loader2, AlertCircle, ChevronLeft,
  ShieldAlert, Activity
} from 'lucide-react'

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, logout, user } = useAuth();
  
  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true })
  }, [user, navigate])
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      const result = await login(email, password);
      
      if (result.role !== 'admin') {
        // Patient tried admin portal — block and clear session
        localStorage.removeItem('oa_token');
        localStorage.removeItem('oa_user');
        logout(false);
        setError(
          'Access denied. This portal is for administrators only. ' +
          'Please use the patient login page.'
        );
        return;
      }
      
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        
        <div className="text-center mb-8">
          <Shield className="text-primary-light w-12 h-12 mx-auto mb-4 shrink-0" />
          <h2 className="font-heading text-2xl text-white font-bold mb-1 mt-0">Admin Portal</h2>
          <p className="text-slate-400 text-sm m-0">Restricted access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-light min-h-[48px] text-base border box-border"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-light min-h-[48px] text-base pr-11 border box-border"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors bg-transparent border-0 cursor-pointer flex items-center justify-center p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5 shrink-0" /> : <Eye className="w-5 h-5 shrink-0" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 mb-4 text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-3 font-semibold min-h-[48px] mt-6 transition-all border-0 cursor-pointer disabled:opacity-70 flex items-center justify-center"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4 flex items-center gap-2 text-amber-700 text-xs text-left">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>This portal is restricted to administrators only. Unauthorised access attempts are logged.</span>
        </div>

        <div className="mt-6 text-center">
          <Link 
            to="/login"
            className="text-slate-400 text-xs hover:text-slate-300">
            ← Back to Patient Login
          </Link>
        </div>

      </div>
    </div>
  );
}
