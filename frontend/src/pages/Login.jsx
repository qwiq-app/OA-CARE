import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope,
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function Login() {
  useEffect(() => {
    document.title = 'Login — OA Care';
    return () => { document.title = 'OA Care'; };
  }, []);

  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin',     { replace: true });
      else                       navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please enter both email and password.'); return; }
    try {
      setError(''); setLoading(true);
      const result = await login(email, password);
      if (result.role === 'admin') {
        localStorage.removeItem('oa_token'); localStorage.removeItem('oa_user');
        setError('This login is for patients only. Please use the Admin Portal to sign in.');
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <div className="bg-white border-b border-primary/10 py-4">
        <div className="container-main flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6" style={{ color: '#11A9E2' }} />
            <span className="font-semibold text-[20px]" style={{ color: '#1299DB' }}>OA Care</span>
          </Link>
          <Link to="/" className="flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors font-medium">
            <ChevronLeft className="w-4 h-4 shrink-0" /> Back to site
          </Link>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white w-full max-w-[420px] p-10" style={{ borderRadius: 30, boxShadow: '0 15px 35px rgba(0,0,0,0.08)' }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #14B5F0, #0E95D4)', borderRadius: 18 }}>
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-semibold text-text-body mb-1 mt-0" style={{ fontSize: 28 }}>Welcome Back</h2>
            <p className="text-text-muted text-[14px] m-0">Sign in to your OA Care account</p>
          </div>

          <div className="space-y-4" onKeyDown={handleKeyDown}>
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 shrink-0" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-11" placeholder="name@example.com" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 shrink-0" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-11 pr-11" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-body border-0 bg-transparent cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 rounded-[14px] p-3 flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary w-full py-3.5 text-base border-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin shrink-0" /> Signing in...</> : 'Sign In'}
            </button>
          </div>

          <div className="border-t border-gray-100 my-6" />
          <div className="text-center">
            <p className="text-text-muted text-sm m-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">Create account</Link>
            </p>
          </div>
          <div className="text-center mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-text-muted m-0">
              Are you an administrator?{' '}
              <Link to="/admin/login" className="text-primary font-medium hover:underline">Use the Admin Portal →</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
