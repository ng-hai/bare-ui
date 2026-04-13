import { describe } from "vitest";
import { Dialog } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Dialog", () => {
  describeSlots("dialog", Dialog, {
    Root: { slot: "dialog", skipRender: true },
    Trigger: { slot: "dialog-trigger" },
    Portal: { slot: "dialog-portal", skipRender: true },
    Backdrop: { slot: "dialog-backdrop" },
    Popup: { slot: "dialog-popup", skipRender: true },
    Viewport: { slot: "dialog-viewport", skipRender: true },
    Title: { slot: "dialog-title" },
    Description: { slot: "dialog-description" },
    Close: { slot: "dialog-close" },
  }, {
    wrapper: (children) => (
      <Dialog.Root open>{children}</Dialog.Root>
    ),
  });
});
