import { describe } from "vitest";
import { Input } from "./index";
import { describeSlots } from "@/registry/lib/testing-utils";

describe("Input", () => {
  describeSlots(Input, {
    Root: { slot: "input" },
    Group: { slot: "input-group" },
    Addon: { slot: "input-addon" },
  });
});

import { fireEvent, render } from "@testing-library/react";
import { expect, it } from "vitest";

describe("Input.Group", () => {
  it("focuses the inner input when the group is pressed", () => {
    const { container } = render(
      <Input.Group>
        <Input.Addon>$</Input.Addon>
        <Input.Root />
      </Input.Group>,
    );
    fireEvent.pointerDown(container.querySelector("[data-slot=input-group]")!);
    expect(document.activeElement).toBe(container.querySelector("input"));
  });

  it("does not steal focus from interactive children", () => {
    const { container } = render(
      <Input.Group>
        <Input.Root />
        <Input.Addon>
          <button type="button">go</button>
        </Input.Addon>
      </Input.Group>,
    );
    fireEvent.pointerDown(container.querySelector("button")!);
    expect(document.activeElement).not.toBe(container.querySelector("input"));
  });
});
