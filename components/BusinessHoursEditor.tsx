"use client";

import {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BusinessHours,
  createEmptyBusinessHours,
  normalizeBusinessHours,
} from "@/lib/businessHours";

type Props = {
  value?: BusinessHours;
  onChange: (value: BusinessHours) => void;
};

const HOURS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0")
);
const MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0")
);

const editorStyle: CSSProperties = {
  display: "grid",
  gap: 12,
};

const rowCardStyle: CSSProperties = {
  border: "1px solid #dddddd",
  borderRadius: 14,
  background: "#ffffff",
  padding: 14,
  display: "grid",
  gap: 12,
};

const rowHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const rangeRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const timeButtonStyle: CSSProperties = {
  minWidth: 110,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #cfcfcf",
  background: "#ffffff",
  textAlign: "left",
  cursor: "pointer",
};

const smallButtonStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid #cfcfcf",
  background: "#ffffff",
  cursor: "pointer",
};

const dangerButtonStyle: CSSProperties = {
  ...smallButtonStyle,
  color: "#c62828",
};

const hintStyle: CSSProperties = {
  color: "#999999",
  fontSize: 14,
};

function WheelColumn({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center" });
  }, [value]);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ fontSize: 13, color: "#666" }}>{label}</div>
      <div
        style={{
          position: "relative",
          height: 180,
          width: 88,
          overflowY: "auto",
          border: "1px solid #e1e1e1",
          borderRadius: 14,
          background: "#fff",
          scrollSnapType: "y mandatory",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 70,
            margin: "0 8px",
            height: 40,
            borderRadius: 10,
            background: "#f5f5f5",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div style={{ padding: "70px 0" }}>
          {options.map((option) => {
            const active = option === value;
            return (
              <button
                key={option}
                ref={active ? activeRef : null}
                type="button"
                onClick={() => onSelect(option)}
                style={{
                  display: "block",
                  width: "100%",
                  height: 40,
                  border: "none",
                  background: "transparent",
                  fontSize: 15,
                  color: active ? "#111" : "#999",
                  fontWeight: active ? 700 : 400,
                  cursor: "pointer",
                  scrollSnapAlign: "center",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hour, minute] = useMemo(() => {
    const [nextHour = "09", nextMinute = "00"] = value.split(":");
    return [nextHour, nextMinute];
  }, [value]);

  const [draftHour, setDraftHour] = useState(hour);
  const [draftMinute, setDraftMinute] = useState(minute);

  useEffect(() => {
    setDraftHour(hour);
    setDraftMinute(minute);
  }, [hour, minute, open]);

  const confirm = () => {
    onChange(`${draftHour}:${draftMinute}`);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={timeButtonStyle}
      >
        {value || "09:00"}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 20,
            border: "1px solid #dddddd",
            borderRadius: 16,
            background: "#ffffff",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
            padding: 14,
            display: "grid",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700 }}>選擇時間</div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <WheelColumn
              label="時"
              options={HOURS}
              value={draftHour}
              onSelect={setDraftHour}
            />
            <div style={{ fontSize: 24, color: "#888" }}>:</div>
            <WheelColumn
              label="分"
              options={MINUTES}
              value={draftMinute}
              onSelect={setDraftMinute}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={smallButtonStyle}
            >
              取消
            </button>
            <button type="button" onClick={confirm} style={smallButtonStyle}>
              確認
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BusinessHoursEditor({ value, onChange }: Props) {
  const rows = useMemo(
    () => normalizeBusinessHours(value ?? createEmptyBusinessHours()),
    [value]
  );

  const updateRows = (updater: (rows: BusinessHours) => BusinessHours) => {
    const next = updater(rows);
    onChange(normalizeBusinessHours(next));
  };

  const toggleClosed = (index: number, checked: boolean) => {
    updateRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              closed: checked,
              ranges: checked ? [] : row.ranges,
            }
          : row
      )
    );
  };

  const addRange = (index: number) => {
    updateRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              closed: false,
              ranges: [...row.ranges, { start: "09:00", end: "18:00" }],
            }
          : row
      )
    );
  };

  const updateRange = (
    rowIndex: number,
    rangeIndex: number,
    field: "start" | "end",
    nextValue: string
  ) => {
    updateRows((prev) =>
      prev.map((row, currentRowIndex) => {
        if (currentRowIndex !== rowIndex) return row;
        return {
          ...row,
          ranges: row.ranges.map((range, currentRangeIndex) =>
            currentRangeIndex === rangeIndex
              ? { ...range, [field]: nextValue }
              : range
          ),
        };
      })
    );
  };

  const removeRange = (rowIndex: number, rangeIndex: number) => {
    updateRows((prev) =>
      prev.map((row, currentRowIndex) => {
        if (currentRowIndex !== rowIndex) return row;
        return {
          ...row,
          ranges: row.ranges.filter((_, index) => index !== rangeIndex),
        };
      })
    );
  };

  return (
    <div style={editorStyle}>
      <div style={{ fontWeight: 700 }}>營業時間</div>

      {rows.map((row, rowIndex) => {
        const hasInvalidRange = row.ranges.some((range) => range.end <= range.start);

        return (
          <div key={row.day} style={rowCardStyle}>
            <div style={rowHeaderStyle}>
              <div style={{ fontWeight: 700 }}>{row.day}</div>

              <div style={actionRowStyle}>
                <label
                  style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    checked={row.closed}
                    onChange={(event) => toggleClosed(rowIndex, event.target.checked)}
                  />
                  公休
                </label>

                <button
                  type="button"
                  onClick={() => addRange(rowIndex)}
                  disabled={row.closed}
                  style={{
                    ...smallButtonStyle,
                    opacity: row.closed ? 0.55 : 1,
                    cursor: row.closed ? "not-allowed" : "pointer",
                  }}
                >
                  + 新增營業時間
                </button>
              </div>
            </div>

            {row.closed ? (
              <div style={hintStyle}>本日公休</div>
            ) : row.ranges.length === 0 ? (
              <div style={hintStyle}>尚未新增營業時間</div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {row.ranges.map((range, rangeIndex) => (
                  <div key={`${row.day}-${rangeIndex}`} style={rangeRowStyle}>
                    <TimePicker
                      value={range.start}
                      onChange={(nextValue) =>
                        updateRange(rowIndex, rangeIndex, "start", nextValue)
                      }
                    />
                    <span style={{ color: "#999", fontSize: 20 }}>－</span>
                    <TimePicker
                      value={range.end}
                      onChange={(nextValue) =>
                        updateRange(rowIndex, rangeIndex, "end", nextValue)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeRange(rowIndex, rangeIndex)}
                      style={dangerButtonStyle}
                    >
                      刪除
                    </button>
                  </div>
                ))}

                {hasInvalidRange && (
                  <div style={{ color: "#c62828", fontSize: 14 }}>
                    結束時間需要晚於開始時間。
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
