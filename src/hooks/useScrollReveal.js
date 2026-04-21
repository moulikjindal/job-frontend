import { useEffect } from "react";

export const useScrollReveal = () => {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    const els = document.querySelectorAll(".reveal:not(.visible)");
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
};
