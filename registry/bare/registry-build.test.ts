/// <reference types="node" />
import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";

describe("registry build integrity", () => {
  it("public/r/*.json is in sync with source", () => {
    execSync("pnpm registry:build", { stdio: "pipe" });

    const diff = execSync("git diff --name-only public/r/", { encoding: "utf-8" }).trim();

    expect(diff).toBe("");
  }, 30_000);
});
