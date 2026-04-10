"use client";

import { CSSProperties } from "react";

export type BeautyPart = "Hair" | "Face" | "Eyes" | "Lips" | "Skincare";

const PART_OPTIONS: BeautyPart[] = [
  "Hair",
  "Face",
  "Eyes",
  "Lips",
  "Skincare",
];

const wrapperStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const chipListStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const chipStyle: CSSProperties = {
  border: "1px solid #d6d6d6",
  borderRadius: 999,
  padding: "8px 14px",
  background: "#fff",
  cursor: "pointer",
  fontSize: 14,
};

const activeChipStyle: CSSProperties = {
  ...chipStyle,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
};

const hintStyle: CSSProperties = {
  margin: 0,
  color: "#777",
  fontSize: 13,
};

type BeautyPartSelectorProps = {
  value: BeautyPart[];
  onChange: (value: BeautyPart[]) => void;
};

export default function BeautyPartSelector({
  value,
  onChange,
}: BeautyPartSelectorProps) {
  const togglePart = (part: BeautyPart) => {
    if (value.includes(part)) {
      onChange(value.filter((item) => item !== part));
      return;
    }

    onChange([...value, part]);
  };

  return (
    <div style={wrapperStyle}>
      <p style={hintStyle}>可複選使用部位。</p>
      <div style={chipListStyle}>
        {PART_OPTIONS.map((part) => {
          const active = value.includes(part);
          return (
            <button
              key={part}
              type="button"
              style={active ? activeChipStyle : chipStyle}
              onClick={() => togglePart(part)}
            >
              {part}
            </button>
          );
        })}
      </div>
    </div>
  );
}
