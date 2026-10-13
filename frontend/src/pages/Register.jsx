import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  Stethoscope, ChevronLeft, ChevronRight, Check,
  Eye, EyeOff, AlertCircle, Loader2, CheckCircle
} from 'lucide-react'

const STEP_LABELS = ['Personal Information', 'Clinical Details', 'Health Profile']
const STEP_SUBS   = ['Let\'s start with the basics.', 'Tell us about your osteoarthritis.', 'A few final details to complete your profile.']
const COMORBIDITIES = ['Diabetes', 'Hypertension', 'Heart Disease', 'Obesity', 'Kidney Disease', 'Other']

export default function Register() {
  useEffect(() => {
    document.title = 'Create Account — OA Care'
    return () => { document.title = 'OA Care' }
  }, [])

  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin', { replace: true })
      else navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const [step,         setStep]         = useState(1)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [success,      setSuccess]      = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', password: '', confirmPassword: '',
    age: '', gender: '', oa_location: '', oa_grade: '',
    weight_kg: '', height_cm: '', comorbidities: [], terms: false
  })

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

  const toggleComorbidity = (item) => {
    setFormData(prev => ({
      ...prev,
      comorbidities: prev.comorbidities.includes(item)
        ? prev.comorbidities.filter(c => c !== item)
        : [...prev.comorbidities, item]
    }))
  }

  const handleNextStep = () => {
    setError('')
    if (step === 1) {
      if (!formData.full_name.trim()) return setError('Full name required')
      if (!formData.email.trim())     return setError('Email required')
      if (!formData.password || formData.password.length < 8)
        return setError('Password must be at least 8 characters')
      if (formData.password !== formData.confirmPassword)
        return setError('Passwords do not match')
      setStep(2)
    } else if (step === 2) {
      if (!formData.oa_location) return setError('Please select your OA location (Hip, Knee, or Both)')
      if (!formData.oa_grade)    return setError('Please select your OA grade')
      setError(''); setStep(3)
    }
  }

  const handleSubmit = async () => {
    if (!formData.terms) return setError('Please accept the terms')
    setLoading(true); setError('')
    try {
      await authAPI.register({
        full_name: formData.full_name, email: formData.email,
        phone: formData.phone || null, password: formData.password,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        oa_location: formData.oa_location || null,
        oa_grade: formData.oa_grade ? parseInt(formData.oa_grade) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        comorbidities: formData.comorbidities
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      const detail = err.response?.data?.detail
      if (typeof detail === 'string' && detail.toLowerCase().includes('already registered')) {
        setError(<>This email is already registered. <Link to="/login" className="underline hover:text-rose-800">Login →</Link></>)
        setStep(1); setLoading(false); return
      }
      if (Array.isArray(detail)) {
        setError(detail.map(e => `${e.loc?.[e.loc.length-1]||'field'}: ${e.msg}`).join(', '))
      } else if (typeof detail === 'string') {
        setError(detail)
      } else {
        setError('Registration failed. Please check your details.')
      }
    } finally { setLoading(false) }
  }

  /* ── shared selector chip ── */
  const Chip = ({ label, active, onClick }) => (
    <div onClick={onClick}
      className={`cursor-pointer rounded-[14px] p-3 text-center text-sm font-medium transition-all border-2 ${
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-gray-100 text-text-muted hover:border-primary/30 hover:bg-primary/5'
      }`}>
      {label}
    </div>
  )

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      {/* top bar */}
      <div className="bg-white border-b border-primary/10 py-4">
        <div className="container-main flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6" style={{ color: '#11A9E2' }} />
            <span className="font-semibold text-[20px]" style={{ color: '#1299DB' }}>OA Care</span>
          </Link>
          <Link to="/login" className="text-sm text-text-muted hover:text-primary flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        {success ? (
          <div className="bg-white w-full max-w-md p-10 text-center"
            style={{ borderRadius: 30, boxShadow: '0 15px 35px rgba(0,0,0,0.08)' }}>
            <CheckCircle className="text-emerald-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-text-body mb-2">Account Created!</h2>
            <p className="text-text-muted text-sm">Redirecting you to login...</p>
          </div>
        ) : (
          <div className="bg-white w-full max-w-[520px] p-8"
            style={{ borderRadius: 30, boxShadow: '0 15px 35px rgba(0,0,0,0.08)' }}>

            {/* ── STEP INDICATOR ── */}
            <div className="flex items-center justify-center gap-0 mb-8">
              {[1, 2, 3].map((s, idx) => (
                <React.Fragment key={s}>
                  {/* circle */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                    s < step  ? 'bg-primary/20 text-primary'
                    : s === step ? 'bg-primary text-white shadow-btn'
                    : 'bg-gray-100 text-gray-400'
                  }`}>
                    {s < step ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {/* connecting line */}
                  {idx < 2 && (
                    <div className="w-8 sm:w-16 h-0.5 relative flex-1 max-w-[64px] min-w-[16px]">
                      <div className="absolute inset-0 bg-gray-200 rounded-full" />
                      {step > s && (
                        <div className="absolute inset-0 bg-primary rounded-full transition-all" />
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* step title */}
            <div className="text-center mb-6">
              <h2 className="font-semibold text-[24px] text-text-body mb-1">{STEP_LABELS[step-1]}</h2>
              <p className="text-text-muted text-sm">{STEP_SUBS[step-1]}</p>
            </div>

            {/* error */}
            {error && (
              <div className="bg-rose-50 text-rose-600 rounded-[14px] p-3 mb-5 flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{String(error)}</span>
              </div>
            )}

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" value={formData.full_name}
                    onChange={e => update('full_name', e.target.value)}
                    className="input-field" placeholder="Your full name" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" value={formData.email}
                    onChange={e => update('email', e.target.value)}
                    className="input-field" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="label">Phone <span className="text-text-muted font-normal">(optional)</span></label>
                  <input type="tel" value={formData.phone}
                    onChange={e => update('phone', e.target.value)}
                    className="input-field" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={formData.password}
                      onChange={e => update('password', e.target.value)}
                      className="input-field pr-12" placeholder="At least 8 characters" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-body border-0 bg-transparent cursor-pointer">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <input type="password" value={formData.confirmPassword}
                    onChange={e => update('confirmPassword', e.target.value)}
                    className="input-field" placeholder="Repeat password" />
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="label">Age</label>
                  <input type="number" min="1" max="120" value={formData.age}
                    onChange={e => update('age', e.target.value)}
                    className="input-field max-w-[160px]" placeholder="e.g. 65" />
                </div>
                <div>
                  <label className="label mb-2 block">Gender</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Male','Female','Other'].map(opt => (
                      <Chip key={opt} label={opt} active={formData.gender === opt} onClick={() => update('gender', opt)} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label mb-2 block">OA Location</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[{value:'hip',label:'Hip'},{value:'knee',label:'Knee'},{value:'both',label:'Both'}].map(opt => (
                      <Chip key={opt.value} label={opt.label} active={formData.oa_location === opt.value} onClick={() => update('oa_location', opt.value)} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label mb-2 block">OA Grade</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{value:1,label:'Grade 1',sub:'Mild'},{value:2,label:'Grade 2',sub:'Moderate'},{value:3,label:'Grade 3',sub:'Severe'},{value:4,label:'Grade 4',sub:'Critical'}].map(opt => (
                      <div key={opt.value} onClick={() => update('oa_grade', opt.value)}
                        className={`cursor-pointer rounded-[14px] p-3 flex flex-col items-center border-2 transition-all ${
                          formData.oa_grade == opt.value
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-100 hover:border-primary/30'
                        }`}>
                        <div className={`text-xl font-bold ${formData.oa_grade == opt.value ? 'text-primary' : 'text-text-muted'}`}>{opt.label}</div>
                        <div className="text-xs text-text-muted mt-0.5">{opt.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="label">Weight (kg)</label>
                    <input type="number" value={formData.weight_kg}
                      onChange={e => update('weight_kg', e.target.value)}
                      className="input-field" placeholder="e.g. 75" />
                  </div>
                  <div className="flex-1">
                    <label className="label">Height (cm)</label>
                    <input type="number" value={formData.height_cm}
                      onChange={e => update('height_cm', e.target.value)}
                      className="input-field" placeholder="e.g. 170" />
                  </div>
                </div>

                <div>
                  <label className="label mb-3 block">Comorbidities <span className="text-text-muted font-normal">(select all that apply)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {COMORBIDITIES.map(item => {
                      const sel = formData.comorbidities.includes(item)
                      return (
                        <button key={item} type="button" onClick={() => toggleComorbidity(item)}
                          className={`rounded-pill px-4 py-2 text-sm font-medium transition-all border-0 cursor-pointer ${
                            sel
                              ? 'bg-primary/10 text-primary'
                              : 'bg-bg-section text-text-muted hover:bg-primary/5'
                          }`}>
                          {sel && <Check className="w-3 h-3 inline mr-1" />}{item}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* terms */}
                <div onClick={() => update('terms', !formData.terms)}
                  className={`flex items-start gap-3 p-4 rounded-[16px] border-2 cursor-pointer transition-all ${
                    formData.terms ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/20'
                  }`}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    formData.terms ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                  }`}>
                    {formData.terms && <Check className="text-white w-3 h-3" />}
                  </div>
                  <p className="text-sm text-text-body leading-relaxed">
                    I understand this website supports but does not replace professional medical care.
                  </p>
                </div>
              </div>
            )}

            {/* ── NAVIGATION ── */}
            <div className="flex justify-between items-center mt-8">
              {step > 1 ? (
                <button onClick={() => { setStep(step-1); setError('') }}
                  className="btn-secondary flex items-center gap-2 cursor-pointer">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button onClick={handleNextStep}
                  className="btn-primary flex items-center gap-2 cursor-pointer ml-auto border-0">
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading}
                  className="btn-primary flex items-center gap-2 cursor-pointer ml-auto border-0 disabled:opacity-60">
                  {loading
                    ? <><Loader2 className="animate-spin w-4 h-4" /> Creating...</>
                    : <><Check className="w-4 h-4" /> Create Account</>
                  }
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
