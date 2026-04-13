import { describe } from "vitest";
import { Popover } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Popover", () => {
  describeSlots("popover", Popover, {
    Root: { slot: "popover", skipRender: true },
    Trigger: { slot: "popover-trigger" },
    Portal: { slot: "popover-portal", skipRender: true },
    Backdrop: { slot: "popover-backdrop" },
    Positioner: { slot: "popover-positioner", skipRender: true },
    Popup: { slot: "popover-popup", skipRender: true },
    Arrow: { slot: "popover-arrow", skipRender: true },
    Title: { slot: "popover-title" },
    Description: { slot: "popover-description" },
    Close: { slot: "popover-close" },
  }, {
    wrapper: (children) => (
      <Popover.Root open>{children}</Popover.Root>
    ),
  });
});
