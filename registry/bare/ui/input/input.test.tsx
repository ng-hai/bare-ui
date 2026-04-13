import { describe } from "vitest";
import { Input } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Input", () => {
  describeSlots("input", Input, {
    Root: { slot: "input" },
  });
});
