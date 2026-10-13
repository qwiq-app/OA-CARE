import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  BarChart2, 
  TrendingUp, 
  UserCircle, 
  LogOut,
  Calendar,
  Bell
} from 'lucide-react';

export default function AdminLayout({ children, pageTitle, pageSubtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short', 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric'
  });

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  return (
    <div className="min-h-screen bg-bg-main flex font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0f3d5c] min-h-screen fixed left-0 top-0 bottom-0 flex flex-col z-40">
        
        {/* LOGO AREA */}
        <div className="px-6 py-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #14B5F0, #0E95D4)' }}>
            <Activity className="text-white w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-semibold text-lg leading-tight">OA Admin</div>
            <div className="text-blue-200/70 text-xs">Control Panel</div>
          </div>
        </div>

        {/* NAV MENU */}
        <div className="flex-1 py-6 space-y-1 overflow-y-auto pr-4">
          <div className="text-xs text-blue-300/50 font-semibold tracking-widest px-6 mb-3">
            OVERVIEW
          </div>
          
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => 
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all cursor-pointer rounded-r-[14px] border-l-4 ${
                isActive 
                  ? 'bg-white/10 text-white border-primary' 
                  : 'text-blue-200 hover:bg-white/5 hover:text-white border-transparent'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all cursor-pointer rounded-r-[14px] border-l-4 ${
                isActive 
                  ? 'bg-white/10 text-white border-primary' 
                  : 'text-blue-200 hover:bg-white/5 hover:text-white border-transparent'
              }`
            }
          >
            <Users className="w-4 h-4 shrink-0" />
            Patients
          </NavLink>
          
          <NavLink 
            to="/admin/exercises" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all cursor-pointer rounded-r-[14px] border-l-4 ${
                isActive 
                  ? 'bg-white/10 text-white border-primary' 
                  : 'text-blue-200 hover:bg-white/5 hover:text-white border-transparent'
              }`
            }
          >
            <Dumbbell className="w-4 h-4 shrink-0" />
            Exercises
          </NavLink>

          <div className="border-t border-white/10 my-4 ml-6"></div>
          
          <div className="text-xs text-blue-300/50 font-semibold tracking-widest px-6 mb-3 mt-4">
            ANALYTICS
          </div>

          <NavLink 
            to="/admin/exercise-status" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all cursor-pointer rounded-r-[14px] border-l-4 ${
                isActive 
                  ? 'bg-white/10 text-white border-primary' 
                  : 'text-blue-200 hover:bg-white/5 hover:text-white border-transparent'
              }`
            }
          >
            <Activity className="w-4 h-4 shrink-0" />
            Exercise Status
          </NavLink>

          <div className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-blue-400/30 cursor-not-allowed border-l-4 border-transparent">
            <TrendingUp className="w-4 h-4 shrink-0" />
            Pain Trends
            <span className="bg-white/5 text-blue-300/50 text-[10px] px-2 py-0.5 rounded-full ml-auto uppercase tracking-wider font-bold">
              Soon
            </span>
          </div>
        </div>

        {/* BOTTOM AREA */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-pill text-blue-200 hover:bg-white/10 hover:text-white transition-all text-sm font-medium cursor-pointer border-0 bg-transparent"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        
        {/* TOP BAR */}
        <div className="bg-white shadow-sm border-b border-primary/5 px-8 py-4 flex items-center justify-between sticky top-0 z-30 rounded-bl-[20px] rounded-br-[20px]">
          <div>
            <h1 className="text-xl font-semibold text-text-body m-0 leading-tight">
              {pageTitle}
            </h1>
            {pageSubtitle && (
              <div className="text-sm text-text-muted mt-0.5">{pageSubtitle}</div>
            )}
          </div>
          
          <div className="flex items-center gap-5">
            <div className="text-sm text-text-muted hidden sm:flex items-center font-medium">
              <Calendar className="w-4 h-4 inline mr-1.5" />
              {currentDate}
            </div>
            
            <div className="w-px h-6 bg-gray-100 hidden sm:block"></div>
            
            <div className="p-2 rounded-full hover:bg-bg-section cursor-pointer transition-colors relative text-text-muted hover:text-primary">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </div>
            
            <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-text-body leading-tight">{user?.full_name || 'Admin User'}</div>
                <div className="text-xs text-text-muted font-medium">Administrator</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-btn">
                {getInitials(user?.full_name)}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
