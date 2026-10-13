import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useAuth } from '../context/AuthContext';
import { exercisesAPI, progressAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { exerciseVideos, isImageMedia } from '../data/exerciseVideos';
import { exercises as staticExercises } from '../data/exercises';
import {
  ChevronLeft,
  Play,
  List,
  TriangleAlert,
  CheckCircle,
  Info,
  BarChart2,
  RotateCw,
  Loader2,
  Lock,
  SearchX
} from 'lucide-react';




export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [exercise, setExercise] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (exercise) {
      document.title = `${exercise.title || exercise.name} — OA Care`;
    }
    return () => { document.title = "OA Care"; };
  }, [exercise]);
  const [loading, setLoading] = useState(true);

  const [exerciseStatus, setExerciseStatus] = useState('not_started');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);

  // Log exercise state
  const [painBefore, setPainBefore] = useState(5)
  const [painAfter, setPainAfter] = useState(5)
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [logError, setLogError] = useState(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setError(null);
        const response = await exercisesAPI.getOne(id);
        const dbEx = response.data;
        const name = (dbEx.title || dbEx.name || '').toLowerCase().trim();
        const staticEx = staticExercises.find(
          ex => (ex.title || '').toLowerCase().trim() === name
        );
        setExercise({
          ...dbEx,
          // The API names the field `level`; the badges and details panel read `difficulty_level`.
          difficulty_level: dbEx.difficulty_level || dbEx.level,
          videoKey: staticEx?.videoKey || ''
        });
        if (isAuthenticated) {
          try {
            const statusRes = await progressAPI.getStatuses();
            const thisStatus = statusRes.data.find(s => s.exercise_id === id);
            if (thisStatus) setExerciseStatus(thisStatus.status);
          } catch (err) {
            console.error("Failed to fetch status", err);
          }
        }
      } catch (error) {
        console.error("Failed to fetch exercise details", error);
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Unable to load exercise details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchExercise();
    }
  }, [id, isAuthenticated]);

  const updateStatus = async (newStatus) => {
    if (!id || !exercise) return;
    setStatusLoading(true);
    try {
      await progressAPI.updateStatus({
        exercise_id: id,
        status: newStatus
      });
      setExerciseStatus(newStatus);
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to update status", err);
      const msg = err.response?.data?.detail ||
        err.message ||
        'Failed to update status'
      alert(`Error: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`)
    } finally {
      setStatusLoading(false);
    }
  };

  const handleLogExercise = async () => {
    if (!id) {
      alert('Exercise ID missing. Please go back and try again.');
      return;
    }
    setLogError(null);
    try {
      setSubmitting(true);
      const token = localStorage.getItem("oa_token");
      const payload = {
        exercise_id: id,
        patient_id: user?.id,
        pain_before: parseInt(painBefore) || 0,
        pain_after: parseInt(painAfter) || 0,
        notes: notes || "",
        logged_at: new Date().toISOString(),
        sets_done: exercise?.sets ? parseInt(exercise.sets) : 0,
        reps_done: exercise?.reps ? parseInt(exercise.reps) : 0
      };

      console.log('Log payload:', payload);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/progress/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('oa_token');
        localStorage.removeItem('oa_user');
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        console.log('Log payload:', payload);
        console.log('Response:', res.status, await res.clone().json());
        throw new Error('Failed to log exercise.');
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);
    } catch (error) {
      console.error("Failed to log exercise", error);
      setSubmitting(false);
      setLogError(error.message || 'Failed to log exercise.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container-main pt-6 flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container-main section-pad text-center flex-1 flex flex-col items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto text-red-700 font-semibold">
            {error}
            <div className="mt-6">
              <Link to="/exercises" className="btn-primary inline-flex items-center no-underline">
                Back to Exercise Library
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !exercise) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container-main section-pad text-center flex-1 flex flex-col items-center justify-center">
          <SearchX className="text-slate-300 w-16 h-16 mx-auto mb-4" />
          <h2 className="font-heading text-2xl text-slate-500 mb-3 font-bold">Exercise not found</h2>
          <p className="text-slate-400 mb-6">This exercise may have been removed</p>
          <Link to="/exercises" className="btn-primary inline-flex items-center">
            Back to Exercise Library
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse instructions safely
  const instructionsList = Array.isArray(exercise.instructions)
    ? exercise.instructions
    : typeof exercise.instructions === 'string'
      ? exercise.instructions.split('\n').filter(s => s.trim() !== '')
      : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <style>{`
        .react-player video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
      `}</style>

      <main className="flex-1 relative">
        {/* BACK BUTTON */}
        <div className="container-main pt-6">
          <button onClick={() => navigate(-1)} className="btn-outline border-slate-200 cursor-pointer">
            <ChevronLeft className="w-5 h-5" /> Back to Exercises
          </button>
        </div>

        {/* MAIN LAYOUT */}
        <div className="container-main section-pad">
          <div className="grid md:grid-cols-5 gap-8">

            {/* LEFT COLUMN */}
            <div className="md:col-span-3">
              {/* Exercise header */}
              <div className="flex flex-wrap gap-2 items-center mb-2">
                {exercise.difficulty_level?.toLowerCase() === 'beginner' && <span className="badge-green">Beginner</span>}
                {exercise.difficulty_level?.toLowerCase() === 'intermediate' && <span className="badge-amber">Intermediate</span>}
                {exercise.difficulty_level?.toLowerCase() === 'advanced' && <span className="badge-red">Advanced</span>}
                {!['beginner', 'intermediate', 'advanced'].includes(exercise.difficulty_level?.toLowerCase()) && (
                  <span className="badge-blue">{exercise.difficulty_level || 'All Levels'}</span>
                )}

                {exercise.target_area && (
                  <span className="badge-blue capitalize border-blue-200">{exercise.target_area}</span>
                )}

                {exercise.category && (
                  <span className="badge-blue capitalize bg-purple-50 text-purple-700 border-purple-200">{exercise.category}</span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-heading text-primary-dark mt-2 mb-6 font-bold">
                {exercise.title || exercise.name}
              </h1>

              {/* VIDEO SECTION */}
              {exercise.video_url ? (
                <div className="aspect-video rounded-2xl overflow-hidden shadow-card mb-6 bg-black" style={{ aspectRatio: '16/9' }}>
                  <ReactPlayer
                    url={exercise.video_url}
                    width="100%"
                    height="100%"
                    controls={true}
                    light={false}
                    className="react-player"
                    style={{ objectFit: 'cover' }}
                    config={{
                      file: {
                        attributes: {
                          style: {
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div
                  className="bg-slate-50 rounded-2xl aspect-video flex flex-col items-center justify-center mb-6 border border-slate-200 overflow-hidden relative"
                  style={{ aspectRatio: '16/9' }}
                >
                  {exercise.videoKey && !videoError && isImageMedia(exerciseVideos[exercise.videoKey]) ? (
                    // Static holds (plank, quad set…) have a demonstration photo instead of a video.
                    <img
                      src={exerciseVideos[exercise.videoKey]}
                      alt={`${exercise.name || exercise.title} demonstration`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff', borderRadius: '1rem' }}
                      onError={() => setVideoError(true)}
                    />
                  ) : exercise.videoKey && !videoError ? (
                    <video
                      src={exerciseVideos[exercise.videoKey]}
                      controls
                      playsInline
                      preload="metadata"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }}
                      onError={() => setVideoError(true)}
                    />
                  ) : (
                    <>
                      <Play className="text-slate-300 w-12 h-12 mb-2" />
                      <span className="text-slate-400 text-sm mt-2 font-medium">
                        {videoError ? "Video unavailable" : "Video coming soon"}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* INSTRUCTIONS */}
              <div className="card mb-6">
                <h3 className="flex items-center gap-2 text-primary-dark mb-4 text-lg font-bold">
                  <List className="w-5 h-5 text-primary" />
                  Step-by-Step Instructions
                </h3>

                <div className="space-y-3">
                  {instructionsList.length > 0 ? (
                    instructionsList.map((step, index) => (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-slate-700 leading-relaxed pt-0.5 m-0">
                          {step}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500">No instructions provided.</p>
                  )}
                </div>
              </div>

              {/* PRECAUTIONS */}
              {exercise.precautions && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
                  <TriangleAlert className="text-amber-500 w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1 mt-0">Precautions</h4>
                    <p className="text-amber-700 text-sm leading-relaxed m-0">
                      {exercise.precautions}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="md:col-span-2 relative">
              <div className="sticky top-24">

                {/* EXERCISE INFO CARD */}
                <div className="card mb-5 p-6 rounded-2xl">
                  <h3 className="text-base font-semibold text-slate-700 mb-4 mt-0">Exercise Details</h3>
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200/60 py-3">
                      <span className="text-sm text-slate-400">Sets</span>
                      <span className="text-sm font-semibold text-slate-700">{exercise.sets || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200/60 py-3">
                      <span className="text-sm text-slate-400">Reps</span>
                      <span className="text-sm font-semibold text-slate-700">
                        {exercise.reps ? exercise.reps : exercise.hold_seconds ? `Hold ${exercise.hold_seconds}s` : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200/60 py-3">
                      <span className="text-sm text-slate-400">Target Area</span>
                      <span className="text-sm font-semibold text-slate-700 capitalize">{exercise.target_area || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200/60 py-3">
                      <span className="text-sm text-slate-400">Level</span>
                      <span className="text-sm font-semibold text-slate-700 capitalize">{exercise.difficulty_level || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 pb-0">
                      <span className="text-sm text-slate-400">Category</span>
                      <span className="text-sm font-semibold text-slate-700 capitalize">{exercise.category || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* TRACKING & LOGGING SECTION */}
                {isAuthenticated ? (
                  <>
                    <div className={`card mb-5 relative ${statusLoading ? 'opacity-60 pointer-events-none' : ''}`}>
                      <div className="flex items-center gap-2 mb-5">
                        <BarChart2 className="text-primary w-5 h-5 shrink-0" />
                        <h3 className="text-base font-semibold text-slate-700 m-0 mt-0.5">Exercise Status</h3>
                        {statusLoading && <Loader2 className="w-4 h-4 text-primary animate-spin ml-auto" />}
                      </div>

                      <div className="space-y-2">
                        <div
                          onClick={() => updateStatus('started')}
                          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all text-left ${exerciseStatus === 'started' ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-200'
                            }`}
                        >
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${exerciseStatus === 'started' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                            <Play className="w-5 h-5 shrink-0 ml-0.5" />
                          </div>
                          <div>
                            <div className={`font-semibold text-sm leading-tight mb-0.5 ${exerciseStatus === 'started' ? 'text-blue-700' : 'text-slate-600'
                              }`}>Started</div>
                            <div className={`text-xs ${exerciseStatus === 'started' ? 'text-blue-500' : 'text-slate-400'
                              }`}>I have begun this exercise</div>
                          </div>
                        </div>

                        <div
                          onClick={() => updateStatus('in_progress')}
                          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all text-left ${exerciseStatus === 'in_progress' ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white hover:border-amber-200'
                            }`}
                        >
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${exerciseStatus === 'in_progress' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                            <RotateCw className="w-5 h-5 shrink-0" />
                          </div>
                          <div>
                            <div className={`font-semibold text-sm leading-tight mb-0.5 ${exerciseStatus === 'in_progress' ? 'text-amber-700' : 'text-slate-600'
                              }`}>In Progress</div>
                            <div className={`text-xs ${exerciseStatus === 'in_progress' ? 'text-amber-500' : 'text-slate-400'
                              }`}>Regularly doing this exercise</div>
                          </div>
                        </div>

                        <div
                          onClick={() => updateStatus('completed')}
                          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all text-left ${exerciseStatus === 'completed' ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-white hover:border-green-200'
                            }`}
                        >
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${exerciseStatus === 'completed' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                            <CheckCircle className="w-5 h-5 shrink-0" />
                          </div>
                          <div>
                            <div className={`font-semibold text-sm leading-tight mb-0.5 ${exerciseStatus === 'completed' ? 'text-green-700' : 'text-slate-600'
                              }`}>Completed</div>
                            <div className={`text-xs ${exerciseStatus === 'completed' ? 'text-green-500' : 'text-slate-400'
                              }`}>I can do this exercise confidently</div>
                          </div>
                        </div>
                      </div>

                      {statusSuccess && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mt-3 flex items-center gap-2 text-green-700 text-sm font-medium animate-fade-in">
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          Status updated!
                        </div>
                      )}
                    </div>

                    <div className="card">
                      {submitSuccess ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                          <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-3" />
                          <h3 className="text-green-800 font-bold text-lg m-0 mb-1">Exercise Logged!</h3>
                          <p className="text-green-700 text-sm mb-5 mt-0">Great job staying on track with your recovery.</p>
                          <Link to="/dashboard" className="btn-primary w-full justify-center inline-flex no-underline text-sm border-0">
                            View My Progress →
                          </Link>
                        </div>
                      ) : (
                        <>
                          <h3 className="flex items-center gap-2 text-base font-semibold mb-5 text-slate-800 mt-0">
                            <CheckCircle className="text-green-500 w-5 h-5 shrink-0" />
                            Log This Exercise
                          </h3>

                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-sm font-semibold text-slate-700">Pain before (0-10)</label>
                              <span className="badge-red shrink-0 py-0.5">{painBefore}</span>
                            </div>
                            <input
                              type="range"
                              min="0" max="10"
                              value={painBefore}
                              onChange={e => setPainBefore(parseInt(e.target.value))}
                              className="w-full accent-primary mb-1 cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                              <span>0 No pain</span>
                              <span>10 Worst</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-sm font-semibold text-slate-700">Pain after (0-10)</label>
                              <span className="badge-red shrink-0 py-0.5">{painAfter}</span>
                            </div>
                            <input
                              type="range"
                              min="0" max="10"
                              value={painAfter}
                              onChange={e => setPainAfter(parseInt(e.target.value))}
                              className="w-full accent-primary mb-1 cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                              <span>0 No pain</span>
                              <span>10 Worst</span>
                            </div>
                          </div>

                          <div className="mb-4 mt-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Optional notes...</label>
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="input-field resize-none h-20 w-full"
                              placeholder="Optional notes..."
                            ></textarea>
                          </div>

                          <button
                            onClick={handleLogExercise}
                            disabled={submitting}
                            className="btn-primary w-full mt-2 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 border-0"
                          >
                            <CheckCircle className="w-5 h-5 shrink-0" />
                            {submitting ? "Logging..." : "Mark as Complete"}
                          </button>
                          {logError && <p className="text-red-500 text-sm mt-2">{logError}</p>}
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="card text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                      <Lock className="text-slate-300 w-8 h-8" />
                    </div>
                    <p className="font-semibold text-slate-600 mb-1 mt-0">
                      Track Your Progress
                    </p>
                    <p className="text-sm text-slate-400 mb-6 mt-0">
                      Login to mark exercise status and log pain scores
                    </p>
                    <Link to="/login" className="btn-primary w-full justify-center inline-flex no-underline text-sm border-0 mb-3">
                      Login to Continue
                    </Link>
                    <p className="text-xs text-slate-400 mt-0 m-0">
                      Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register free</Link>
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
