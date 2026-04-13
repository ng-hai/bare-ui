import { describe } from "vitest";
import { AlertDialog } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("AlertDialog", () => {
  describeSlots("alert-dialog", AlertDialog, {
    Root: { slot: "alert-dialog", skipRender: true },
    Trigger: { slot: "alert-dialog-trigger" },
    Portal: { slot: "alert-dialog-portal", skipRender: true },
    Backdrop: { slot: "alert-dialog-backdrop" },
    Popup: { slot: "alert-dialog-popup", skipRender: true },
    Viewport: { slot: "alert-dialog-viewport", skipRender: true },
    Title: { slot: "alert-dialog-title" },
    Description: { slot: "alert-dialog-description" },
    Close: { slot: "alert-dialog-close" },
  }, {
    wrapper: (children) => (
      <AlertDialog.Root open>{children}</AlertDialog.Root>
    ),
  });
});
