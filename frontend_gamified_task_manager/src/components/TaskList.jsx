import React from "react";
import TaskItem from "./TaskItem.jsx";

/**
 * Task list section: header, empty state, list of tasks.
 */

// PUBLIC_INTERFACE
export default function TaskList({
  tasks,
  completedCount,
  totalCount,
  editingId,
  editingTitle,
  onToggleComplete,
  onBeginEdit,
  onDelete,
  onEditTitleChange,
  onEditSubmit,
  onCancelEdit,
  editInputRef,
  isSaveDisabledForCurrentEdit
}) {
  /** Renders the tasks section (empty state or list). */
  const hasTasks = tasks.length > 0;

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
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
              <TaskItem
                key={t.id}
                task={t}
                isEditing={isEditing}
                editingTitle={isEditing ? editingTitle : ""}
                onToggleComplete={() => onToggleComplete(t.id)}
                onBeginEdit={() => onBeginEdit(t)}
                onDelete={() => onDelete(t.id)}
                onEditTitleChange={onEditTitleChange}
                onEditSubmit={onEditSubmit}
                onCancelEdit={onCancelEdit}
                editInputRef={editInputRef}
                isSaveDisabled={
                  isEditing ? isSaveDisabledForCurrentEdit : true
                }
              />
            );
          })}
        </ul>
      )}
    </section>
  );
}
