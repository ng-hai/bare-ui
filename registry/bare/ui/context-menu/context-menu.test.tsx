import { describe } from "vitest";
import { ContextMenu } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("ContextMenu", () => {
  describeSlots("context-menu", ContextMenu, {
    Root: { slot: "context-menu", skipRender: true },
    Trigger: { slot: "context-menu-trigger" },
    SubmenuRoot: { slot: "context-menu-submenu", skipRender: true },
    SubmenuTrigger: { slot: "context-menu-submenu-trigger", skipRender: true },
    Portal: { slot: "context-menu-portal", skipRender: true },
    Backdrop: { slot: "context-menu-backdrop" },
    Positioner: { slot: "context-menu-positioner", skipRender: true },
    Popup: { slot: "context-menu-popup", skipRender: true },
    Arrow: { slot: "context-menu-arrow", skipRender: true },
    Item: { slot: "context-menu-item" },
    LinkItem: { slot: "context-menu-link-item" },
    Group: { slot: "context-menu-group" },
    GroupLabel: { slot: "context-menu-group-label", skipRender: true },
    RadioGroup: { slot: "context-menu-radio-group" },
    RadioItem: { slot: "context-menu-radio-item", skipRender: true },
    RadioItemIndicator: { slot: "context-menu-radio-item-indicator", skipRender: true },
    CheckboxItem: { slot: "context-menu-checkbox-item" },
    CheckboxItemIndicator: { slot: "context-menu-checkbox-item-indicator", skipRender: true },
  }, {
    wrapper: (children) => (
      <ContextMenu.Root open>{children}</ContextMenu.Root>
    ),
  });
});
