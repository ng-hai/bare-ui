import { describe } from "vitest";
import { Menubar } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Menubar", () => {
  describeSlots("menubar", Menubar, {
    Root: { slot: "menubar" },
  });
});
