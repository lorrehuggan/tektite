import { vi } from "vitest";

// Mock Tauri API
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

// Mock Tauri plugins
vi.mock("@tauri-apps/plugin-opener", () => ({
  open: vi.fn(),
}));

// Global test utilities
(globalThis as any).ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
(globalThis as any).IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Suppress console warnings in tests unless explicitly testing them
const originalWarn = console.warn;
// eslint-disable-next-line no-console
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("Unknown property") ||
      args[0].includes("was created with unknown prop"))
  ) {
    return;
  }
  // eslint-disable-next-line no-console
  originalWarn.apply(console, args);
};
