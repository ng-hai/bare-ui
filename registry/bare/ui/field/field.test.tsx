import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Field } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Field", () => {
  describe("Root", () => {
    it('renders with data-slot="field"', () => {
      const { container } = render(<Field.Root />);
      expect(container.querySelector('[data-slot="field"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Field.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="field"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("field", Field, {
    Root: { slot: "field", skipRender: true },
    Label: { slot: "field-label" },
    Error: { slot: "field-error", skipRender: true },
    Description: { slot: "field-description" },
    Control: { slot: "field-control" },
    Validity: { slot: "field-validity", skipRender: true },
    Item: { slot: "field-item" },
  }, {
    wrapper: (children) => (
      <Field.Root>{children}</Field.Root>
    ),
  });
});
