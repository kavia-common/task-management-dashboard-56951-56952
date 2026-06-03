import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "gtm.tasks.v1";

/**
 * Minimal app shell (Step 1) — establishes the layout and theme baseline.
 * Step 2 replaces placeholders with real Task/Score functionality (CRUD + persistence).
 */

// PUBLIC_INTERFACE
export default function App() {
  /** Root application component. */
  const [tasks, setTasks] = useState([]);
  const [draftTitle, setDraftTitle] = useState("");

  // Simple inline-edit state (kept in App for Step 2; Step 3 can modularize).
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
          createdAt:
            typeof t.createdAt === "number" ? t.createdAt : Date.now()
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
    // Score logic (Step 2): 1 point per completed task.
    // Step 3 can evolve this to more gamified rules if needed.
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

  const hasTasks = tasks.length > 0;

  return (
    <div className="min-h-screen bg-appbg text-apptext">
      <header className="border-b border-black/5 bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight">
              Gamified Task Manager
            </h1>
            <p className="mt-0.5 text-sm text-black/60">
              Add, edit, complete tasks — score updates instantly and persists
              locally.
            </p>
          </div>

          <div className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Score: <span className="tabular-nums">{score}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <section className="rounded-2xl border border-black/5 bg-surface p-4 shadow-sm">
          <h2 className="text-base font-semibold">Add a task</h2>
          <p className="mt-1 text-sm text-black/60">
            Press <kbd className="rounded bg-black/5 px-1 py-0.5">Enter</kbd> to
            add quickly.
          </p>

          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row"
            onSubmit={onAddSubmit}
          >
            <label className="sr-only" htmlFor="task-title">
              Task title
            </label>
            <input
              id="task-title"
              ref={draftInputRef}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-primary/30 placeholder:text-black/35 focus:ring-4"
              placeholder="e.g., Finish the onboarding checklist"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              maxLength={140}
            />
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              disabled={!normalizeTitle(draftTitle)}
            >
              Add
            </button>
          </form>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Tasks</h2>
            <span className="text-sm text-black/50">
              {completedCount}/{totalCount} completed
            </span>
          </div>

          {!hasTasks ? (
            <div className="mt-3 rounded-2xl border border-dashed border-black/10 bg-surface p-6 text-sm text-black/60">
              No tasks yet. Add one above to start earning points.
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {tasks.map((t) => {
                const isEditing = editingId === t.id;
                return (
                  <li
                    key={t.id}
                    className="rounded-2xl border border-black/5 bg-surface p-3 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        className={[
                          "mt-0.5 grid size-6 place-items-center rounded-full border",
                          t.completed
                            ? "border-secondary bg-secondary text-white"
                            : "border-black/15 bg-white text-black/40 hover:bg-black/5"
                        ].join(" ")}
                        onClick={() => toggleComplete(t.id)}
                        aria-label={
                          t.completed ? "Mark as not complete" : "Mark as complete"
                        }
                        title={t.completed ? "Completed" : "Not completed"}
                      >
                        {t.completed ? (
                          <span className="text-xs font-bold">✓</span>
                        ) : (
                          <span className="text-xs font-bold"> </span>
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        {!isEditing ? (
                          <>
                            <p
                              className={[
                                "truncate text-sm font-medium",
                                t.completed ? "text-black/45 line-through" : ""
                              ].join(" ")}
                              title={t.title}
                            >
                              {t.title}
                            </p>
                            <p className="mt-0.5 text-xs text-black/45">
                              {t.completed ? "Completed" : "Active"}
                            </p>
                          </>
                        ) : (
                          <form onSubmit={onEditSubmit} className="space-y-2">
                            <label className="sr-only" htmlFor={`edit-${t.id}`}>
                              Edit task title
                            </label>
                            <input
                              id={`edit-${t.id}`}
                              ref={editInputRef}
                              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-primary/30 placeholder:text-black/35 focus:ring-4"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              maxLength={140}
                            />
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="submit"
                                className="rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                                disabled={!normalizeTitle(editingTitle)}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/5"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </div>

                      {!isEditing ? (
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/5"
                            onClick={() => beginEdit(t)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-error/20 bg-error/5 px-3 py-1.5 text-sm font-medium text-error hover:bg-error/10"
                            onClick={() => deleteTask(t.id)}
                          >
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      <footer className="mx-auto max-w-3xl px-4 pb-8 pt-2 text-xs text-black/45">
        Tip: your tasks are saved to{" "}
        <code className="rounded bg-black/5 px-1 py-0.5">localStorage</code> so a
        refresh won&apos;t lose them.
      </footer>
    </div>
  );
}
