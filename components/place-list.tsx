"use client";

import { FilterShell } from "@/components/filter-shell";
import { getDirectionsUrl, getViewMapUrl } from "@/lib/maps";
import { PlaceItem } from "@/lib/types";

export function PlaceList({ items }: { items: PlaceItem[] }) {
  return (
    <FilterShell
      title="景點"
      subtitle="依地區、價位、性質與開放時間整理景點資訊。"
      items={items}
      cityKey="city"
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
          <p className="mt-1 text-sm text-slate-500">
            {item.city}｜{item.district}
          </p>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>價位：{item.price_text}</p>
            <p>開放時間：{item.hours}</p>
            <p>性質：{item.category}</p>
            <p>地址：{item.address}</p>
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

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <a
              href={getViewMapUrl(item)}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-center text-sm font-medium"
            >
              查看地圖
            </a>
            <a
              href={getDirectionsUrl(item)}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-white"
            >
              規劃路線
            </a>
          </div>
        </article>
      )}
    />
  );
}