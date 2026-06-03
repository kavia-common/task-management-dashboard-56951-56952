import React from "react";

/**
 * Minimal app shell (Step 1) — establishes the layout and theme baseline.
 * Later steps will replace placeholders with real Task/Score functionality.
 */
// PUBLIC_INTERFACE
export default function App() {
  /** Root application component. */
  return (
    <div className="min-h-screen bg-appbg text-apptext">
      <header className="border-b border-black/5 bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight">
              Gamified Task Manager
            </h1>
            <p className="mt-0.5 text-sm text-black/60">
              Minimal, light theme shell (Vite + React + Tailwind)
            </p>
          </div>

          <div className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Score: <span className="tabular-nums">0</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <section className="rounded-2xl border border-black/5 bg-surface p-4 shadow-sm">
          <h2 className="text-base font-semibold">Add a task</h2>
          <p className="mt-1 text-sm text-black/60">
            Task form will be implemented in Step 2.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-primary/30 placeholder:text-black/35 focus:ring-4"
              placeholder="e.g., Finish the onboarding checklist"
              disabled
              aria-disabled="true"
            />
            <button
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white opacity-60"
              disabled
              aria-disabled="true"
            >
              Add
            </button>
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Tasks</h2>
            <span className="text-sm text-black/50">
              0 total
            </span>
          </div>

          <div className="mt-3 rounded-2xl border border-dashed border-black/10 bg-surface p-6 text-sm text-black/60">
            Task list will be implemented in Step 2.
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-3xl px-4 pb-8 pt-2 text-xs text-black/45">
        Tip: use <code className="rounded bg-black/5 px-1 py-0.5">VITE_PORT</code>{" "}
        to change the dev server port.
      </footer>
    </div>
  );
}
