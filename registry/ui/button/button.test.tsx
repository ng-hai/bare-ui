import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./index";
import { describeSlots } from "@/registry/lib/testing-utils";

describe("Button", () => {
  describeSlots(Button, {
    Root: { slot: "button" },
  });
});

describe("Button accent", () => {
  it("defaults to the gray accent", () => {
    const { container } = render(<Button.Root>Save</Button.Root>);
    expect(container.querySelector("button")).toHaveAttribute("data-accent-color", "gray");
  });

  it("lets a consumer's data-accent-color override the default", () => {
    const { container } = render(<Button.Root data-accent-color="jade">Upgrade</Button.Root>);
    expect(container.querySelector("button")).toHaveAttribute("data-accent-color", "jade");
  });
});
