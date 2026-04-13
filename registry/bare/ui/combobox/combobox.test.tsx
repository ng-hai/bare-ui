import { describe } from "vitest";
import { Combobox } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Combobox", () => {
  describeSlots("combobox", Combobox, {
    Root: { slot: "combobox", skipRender: true },
    Value: { slot: "combobox-value", skipRender: true },
    Collection: { slot: "combobox-collection", skipRender: true },
    Label: { slot: "combobox-label" },
    Trigger: { slot: "combobox-trigger" },
    Input: { slot: "combobox-input" },
    InputGroup: { slot: "combobox-input-group" },
    Chips: { slot: "combobox-chips" },
    Chip: { slot: "combobox-chip", skipRender: true },
    ChipRemove: { slot: "combobox-chip-remove", skipRender: true },
    Clear: { slot: "combobox-clear", skipRender: true },
    Icon: { slot: "combobox-icon" },
    Portal: { slot: "combobox-portal", skipRender: true },
    Backdrop: { slot: "combobox-backdrop" },
    Positioner: { slot: "combobox-positioner", skipRender: true },
    Popup: { slot: "combobox-popup", skipRender: true },
    Arrow: { slot: "combobox-arrow", skipRender: true },
    List: { slot: "combobox-list" },
    Row: { slot: "combobox-row" },
    Item: { slot: "combobox-item" },
    ItemIndicator: { slot: "combobox-item-indicator", skipRender: true },
    Group: { slot: "combobox-group" },
    GroupLabel: { slot: "combobox-group-label", skipRender: true },
    Empty: { slot: "combobox-empty" },
    Status: { slot: "combobox-status" },
  }, {
    wrapper: (children) => (
      <Combobox.Root open>{children}</Combobox.Root>
    ),
  });
});
