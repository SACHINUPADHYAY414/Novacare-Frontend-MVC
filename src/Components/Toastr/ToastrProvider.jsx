import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Toast } from "primereact/toast";

const ToastrContext = createContext(null);

export const ToastrProvider = ({ children }) => {
  const toastRef = useRef(null);
  const lastToastTime = useRef(0);

  const customToast = useCallback(
    ({
      severity,
      summary,
      detail,
      life = 3000,
      sticky = false,
      closable = true,
    }) => {
      const now = Date.now();
      if (now - lastToastTime.current < 500) {
        console.warn("Toastr call ignored due to debouncing.");
        return;
      }
      lastToastTime.current = now;

      if (toastRef.current) {
        toastRef.current.show({
          severity,
          summary,
          detail,
          life,
          sticky,
          closable,
        });
      } else {
        // console.error("Toast reference is not initialized.");
      }
    },
    []
  );

  const clearToast = () => {
    if (toastRef.current) {
      toastRef.current.clear();
    } else {
      // console.error("Toast reference is not initialized.");
    }
  };

  useEffect(() => {
    window.customToast = customToast;
  }, [customToast]);

  return (
    <ToastrContext.Provider value={{ customToast, clearToast }}>
      <Toast
        ref={toastRef}
        className="p-toast-container"
      />

      {children}
    </ToastrContext.Provider>
  );
};

// Custom Hook to Use Toastr
export const useToastr = () => {
  const context = useContext(ToastrContext);
  if (!context) {
    throw new Error("useToastr must be used within a ToastrProvider.");
  }
  return context;
};
