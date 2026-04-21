import React, { useEffect, useState } from "react";
import { FiWifiOff } from "react-icons/fi";
import "./OfflineBanner.css";

const OfflineBanner = () => {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  if (online) return null;

  return (
    <div className="offline-banner" role="alert">
      <FiWifiOff />
      <span>You're offline. Some features may be unavailable.</span>
    </div>
  );
};

export default OfflineBanner;
