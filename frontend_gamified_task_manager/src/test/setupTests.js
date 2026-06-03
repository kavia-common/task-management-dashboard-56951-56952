import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * Test environment setup:
 * - cleanup DOM after each test
 * - polyfill crypto.randomUUID (used by App when adding tasks / sanitizing storage)
 * - polyfill requestAnimationFrame (used for focus management)
 */

afterEach(() => {
  cleanup();
});

// crypto.randomUUID is available in modern browsers but may be absent in jsdom runs.
if (!globalThis.crypto) {
  globalThis.crypto = {};
}
if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = vi.fn(() => "test-uuid");
}

if (!globalThis.requestAnimationFrame) {
  globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
}
