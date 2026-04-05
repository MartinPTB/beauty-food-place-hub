"use client";

import { FilterShell } from "@/components/filter-shell";
import { BeautyItem } from "@/lib/types";

export function BeautyList({ items }: { items: BeautyItem[] }) {
  return (
    <FilterShell
      title="美妝"
      subtitle="依品牌、功能、價位與使用部位快速查找。"
      items={items}
      priceKey="price_level"
      renderItem={(item) => (
        <article key={item.id} className="rounded-3xl bg-white p-5 shadow-sm">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="mb-4 h-40 w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="mb-4 h-40 rounded-2xl bg-slate-100" />
          )}

          <h2 className="text-lg font-semibold">{item.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{item.brand}</p>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>功能：{item.function}</p>
            <p>價位：{item.price_text}</p>
            <p>類型：{item.type}</p>
            <p>使用部位：{item.area}</p>
            <p>適合膚質：{item.skin}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {item.notes.map((note) => (
              <span
                key={note}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
              >
                {note}
              </span>
            ))}
          </div>
        </article>
      )}
    />
  );
}