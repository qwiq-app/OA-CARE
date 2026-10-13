import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Edit, Loader2, Plus, Trash2, X } from "lucide-react";

import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { adminAPI, exercisesAPI } from "../../services/api";

const emptyForm = {
  name: "",
  category: "strengthening",
  level: "beginner",
  target_area: "knee",
  description: "",
  instructions: [""],
  sets: "",
  reps: "",
  hold_seconds: "",
  precautions: "",
  video_url: "",
  thumbnail_url: "",
  sort_order: 0,
  is_active: true,
};

const categories = ["strengthening", "stretching", "balance", "cardio", "calisthenics"];
const levels = ["beginner", "intermediate", "advanced"];
const targetAreas = ["hip", "knee", "both"];

function titleCase(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function statusBadge(active) {
  return (
    <span className={`rounded-full px-3 py-1 text-base font-extrabold ${active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function ExerciseModal({ form, setForm, onClose, onSubmit, saving, editing }) {
  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateInstruction(index, value) {
    setForm((current) => ({
      ...current,
      instructions: current.instructions.map((step, stepIndex) => (stepIndex === index ? value : step)),
    }));
  }

  function addInstruction() {
    setForm((current) => ({ ...current, instructions: [...current.instructions, ""] }));
  }

  function removeInstruction(index) {
    setForm((current) => ({
      ...current,
      instructions: current.instructions.filter((_, stepIndex) => stepIndex !== index),
    }));
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 py-8" role="dialog" aria-modal="true">
      <form onSubmit={onSubmit} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-extrabold text-slate-950">
            {editing ? "Edit Exercise" : "Add New Exercise"}
          </h2>
          <button type="button" onClick={onClose} className="min-h-12 min-w-12 rounded-md border border-slate-200">
            <X aria-hidden="true" className="mx-auto h-6 w-6" />
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-lg font-extrabold text-slate-800 md:col-span-2">
            Name
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
              className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-semibold focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
            />
          </label>

          <label className="grid gap-2 text-lg font-extrabold text-slate-800">
            Category
            <select value={form.category} onChange={(event) => updateField("category", event.target.value)} className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-bold">
              {categories.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-lg font-extrabold text-slate-800">
            Level
            <select value={form.level} onChange={(event) => updateField("level", event.target.value)} className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-bold">
              {levels.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-lg font-extrabold text-slate-800">
            Target Area
            <select value={form.target_area} onChange={(event) => updateField("target_area", event.target.value)} className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-bold">
              {targetAreas.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-lg font-extrabold text-slate-800">
            Sort Order
            <input type="number" value={form.sort_order} onChange={(event) => updateField("sort_order", event.target.value)} className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-semibold" />
          </label>

          <label className="grid gap-2 text-lg font-extrabold text-slate-800 md:col-span-2">
            Description
            <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} rows="3" className="rounded-md border border-slate-300 p-4 text-lg font-semibold" />
          </label>

          <fieldset className="grid gap-3 md:col-span-2">
            <legend className="text-lg font-extrabold text-slate-800">Instructions</legend>
            {form.instructions.map((step, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-[1fr_auto]">
                <input
                  value={step}
                  onChange={(event) => updateInstruction(index, event.target.value)}
                  placeholder={`Step ${index + 1}`}
                  className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-semibold"
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  disabled={form.instructions.length === 1}
                  className="min-h-12 rounded-md border border-red-200 px-4 text-xl font-extrabold text-red-700 disabled:opacity-40"
                  aria-label={`Remove step ${index + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" onClick={addInstruction} className="inline-flex min-h-12 w-fit items-center rounded-md border border-primary px-4 font-extrabold text-primary">
              <Plus aria-hidden="true" className="mr-2 h-5 w-5" />
              Add Step
            </button>
          </fieldset>

          <label className="grid gap-2 text-lg font-extrabold text-slate-800">
            Sets
            <input type="number" value={form.sets} onChange={(event) => updateField("sets", event.target.value)} className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-semibold" />
          </label>
          <label className="grid gap-2 text-lg font-extrabold text-slate-800">
            Reps
            <input type="number" value={form.reps} onChange={(event) => updateField("reps", event.target.value)} className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-semibold" />
          </label>
          <label className="grid gap-2 text-lg font-extrabold text-slate-800">
            Hold Seconds
            <input type="number" value={form.hold_seconds} onChange={(event) => updateField("hold_seconds", event.target.value)} className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-semibold" />
          </label>
          <label className="grid gap-2 text-lg font-extrabold text-slate-800">
            Video URL
            <input value={form.video_url} onChange={(event) => updateField("video_url", event.target.value)} className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-semibold" />
          </label>
          <label className="grid gap-2 text-lg font-extrabold text-slate-800">
            Thumbnail URL
            <input value={form.thumbnail_url} onChange={(event) => updateField("thumbnail_url", event.target.value)} className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-semibold" />
          </label>
          <label className="flex min-h-12 items-center gap-3 text-lg font-extrabold text-slate-800">
            <input type="checkbox" checked={form.is_active} onChange={(event) => updateField("is_active", event.target.checked)} className="h-6 w-6 accent-primary" />
            Active
          </label>
          <label className="grid gap-2 text-lg font-extrabold text-slate-800 md:col-span-2">
            Precautions
            <textarea value={form.precautions} onChange={(event) => updateField("precautions", event.target.value)} rows="3" className="rounded-md border border-slate-300 p-4 text-lg font-semibold" />
          </label>
        </div>

        <button type="submit" disabled={saving} className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-md bg-slate-950 px-6 text-xl font-extrabold text-white hover:bg-slate-800 disabled:opacity-60">
          {saving && <Loader2 aria-hidden="true" className="mr-3 h-6 w-6 animate-spin" />}
          {editing ? "Save Changes" : "Create Exercise"}
        </button>
      </form>
    </div>
  );
}

export default function AdminExercises() {
  useEffect(() => {
    document.title = "Exercises — OA Care Admin";
    return () => { document.title = "OA Care Admin"; };
  }, []);
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [targetArea, setTargetArea] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadExercises() {
    setLoading(true);
    try {
      const response = await adminAPI.getExercises({
        ...(targetArea ? { target_area: targetArea } : {}),
        ...(level ? { level } : {}),
      });
      setExercises(response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExercises();
  }, [targetArea, level]);

  const sortedExercises = useMemo(
    () => [...exercises].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name)),
    [exercises],
  );

  function openCreateModal() {
    setEditingExercise(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(exercise) {
    setEditingExercise(exercise);
    setForm({
      name: exercise.name || "",
      category: exercise.category || "strengthening",
      level: exercise.level || "beginner",
      target_area: exercise.target_area || "knee",
      description: exercise.description || "",
      instructions: exercise.instructions?.length ? exercise.instructions : [""],
      sets: exercise.sets ?? "",
      reps: exercise.reps ?? "",
      hold_seconds: exercise.hold_seconds ?? "",
      precautions: exercise.precautions || "",
      video_url: exercise.video_url || "",
      thumbnail_url: exercise.thumbnail_url || "",
      sort_order: exercise.sort_order ?? 0,
      is_active: exercise.is_active ?? true,
    });
    setModalOpen(true);
  }

  function buildPayload() {
    return {
      ...form,
      instructions: form.instructions.map((step) => step.trim()).filter(Boolean),
      sets: form.sets === "" ? null : Number(form.sets),
      reps: form.reps === "" ? null : Number(form.reps),
      hold_seconds: form.hold_seconds === "" ? null : Number(form.hold_seconds),
      sort_order: Number(form.sort_order || 0),
      description: form.description || null,
      precautions: form.precautions || null,
      video_url: form.video_url || null,
      thumbnail_url: form.thumbnail_url || null,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = buildPayload();
      if (editingExercise) {
        const response = await exercisesAPI.update(editingExercise.id, payload);
        setExercises((current) =>
          current.map((item) => (item.id === editingExercise.id ? response.data : item)),
        );
        setMessage("Exercise updated successfully.");
      } else {
        const response = await exercisesAPI.create(payload);
        setExercises((current) => [response.data, ...current]);
        setMessage("Exercise created successfully.");
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(exercise) {
    const confirmed = window.confirm(`Delete "${exercise.name}"? This will mark it inactive.`);
    if (!confirmed) return;
    await exercisesAPI.delete(exercise.id);
    setExercises((current) =>
      current.map((item) => (item.id === exercise.id ? { ...item, is_active: false } : item)),
    );
    setMessage("Exercise marked inactive.");
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AdminLayout pageTitle="Exercises" pageSubtitle="Manage exercise library content">
      <div className="grid gap-6">
          {message && (
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-lg font-bold text-cyan-900">
              {message}
            </div>
          )}

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-[14rem_14rem_1fr]">
              <label className="grid gap-2 text-lg font-extrabold text-slate-800">
                Target Area
                <select value={targetArea} onChange={(event) => setTargetArea(event.target.value)} className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-bold">
                  <option value="">All</option>
                  {targetAreas.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-lg font-extrabold text-slate-800">
                Level
                <select value={level} onChange={(event) => setLevel(event.target.value)} className="min-h-12 rounded-md border border-slate-300 px-4 text-lg font-bold">
                  <option value="">All</option>
                  {levels.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}
                </select>
              </label>
              <button type="button" onClick={openCreateModal} className="mt-auto inline-flex min-h-12 items-center justify-center rounded-md bg-slate-950 px-5 text-lg font-extrabold text-white hover:bg-slate-800 md:justify-self-end">
                <Plus aria-hidden="true" className="mr-2 h-5 w-5" />
                Add New Exercise
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[72rem] text-left text-lg">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Sort Order</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Target Area</th>
                    <th className="px-4 py-3">Level</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Sets/Reps</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-10 text-center font-bold text-slate-600">
                        <Loader2 aria-hidden="true" className="mx-auto mb-3 h-7 w-7 animate-spin" />
                        Loading exercises...
                      </td>
                    </tr>
                  ) : sortedExercises.length ? (
                    sortedExercises.map((exercise, index) => (
                      <tr key={exercise.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="px-4 py-4 font-extrabold">{exercise.sort_order ?? 0}</td>
                        <td className="px-4 py-4 font-extrabold text-slate-950">{exercise.name}</td>
                        <td className="px-4 py-4">{titleCase(exercise.target_area)}</td>
                        <td className="px-4 py-4">{titleCase(exercise.level)}</td>
                        <td className="px-4 py-4">{titleCase(exercise.category)}</td>
                        <td className="px-4 py-4">
                          {exercise.hold_seconds && !exercise.reps
                            ? `Hold ${exercise.hold_seconds}s`
                            : `${exercise.sets ?? "-"} / ${exercise.reps ?? "-"}`}
                        </td>
                        <td className="px-4 py-4">{statusBadge(exercise.is_active)}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(exercise)}
                              className="inline-flex min-h-12 items-center rounded-md border border-primary px-4 font-extrabold text-primary"
                            >
                              <Edit aria-hidden="true" className="mr-2 h-5 w-5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(exercise)}
                              className="inline-flex min-h-12 items-center rounded-md bg-red-600 px-4 font-extrabold text-white hover:bg-red-700"
                            >
                              <Trash2 aria-hidden="true" className="mr-2 h-5 w-5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-4 py-10 text-center font-bold text-slate-600">
                        No exercises match these filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

      {modalOpen && (
        <ExerciseModal
          form={form}
          setForm={setForm}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          saving={saving}
          editing={Boolean(editingExercise)}
        />
      )}
    </AdminLayout>
  );
}
