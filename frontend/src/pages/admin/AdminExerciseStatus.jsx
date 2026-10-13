import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Play, RotateCw, CheckCircle, Dumbbell, Loader2 } from 'lucide-react';

export default function AdminExerciseStatus() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await adminAPI.getExerciseStatusOverview();
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch exercise status overview", error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <AdminLayout pageTitle="Exercise Status" pageSubtitle="Patient exercise progress tracking">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const {
    total_started = 0,
    total_in_progress = 0,
    total_completed = 0,
    completion_by_exercise = [],
    recent_completions = []
  } = data || {};

  const getLevelBadge = (level) => {
    switch(level) {
      case 'beginner': return <span className="badge-green capitalize text-xs">Beginner</span>;
      case 'intermediate': return <span className="badge-amber capitalize text-xs">Intermediate</span>;
      case 'advanced': return <span className="badge-red capitalize text-xs">Advanced</span>;
      default: return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs font-semibold capitalize">{level}</span>;
    }
  };

  return (
    <AdminLayout pageTitle="Exercise Status" pageSubtitle="Patient exercise progress tracking">
      
      {/* SECTION 1 — Summary Cards */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {/* Card 1 — Started */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
            <Play className="text-blue-500 w-7 h-7" />
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-700 leading-none">{total_started}</div>
            <div className="text-slate-400 text-sm font-medium mt-1">Patients Started</div>
          </div>
        </div>

        {/* Card 2 — In Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
            <RotateCw className="text-amber-500 w-7 h-7" />
          </div>
          <div>
            <div className="text-4xl font-bold text-amber-700 leading-none">{total_in_progress}</div>
            <div className="text-slate-400 text-sm font-medium mt-1">Currently In Progress</div>
          </div>
        </div>

        {/* Card 3 — Completed */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle className="text-green-500 w-7 h-7" />
          </div>
          <div>
            <div className="text-4xl font-bold text-green-700 leading-none">{total_completed}</div>
            <div className="text-slate-400 text-sm font-medium mt-1">Fully Completed</div>
          </div>
        </div>
      </div>

      {/* SECTION 2 — Exercise Breakdown Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="font-semibold text-slate-700 m-0 text-lg">Progress by Exercise</h3>
          <Dumbbell className="text-slate-400 w-5 h-5 shrink-0" />
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-y border-slate-100">
              <tr>
                <th className="text-xs text-slate-400 uppercase tracking-wide px-6 py-3 font-semibold">Exercise</th>
                <th className="text-xs text-slate-400 uppercase tracking-wide px-6 py-3 font-semibold">Area</th>
                <th className="text-xs text-slate-400 uppercase tracking-wide px-6 py-3 font-semibold">Level</th>
                <th className="text-xs text-slate-400 uppercase tracking-wide px-6 py-3 font-semibold">Started</th>
                <th className="text-xs text-slate-400 uppercase tracking-wide px-6 py-3 font-semibold">In Progress</th>
                <th className="text-xs text-slate-400 uppercase tracking-wide px-6 py-3 font-semibold">Completed</th>
                <th className="text-xs text-slate-400 uppercase tracking-wide px-6 py-3 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completion_by_exercise.length > 0 ? (
                completion_by_exercise.map((item, index) => {
                  const total = (item.started || 0) + (item.in_progress || 0) + (item.completed || 0);
                  return (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-700 text-sm">{item.exercise_name}</td>
                      <td className="px-6 py-4">
                        <span className="badge-blue capitalize text-xs border border-blue-200">{item.target_area}</span>
                      </td>
                      <td className="px-6 py-4">
                        {getLevelBadge(item.level)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg inline-block">
                          {item.started || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg inline-block">
                          {item.in_progress || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg inline-block">
                          {item.completed || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">
                        {total}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-sm">No status data yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3 — Recent Completions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="font-semibold text-slate-700 m-0 text-lg">Recent Completions</h3>
          <CheckCircle className="text-green-500 w-5 h-5 shrink-0" />
        </div>
        
        <div className="divide-y divide-slate-50">
          {recent_completions.length > 0 ? (
            recent_completions.slice(0, 10).map((comp, index) => {
              const dateStr = new Date(comp.completed_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              });
              
              return (
                <div key={index} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {comp.user_name ? comp.user_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-700 text-sm truncate">{comp.user_name}</div>
                    <div className="flex items-center mt-0.5">
                      <span className="text-slate-500 text-xs truncate">{comp.exercise_name}</span>
                      <span className="badge-blue ml-2 !text-[10px] !py-0 !px-1.5 border border-blue-200 capitalize">
                        {comp.target_area}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center shrink-0">
                    <span className="text-xs text-slate-400">{dateStr}</span>
                    <CheckCircle className="text-green-400 w-4 h-4 ml-2" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400 text-sm">No recent completions</div>
          )}
        </div>
      </div>

    </AdminLayout>
  );
}
