import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

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

  // React Router navigation
  const blocker = useBlocker(isDirty);

  useEffect(() => {
    if (blocker.state === "blocked") {
      const leave = window.confirm("You have unsaved changes. Leave anyway?");
      if (leave) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);
};
