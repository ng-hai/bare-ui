import { describe } from "vitest";
import { Button } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Button", () => {
  describeSlots(Button, {
    Root: { slot: "button" },
  });
});
