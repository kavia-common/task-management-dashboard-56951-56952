import React, { useEffect, useMemo, useRef, useState } from "react";
import ScoreHeader from "./components/ScoreHeader.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";

const STORAGE_KEY = "gtm.tasks.v1";

/**
 * Gamified Task Manager
 * - Local-first tasks stored in localStorage
 * - Score is 1 point per completed task
 * - Inline edit for quick updates
 */

// PUBLIC_INTERFACE
export default function App() {
  /** Root application component. */
  const [tasks, setTasks] = useState([]);
  const [draftTitle, setDraftTitle] = useState("");

  // Inline edit state (kept here to simplify cross-item constraints like "one edit at a time").
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const draftInputRef = useRef(null);
  const editInputRef = useRef(null);

  // Load persisted tasks once.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      // Minimal schema hardening to avoid crashing on corrupted storage.
      const sanitized = parsed
        .filter((t) => t && typeof t === "object")
        .map((t) => ({
          id: typeof t.id === "string" ? t.id : crypto.randomUUID(),
          title: typeof t.title === "string" ? t.title : "",
          completed: Boolean(t.completed),
          createdAt: typeof t.createdAt === "number" ? t.createdAt : Date.now()
        }))
        .filter((t) => t.title.trim().length > 0);

      setTasks(sanitized);
    } catch {
      // If localStorage contains invalid JSON, ignore and start fresh.
      setTasks([]);
    }
  }, []);

  // Persist tasks on every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Ignore quota / storage errors; app should remain usable.
    }
  }, [tasks]);

  const score = useMemo(() => {
    // Score logic: 1 point per completed task.
    return tasks.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0);
  }, [tasks]);

  const totalCount = tasks.length;
  const completedCount = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks]
  );

  function normalizeTitle(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function addTask() {
    const title = normalizeTitle(draftTitle);
    if (!title) return;

    const newTask = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now()
    };

    setTasks((prev) => [newTask, ...prev]);
    setDraftTitle("");

    // Keep focus in the input for quick capture.
    requestAnimationFrame(() => draftInputRef.current?.focus());
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingTitle("");
    }
  }

  function toggleComplete(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function beginEdit(task) {
    setEditingId(task.id);
    setEditingTitle(task.title);
    requestAnimationFrame(() => editInputRef.current?.focus());
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  function saveEdit() {
    if (!editingId) return;

    const title = normalizeTitle(editingTitle);
    if (!title) return; // Don't allow empty titles; user can cancel or type.

    setTasks((prev) =>
      prev.map((t) => (t.id === editingId ? { ...t, title } : t))
    );
    setEditingId(null);
    setEditingTitle("");
  }

  function onAddSubmit(e) {
    e.preventDefault();
    addTask();
  }

  function onEditSubmit(e) {
    e.preventDefault();
    saveEdit();
  }

  const addDisabled = !normalizeTitle(draftTitle);
  const saveDisabled = !normalizeTitle(editingTitle);

  return (
    <div className="min-h-screen bg-appbg text-apptext">
      <ScoreHeader
        title="Gamified Task Manager"
        subtitle="Add, edit, complete tasks — score updates instantly and persists locally."
        score={score}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <TaskForm
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onSubmit={onAddSubmit}
          inputRef={draftInputRef}
          isSubmitDisabled={addDisabled}
        />

        <TaskList
          tasks={tasks}
          completedCount={completedCount}
          totalCount={totalCount}
          editingId={editingId}
          editingTitle={editingTitle}
          onToggleComplete={toggleComplete}
          onBeginEdit={beginEdit}
          onDelete={deleteTask}
          onEditTitleChange={(e) => setEditingTitle(e.target.value)}
          onEditSubmit={onEditSubmit}
          onCancelEdit={cancelEdit}
          editInputRef={editInputRef}
          isSaveDisabledForCurrentEdit={saveDisabled}
        />
      </main>

      <footer className="mx-auto max-w-3xl px-4 pb-8 pt-2 text-xs text-black/45">
        Tip: your tasks are saved to{" "}
        <code className="rounded bg-black/5 px-1 py-0.5">localStorage</code> so a
        refresh won&apos;t lose them.
      </footer>
    </div>
  );
}
