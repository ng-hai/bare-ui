import { describe } from "vitest";
import { Tooltip } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Tooltip", () => {
  describeSlots("tooltip", Tooltip, {
    Root: { slot: "tooltip", skipRender: true },
    Trigger: { slot: "tooltip-trigger" },
    Portal: { slot: "tooltip-portal", skipRender: true },
    Positioner: { slot: "tooltip-positioner", skipRender: true },
    Popup: { slot: "tooltip-popup", skipRender: true },
    Arrow: { slot: "tooltip-arrow", skipRender: true },
  }, {
    wrapper: (children) => (
      <Tooltip.Root open>{children}</Tooltip.Root>
    ),
  });
});
