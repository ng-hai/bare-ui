import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Sidebar } from "./index";
import { describeSlots } from "@/registry/lib/testing-utils";

const inGroup = (children: React.ReactNode) => (
  <Sidebar.Provider>
    <Sidebar.Group>{children}</Sidebar.Group>
  </Sidebar.Provider>
);

describe("Sidebar", () => {
  describe("Provider", () => {
    it('renders with data-slot="sidebar-provider"', () => {
      const { container } = render(<Sidebar.Provider />);
      expect(container.querySelector('[data-slot="sidebar-provider"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Sidebar.Provider className="__test-class__" />);
      expect(container.querySelector('[data-slot="sidebar-provider"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots(Sidebar, {
    Root: { slot: "sidebar" },
    Trigger: { slot: "sidebar-trigger" },
    Inset: { slot: "sidebar-inset" },
    Header: { slot: "sidebar-header" },
    Content: { slot: "sidebar-content" },
    Group: { slot: "sidebar-group" },
    GroupLabel: { slot: "sidebar-group-label", wrapper: inGroup },
    GroupAction: { slot: "sidebar-group-action" },
    GroupBadge: { slot: "sidebar-group-badge" },
    GroupContent: { slot: "sidebar-group-content", wrapper: inGroup },
    Menu: { slot: "sidebar-menu" },
    MenuItem: { slot: "sidebar-menu-item" },
    MenuButton: { slot: "sidebar-menu-button" },
    MenuAction: { slot: "sidebar-menu-action" },
    MenuBadge: { slot: "sidebar-menu-badge" },
    MenuSub: { slot: "sidebar-menu-sub" },
    MenuSubItem: { slot: "sidebar-menu-sub-item" },
    MenuSubButton: { slot: "sidebar-menu-sub-button" },
  }, {
    wrapper: (children) => <Sidebar.Provider>{children}</Sidebar.Provider>,
  });

  describe("open state", () => {
    it("starts expanded and toggles via Trigger", () => {
      const { container } = render(
        <Sidebar.Provider>
          <Sidebar.Root>
            <Sidebar.Trigger>Toggle</Sidebar.Trigger>
          </Sidebar.Root>
        </Sidebar.Provider>,
      );
      const root = container.querySelector('[data-slot="sidebar"]');
      const trigger = container.querySelector('[data-slot="sidebar-trigger"]')!;
      expect(root).toHaveAttribute("data-state", "expanded");
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      fireEvent.click(trigger);
      expect(root).toHaveAttribute("data-state", "collapsed");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("supports controlled open", () => {
      const onOpenChange = vi.fn();
      const { container } = render(
        <Sidebar.Provider open={false} onOpenChange={onOpenChange}>
          <Sidebar.Trigger>Toggle</Sidebar.Trigger>
        </Sidebar.Provider>,
      );
      expect(container.querySelector('[data-slot="sidebar-provider"]')).toHaveAttribute("data-state", "collapsed");
      fireEvent.click(container.querySelector('[data-slot="sidebar-trigger"]')!);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(container.querySelector('[data-slot="sidebar-provider"]')).toHaveAttribute("data-state", "collapsed");
    });
  });

  describe("collapsible groups", () => {
    it("renders Group as a section, open by default, and toggles via GroupLabel", () => {
      const { container, getByRole } = render(
        <Sidebar.Provider>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton>Home</Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Provider>,
      );

      expect(container.querySelector('[data-slot="sidebar-group"]')?.tagName).toBe("SECTION");
      const label = getByRole("button", { name: "Platform" });
      expect(label).toHaveAttribute("aria-expanded", "true");
      expect(container.querySelector('[data-slot="sidebar-group-content"]')).toBeInTheDocument();

      fireEvent.click(label);
      expect(label).toHaveAttribute("aria-expanded", "false");
      expect(container.querySelector('[data-slot="sidebar-group-content"]')).not.toBeInTheDocument();
    });

    it("respects defaultOpen={false}", () => {
      const { container } = render(
        <Sidebar.Provider>
          <Sidebar.Group defaultOpen={false}>
            <Sidebar.GroupLabel>Archive</Sidebar.GroupLabel>
            <Sidebar.GroupContent>2024</Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Provider>,
      );
      expect(container.querySelector('[data-slot="sidebar-group-content"]')).not.toBeInTheDocument();
    });
  });

  describe("MenuButton", () => {
    it("renders a button by default and swaps via render", () => {
      const { container } = render(
        <Sidebar.Provider>
          <Sidebar.MenuButton>Home</Sidebar.MenuButton>
          <Sidebar.MenuButton render={<a href="/inbox" />}>Inbox</Sidebar.MenuButton>
        </Sidebar.Provider>,
      );
      const [home, inbox] = container.querySelectorAll('[data-slot="sidebar-menu-button"]');
      expect(home.tagName).toBe("BUTTON");
      expect(inbox.tagName).toBe("A");
      expect(inbox).toHaveAttribute("href", "/inbox");
    });

    it('sets aria-current="page" and data-active when active', () => {
      const { container } = render(
        <Sidebar.Provider>
          <Sidebar.MenuButton active>Home</Sidebar.MenuButton>
          <Sidebar.MenuSubButton>Inbox</Sidebar.MenuSubButton>
        </Sidebar.Provider>,
      );
      const home = container.querySelector('[data-slot="sidebar-menu-button"]');
      const inbox = container.querySelector('[data-slot="sidebar-menu-sub-button"]');
      expect(home).toHaveAttribute("aria-current", "page");
      expect(home).toHaveAttribute("data-active");
      expect(inbox).not.toHaveAttribute("aria-current");
    });
  });
});
