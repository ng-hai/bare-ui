import { describe } from "vitest";
import { Drawer } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Drawer", () => {
  describeSlots("drawer", Drawer, {
    Root: { slot: "drawer", skipRender: true },
    Provider: { slot: "drawer-provider", skipRender: true },
    Trigger: { slot: "drawer-trigger" },
    Portal: { slot: "drawer-portal", skipRender: true },
    Backdrop: { slot: "drawer-backdrop" },
    Popup: { slot: "drawer-popup", skipRender: true },
    SwipeArea: { slot: "drawer-swipe-area" },
    Content: { slot: "drawer-content" },
    Viewport: { slot: "drawer-viewport", skipRender: true },
    Title: { slot: "drawer-title" },
    Description: { slot: "drawer-description" },
    Close: { slot: "drawer-close" },
    Indent: { slot: "drawer-indent" },
    IndentBackground: { slot: "drawer-indent-background" },
  }, {
    wrapper: (children) => (
      <Drawer.Root open>{children}</Drawer.Root>
    ),
  });
});
