import { useCallback } from "react";
import toast from "react-hot-toast";

export const useCopy = () => {
  return useCallback(async (text, message = "Copied to clipboard") => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      toast.success(message);
      return true;
    } catch {
      toast.error("Unable to copy");
      return false;
    }
  }, []);
};
