import React from "react";

/**
 * Single task row: toggle complete, edit inline, delete.
 */

// PUBLIC_INTERFACE
export default function TaskItem({
  task,
  isEditing,
  editingTitle,
  onToggleComplete,
  onBeginEdit,
  onDelete,
  onEditTitleChange,
  onEditSubmit,
  onCancelEdit,
  editInputRef,
  isSaveDisabled
}) {
  /** Renders one task item including edit mode UI. */
  return (
    <li className="rounded-2xl border border-black/5 bg-surface p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <button
          type="button"
          className={[
            "mt-0.5 grid size-6 place-items-center rounded-full border transition",
            task.completed
              ? "border-secondary bg-secondary text-white"
              : "border-black/15 bg-white text-black/40 hover:bg-black/5"
          ].join(" ")}
          onClick={onToggleComplete}
          aria-label={
            task.completed ? "Mark as not complete" : "Mark as complete"
          }
          title={task.completed ? "Completed" : "Not completed"}
        >
          {task.completed ? (
            <span className="text-xs font-bold">✓</span>
          ) : (
            // Keeps height stable; avoids layout shift.
            <span className="text-xs font-bold">&nbsp;</span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          {!isEditing ? (
            <>
              <p
                className={[
                  "truncate text-sm font-medium",
                  task.completed ? "text-black/45 line-through" : "text-black/90"
                ].join(" ")}
                title={task.title}
              >
                {task.title}
              </p>
              <p className="mt-0.5 text-xs text-black/45">
                {task.completed ? "Completed" : "Active"}
              </p>
            </>
          ) : (
            <form onSubmit={onEditSubmit} className="space-y-2">
              <label className="sr-only" htmlFor={`edit-${task.id}`}>
                Edit task title
              </label>
              <input
                id={`edit-${task.id}`}
                ref={editInputRef}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-primary/30 placeholder:text-black/35 focus:ring-4"
                value={editingTitle}
                onChange={onEditTitleChange}
                maxLength={140}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:brightness-95 disabled:opacity-50"
                  disabled={isSaveDisabled}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-black/70 transition hover:bg-black/5"
                  onClick={onCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {!isEditing ? (
          <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-black/70 transition hover:bg-black/5"
              onClick={onBeginEdit}
            >
              Edit
            </button>
            <button
              type="button"
              className="rounded-xl border border-error/20 bg-error/5 px-3 py-1.5 text-sm font-medium text-error transition hover:bg-error/10"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </li>
  );
}
