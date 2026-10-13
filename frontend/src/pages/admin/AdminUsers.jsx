import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Download, Eye, Loader2, Search, X } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { adminAPI } from "../../services/api";

const PAGE_SIZE = 20;

function relativeDate(value) {
  if (!value) return "Never";
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
}

function oaBadge(location) {
  const classes = {
    hip: "bg-orange-100 text-orange-800",
    knee: "bg-blue-100 text-blue-800",
    both: "bg-purple-100 text-purple-800",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-base font-extrabold ${classes[location] || "bg-slate-100 text-slate-700"}`}>
      {location || "Not set"}
    </span>
  );
}

function statusBadge(active) {
  return (
    <span className={`rounded-full px-3 py-1 text-base font-extrabold ${active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function exportCsv(users) {
  const headers = ["Name", "Email", "Age", "OA Location", "OA Grade", "Last Login", "Status"];
  const rows = users.map((user) => [
    user.full_name,
    user.email,
    user.age ?? "",
    user.oa_location ?? "",
    user.oa_grade ?? "",
    user.last_login ?? "",
    user.is_active ? "Active" : "Inactive",
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "oa-patients.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminUsers() {
  useEffect(() => {
    document.title = "Patients — OA Care Admin";
    return () => { document.title = "OA Care Admin"; };
  }, []);
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [oaLocation, setOaLocation] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const response = await adminAPI.getUsers({
          skip: page * PAGE_SIZE,
          limit: PAGE_SIZE,
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
          ...(oaLocation ? { oa_location: oaLocation } : {}),
        });
        setUsers(response.data);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [debouncedSearch, oaLocation, page]);

  async function openActivity(userId) {
    setActivityLoading(true);
    setSelectedActivity(null);
    setActivityError(null);
    try {
      const response = await adminAPI.getUserActivity(userId);
      setSelectedActivity(response.data);
    } catch (err) {
      console.error("Failed to load activity", err);
      setActivityError("Unable to load patient activity. Please try again.");
    } finally {
      setActivityLoading(false);
    }
  }

  async function toggleActive(targetUser) {
    if (targetUser.is_active) {
      const confirmed = window.confirm(`Deactivate ${targetUser.full_name}'s account?`);
      if (!confirmed) return;
    }

    const response = await adminAPI.toggleUserActive(targetUser.id);
    setUsers((current) =>
      current.map((item) =>
        item.id === targetUser.id ? { ...item, is_active: response.data.is_active } : item,
      ),
    );
    setMessage(`${targetUser.full_name} is now ${response.data.is_active ? "active" : "inactive"}.`);
  }

  const chartData = useMemo(
    () =>
      selectedActivity?.pain_diary
        ? [...selectedActivity.pain_diary].reverse().map((entry) => ({
            date: entry.date,
            pain_score: entry.pain_score,
          }))
        : [],
    [selectedActivity],
  );

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AdminLayout pageTitle="Patients" pageSubtitle="Manage registered patients">
      <div className="grid gap-6">
          {message && (
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-lg font-bold text-cyan-900">
              {message}
            </div>
          )}

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1fr_14rem_auto]">
              <label className="grid gap-2 text-lg font-extrabold text-slate-800">
                Search
                <span className="relative">
                  <Search aria-hidden="true" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name or email"
                    className="min-h-12 w-full rounded-md border border-slate-300 px-12 text-lg font-semibold focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                  />
                </span>
              </label>
              <label className="grid gap-2 text-lg font-extrabold text-slate-800">
                OA Location
                <select
                  value={oaLocation}
                  onChange={(event) => {
                    setOaLocation(event.target.value);
                    setPage(0);
                  }}
                  className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-bold focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                >
                  <option value="">All</option>
                  <option value="hip">Hip OA</option>
                  <option value="knee">Knee OA</option>
                  <option value="both">Both</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => exportCsv(users)}
                className="mt-auto inline-flex min-h-12 items-center justify-center rounded-md bg-slate-950 px-5 text-lg font-extrabold text-white hover:bg-slate-800"
              >
                <Download aria-hidden="true" className="mr-2 h-5 w-5" />
                Export CSV
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[70rem] text-left text-lg">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Age</th>
                    <th className="px-4 py-3">OA Location</th>
                    <th className="px-4 py-3">OA Grade</th>
                    <th className="px-4 py-3">Last Login</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-10 text-center font-bold text-slate-600">
                        <Loader2 aria-hidden="true" className="mx-auto mb-3 h-7 w-7 animate-spin" />
                        Loading patients...
                      </td>
                    </tr>
                  ) : users.length ? (
                    users.map((row, index) => (
                      <tr key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="px-4 py-4 font-extrabold text-slate-950">{row.full_name}</td>
                        <td className="px-4 py-4">{row.email}</td>
                        <td className="px-4 py-4">{row.age ?? "-"}</td>
                        <td className="px-4 py-4">{oaBadge(row.oa_location)}</td>
                        <td className="px-4 py-4">{row.oa_grade ? `Grade ${row.oa_grade}` : "-"}</td>
                        <td className="px-4 py-4">{relativeDate(row.last_login)}</td>
                        <td className="px-4 py-4">{statusBadge(row.is_active)}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => openActivity(row.id)}
                              className="inline-flex min-h-12 items-center rounded-md border border-primary px-4 font-extrabold text-primary"
                            >
                              <Eye aria-hidden="true" className="mr-2 h-5 w-5" />
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleActive(row)}
                              className={`min-h-12 rounded-md px-4 font-extrabold text-white ${
                                row.is_active ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
                              }`}
                            >
                              {row.is_active ? "Disable" : "Enable"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-4 py-10 text-center font-bold text-slate-600">
                        No patients match these filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-lg font-bold text-slate-600">Page {page + 1}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                disabled={page === 0}
                className="min-h-12 rounded-md border border-slate-300 bg-white px-5 font-extrabold disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={users.length < PAGE_SIZE}
                className="min-h-12 rounded-md bg-slate-950 px-5 font-extrabold text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      {(selectedActivity || activityLoading || activityError) && (
        <aside className="fixed right-0 top-0 z-50 h-screen w-full overflow-y-auto bg-white p-6 shadow-2xl md:w-[34rem]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl font-extrabold text-slate-950">Patient Activity</h2>
            <button type="button" onClick={() => { setSelectedActivity(null); setActivityError(null); }} className="min-h-12 min-w-12 rounded-md border border-slate-200">
              <X aria-hidden="true" className="mx-auto h-6 w-6" />
            </button>
          </div>
          {activityLoading ? (
            <div className="mt-10 text-center text-lg font-bold text-slate-600">
              <Loader2 aria-hidden="true" className="mx-auto mb-3 h-7 w-7 animate-spin" />
              Loading activity...
            </div>
          ) : activityError ? (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 font-semibold">
              {activityError}
            </div>
          ) : (
            <div className="mt-6 grid gap-6">
              <section>
                <h3 className="text-2xl font-extrabold text-primary-dark">{selectedActivity.user.full_name}</h3>
                <p className="mt-1 text-lg text-slate-700">{selectedActivity.user.email}</p>
                <div className="mt-4 grid gap-2 text-lg">
                  <p>Age: {selectedActivity.user.age ?? "-"}</p>
                  <p>OA: {selectedActivity.user.oa_location ?? "-"} · Grade {selectedActivity.user.oa_grade ?? "-"}</p>
                  <p>Comorbidities: {selectedActivity.user.comorbidities?.length ? selectedActivity.user.comorbidities.join(", ") : "None listed"}</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-extrabold text-slate-950">Pain Trend</h3>
                <div className="mt-3 h-56 rounded-lg border border-slate-200 p-2">
                  {chartData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="pain_score" stroke="#1a5c8a" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="grid h-full place-items-center font-bold text-slate-500">No pain diary data</div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-extrabold text-slate-950">Exercise Activity</h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-base">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2">Exercise</th>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Pain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedActivity.exercise_logs.slice(0, 10).map((log) => (
                        <tr key={log.id} className="border-t border-slate-100">
                          <td className="px-3 py-2 font-bold">{log.exercise_name}</td>
                          <td className="px-3 py-2">{new Date(log.completed_at).toLocaleDateString()}</td>
                          <td className="px-3 py-2">{log.pain_before} → {log.pain_after}</td>
                        </tr>
                      ))}
                      {!selectedActivity.exercise_logs.length && (
                        <tr>
                          <td colSpan="3" className="px-3 py-5 text-center font-bold text-slate-500">
                            No exercise logs
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
              <section>
                <h3 className="flex items-center gap-2 font-semibold text-slate-700 mb-4 mt-6">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                  </div>
                  Exercise Status
                </h3>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                    <div className="text-xl font-bold">{selectedActivity.exercise_statuses?.filter(s => s.status === 'started').length || 0}</div>
                    <div className="text-xs font-semibold">Started</div>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                    <div className="text-xl font-bold">{selectedActivity.exercise_statuses?.filter(s => s.status === 'in_progress').length || 0}</div>
                    <div className="text-xs font-semibold">In Progress</div>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-green-50 text-green-700 border border-green-100">
                    <div className="text-xl font-bold">{selectedActivity.exercise_statuses?.filter(s => s.status === 'completed').length || 0}</div>
                    <div className="text-xs font-semibold">Completed</div>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto pr-2">
                  {selectedActivity.exercise_statuses?.length > 0 ? (
                    selectedActivity.exercise_statuses.map((status, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div>
                          <div className="text-sm font-semibold text-slate-700">{status.exercise_name}</div>
                          <div className="text-xs text-slate-400 capitalize mt-0.5 border border-slate-200 rounded px-1.5 inline-block">{status.target_area}</div>
                        </div>
                        <div>
                          {status.status === 'started' && <span className="badge-blue !py-0.5 !px-2 text-[10px]">Started</span>}
                          {status.status === 'in_progress' && <span className="badge-amber !py-0.5 !px-2 text-[10px]">In Progress</span>}
                          {status.status === 'completed' && <span className="badge-green !py-0.5 !px-2 text-[10px]">Completed</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-400 text-sm font-medium">No exercises started yet</div>
                  )}
                </div>
              </section>

            </div>
          )}
        </aside>
      )}
    </AdminLayout>
  );
}
