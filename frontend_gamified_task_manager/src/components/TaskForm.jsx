import React from "react";

/**
 * Controlled input form used to add a new task.
 */

// PUBLIC_INTERFACE
export default function TaskForm({
  value,
  onChange,
  onSubmit,
  inputRef,
  isSubmitDisabled
}) {
  /** Renders the "Add task" form (input + button). */
  return (
    <section className="rounded-2xl border border-black/5 bg-surface p-4 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Add a task</h2>
          <p className="mt-1 text-sm text-black/60">
            Press{" "}
            <kbd className="rounded bg-black/5 px-1 py-0.5 text-xs">Enter</kbd>{" "}
            to add quickly.
          </p>
        </div>
      </div>

      <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="task-title">
          Task title
        </label>
        <input
          id="task-title"
          ref={inputRef}
          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-primary/30 placeholder:text-black/35 focus:ring-4"
          placeholder="e.g., Finish the onboarding checklist"
          value={value}
          onChange={onChange}
          maxLength={140}
        />
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-95 disabled:opacity-50"
          disabled={isSubmitDisabled}
        >
          Add
        </button>
      </form>
    </section>
  );
}
