import { Link, NavLink, useNavigate } from "react-router-dom";
import { Dumbbell, LayoutDashboard, LogOut, Users } from "lucide-react";

import { useAuth } from "../context/AuthContext";

function menuClass({ isActive }) {
  return [
    "flex min-h-12 items-center gap-3 rounded-md px-4 text-lg font-bold transition",
    isActive ? "bg-cyan-400 text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white",
  ].join(" ");
}

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col bg-slate-950 p-5 md:flex">
      <Link to="/admin" className="mb-8 text-3xl font-extrabold text-white">
        OA Admin
      </Link>
      <nav className="grid gap-2" aria-label="Admin navigation">
        <NavLink to="/admin" end className={menuClass}>
          <LayoutDashboard aria-hidden="true" className="h-6 w-6" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={menuClass}>
          <Users aria-hidden="true" className="h-6 w-6" />
          Users
        </NavLink>
        <NavLink to="/admin/exercises" className={menuClass}>
          <Dumbbell aria-hidden="true" className="h-6 w-6" />
          Exercises
        </NavLink>
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="mt-auto flex min-h-12 items-center gap-3 rounded-md px-4 text-lg font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
      >
        <LogOut aria-hidden="true" className="h-6 w-6" />
        Logout
      </button>
    </aside>
  );
}
