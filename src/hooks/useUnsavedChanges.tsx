import { useEffect } from "react";

export const useUnsavedChanges = (isDirty: boolean) => {
  // Browser tab close / reload
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);
};
