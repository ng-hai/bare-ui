import { describe } from "vitest";
import { PreviewCard } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("PreviewCard", () => {
  describeSlots("preview-card", PreviewCard, {
    Root: { slot: "preview-card", skipRender: true },
    Trigger: { slot: "preview-card-trigger" },
    Portal: { slot: "preview-card-portal", skipRender: true },
    Backdrop: { slot: "preview-card-backdrop" },
    Positioner: { slot: "preview-card-positioner", skipRender: true },
    Popup: { slot: "preview-card-popup", skipRender: true },
    Arrow: { slot: "preview-card-arrow", skipRender: true },
    Viewport: { slot: "preview-card-viewport", skipRender: true },
  }, {
    wrapper: (children) => (
      <PreviewCard.Root open>{children}</PreviewCard.Root>
    ),
  });
});
