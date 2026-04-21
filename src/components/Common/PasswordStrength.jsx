import React, { useMemo } from "react";
import "./PasswordStrength.css";

export const scorePassword = (pw = "") => {
  let score = 0;
  if (!pw) return { score: 0, label: "Empty", hints: ["Enter a password"] };
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const normalised = Math.min(4, Math.floor(score / 1.5));
  const labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];
  const hints = [];
  if (pw.length < 8) hints.push("At least 8 characters");
  if (!/[A-Z]/.test(pw)) hints.push("Add an uppercase letter");
  if (!/[a-z]/.test(pw)) hints.push("Add a lowercase letter");
  if (!/\d/.test(pw)) hints.push("Add a number");
  if (!/[^A-Za-z0-9]/.test(pw)) hints.push("Add a symbol (e.g. ! @ #)");
  return { score: normalised, label: labels[normalised], hints };
};

const PasswordStrength = ({ value = "" }) => {
  const { score, label, hints } = useMemo(() => scorePassword(value), [value]);
  if (!value) return null;

  return (
    <div className="pw-strength">
      <div className="pw-bars">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`pw-bar ${i <= score ? `pw-bar--active pw-bar--lvl-${score}` : ""}`}
          />
        ))}
      </div>
      <div className="pw-meta">
        <span className={`pw-label pw-label--lvl-${score}`}>{label}</span>
        {hints.length > 0 && score < 3 && (
          <span className="pw-hint">· {hints[0]}</span>
        )}
      </div>
    </div>
  );
};

export default PasswordStrength;
