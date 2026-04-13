import { describe } from "vitest";
import { Autocomplete } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Autocomplete", () => {
  describeSlots("autocomplete", Autocomplete, {
    Root: { slot: "autocomplete", skipRender: true },
    Value: { slot: "autocomplete-value", skipRender: true },
    Collection: { slot: "autocomplete-collection", skipRender: true },
    Trigger: { slot: "autocomplete-trigger" },
    Input: { slot: "autocomplete-input" },
    InputGroup: { slot: "autocomplete-input-group" },
    Icon: { slot: "autocomplete-icon" },
    Clear: { slot: "autocomplete-clear", skipRender: true },
    Portal: { slot: "autocomplete-portal", skipRender: true },
    Backdrop: { slot: "autocomplete-backdrop" },
    Positioner: { slot: "autocomplete-positioner", skipRender: true },
    Popup: { slot: "autocomplete-popup", skipRender: true },
    Arrow: { slot: "autocomplete-arrow", skipRender: true },
    List: { slot: "autocomplete-list" },
    Row: { slot: "autocomplete-row" },
    Item: { slot: "autocomplete-item" },
    Group: { slot: "autocomplete-group" },
    GroupLabel: { slot: "autocomplete-group-label", skipRender: true },
    Empty: { slot: "autocomplete-empty" },
    Status: { slot: "autocomplete-status" },
  }, {
    wrapper: (children) => (
      <Autocomplete.Root open>{children}</Autocomplete.Root>
    ),
  });
});
