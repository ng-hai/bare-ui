import { describe } from "vitest";
import { CheckboxGroup } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("CheckboxGroup", () => {
  describeSlots("checkbox-group", CheckboxGroup, {
    Root: { slot: "checkbox-group" },
  });
});
