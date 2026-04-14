import { describe } from "vitest";
import { ToggleGroup } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("ToggleGroup", () => {
  describeSlots(ToggleGroup, {
    Root: { slot: "toggle-group" },
  });
});
