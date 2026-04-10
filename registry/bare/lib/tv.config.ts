import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { createTV } from "tailwind-variants";

const twMergeConfig = {
  extend: {
    classGroups: {},
  },
};

export const tv = createTV({
  twMerge: true,
  twMergeConfig,
});

const twMerge = extendTailwindMerge(twMergeConfig);

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type { VariantProps } from "tailwind-variants";
