"use client";

import { useMemo, useState, type ReactNode } from "react";

export type FilterableItem = Record<string, string | string[] | null> & {
  id: string;
};

type Props<T extends FilterableItem> = {
  title: string;
  subtitle: string;
  items: T[];
  cityKey?: keyof T;
  priceKey: keyof T;
  renderItem: (item: T) => ReactNode;
};

export function FilterShell<T extends FilterableItem>({
  title,
  subtitle,
  items,
  cityKey,
  priceKey,
  renderItem,
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("全部");
  const [selectedPrice, setSelectedPrice] = useState("全部");

  const cityOptions = useMemo(() => {
    if (!cityKey) return ["全部"];
    return [
      "全部",
      ...Array.from(new Set(items.map((item) => String(item[cityKey])))),
    ];
  }, [items, cityKey]);

  const priceOptions = useMemo(() => {
    return [
      "全部",
      ...Array.from(new Set(items.map((item) => String(item[priceKey])))),
    ];
  }, [items, priceKey]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const fullText = Object.values(item)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = fullText.includes(query.toLowerCase());
      const matchesCity =
        !cityKey ||
        selectedCity === "全部" ||
        String(item[cityKey]) === selectedCity;
      const matchesPrice =
        selectedPrice === "全部" || String(item[priceKey]) === selectedPrice;

      return matchesQuery && matchesCity && matchesPrice;
    });
  }, [items, query, cityKey, selectedCity, priceKey, selectedPrice]);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit space-y-4 rounded-3xl bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">搜尋</p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="輸入名稱、地區、標籤…"
            className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 outline-none"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">價位</p>
          <div className="flex flex-wrap gap-2">
            {priceOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedPrice(option)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  selectedPrice === option
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {cityKey && (
          <div className="space-y-2">
            <p className="text-sm font-medium">城市</p>
            <div className="flex flex-wrap gap-2">
              {cityOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedCity(option)}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    selectedCity === option
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map((item) => renderItem(item))
        ) : (
          <div className="rounded-3xl bg-white p-6 text-sm text-slate-500 shadow-sm">
            目前沒有符合條件的資料。
          </div>
        )}
      </section>
    </div>
  );
}