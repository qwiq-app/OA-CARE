import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressAPI, userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Activity, Dumbbell, Calendar, TrendingDown, TrendingUp, History, CheckCircle, ArrowRight, Settings, X, Check, Loader2, CheckCircle2 } from 'lucide-react';

export default function PatientDashboard() {
  useEffect(() => { document.title = 'My Dashboard — OA Care'; return () => { document.title = 'OA Care'; }; }, []);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [showPainLog, setShowPainLog] = useState(false);
  const [painScore, setPainScore] = useState(5);
  const [stiffnessScore, setStiffnessScore] = useState(5);
  const [painLocation, setPainLocation] = useState('Both');
  const [painNotes, setPainNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPainSuccess, setShowPainSuccess] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState(false);
  const [painData, setPainData] = useState([]);
  const [painLoading, setPainLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => { fetchDashboardData(); }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      setLogsLoading(true); setLogsError(false);
      try { const res = await progressAPI.getLogs(30); setLogs(Array.isArray(res.data) ? res.data : []); }
      catch { setLogsError(true); }
      finally { setLogsLoading(false); }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    const fetchPain = async () => {
      setPainLoading(true);
      try { const res = await progressAPI.getPainDiary(30); setPainData(Array.isArray(res.data) ? res.data : []); }
      catch (err) { console.error('Pain diary fetch failed:', err); }
      finally { setPainLoading(false); }
    };
    fetchPain();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await progressAPI.getSummary(); setStats(response.data);
      const statusesRes = await progressAPI.getStatuses(); setStatuses(statusesRes.data || []);
    } catch (error) { console.error('Failed to fetch dashboard data', error); }
    finally { setLoading(false); }
  };

  const handleLogPain = async () => {
    if (parseInt(painScore) === 0) { if (!window.confirm('You selected 0 (No pain). Is this correct?')) return; }
    try {
      setSubmitting(true);
      await progressAPI.logPain({ pain_score: parseInt(painScore), stiffness_score: parseInt(stiffnessScore), location: painLocation || null, notes: painNotes || null });
      const summaryRes = await progressAPI.getSummary(); setStats(summaryRes.data);
      const painRes = await progressAPI.getPainDiary(30); setPainData(Array.isArray(painRes.data) ? painRes.data : []);
      setShowPainLog(false); setPainScore(5); setStiffnessScore(5); setPainNotes('');
      setShowPainSuccess(true); setTimeout(() => setShowPainSuccess(false), 3000);
    } catch (err) { console.error('Pain log failed:', err); alert('Failed to save pain entry. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    try {
      await userAPI.updateProfile({ full_name: profileData.full_name, phone: profileData.phone || null, age: profileData.age ? parseInt(profileData.age) : null, gender: profileData.gender || null, weight_kg: profileData.weight_kg ? parseFloat(profileData.weight_kg) : null, height_cm: profileData.height_cm ? parseFloat(profileData.height_cm) : null, oa_location: profileData.oa_location || null, oa_grade: profileData.oa_grade ? parseInt(profileData.oa_grade) : null, comorbidities: profileData.comorbidities || [] });
      setProfileSuccess(true);
      const stored = JSON.parse(localStorage.getItem('oa_user') || '{}');
      stored.full_name = profileData.full_name; localStorage.setItem('oa_user', JSON.stringify(stored));
      setTimeout(() => { setShowProfileModal(false); setProfileSuccess(false); window.location.reload(); }, 1500);
    } catch (err) { console.error('Profile save failed:', err); alert('Failed to save profile. Please try again.'); }
    finally { setProfileSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <Navbar />
      <main className="container-main section-pad flex-1">
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-primary/5 rounded-[24px]" />)}
        </div>
      </main>
    </div>
  );

  const chartData = painData.map(entry => ({
    date: new Date(entry.date || entry.recorded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    pain: entry.pain_score, stiffness: entry.stiffness_score
  }));
  const avgPainScore = stats?.avg_pain_last_30_days !== undefined && stats?.avg_pain_last_30_days !== null ? stats.avg_pain_last_30_days : null;

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <Navbar />

      <main className="container-main section-pad flex-1">

        {/* ── WELCOME HEADER ── */}
        <div className="rounded-[26px] p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #11A9E2, #0B92D1)' }}>
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">Welcome back,</p>
            <h1 className="text-white text-2xl font-bold mb-2">{user?.full_name || 'Patient'}</h1>
            {user?.oa_location && (
              <span className="inline-block bg-white/20 text-white text-xs font-semibold rounded-pill px-3 py-1 capitalize">
                {user.oa_location} OA
              </span>
            )}
          </div>
          <button onClick={() => setShowPainLog(!showPainLog)}
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold rounded-pill px-6 py-3 shadow-white hover:shadow-float transition-all cursor-pointer border-0 shrink-0">
            <Activity className="w-4 h-4 shrink-0" /> Log Today's Pain
          </button>
        </div>

        {/* ── STATS GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Dumbbell,  color: '#11A9E2', val: stats?.exercises_this_week  ?? '--', label: 'This Week'    },
            { icon: Calendar,  color: '#11A9E2', val: stats?.exercises_this_month ?? '--', label: 'This Month'   },
            { icon: Activity,  color: avgPainScore === null ? '#11A9E2' : avgPainScore < 4 ? '#10b981' : avgPainScore <= 6 ? '#f59e0b' : '#f43f5e',
              val: avgPainScore !== null ? Number(avgPainScore).toFixed(1) : '--', label: 'Avg Pain Score' },
            { icon: CheckCircle2, color: '#11A9E2', val: logs.length, label: 'Logs (30d)' },
          ].map(({ icon: Icon, color, val, label }, i) => (
            <div key={i} className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 12px 30px rgba(17,169,226,0.12)' }}>
              <div className="flex items-center justify-center w-10 h-10 mb-3" style={{ background: '#EAF6FB', borderRadius: 14 }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="text-3xl font-bold leading-none mb-1" style={{ color }}>{val}</div>
              <div className="text-text-muted text-xs font-medium uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>

        {/* ── PAIN LOG FORM ── */}
        {showPainLog && (
          <div className="bg-white rounded-[26px] p-6 mb-6 border border-primary/10"
            style={{ boxShadow: '0 12px 30px rgba(17,169,226,0.12)' }}>
            <h3 className="flex items-center gap-2 mb-5 font-semibold text-text-body mt-0">
              <Activity className="text-primary w-5 h-5 shrink-0" /> Log Pain Level
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label mb-0">Pain score</label>
                  <span className="badge-red py-0.5">{painScore}</span>
                </div>
                <input type="range" min="0" max="10" value={painScore} onChange={e => setPainScore(e.target.value)}
                  className="w-full cursor-pointer" style={{ accentColor: '#11A9E2' }} />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-emerald-600 font-medium">No pain</span>
                  <span className="text-rose-500 font-medium">Worst pain</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label mb-0">Stiffness score</label>
                  <span className="badge-amber py-0.5">{stiffnessScore}</span>
                </div>
                <input type="range" min="0" max="10" value={stiffnessScore} onChange={e => setStiffnessScore(e.target.value)}
                  className="w-full cursor-pointer" style={{ accentColor: '#11A9E2' }} />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-emerald-600 font-medium">No stiffness</span>
                  <span className="text-amber-500 font-medium">Severe stiffness</span>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="label">Location</label>
                <select value={painLocation} onChange={e => setPainLocation(e.target.value)} className="input-field max-w-[200px]">
                  <option value="Hip">Hip</option><option value="Knee">Knee</option><option value="Both">Both</option>
                </select>
              </div>
              <div>
                <label className="label">Notes (Optional)</label>
                <textarea value={painNotes} onChange={e => setPainNotes(e.target.value)}
                  className="input-field resize-none h-20 w-full" placeholder="How are your joints feeling today?" />
              </div>
            </div>
            <div className="flex gap-3 dashboard-btn-group">
              <button onClick={handleLogPain} disabled={submitting}
                className="btn-primary border-0 cursor-pointer disabled:opacity-70 px-8">
                {submitting ? 'Saving...' : 'Save Entry'}
              </button>
              <button onClick={() => setShowPainLog(false)} className="btn-secondary cursor-pointer px-6">Cancel</button>
            </div>
          </div>
        )}

        {/* ── TWO COLUMN ── */}
        <div className="grid md:grid-cols-5 gap-6">

          {/* Pain Chart */}
          <div className="md:col-span-3 bg-white rounded-[26px] p-6" style={{ boxShadow: '0 12px 30px rgba(17,169,226,0.12)' }}>
            <h3 className="flex items-center gap-2 font-semibold text-text-body mb-6 mt-0 text-lg">
              <TrendingDown className="w-5 h-5 text-primary shrink-0" /> Pain Score — Last 30 Days
            </h3>
            {chartData.length > 0 ? (
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid stroke="#EAF6FB" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8D98A5' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#8D98A5' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #EAF6FB', boxShadow: '0 8px 20px rgba(17,169,226,0.12)' }} itemStyle={{ fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="pain" name="Pain Score" stroke="#11A9E2" strokeWidth={2.5} dot={false} activeDot={{ r: 6, fill: '#11A9E2' }} />
                    <Line type="monotone" dataKey="stiffness" name="Stiffness" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#f59e0b' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-12 text-center">
                <TrendingUp className="w-10 h-10 mx-auto mb-3" style={{ color: '#EAF6FB' }} />
                <p className="text-text-muted text-sm font-medium m-0">No pain entries yet</p>
                <p className="text-text-muted text-xs mt-1 m-0">Log your first pain entry above</p>
              </div>
            )}
          </div>

          {/* Recent Activity + Quick Links */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-[26px] p-6 flex-1 flex flex-col" style={{ boxShadow: '0 12px 30px rgba(17,169,226,0.12)' }}>
              <h3 className="flex items-center gap-2 font-semibold text-text-body mb-4 mt-0 text-lg">
                <History className="w-5 h-5 text-primary shrink-0" /> Recent Activity
              </h3>
              <div className="flex-1">
                {logsLoading ? (
                  <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-bg-section rounded-[16px] animate-pulse" />)}</div>
                ) : logsError ? (
                  <div className="text-center py-6">
                    <p className="text-text-muted text-sm">Failed to load activity</p>
                    <button onClick={() => window.location.reload()} className="text-primary text-sm mt-2 hover:underline">Retry</button>
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-text-muted text-sm mb-1">No exercises logged yet</p>
                    <Link to="/exercises" className="text-primary text-sm font-medium hover:underline mt-3 inline-block">Browse Exercises →</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logs.slice(0, 8).map((log, index) => (
                      <div key={log.id || index} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#EAF6FB', borderRadius: 12 }}>
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-body truncate">{log.exercise_name || 'Exercise'}</p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {log.completed_at ? new Date(log.completed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                          </p>
                        </div>
                        {(log.pain_before !== null || log.pain_after !== null) && (
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="badge-red py-0.5 px-2 text-xs">{log.pain_before ?? '-'}</span>
                            <span className="text-text-muted text-xs">→</span>
                            <span className="badge-green py-0.5 px-2 text-xs">{log.pain_after ?? '-'}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/exercises" className="text-primary text-sm font-medium hover:underline mt-4 inline-block text-center border-t border-gray-50 pt-3 w-full">
                View All Exercises
              </Link>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => navigate('/exercises')}
                className="bg-white rounded-[24px] p-4 cursor-pointer hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: '0 12px 30px rgba(17,169,226,0.12)' }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center justify-center w-10 h-10" style={{ background: '#EAF6FB', borderRadius: 14 }}>
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted mt-1" />
                </div>
                <div className="font-semibold text-text-body text-sm mb-0.5">Go to Exercises</div>
                <div className="text-xs text-text-muted">View full library</div>
              </div>

              <div onClick={async () => {
                setShowProfileModal(true); setProfileLoading(true);
                try { const res = await userAPI.getProfile(); setProfileData(res.data); }
                catch (err) { console.error('Profile fetch failed:', err); }
                finally { setProfileLoading(false); }
              }} className="bg-white rounded-[24px] p-4 cursor-pointer hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: '0 12px 30px rgba(17,169,226,0.12)' }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center justify-center w-10 h-10" style={{ background: '#EAF6FB', borderRadius: 14 }}>
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted mt-1" />
                </div>
                <div className="font-semibold text-text-body text-sm mb-0.5">Update Profile</div>
                <div className="text-xs text-text-muted">Manage account details</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── SUCCESS TOAST ── */}
      {showPainSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-[20px] shadow-float flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium text-sm">Pain entry saved!</span>
        </div>
      )}

      {/* ── PROFILE MODAL ── */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ borderRadius: 30, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div className="flex items-center justify-between p-6 border-b border-gray-50 sticky top-0 bg-white z-10" style={{ borderRadius: '30px 30px 0 0' }}>
              <div>
                <h3 className="font-semibold text-xl text-text-body mt-0 mb-0">Update Profile</h3>
                <p className="text-text-muted text-sm mt-0.5 mb-0">Edit your medical details</p>
              </div>
              <button onClick={() => setShowProfileModal(false)}
                className="w-8 h-8 rounded-full bg-bg-section flex items-center justify-center hover:bg-primary/10 border-0 cursor-pointer transition-colors">
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>

            {profileLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-text-muted text-sm font-medium">Loading profile...</p>
              </div>
            ) : profileSuccess ? (
              <div className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <p className="font-semibold text-text-body text-xl">Profile Updated!</p>
                <p className="text-text-muted text-sm mt-1">Your changes have been saved.</p>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div>
                  <label className="label">Full Name</label>
                  <input className="input-field" value={profileData.full_name || ''} onChange={e => setProfileData(p => ({ ...p, full_name: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Phone <span className="text-text-muted font-normal">(optional)</span></label>
                  <input className="input-field" value={profileData.phone || ''} onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Age</label>
                    <input type="number" className="input-field" value={profileData.age || ''} onChange={e => setProfileData(p => ({ ...p, age: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Gender</label>
                    <select className="input-field" value={profileData.gender || ''} onChange={e => setProfileData(p => ({ ...p, gender: e.target.value }))}>
                      <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Weight (kg)</label>
                    <input type="number" className="input-field" value={profileData.weight_kg || ''} onChange={e => setProfileData(p => ({ ...p, weight_kg: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Height (cm)</label>
                    <input type="number" className="input-field" value={profileData.height_cm || ''} onChange={e => setProfileData(p => ({ ...p, height_cm: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="label mb-2 block">OA Location</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['hip','knee','both'].map(loc => (
                      <div key={loc} onClick={() => setProfileData(p => ({ ...p, oa_location: loc }))}
                        className={`border-2 rounded-[14px] p-3 text-center cursor-pointer text-sm font-medium transition-all capitalize ${
                          profileData.oa_location === loc ? 'border-primary bg-primary/10 text-primary' : 'border-gray-100 text-text-muted hover:border-primary/20'
                        }`}>{loc}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label mb-2 block">Severity Grade</label>
                  <div className="grid grid-cols-4 gap-2 profile-grade-grid">
                    {[1,2,3,4].map(grade => (
                      <div key={grade} onClick={() => setProfileData(p => ({ ...p, oa_grade: grade }))}
                        className={`border-2 rounded-[14px] py-2 px-1 text-center cursor-pointer transition-all ${
                          profileData.oa_grade === grade ? 'border-primary bg-primary/10' : 'border-gray-100 hover:border-primary/20'
                        }`}>
                        <div className={`text-xl font-bold mb-0.5 leading-none ${profileData.oa_grade === grade ? 'text-primary' : 'text-text-muted'}`}>{grade}</div>
                        <div className="text-[10px] font-medium text-text-muted">{['Mild','Moderate','Severe','Critical'][grade-1]}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-50">
                  <button onClick={() => setShowProfileModal(false)} className="btn-secondary flex-1 cursor-pointer">Cancel</button>
                  <button onClick={handleProfileSave} disabled={profileSaving}
                    className="btn-primary flex-1 border-0 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60">
                    {profileSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Check className="w-4 h-4" /> Save Profile</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
