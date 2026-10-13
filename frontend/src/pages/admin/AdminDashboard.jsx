import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  Heart, 
  Database,
  Play,
  RotateCw,
  CheckCircle,
  Dumbbell,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  useEffect(() => {
    document.title = "Admin Dashboard — OA Care";
    return () => { document.title = "OA Care Admin"; };
  }, []);
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statusOverview, setStatusOverview] = useState(null);
  const [statsError, setStatsError] = useState(false);
  const [statusError, setStatusError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setStatsError(false);
    setStatusError(false);
    
    try {
      const statsRes = await adminAPI.getStats();
      setStats(statsRes.data);
    } catch (error) {
      console.error("Stats fetch failed", error);
      setStatsError(true);
    }
    
    try {
      const statusRes = await adminAPI.getExerciseStatusOverview();
      setStatusOverview(statusRes.data);
    } catch (error) {
      console.error("Status overview failed", error);
      setStatusError(true);
    }
    
    setLoading(false);
  };

  const handleSeedExercises = async () => {
    try {
      await adminAPI.seedExercises();
      alert('Exercises seeded successfully!');
      fetchData();
    } catch (error) {
      console.error("Failed to seed exercises", error);
      alert('Failed to seed exercises.');
    }
  };

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Parse pie chart data safely using new tokens
  const PIE_COLORS = ['#11A9E2', '#0B92D1', '#3DBFEE', '#14B5F0'];
  const oaDistributionRaw = stats?.oa_distribution || {};
  const oaDistributionData = Object.keys(oaDistributionRaw).map(key => ({
    name: key,
    value: oaDistributionRaw[key]
  }));

  // Parse bar chart data safely
  const gradeDistributionRaw = stats?.grade_distribution || {};
  const gradeDistributionData = Object.keys(gradeDistributionRaw).map(key => ({
    grade: `Grade ${key}`,
    count: gradeDistributionRaw[key]
  }));

  const topExercises = stats?.top_exercises || [];
  const recentCompletions = statusOverview?.recent_completions || [];

  return (
    <AdminLayout pageTitle="Dashboard" pageSubtitle="Platform overview">
      {/* STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsError ? (
          <div className="col-span-2 lg:col-span-4 bg-white rounded-[26px] p-6 shadow-card text-center py-10">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-rose-400" />
            </div>
            <p className="text-text-muted font-medium m-0">Failed to load platform statistics</p>
            <button onClick={fetchData} className="text-primary font-medium text-sm mt-2 border-0 bg-transparent cursor-pointer hover:underline">
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-[26px] p-6 shadow-card hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center bg-bg-section text-primary shrink-0" style={{ background: 'linear-gradient(135deg, rgba(17,169,226,0.1), rgba(17,169,226,0.2))' }}>
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-pill text-xs font-bold">
                  <ArrowUp className="w-3 h-3" /> 12%
                </div>
              </div>
              <div className="text-3xl font-bold text-text-body leading-none">{stats?.total_users || 0}</div>
              <div className="text-sm text-text-muted mt-1 font-medium">Total Patients</div>
            </div>

            <div className="bg-white rounded-[26px] p-6 shadow-card hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center text-primary shrink-0" style={{ background: 'linear-gradient(135deg, rgba(17,169,226,0.1), rgba(17,169,226,0.2))' }}>
                  <Activity className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-pill text-xs font-bold">
                  <ArrowUp className="w-3 h-3" /> 8%
                </div>
              </div>
              <div className="text-3xl font-bold text-text-body leading-none">{stats?.active_today || 0}</div>
              <div className="text-sm text-text-muted mt-1 font-medium">Active Today</div>
            </div>

            <div className="bg-white rounded-[26px] p-6 shadow-card hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center text-primary shrink-0" style={{ background: 'linear-gradient(135deg, rgba(17,169,226,0.1), rgba(17,169,226,0.2))' }}>
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-pill text-xs font-bold">
                  <ArrowUp className="w-3 h-3" /> 24%
                </div>
              </div>
              <div className="text-3xl font-bold text-text-body leading-none">{stats?.new_this_week || 0}</div>
              <div className="text-sm text-text-muted mt-1 font-medium">New This Week</div>
            </div>

            <div className="bg-white rounded-[26px] p-6 shadow-card hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center text-primary shrink-0" style={{ background: 'linear-gradient(135deg, rgba(17,169,226,0.1), rgba(17,169,226,0.2))' }}>
                  <Heart className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-rose-500 bg-rose-50 px-2 py-0.5 rounded-pill text-xs font-bold">
                  <ArrowDown className="w-3 h-3" /> 3%
                </div>
              </div>
              <div className="text-3xl font-bold text-text-body leading-none">
                {stats?.avg_pain_last_30_days !== undefined && stats?.avg_pain_last_30_days !== null ? stats.avg_pain_last_30_days : '--'}
              </div>
              <div className="text-sm text-text-muted mt-1 font-medium">Avg Pain Score</div>
            </div>
          </>
        )}
      </div>

      {/* EXERCISE STATUS OVERVIEW */}
      <div className="flex items-center justify-between mb-5 px-1">
        <h2 className="text-xl font-bold text-text-body m-0">Exercise Progress Overview</h2>
        <Link to="/admin/exercise-status" className="text-primary text-sm font-semibold hover:underline">
          View Details →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-card rounded-[26px] p-6 flex items-center gap-5 border border-primary/5">
          <div className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center bg-[#EAF6FB] text-primary shrink-0">
            <Play className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-text-body">{statusOverview?.total_started || 0}</div>
            <div className="text-sm text-text-muted font-medium mt-1">Patients Started</div>
          </div>
        </div>
        
        <div className="bg-white shadow-card rounded-[26px] p-6 flex items-center gap-5 border border-primary/5">
          <div className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center bg-amber-50 text-amber-500 shrink-0">
            <RotateCw className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-text-body">{statusOverview?.total_in_progress || 0}</div>
            <div className="text-sm text-text-muted font-medium mt-1">In Progress</div>
          </div>
        </div>

        <div className="bg-white shadow-card rounded-[26px] p-6 flex items-center gap-5 border border-primary/5">
          <div className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center bg-emerald-50 text-emerald-500 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-text-body">{statusOverview?.total_completed || 0}</div>
            <div className="text-sm text-text-muted font-medium mt-1">Completed</div>
          </div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Chart 1 */}
        <div className="bg-white rounded-[26px] p-6 shadow-card flex flex-col">
          <h3 className="font-bold text-text-body mb-6 mt-0 text-lg">Patient Distribution</h3>
          <div className="h-[250px] w-full flex-1">
            {oaDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={oaDistributionData} 
                    cx="50%" cy="50%" 
                    outerRadius={90} 
                    innerRadius={60}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {oaDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '15px', fontWeight: 500, color: '#8D98A5' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-text-muted text-sm font-medium">No data available</div>
            )}
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white rounded-[26px] p-6 shadow-card flex flex-col">
          <h3 className="font-bold text-text-body mb-6 mt-0 text-lg">OA Grades</h3>
          <div className="h-[250px] w-full flex-1">
            {gradeDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAF6FB" vertical={false} />
                  <XAxis dataKey="grade" tick={{fontSize: 12, fill: '#8D98A5', fontWeight: 500}} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{fontSize: 12, fill: '#8D98A5', fontWeight: 500}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#F4FAFD'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#11A9E2" radius={[6, 6, 0, 0]} barSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-text-muted text-sm font-medium">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* TWO COL TABLES ROW */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* RECENT COMPLETIONS TABLE */}
        <div className="bg-white rounded-[26px] shadow-card overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-text-body m-0 text-lg">Recent Completions</h3>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-bg-section">
                <tr>
                  <th className="text-[11px] text-text-muted uppercase tracking-wider px-6 py-3 font-semibold">Patient</th>
                  <th className="text-[11px] text-text-muted uppercase tracking-wider px-6 py-3 font-semibold">Exercise</th>
                  <th className="text-[11px] text-text-muted uppercase tracking-wider px-6 py-3 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-section">
                {recentCompletions.length > 0 ? (
                  recentCompletions.slice(0, 5).map((comp, i) => {
                    const completedDate = new Date(comp.completed_at);
                    const diffDays = Math.floor((new Date() - completedDate) / (1000 * 60 * 60 * 24));
                    let dateStr = diffDays <= 0 ? "Today" : diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
                    
                    return (
                      <tr key={i} className="hover:bg-bg-main transition-colors">
                        <td className="px-6 py-4 font-semibold text-text-body text-sm">{comp.user_name}</td>
                        <td className="px-6 py-4 text-text-muted text-sm">
                          <span className="block">{comp.exercise_name}</span>
                          <span className="text-[10px] uppercase font-semibold text-primary">{comp.target_area}</span>
                        </td>
                        <td className="px-6 py-4 text-text-muted text-sm text-right whitespace-nowrap">{dateStr}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-text-muted text-sm">No completed exercises yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP EXERCISES TABLE */}
        <div className="bg-white rounded-[26px] shadow-card overflow-hidden flex flex-col">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-50">
            <h3 className="font-bold text-text-body m-0 text-lg">Top Exercises</h3>
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-bg-section">
                <tr>
                  <th className="text-[11px] text-text-muted uppercase tracking-wider px-6 py-3 font-semibold w-16">#</th>
                  <th className="text-[11px] text-text-muted uppercase tracking-wider px-6 py-3 font-semibold">Exercise Name</th>
                  <th className="text-[11px] text-text-muted uppercase tracking-wider px-6 py-3 font-semibold text-right">Done</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-section">
                {topExercises.length > 0 ? (
                  topExercises.slice(0, 5).map((ex, index) => (
                    <tr key={ex.id || index} className="hover:bg-bg-main transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-text-muted">0{index + 1}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-text-body text-sm">{ex.title || ex.name || 'Unknown Exercise'}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center justify-center bg-primary/10 text-primary font-bold px-3 py-1 rounded-pill text-xs">
                          {ex.completion_count || 0}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-text-muted text-sm">No exercise data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SEED BUTTON */}
      <div className="bg-white rounded-[26px] shadow-card flex flex-col sm:flex-row items-center justify-between p-8 gap-4 mb-8 border border-primary/10">
        <div>
          <div className="font-bold text-text-body mb-1 text-lg">Exercise Database</div>
          <div className="text-text-muted text-sm">Seed initial exercise data into the system. Note: This may overwrite existing default data.</div>
        </div>
        <button 
          onClick={handleSeedExercises}
          className="btn-primary rounded-pill cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shrink-0 px-8 py-3.5 border-0"
        >
          <Database className="w-4 h-4 shrink-0" /> Seed Exercises
        </button>
      </div>

    </AdminLayout>
  );
}
