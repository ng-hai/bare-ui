export function createPropSplitter<T extends (...args: any[]) => any>(styles: T) {
  const variantKeys = new Set((styles as any).variantKeys as string[]);

  return function split(props: Record<string, any>): [Record<string, any>, Record<string, any>] {
    const variantProps: Record<string, any> = {};
    const rest: Record<string, any> = {};
    for (const [key, val] of Object.entries(props)) {
      if (variantKeys.has(key)) variantProps[key] = val;
      else rest[key] = val;
    }
    return [variantProps, rest];
  };
}
