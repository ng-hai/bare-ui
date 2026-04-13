import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { NavigationMenu } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("NavigationMenu", () => {
  describe("Root", () => {
    it('renders with data-slot="navigation-menu"', () => {
      const { container } = render(<NavigationMenu.Root />);
      expect(container.querySelector('[data-slot="navigation-menu"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<NavigationMenu.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="navigation-menu"]')).toHaveClass("__test-class__");
    });
  });

  describe("List", () => {
    it('renders with data-slot="navigation-menu-list"', () => {
      const { container } = render(
        <NavigationMenu.Root>
          <NavigationMenu.List />
        </NavigationMenu.Root>
      );
      expect(container.querySelector('[data-slot="navigation-menu-list"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(
        <NavigationMenu.Root>
          <NavigationMenu.List className="__test-class__" />
        </NavigationMenu.Root>
      );
      expect(container.querySelector('[data-slot="navigation-menu-list"]')).toHaveClass("__test-class__");
    });
  });

  describe("Item", () => {
    it('renders with data-slot="navigation-menu-item"', () => {
      const { container } = render(
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item />
          </NavigationMenu.List>
        </NavigationMenu.Root>
      );
      expect(container.querySelector('[data-slot="navigation-menu-item"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item className="__test-class__" />
          </NavigationMenu.List>
        </NavigationMenu.Root>
      );
      expect(container.querySelector('[data-slot="navigation-menu-item"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("navigation-menu", NavigationMenu, {
    Root: { slot: "navigation-menu", skipRender: true },
    List: { slot: "navigation-menu-list", skipRender: true },
    Item: { slot: "navigation-menu-item", skipRender: true },
    Trigger: { slot: "navigation-menu-trigger" },
    Icon: { slot: "navigation-menu-icon" },
    Content: { slot: "navigation-menu-content", skipRender: true },
    Link: { slot: "navigation-menu-link" },
    Portal: { slot: "navigation-menu-portal", skipRender: true },
    Backdrop: { slot: "navigation-menu-backdrop" },
    Positioner: { slot: "navigation-menu-positioner", skipRender: true },
    Popup: { slot: "navigation-menu-popup", skipRender: true },
    Viewport: { slot: "navigation-menu-viewport" },
    Arrow: { slot: "navigation-menu-arrow", skipRender: true },
  }, {
    wrapper: (children) => (
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item value="test">
            {children}
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    ),
  });
});
