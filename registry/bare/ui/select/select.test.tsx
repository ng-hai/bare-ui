import { describe } from "vitest";
import { Select } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Select", () => {
  describeSlots("select", Select, {
    Root: { slot: "select", skipRender: true },
    Trigger: { slot: "select-trigger" },
    Value: { slot: "select-value" },
    Icon: { slot: "select-icon" },
    Portal: { slot: "select-portal", skipRender: true },
    Backdrop: { slot: "select-backdrop" },
    Positioner: { slot: "select-positioner" },
    Popup: { slot: "select-popup", skipRender: true },
    Item: { slot: "select-item" },
    ItemText: { slot: "select-item-text", skipRender: true },
    ItemIndicator: { slot: "select-item-indicator", skipRender: true },
    Group: { slot: "select-group" },
    GroupLabel: { slot: "select-group-label", skipRender: true },
    Arrow: { slot: "select-arrow", skipRender: true },
    Separator: { slot: "select-separator" },
  }, {
    wrapper: (children) => (
      <Select.Root open>{children}</Select.Root>
    ),
  });
});
