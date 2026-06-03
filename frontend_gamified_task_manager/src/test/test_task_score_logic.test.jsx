import React from "react";
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App.jsx";

const STORAGE_KEY = "gtm.tasks.v1";

function getScoreValue() {
  // ScoreHeader renders: "Score: <span>{score}</span>"
  const scoreChip = screen.getByText(/score:/i).closest("div");
  expect(scoreChip).toBeTruthy();
  const nums = within(scoreChip).getByText(/^\d+$/);
  return Number(nums.textContent);
}

function getCompletedSummaryText() {
  // There are two locations that show X/Y completed:
  // - ScoreHeader (has hidden "completed" word on larger screens)
  // - TaskList header: "{completedCount}/{totalCount} completed"
  // We assert against TaskList header because it includes literal "completed".
  return screen.getByText(/completed$/i).textContent;
}

describe("Gamified Task Manager core flows", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("adds a task via the form and persists to localStorage", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/task title/i);
    await user.type(input, "   Buy   milk   ");
    await user.click(screen.getByRole("button", { name: /add/i }));

    // Task appears in list (as text content).
    expect(screen.getByText("Buy milk")).toBeInTheDocument();

    // Score unchanged because it's not completed yet.
    expect(getScoreValue()).toBe(0);
    expect(getCompletedSummaryText()).toMatch(/^0\/1 completed$/);

    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();

    const parsed = JSON.parse(raw);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({
      title: "Buy milk",
      completed: false
    });
    expect(typeof parsed[0].id).toBe("string");
    expect(typeof parsed[0].createdAt).toBe("number");
  });

  it("toggles completion and updates score (1 point per completed task)", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add two tasks.
    const input = screen.getByLabelText(/task title/i);
    await user.type(input, "Task A");
    await user.click(screen.getByRole("button", { name: /add/i }));
    await user.type(input, "Task B");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(getScoreValue()).toBe(0);
    expect(getCompletedSummaryText()).toMatch(/^0\/2 completed$/);

    // Toggle complete for "Task A".
    const row = screen.getByText("Task A").closest("li");
    expect(row).toBeTruthy();

    // The toggle is the button with aria-label "Mark as complete/not complete".
    const toggle = within(row).getByRole("button", { name: /mark as complete/i });
    await user.click(toggle);

    expect(getScoreValue()).toBe(1);
    expect(getCompletedSummaryText()).toMatch(/^1\/2 completed$/);

    // Toggle again -> score should decrement.
    const toggleBack = within(row).getByRole("button", {
      name: /mark as not complete/i
    });
    await user.click(toggleBack);

    expect(getScoreValue()).toBe(0);
    expect(getCompletedSummaryText()).toMatch(/^0\/2 completed$/);
  });

  it("edits a task title inline and saves changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add initial task.
    const input = screen.getByLabelText(/task title/i);
    await user.type(input, "Original title");
    await user.click(screen.getByRole("button", { name: /add/i }));

    const row = screen.getByText("Original title").closest("li");
    expect(row).toBeTruthy();

    await user.click(within(row).getByRole("button", { name: /edit/i }));

    const editInput = within(row).getByLabelText(/edit task title/i);
    await user.clear(editInput);
    await user.type(editInput, "  Updated   title  ");
    await user.click(within(row).getByRole("button", { name: /save/i }));

    expect(screen.getByText("Updated title")).toBeInTheDocument();
    expect(screen.queryByText("Original title")).not.toBeInTheDocument();

    // Ensure localStorage reflects update.
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe("Updated title");
  });

  it("deletes a task and updates counts + localStorage", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/task title/i);
    await user.type(input, "One");
    await user.click(screen.getByRole("button", { name: /add/i }));
    await user.type(input, "Two");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(getCompletedSummaryText()).toMatch(/^0\/2 completed$/);

    const row = screen.getByText("Two").closest("li");
    expect(row).toBeTruthy();

    await user.click(within(row).getByRole("button", { name: /delete/i }));

    expect(screen.queryByText("Two")).not.toBeInTheDocument();
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(getCompletedSummaryText()).toMatch(/^0\/1 completed$/);

    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe("One");
  });

  it("loads tasks from localStorage and ignores invalid/corrupt JSON", async () => {
    // Case 1: corrupt JSON -> app should not crash; should start empty.
    window.localStorage.setItem(STORAGE_KEY, "{not-json");
    render(<App />);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });
});
