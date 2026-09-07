import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Alert } from "./index";
import { describeSlots } from "@/registry/lib/testing-utils";

describe("Alert", () => {
  describe("Root", () => {
    it("is a polite status region by default", () => {
      const { container } = render(<Alert.Root />);
      const el = container.querySelector('[data-slot="alert"]');
      expect(el).toHaveAttribute("role", "status");
      expect(el).toHaveAttribute("tabindex", "-1");
    });

    it("merges className into slot", () => {
      const { container } = render(<Alert.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="alert"]')).toHaveClass("__test-class__");
    });

    it("lets a submit-time message opt into role=alert", () => {
      const { container } = render(<Alert.Root role="alert" />);
      expect(container.querySelector('[data-slot="alert"]')).toHaveAttribute("role", "alert");
    });
  });

  it("hides the icon from assistive tech", () => {
    const { container } = render(
      <Alert.Root>
        <Alert.Icon>!</Alert.Icon>
      </Alert.Root>,
    );
    expect(container.querySelector('[data-slot="alert-icon"]')).toHaveAttribute("aria-hidden");
  });

  describeSlots(
    Alert,
    {
      Root: { slot: "alert", skipRender: true },
      Icon: { slot: "alert-icon" },
      Content: { slot: "alert-content" },
      Title: { slot: "alert-title" },
      Description: { slot: "alert-description" },
      Action: { slot: "alert-action" },
    },
    { wrapper: (children) => <Alert.Root>{children}</Alert.Root> },
  );
});
