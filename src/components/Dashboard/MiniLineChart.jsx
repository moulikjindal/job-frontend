import React, { useMemo } from "react";
import "./MiniLineChart.css";

/**
 * Lightweight SVG line chart — no deps.
 * series: [{ date, count }]
 */
const MiniLineChart = ({ series = [], height = 160, color = "var(--primary)" }) => {
  const { points, gradientPath, max, min, step } = useMemo(() => {
    if (!series.length) return { points: [], gradientPath: "", max: 0, min: 0, step: 0 };
    const counts = series.map((p) => p.count);
    const max = Math.max(...counts, 1);
    const min = 0;
    const width = 600;
    const stepX = width / Math.max(1, series.length - 1);
    const points = series.map((p, i) => {
      const x = i * stepX;
      const y = height - ((p.count - min) / (max - min || 1)) * (height - 20) - 10;
      return { x, y, raw: p };
    });
    const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const gradientPath = `${line} L${points[points.length - 1].x},${height} L0,${height} Z`;
    return { points, gradientPath: gradientPath, max, min, step: stepX, linePath: line };
  }, [series, height]);

  if (!series.length) {
    return <div className="mlc-empty">No data yet</div>;
  }

  return (
    <div className="mlc-wrap" style={{ height }}>
      <svg viewBox={`0 0 600 ${height}`} preserveAspectRatio="none" className="mlc-svg">
        <defs>
          <linearGradient id="mlc-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={gradientPath} fill="url(#mlc-fill)" />
        <path
          d={points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.4} fill={color}>
            <title>{p.raw.date}: {p.raw.count}</title>
          </circle>
        ))}
      </svg>
      <div className="mlc-axis">
        <span>{series[0]?.date?.slice(5)}</span>
        <span>{series[series.length - 1]?.date?.slice(5)}</span>
      </div>
      <div className="mlc-max">peak: {max}</div>
    </div>
  );
};

export default MiniLineChart;
