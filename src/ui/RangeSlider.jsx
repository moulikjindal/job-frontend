import React from "react";
import "./RangeSlider.css";

const fmt = (v) => (v >= 1_00_000 ? `₹${(v / 1_00_000).toFixed(1)}L` : `₹${v.toLocaleString()}`);

const RangeSlider = ({ min = 0, max = 5_000_000, step = 10_000, value = [min, max], onChange, label }) => {
  const [a, b] = value;
  const setA = (v) => onChange?.([Math.min(Number(v), b - step), b]);
  const setB = (v) => onChange?.([a, Math.max(Number(v), a + step)]);
  const leftPct = ((a - min) / (max - min)) * 100;
  const rightPct = ((b - min) / (max - min)) * 100;

  return (
    <div className="ui-range">
      {label && (
        <div className="ui-range-head">
          <span className="ui-range-label">{label}</span>
          <span className="ui-range-value">{fmt(a)} — {fmt(b)}</span>
        </div>
      )}
      <div className="ui-range-track">
        <div
          className="ui-range-fill"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />
        <input
          type="range" min={min} max={max} step={step} value={a}
          onChange={(e) => setA(e.target.value)}
          className="ui-range-input ui-range-input--a"
          aria-label="Minimum value"
        />
        <input
          type="range" min={min} max={max} step={step} value={b}
          onChange={(e) => setB(e.target.value)}
          className="ui-range-input ui-range-input--b"
          aria-label="Maximum value"
        />
      </div>
    </div>
  );
};

export default RangeSlider;
