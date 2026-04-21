import React, { useEffect, useState } from "react";
import "./Confetti.css";

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

const Confetti = ({ active = false, duration = 2500, count = 60 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(t);
  }, [active, duration]);

  if (!show) return null;

  const pieces = Array.from({ length: count }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      background: COLORS[i % COLORS.length],
      animationDelay: `${Math.random() * 0.5}s`,
      animationDuration: `${1.5 + Math.random() * 1.5}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
      width: `${6 + Math.random() * 6}px`,
      height: `${10 + Math.random() * 14}px`,
    };
    return <span key={i} className="confetti-piece" style={style} />;
  });

  return <div className="confetti-container" aria-hidden="true">{pieces}</div>;
};

export default Confetti;
