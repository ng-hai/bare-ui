import { describe } from "vitest";
import { Separator } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Separator", () => {
  describeSlots(Separator, {
    Root: { slot: "separator" },
  });
});
