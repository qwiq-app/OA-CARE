import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope,
  ChevronDown,
  Menu,
  X,
  LogOut,
  UserCircle,
  Pill,
  Leaf,
  Home,
  Info,
  Activity,
  MessageCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

const NAV_LINK_BASE =
  'text-[14px] font-medium transition-colors duration-200';
const NAV_LINK_ACTIVE = 'text-primary';
const NAV_LINK_IDLE = 'text-[#555] hover:text-primary';

const MOBILE_LINK_BASE =
  'flex items-center gap-3 px-6 py-4 border-b border-slate-50 transition-colors text-[15px] font-medium';
const MOBILE_LINK_ACTIVE = 'text-primary bg-primary/5';
const MOBILE_LINK_IDLE = 'text-slate-700 hover:bg-primary/5 hover:text-primary';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Don't render public navbar on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTreatmentsOpen, setIsTreatmentsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsTreatmentsOpen(false);
  }, [location.pathname]);

  // Click-outside closes treatments dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsTreatmentsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  const treatmentsActive =
    location.pathname.includes('pharmacological');

  return (
    <>
      <nav
        className="bg-white sticky top-0 z-50"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
      >
        <div className="container-main flex items-center justify-between h-[80px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <Stethoscope
              className="w-7 h-7"
              style={{ color: '#11A9E2' }}
              strokeWidth={2}
            />
            <span
              className="font-semibold"
              style={{ fontSize: '22px', color: '#1299DB' }}
            >
              OA Care
            </span>
          </Link>

          {/* Center nav links (md+) */}
          <div className="hidden lg:flex items-center gap-[24px] xl:gap-[32px]">
            {/* About OA */}
            <Link
              to="/about"
              className={`${NAV_LINK_BASE} ${isActive('/about') ? NAV_LINK_ACTIVE : NAV_LINK_IDLE}`}
            >
              About OA
            </Link>

            {/* Treatments dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setIsTreatmentsOpen(true)}
              onMouseLeave={() => setIsTreatmentsOpen(false)}
            >
              <button
                className={`
                  ${NAV_LINK_BASE} flex items-center gap-1 border-0
                  bg-transparent cursor-pointer
                  ${treatmentsActive ? NAV_LINK_ACTIVE : NAV_LINK_IDLE}
                `}
              >
                Treatments
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isTreatmentsOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown panel */}
              {isTreatmentsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 min-w-[240px] z-50 pt-3">
                  <div
                    className="bg-white rounded-card border border-primary/10 p-2 overflow-hidden"
                    style={{ boxShadow: '0 12px 30px rgba(17,169,226,0.12)' }}
                  >
                    <Link
                      to="/pharmacological"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] text-text-body hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <Pill className="w-4 h-4 text-primary shrink-0" />
                      <span>Pharmacological Management</span>
                    </Link>
                    <Link
                      to="/non-pharmacological"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] text-text-body hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <Leaf className="w-4 h-4 text-primary shrink-0" />
                      <span>Non-Pharmacological Management</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Exercises */}
            <Link
              to="/exercises"
              className={`${NAV_LINK_BASE} ${isActive('/exercises') ? NAV_LINK_ACTIVE : NAV_LINK_IDLE}`}
            >
              Exercises
            </Link>

            {/* Counselling */}
            <Link
              to="/counselling"
              className={`${NAV_LINK_BASE} ${isActive('/counselling') ? NAV_LINK_ACTIVE : NAV_LINK_IDLE}`}
            >
              Counselling
            </Link>

            {/* FAQ */}
            <Link
              to="/faq"
              className={`${NAV_LINK_BASE} ${isActive('/faq') ? NAV_LINK_ACTIVE : NAV_LINK_IDLE}`}
            >
              FAQ
            </Link>

            {/* Resources */}
            <Link
              to="/resources"
              className={`${NAV_LINK_BASE} ${isActive('/resources') ? NAV_LINK_ACTIVE : NAV_LINK_IDLE}`}
            >
              Resources
            </Link>
          </div>

          {/* Right side auth (md+) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {isAuthenticated && user ? (
              <>
                {/* Username */}
                <div className="flex items-center gap-1.5 text-[13px] text-text-muted font-medium">
                  <UserCircle className="w-4 h-4" />
                  <span>{user.full_name || 'User'}</span>
                </div>

                {/* Role-based CTA */}
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="
                      inline-flex items-center gap-1.5 rounded-pill px-5 py-2
                      text-sm font-medium text-white
                      bg-gradient-to-br from-primary to-primary-dark
                      shadow-btn hover:shadow-float transition-all duration-200
                    "
                  >
                    {'Admin Panel ->'}
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="
                      inline-flex items-center gap-1.5 rounded-pill px-5 py-2
                      text-sm font-medium text-white
                      bg-gradient-to-br from-primary to-primary-dark
                      shadow-btn hover:shadow-float transition-all duration-200
                    "
                  >
                    My Progress
                  </Link>
                )}

                {/* Logout icon */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-text-muted hover:text-rose-500 hover:bg-rose-50 transition-colors border-0 bg-transparent cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {/* Login text link */}
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#555] hover:text-primary transition-colors"
                >
                  Login
                </Link>

                {/* Get Started pill */}
                <Link
                  to="/register"
                  className="
                    inline-flex items-center rounded-pill px-5 py-2
                    text-sm font-medium text-primary
                    bg-white border border-primary/30
                    shadow-white hover:shadow-card transition-all duration-200
                  "
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-primary/5 text-text-muted border-0 bg-transparent cursor-pointer transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen
                ? <X className="w-6 h-6 text-primary" />
                : <Menu className="w-6 h-6" />
              }
            </button>
          </div>

        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed left-0 right-0 bg-white z-40 border-t border-primary/10 overflow-y-auto"
          style={{
            top: '80px',
            maxHeight: 'calc(100vh - 80px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          }}
        >
          <div className="flex flex-col py-2">

            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${MOBILE_LINK_BASE} ${isActive('/') ? MOBILE_LINK_ACTIVE : MOBILE_LINK_IDLE}`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${MOBILE_LINK_BASE} ${isActive('/about') ? MOBILE_LINK_ACTIVE : MOBILE_LINK_IDLE}`}
            >
              <Info className="w-5 h-5" />
              <span>About OA</span>
            </Link>

            <Link
              to="/pharmacological"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${MOBILE_LINK_BASE} ${isActive('/pharmacological') ? MOBILE_LINK_ACTIVE : MOBILE_LINK_IDLE}`}
            >
              <Pill className="w-5 h-5" />
              <span>Pharmacological</span>
            </Link>

            <Link
              to="/non-pharmacological"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${MOBILE_LINK_BASE} ${isActive('/non-pharmacological') ? MOBILE_LINK_ACTIVE : MOBILE_LINK_IDLE}`}
            >
              <Leaf className="w-5 h-5" />
              <span>Non-Pharmacological</span>
            </Link>

            <Link
              to="/exercises"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${MOBILE_LINK_BASE} ${isActive('/exercises') ? MOBILE_LINK_ACTIVE : MOBILE_LINK_IDLE}`}
            >
              <Activity className="w-5 h-5" />
              <span>Exercises</span>
            </Link>

            <Link
              to="/counselling"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${MOBILE_LINK_BASE} ${isActive('/counselling') ? MOBILE_LINK_ACTIVE : MOBILE_LINK_IDLE}`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Counselling</span>
            </Link>

            <Link
              to="/faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${MOBILE_LINK_BASE} ${isActive('/faq') ? MOBILE_LINK_ACTIVE : MOBILE_LINK_IDLE}`}
            >
              <HelpCircle className="w-5 h-5" />
              <span>FAQ</span>
            </Link>

            <Link
              to="/resources"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${MOBILE_LINK_BASE} ${isActive('/resources') ? MOBILE_LINK_ACTIVE : MOBILE_LINK_IDLE}`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Resources</span>
            </Link>

            {/* Mobile auth section */}
            <div className="px-6 py-6 mt-1">
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[13px] text-text-muted font-medium mb-1">
                    <UserCircle className="w-4 h-4" />
                    <span>Logged in as {user.full_name || 'User'}</span>
                  </div>

                  {user.role === 'admin' ? (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="
                        flex items-center justify-center rounded-pill px-5 py-3
                        text-sm font-medium text-white w-full
                        bg-gradient-to-br from-primary to-primary-dark
                        shadow-btn hover:shadow-float transition-all
                      "
                    >
                      {'Admin Panel ->'}
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="
                        flex items-center justify-center rounded-pill px-5 py-3
                        text-sm font-medium text-white w-full
                        bg-gradient-to-br from-primary to-primary-dark
                        shadow-btn hover:shadow-float transition-all
                      "
                    >
                      My Progress
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="
                      flex items-center justify-center gap-2 rounded-pill px-5 py-3
                      text-sm font-medium text-rose-600 w-full
                      border border-rose-200 bg-white
                      hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer
                    "
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="
                      flex items-center justify-center rounded-pill px-5 py-3
                      text-sm font-medium text-primary w-full
                      border border-primary/30 bg-white shadow-white
                      hover:shadow-card transition-all
                    "
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="
                      flex items-center justify-center rounded-pill px-5 py-3
                      text-sm font-medium text-white w-full
                      bg-gradient-to-br from-primary to-primary-dark
                      shadow-btn hover:shadow-float transition-all
                    "
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
