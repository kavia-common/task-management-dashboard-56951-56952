import React from "react";

/**
 * Header bar displaying app title, subtitle, and current score.
 */

// PUBLIC_INTERFACE
export default function ScoreHeader({
  title,
  subtitle,
  score,
  completedCount,
  totalCount
}) {
  /** Renders the top header with score + completion stats. */
  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-surface/70 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-0.5 text-sm text-black/60">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            Score: <span className="tabular-nums">{score}</span>
          </div>
          <div className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-black/60">
            <span className="tabular-nums font-medium text-black/70">
              {completedCount}
            </span>
            <span className="text-black/40">/</span>
            <span className="tabular-nums">{totalCount}</span>{" "}
            <span className="hidden sm:inline">completed</span>
          </div>
        </div>
      </div>
    </header>
  );
}
