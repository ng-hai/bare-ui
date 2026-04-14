import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// Flush pending React scheduler work before jsdom environment tears down.
// React 19 schedules async microtasks that reference `window`; without this
// tick they fire after jsdom cleanup and produce spurious "window is not
// defined" unhandled errors.
afterEach(() => new Promise((resolve) => setTimeout(resolve, 0)));
