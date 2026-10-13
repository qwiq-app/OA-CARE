import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { exercisesAPI, getApiErrorDetails } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExerciseCard from '../components/ExerciseCard';
import {
  Search,
  Target,
  Tag,
  Clock,
  ArrowRight,
  Activity,
  Zap,
  Dumbbell,
  Heart,
} from 'lucide-react';
import { exercises as staticExercises } from '../data/exercises';
import { exerciseImages } from '../data/exerciseImages';

function getExerciseImage(dbExercise) {
  const name = (dbExercise.title || dbExercise.name || '').toLowerCase().trim();
  const matched = staticExercises.find(
    ex => (ex.title || '').toLowerCase().trim() === name
  );
  if (matched && matched.imageKey) {
    return exerciseImages[matched.imageKey];
  }
  return null;
}

/* ── target-area icon helper ── */
function AreaIcon({ area, size = 'w-8 h-8' }) {
  const a = (area || '').toLowerCase();
  if (a.includes('hip'))  return <Activity className={`${size} text-white`} />;
  if (a.includes('knee')) return <Zap       className={`${size} text-white`} />;
  if (a.includes('core') || a.includes('back')) return <Heart className={`${size} text-white`} />;
  return <Dumbbell className={`${size} text-white`} />;
}

function FilterRow({ label, options, labels, value, onChange }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    }}>
      <span style={{
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#8D98A5',
        minWidth: '40px',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {options.map((opt, i) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                background: active
                  ? 'linear-gradient(135deg, #11A9E2, #0B92D1)'
                  : 'rgba(244,250,253,0.9)',
                color: active ? 'white' : '#8D98A5',
                border: active
                  ? 'none'
                  : '1px solid rgba(17,169,226,0.15)',
                borderRadius: '999px',
                padding: '6px 18px',
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: active
                  ? '0 4px 12px rgba(17,169,226,0.3)'
                  : 'none',
                outline: 'none',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(17,169,226,0.08)';
                  e.currentTarget.style.color = '#11A9E2';
                  e.currentTarget.style.borderColor = 'rgba(17,169,226,0.3)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(244,250,253,0.9)';
                  e.currentTarget.style.color = '#8D98A5';
                  e.currentTarget.style.borderColor = 'rgba(17,169,226,0.15)';
                }
              }}
            >
              {labels[i]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Exercises() {
  useEffect(() => {
    document.title = 'Exercise Library — OA Care';
    return () => { document.title = 'OA Care'; };
  }, []);

  const navigate = useNavigate();
  const [exercises,         setExercises]         = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [error,             setError]             = useState(null);

  const [areaFilter,  setAreaFilter]  = useState('all');
  const [typeFilter,  setTypeFilter]  = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('All');

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await exercisesAPI.list();
        const data = response.data?.items || response.data;
        const list = Array.isArray(data) ? data : [];

        if (!Array.isArray(data)) {
          console.error('Exercise service returned an empty or invalid response', response.data);
          setError('The exercise service returned an empty response.');
          setExercises([]);
          setFilteredExercises([]);
          return;
        }

        const mergedList = list.map(dbEx => {
          const name = (dbEx.title || dbEx.name || '').toLowerCase().trim();
          const staticEx = staticExercises.find(
            ex => (ex.title || '').toLowerCase().trim() === name
          );
          return {
            ...dbEx,
            id: dbEx.id,
            title: dbEx.title || dbEx.name || staticEx?.title,
            area: dbEx.target_area || staticEx?.area,
            type: dbEx.category || staticEx?.type,
            level: dbEx.difficulty_level || staticEx?.level,
            sets: dbEx.sets && dbEx.reps
              ? `${dbEx.sets}×${dbEx.reps}`
              : dbEx.hold_seconds
                ? `Hold ${dbEx.hold_seconds}s`
                : staticEx?.sets || 'Follow guide',
            description: dbEx.description || staticEx?.description,
            imageKey: staticEx?.imageKey || '',
          };
        });
        setExercises(mergedList);
        setFilteredExercises(mergedList);
      } catch (error) {
        console.error('Failed to fetch exercises', error);
        setError(getApiErrorDetails(error, 'exercise service').message);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    const result = exercises.filter(ex =>
      (areaFilter === 'all' || (ex.area && ex.area.toLowerCase() === areaFilter.toLowerCase())) &&
      (typeFilter === 'all' || (ex.type && ex.type.toLowerCase() === typeFilter.toLowerCase())) &&
      (selectedLevel === 'All' || ex.level === selectedLevel)
    );
    setFilteredExercises(result);
  }, [exercises, areaFilter, typeFilter, selectedLevel]);
  useEffect(() => {
    if (!loading && exercises.length > 0) {
      console.log('filteredExercises.length:', filteredExercises.length);
      console.log('exercises[0]?.target_area:', exercises[0]?.target_area);
    }
  }, [loading, exercises, filteredExercises]);

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <Navbar />

      {/* ── PAGE HEADER ── */}
      <div className="bg-white border-b border-primary/10 py-12">
        <div className="container-main text-center">
          <span className="section-label">EXERCISE LIBRARY</span>
          <h1 className="section-title mt-1">Guided Exercises for OA</h1>
          <p className="section-subtitle mb-0 max-w-xl mx-auto">
            Physiotherapist-recommended exercises for Hip &amp; Knee Osteoarthritis
          </p>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="bg-bg-main py-5 sticky top-[80px] z-30 border-b border-primary/5">
        <div className="container-main">
          <div style={{
            background: 'white',
            border: '1px solid rgba(17,169,226,0.1)',
            borderRadius: '20px',
            padding: '20px 24px',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 4px 20px rgba(17,169,226,0.06)',
          }}>

            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#11A9E2" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1E1E1E',
                }}>
                  Filter exercises
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '13px', color: '#8D98A5' }}>{filteredExercises.length} exercises</span>
                <button
                  onClick={() => { setAreaFilter('all'); setTypeFilter('all'); setSelectedLevel('All'); }}
                  style={{
                    fontSize: '12px',
                    color: '#11A9E2',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    fontWeight: 500,
                  }}
                >
                  Clear all
                </button>
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(17,169,226,0.08)' }} />

            {/* AREA row only */}
            <FilterRow
              label="Area"
              options={['all', 'hip', 'knee']}
              labels={['All', 'Hip', 'Knee']}
              value={areaFilter}
              onChange={setAreaFilter}
            />

            {/* TYPE row only */}
            <FilterRow
              label="Type"
              options={['all', 'strengthening', 'stretching', 'balance', 'cardio']}
              labels={['All', 'Strengthening', 'Stretching', 'Balance', 'Cardio']}
              value={typeFilter}
              onChange={setTypeFilter}
            />

            {/* LEVEL row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#8D98A5',
                minWidth: '40px',
                flexShrink: 0,
              }}>
                LEVEL
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`filter-pill ${selectedLevel === level ? 'active' : ''}`}
                    style={{
                      background: selectedLevel === level
                        ? 'linear-gradient(135deg, #11A9E2, #0B92D1)'
                        : 'rgba(244,250,253,0.9)',
                      color: selectedLevel === level ? 'white' : '#8D98A5',
                      border: selectedLevel === level
                        ? 'none'
                        : '1px solid rgba(17,169,226,0.15)',
                      borderRadius: '999px',
                      padding: '6px 18px',
                      fontSize: '13px',
                      fontWeight: selectedLevel === level ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedLevel === level
                        ? '0 4px 12px rgba(17,169,226,0.3)'
                        : 'none',
                      outline: 'none',
                    }}
                    onMouseEnter={e => {
                      if (selectedLevel !== level) {
                        e.currentTarget.style.background = 'rgba(17,169,226,0.08)';
                        e.currentTarget.style.color = '#11A9E2';
                        e.currentTarget.style.borderColor = 'rgba(17,169,226,0.3)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedLevel !== level) {
                        e.currentTarget.style.background = 'rgba(244,250,253,0.9)';
                        e.currentTarget.style.color = '#8D98A5';
                        e.currentTarget.style.borderColor = 'rgba(17,169,226,0.15)';
                      }
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="container-main section-pad">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1,2,3,4,5,6].map(i => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-[26px] h-64 w-full"
                  style={{ boxShadow: '0 12px 30px rgba(17,169,226,0.08)' }}
                />
              ))
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-[26px] p-12 text-center col-span-full text-red-700 font-semibold">
                {error}
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="bg-white rounded-[26px] p-12 text-center col-span-full"
                style={{ boxShadow: '0 12px 30px rgba(17,169,226,0.10)' }}>
                <Search className="w-12 h-12 mx-auto mb-4" style={{ color: '#11A9E2', opacity: 0.3 }} />
                <p className="text-text-body font-semibold text-lg">No exercises found</p>
                <p className="text-text-muted text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              filteredExercises.map(exercise => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
