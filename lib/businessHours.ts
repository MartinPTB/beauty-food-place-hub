export type BusinessTimeRange = {
  start: string;
  end: string;
};

export type BusinessDay = {
  day: string;
  closed: boolean;
  ranges: BusinessTimeRange[];
};

export type BusinessHours = BusinessDay[];

export const BUSINESS_DAYS = [
  "週一",
  "週二",
  "週三",
  "週四",
  "週五",
  "週六",
  "週日",
] as const;

export const createEmptyBusinessHours = (): BusinessHours =>
  BUSINESS_DAYS.map((day) => ({
    day,
    closed: false,
    ranges: [],
  }));

export const EMPTY_BUSINESS_HOURS = createEmptyBusinessHours();

const normalizeTime = (value: string) => {
  const [rawHour = "00", rawMinute = "00"] = String(value).split(":");
  const hour = Math.min(23, Math.max(0, Number(rawHour) || 0));
  const minute = Math.min(59, Math.max(0, Number(rawMinute) || 0));
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const timeToMinutes = (value: string) => {
  const [hour = "0", minute = "0"] = normalizeTime(value).split(":");
  return Number(hour) * 60 + Number(minute);
};

export const normalizeBusinessHours = (value?: BusinessHours): BusinessHours => {
  const fallback = createEmptyBusinessHours();
  if (!Array.isArray(value)) return fallback;

  return BUSINESS_DAYS.map((day) => {
    const found = value.find((item) => item?.day === day);
    if (!found) {
      return {
        day,
        closed: false,
        ranges: [],
      };
    }

    if (found.closed) {
      return {
        day,
        closed: true,
        ranges: [],
      };
    }

    const ranges = Array.isArray(found.ranges)
      ? found.ranges
          .map((range) => ({
            start: normalizeTime(range?.start ?? "00:00"),
            end: normalizeTime(range?.end ?? "00:00"),
          }))
          .filter((range) => range.start !== range.end)
          .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start))
      : [];

    return {
      day,
      closed: false,
      ranges,
    };
  });
};

export const hasInvalidBusinessHours = (value?: BusinessHours) => {
  const normalized = normalizeBusinessHours(value);

  return normalized.some((day) =>
    day.ranges.some(
      (range) => timeToMinutes(range.end) <= timeToMinutes(range.start)
    )
  );
};

export const formatBusinessHours = (value?: BusinessHours): string[] => {
  const normalized = normalizeBusinessHours(value);
  const hasContent = normalized.some(
    (day) => day.closed || day.ranges.length > 0
  );

  if (!hasContent) return [];

  return normalized
    .filter((day) => day.closed || day.ranges.length > 0)
    .map((day) => {
      if (day.closed) return `${day.day} 公休`;
      return `${day.day} ${day.ranges
        .map((range) => `${range.start}－${range.end}`)
        .join("、")}`;
    });
};
