import { describe } from "vitest";
import { Menu } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Menu", () => {
  describeSlots("menu", Menu, {
    Root: { slot: "menu", skipRender: true },
    SubmenuRoot: { slot: "menu-submenu", skipRender: true },
    Trigger: { slot: "menu-trigger" },
    SubmenuTrigger: { slot: "menu-submenu-trigger", skipRender: true },
    Portal: { slot: "menu-portal", skipRender: true },
    Backdrop: { slot: "menu-backdrop" },
    Positioner: { slot: "menu-positioner", skipRender: true },
    Popup: { slot: "menu-popup", skipRender: true },
    Viewport: { slot: "menu-viewport", skipRender: true },
    Arrow: { slot: "menu-arrow", skipRender: true },
    Item: { slot: "menu-item" },
    LinkItem: { slot: "menu-link-item" },
    Group: { slot: "menu-group" },
    GroupLabel: { slot: "menu-group-label", skipRender: true },
    RadioGroup: { slot: "menu-radio-group" },
    RadioItem: { slot: "menu-radio-item", skipRender: true },
    RadioItemIndicator: { slot: "menu-radio-item-indicator", skipRender: true },
    CheckboxItem: { slot: "menu-checkbox-item" },
    CheckboxItemIndicator: { slot: "menu-checkbox-item-indicator", skipRender: true },
  }, {
    wrapper: (children) => (
      <Menu.Root open>{children}</Menu.Root>
    ),
  });
});
