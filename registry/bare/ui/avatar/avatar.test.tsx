import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Avatar } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Avatar", () => {
  describe("Root", () => {
    it('renders with data-slot="avatar"', () => {
      const { container } = render(<Avatar.Root />);
      expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Avatar.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="avatar"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("avatar", Avatar, {
    Root: { slot: "avatar", skipRender: true },
    Image: { slot: "avatar-image", skipRender: true },
    Fallback: { slot: "avatar-fallback" },
  }, {
    wrapper: (children) => (
      <Avatar.Root>{children}</Avatar.Root>
    ),
  });
});
