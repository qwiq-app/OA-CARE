import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { exerciseImages } from '../data/exerciseImages';
import { Activity, Zap, Heart, Dumbbell, MapPin, Clock, ArrowRight } from 'lucide-react';

/* ── target-area icon helper for fallbacks ── */
function AreaIcon({ area, size = 'w-8 h-8' }) {
  const a = (area || '').toLowerCase();
  if (a.includes('hip'))  return <Activity className={`${size} text-white`} />;
  if (a.includes('knee')) return <Zap       className={`${size} text-white`} />;
  if (a.includes('core') || a.includes('back')) return <Heart className={`${size} text-white`} />;
  return <Dumbbell className={`${size} text-white`} />;
}

export default function ExerciseCard({ exercise }) {
  const { imageKey, title, area, type, level, sets, description, id } = exercise;
  const img = exerciseImages[imageKey];   // resolves to imported asset URL
  const navigate = useNavigate();

  const levelColors = {
    Beginner:     { bg: '#dbeafe', color: '#1d4ed8' },
    Intermediate: { bg: '#fef9c3', color: '#854d0e' },
    Advanced:     { bg: '#fce7f3', color: '#9d174d' },
  }
  const levelStyle = levelColors[exercise.level] || { bg: '#f1f5f9', color: '#475569' }

  return (
    <div className="exercise-card" onClick={() => navigate(`/exercises/${id}`)}>

      {/* ── Image section ── */}
      <div className="card-image-wrap">
        {img ? (
          <img
            src={img}
            alt={title}
            className="card-exercise-img"
          />
        ) : (
          <div className="card-img-fallback">
            <AreaIcon area={area} size="w-8 h-8" />
          </div>
        )}
      </div>

      {/* ── Card body (upgraded to Lucide React & router links) ── */}
      <div className="card-body">
        <div className="card-tags">
          <span style={{ backgroundColor: levelStyle.bg, color: levelStyle.color }} className="tag tag-level">
            {exercise.level}
          </span>
          <span className="tag tag-type">{type}</span>
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="card-area">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" /> {area}
        </p>
        <p className="card-desc">{description}</p>
        <div className="card-footer">
          <span className="card-sets">
            <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" /> {sets}
          </span>
          <Link to={`/exercises/${id}`} className="card-link" onClick={e => e.stopPropagation()}>
            View Exercise <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      </div>

    </div>
  );
}
