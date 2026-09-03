import { createContext, useCallback, useContext, useState, type ComponentProps } from "react";
import { createStyleContext } from "@/registry/lib/create-style-context";
import { createPropSplitter } from "@/registry/lib/split-variant-props";
import { sidebarStyles } from "./styles";
import type { VariantProps } from "@/registry/lib/tv-config";

type SidebarStyles = ReturnType<typeof sidebarStyles>;
type SidebarVariantProps = VariantProps<typeof sidebarStyles>;

const { StyleContext, useStyles } = createStyleContext<SidebarStyles>("Sidebar");
const splitProps = createPropSplitter(sidebarStyles);

export { useStyles as useSidebarStyles };

interface SidebarState {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarState | null>(null);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("Sidebar parts must be used within <Sidebar.Provider>");
  return ctx;
}

interface SidebarProviderProps extends ComponentProps<"div">, SidebarVariantProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  styles?: SidebarStyles;
}

export function SidebarProvider(props: SidebarProviderProps) {
  const [variantProps, { className, styles, open: openProp, defaultOpen = true, onOpenChange, ...htmlProps }] =
    splitProps(props);
  const s = styles ?? sidebarStyles(variantProps);

  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );
  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  return (
    <StyleContext value={s}>
      <SidebarContext value={{ open, setOpen, toggle }}>
        <div
          {...htmlProps}
          className={s.provider({ class: className })}
          data-slot="sidebar-provider"
          data-state={open ? "expanded" : "collapsed"}
        />
      </SidebarContext>
    </StyleContext>
  );
}
