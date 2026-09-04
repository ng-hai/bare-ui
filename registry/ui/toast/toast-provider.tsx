import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { toastStyles } from "./styles";
import { ToastStyleContext } from "./toast-root";

interface ToastProviderProps extends ToastPrimitive.Provider.Props {}

// Portal and Viewport sit outside Toast.Root in Base UI's tree, so the provider
// supplies the default styles for them; each Root re-provides its own variant.
export function ToastProvider(props: ToastProviderProps) {
  return (
    <ToastStyleContext value={toastStyles()}>
      <ToastPrimitive.Provider {...props} />
    </ToastStyleContext>
  );
}
