import { describe, it, expect } from "vitest";
import { Toast } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Toast", () => {
  it("exports Provider", () => {
    expect(Toast.Provider).toBeDefined();
  });

  describeSlots("toast", Toast, {
    Provider: { slot: "toast-provider", skipRender: true },
    Portal: { slot: "toast-portal", skipRender: true },
    Viewport: { slot: "toast-viewport", skipRender: true },
    Positioner: { slot: "toast-positioner", skipRender: true },
    Root: { slot: "toast", skipRender: true },
    Content: { slot: "toast-content", skipRender: true },
    Title: { slot: "toast-title", skipRender: true },
    Description: { slot: "toast-description", skipRender: true },
    Action: { slot: "toast-action", skipRender: true },
    Close: { slot: "toast-close", skipRender: true },
    Arrow: { slot: "toast-arrow", skipRender: true },
  });
});
