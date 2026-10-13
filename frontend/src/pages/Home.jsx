import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { exercisesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heroMedicalImg  from "../assets/hero_medical.png";
import painDiaryImg    from "../assets/pain_diary.png";
import aboutOaImg      from "../assets/about_oa.png";
import exercisesImg    from "../assets/exercises.png";
import counsellingImg  from "../assets/counselling.png";
import {
  Activity,
  ArrowRight,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  HeartPulse,
  MapPin,
  Target,
} from 'lucide-react';

const careSteps = [
  { icon: BookOpen, title: 'Learn the condition', text: 'Plain-language education for symptoms, diagnosis, grades, and treatment options.' },
  { icon: Dumbbell, title: 'Move with guidance', text: 'Targeted hip, knee, core, and balance exercises for different ability levels.' },
  { icon: ClipboardList, title: 'Track what changes', text: 'Pain diary and progress tools help patients see patterns over time.' },
];

function AreaIcon({ area }) {
  const normalizedArea = (area || '').toLowerCase();
  if (normalizedArea.includes('hip')) return <Activity className="h-6 w-6 text-white" />;
  if (normalizedArea.includes('knee')) return <Target className="h-6 w-6 text-white" />;
  if (normalizedArea.includes('core') || normalizedArea.includes('back')) return <HeartPulse className="h-6 w-6 text-white" />;
  return <Dumbbell className="h-6 w-6 text-white" />;
}

function HeroIllustration() {
  return (
    <div className="relative flex flex-1 items-center justify-start home-hero-art">
      <img
        src={heroMedicalImg}
        alt="OA Care Illustration"
        className="hero-image"
      />
    </div>
  );
}

function QuickCard({ card, navigate }) {
  const [hovered, setHovered] = React.useState(false);
  const isBlue = hovered;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(card.path)}
      style={{
        background: isBlue
          ? 'linear-gradient(145deg, #11A9E2, #0B92D1)'
          : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderRadius: '28px',
        border: isBlue
          ? '1px solid rgba(255,255,255,0.3)'
          : '1px solid rgba(17,169,226,0.12)',
        padding: '24px 20px 20px',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isBlue
          ? '0 20px 45px rgba(17,169,226,0.35)'
          : '0 8px 24px rgba(17,169,226,0.08)',
        isolation: 'isolate',
        minWidth: 0,
      }}
    >
      <p style={{
        fontWeight: 700,
        fontSize: '17px',
        color: isBlue ? 'white' : '#1E1E1E',
        letterSpacing: '-0.2px',
        marginBottom: '4px',
        transition: 'color 0.3s ease',
      }}>
        {card.title}
      </p>

      <p style={{
        fontSize: '13px',
        color: isBlue ? 'rgba(255,255,255,0.78)' : '#8D98A5',
        marginBottom: 'auto',
        transition: 'color 0.3s ease',
      }}>
        {card.sub}
      </p>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 0 12px',
        overflow: 'hidden',
      }}>
        <img
          src={card.img}
          alt={card.title}
          style={{
            width: '130px',
            height: '130px',
            objectFit: 'contain',
            transform: hovered
              ? 'translateY(-8px) scale(1.06)'
              : 'translateY(0) scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: 'drop-shadow(0 10px 24px rgba(17,169,226,0.22))',
          }}
        />
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); navigate(card.path); }}
        style={{
          background: isBlue ? 'white' : 'transparent',
          color: '#11A9E2',
          border: isBlue ? 'none' : '1.5px solid #11A9E2',
          borderRadius: '999px',
          padding: '9px 24px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          alignSelf: 'flex-start',
          marginTop: '8px',
          boxShadow: isBlue ? '0 4px 14px rgba(0,0,0,0.12)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {card.btnLabel}
      </button>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'OA Care - Osteoarthritis Patient Platform';
    return () => {
      document.title = 'OA Care';
    };
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await exercisesAPI.list({ limit: 3 });
        const data = response.data?.items || response.data;
        setExercises(
          Array.isArray(data)
            // The API names the field `level`; the badges below read `difficulty_level`.
            ? data.slice(0, 3).map(ex => ({ ...ex, difficulty_level: ex.difficulty_level || ex.level }))
            : []
        );
      } catch (error) {
        console.error('Failed to fetch exercises', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal-up');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [loading, exercises.length]);

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <Navbar />

      <main className="flex-1 overflow-hidden">
        <section className="home-hero">
          <div className="container-main relative z-10 grid items-center gap-9 py-12 pb-0 md:min-h-[560px] md:grid-cols-[45fr_55fr] md:gap-10 md:py-14 md:pb-0 lg:min-h-[600px] lg:gap-12 lg:py-16 lg:pb-0">
            <div className="min-w-0 max-w-[560px] reveal-up is-visible">
              <span className="section-label">Patient education and recovery support</span>
              <h1 className="mt-3 text-[clamp(2.5rem,8vw,4rem)] font-bold leading-[1.05] text-text-main">
                OA Care
              </h1>
              <p className="mt-4 max-w-[340px] text-[clamp(1.35rem,4vw,2rem)] font-semibold leading-tight text-text-body sm:max-w-[540px]">
                Managing osteoarthritis of the hip and knee.
              </p>
              <p className="mt-5 max-w-[340px] text-[15px] leading-8 text-slate-600 sm:max-w-[470px]">
                Clear education, guided exercises, and simple tracking tools for people living with osteoarthritis.
              </p>

              <div className="mt-8 flex max-w-[340px] flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 hero-cta-container">
                <Link to="/exercises" className="btn-primary w-full sm:w-auto">
                  Explore exercises
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/about" className="btn-secondary w-full sm:w-auto">
                  Learn about OA
                </Link>
              </div>

              <div className="mt-8 grid max-w-[520px] grid-cols-3 gap-4 border-t border-primary/10 pt-5 hero-stats">
                <div>
                  <strong className="block text-xl text-text-main">20+</strong>
                  <span className="text-xs font-medium text-text-muted">Exercises</span>
                </div>
                <div>
                  <strong className="block text-xl text-text-main">4</strong>
                  <span className="text-xs font-medium text-text-muted">OA grades</span>
                </div>
                <div>
                  <strong className="block text-xl text-text-main">Free</strong>
                  <span className="text-xs font-medium text-text-muted">Access</span>
                </div>
              </div>
            </div>

            <HeroIllustration />
          </div>
        </section>

        <section className="home-quick-section">
          <div className="container-main quick-card-grid">
            {[
              {
                title: 'Pain Diary',
                sub: 'Log your daily pain',
                img: painDiaryImg,
                btnLabel: 'Log Now',
                path: '/dashboard',
              },
              {
                title: 'About OA',
                sub: 'Learn the basics',
                img: aboutOaImg,
                btnLabel: 'Explore',
                path: '/about',
              },
              {
                title: 'Exercises',
                sub: '20+ guided exercises',
                img: exercisesImg,
                btnLabel: 'Start',
                path: '/exercises',
              },
              {
                title: 'Counselling',
                sub: 'Daily living tips',
                img: counsellingImg,
                btnLabel: 'Read',
                path: '/counselling',
              },
            ].map((card, i) => (
              <QuickCard key={i} card={card} navigate={navigate} />
            ))}
          </div>
        </section>

        <section className="bg-white section-pad">
          <div className="container-main">
            <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center home-pathway-container">
              <div className="reveal-up">
                <span className="section-label">Care pathway</span>
                <h2 className="section-title mt-1 max-w-md">Everything patients need to start with confidence.</h2>
                <p className="section-subtitle max-w-md">
                  OA Care brings education, exercise, counselling, and progress tracking into one calmer workflow.
                </p>
                <Link to="/about" className="btn-primary mt-8">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="home-pathway reveal-up">
                {careSteps.map(({ icon: Icon, title, text }, index) => (
                  <div className="home-pathway-row" key={title}>
                    <div className="home-pathway-index">0{index + 1}</div>
                    <div className="home-pathway-icon">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-bg-main section-pad">
          <div className="container-main">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="section-label">Exercises</span>
                <h2 className="section-title mt-1">Guided exercise library</h2>
              </div>
              <Link to="/exercises" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3 home-exercises-grid">
              {loading ? (
                <>
                  <div className="h-64 w-full animate-pulse rounded-[22px] bg-white shadow-card" />
                  <div className="h-64 w-full animate-pulse rounded-[22px] bg-white shadow-card" />
                  <div className="h-64 w-full animate-pulse rounded-[22px] bg-white shadow-card" />
                </>
              ) : (
                exercises.map((exercise, index) => (
                  <article
                    key={exercise.id}
                    className="home-exercise-card reveal-up"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="home-exercise-art">
                      <div className="home-exercise-icon">
                        <AreaIcon area={exercise.target_area} />
                      </div>
                      <span className="home-exercise-orbit" />
                    </div>

                    <h3 className="mb-1 line-clamp-1 text-[17px] font-semibold text-text-body">
                      {exercise.title || exercise.name}
                    </h3>

                    <div className="mb-3 flex items-center gap-1 text-xs text-text-muted">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="capitalize">{exercise.target_area || 'General'}</span>
                    </div>

                    <p className="mb-5 line-clamp-2 text-sm leading-7 text-text-muted">
                      {exercise.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                      {exercise.difficulty_level?.toLowerCase() === 'beginner' && <span className="badge-green">Beginner</span>}
                      {exercise.difficulty_level?.toLowerCase() === 'intermediate' && <span className="badge-amber">Intermediate</span>}
                      {exercise.difficulty_level?.toLowerCase() === 'advanced' && <span className="badge-red">Advanced</span>}
                      {!['beginner', 'intermediate', 'advanced'].includes(exercise.difficulty_level?.toLowerCase()) && (
                        <span className="badge-blue">{exercise.difficulty_level || 'All levels'}</span>
                      )}

                      <Link to={`/exercises/${exercise.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                        Start
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </div>

            {!loading && exercises.length === 0 && (
              <div className="reveal-up is-visible rounded-[22px] border border-primary/10 bg-white py-10 text-center text-text-muted">
                No featured exercises available right now.
              </div>
            )}
          </div>
        </section>

        {!isAuthenticated && (
          <section className="home-cta-section">
            <div className="container-main">
              <div className="home-cta-banner">

                {/* Decorative circle blobs inside card */}
                <div className="home-cta-blob-1" />
                <div className="home-cta-blob-2" />

                {/* Left text */}
                <div className="home-cta-content">
                  <p className="home-cta-label">START TODAY</p>
                  <h2 className="home-cta-title">Track your OA journey.</h2>
                  <p className="home-cta-desc">
                    Create a free account to log exercises, track pain
                    levels, and monitor your recovery patterns.
                  </p>
                </div>

                {/* Right button */}
                <div className="home-cta-action">
                  <button
                    onClick={() => navigate('/register')}
                    className="home-cta-button"
                  >
                    Create free account
                  </button>
                </div>
              </div>
            </div>

            {/* Wave transition into footer */}
            <div className="home-cta-wave">
              <svg
                viewBox="0 0 1440 80"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
                  fill="#0f3d5c"
                />
              </svg>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
