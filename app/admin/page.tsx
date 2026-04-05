"use client";

import { useEffect, useState } from "react";

type BeautyForm = {
  name: string;
  brand: string;
  function: string;
  price_text: string;
  price_level: string;
  area: string;
  type: string;
  skin: string;
  notesText: string;
};

type FoodForm = {
  name: string;
  city: string;
  district: string;
  address: string;
  price_text: string;
  price_level: string;
  hours: string;
  style: string;
  notesText: string;
  google_maps_url: string;
  google_place_id: string;
};

type PlaceForm = {
  name: string;
  city: string;
  district: string;
  address: string;
  price_text: string;
  price_level: string;
  hours: string;
  category: string;
  notesText: string;
  google_maps_url: string;
  google_place_id: string;
};

const inputClass =
  "w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none";
const sectionClass = "rounded-3xl bg-white p-6 shadow-sm space-y-4";

const initialBeauty: BeautyForm = {
  name: "",
  brand: "",
  function: "",
  price_text: "",
  price_level: "",
  area: "",
  type: "",
  skin: "",
  notesText: "",
};

const initialFood: FoodForm = {
  name: "",
  city: "",
  district: "",
  address: "",
  price_text: "",
  price_level: "",
  hours: "",
  style: "",
  notesText: "",
  google_maps_url: "",
  google_place_id: "",
};

const initialPlace: PlaceForm = {
  name: "",
  city: "",
  district: "",
  address: "",
  price_text: "",
  price_level: "",
  hours: "",
  category: "",
  notesText: "",
  google_maps_url: "",
  google_place_id: "",
};

function parseNotes(text: string) {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [beauty, setBeauty] = useState<BeautyForm>(initialBeauty);
  const [food, setFood] = useState<FoodForm>(initialFood);
  const [place, setPlace] = useState<PlaceForm>(initialPlace);

  const [beautyFile, setBeautyFile] = useState<File | null>(null);
  const [foodFile, setFoodFile] = useState<File | null>(null);
  const [placeFile, setPlaceFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("adminKey");
    if (saved) setAdminKey(saved);
  }, []);

  function saveAdminKey() {
    localStorage.setItem("adminKey", adminKey);
    setMessage("管理密碼已暫存在此瀏覽器。");
  }

  async function uploadImage(file: File, folder: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: {
        "x-admin-key": adminKey,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "圖片上傳失敗");
    }

    return data.publicUrl as string;
  }

  async function createBeauty() {
    setLoading("beauty");
    setMessage("");

    try {
      let image_url: string | null = null;

      if (beautyFile) {
        image_url = await uploadImage(beautyFile, "beauty");
      }

      const res = await fetch("/api/admin/create-beauty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          ...beauty,
          notes: parseNotes(beauty.notesText),
          image_url,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "新增失敗");
      }

      setBeauty(initialBeauty);
      setBeautyFile(null);
      setMessage("美妝產品新增成功。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "新增失敗");
    } finally {
      setLoading("");
    }
  }

  async function createFood() {
    setLoading("food");
    setMessage("");

    try {
      let image_url: string | null = null;

      if (foodFile) {
        image_url = await uploadImage(foodFile, "food");
      }

      const res = await fetch("/api/admin/create-food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          ...food,
          notes: parseNotes(food.notesText),
          image_url,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "新增失敗");
      }

      setFood(initialFood);
      setFoodFile(null);
      setMessage("店家新增成功。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "新增失敗");
    } finally {
      setLoading("");
    }
  }

  async function createPlace() {
    setLoading("place");
    setMessage("");

    try {
      let image_url: string | null = null;

      if (placeFile) {
        image_url = await uploadImage(placeFile, "places");
      }

      const res = await fetch("/api/admin/create-place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          ...place,
          notes: parseNotes(place.notesText),
          image_url,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "新增失敗");
      }

      setPlace(initialPlace);
      setPlaceFile(null);
      setMessage("景點新增成功。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "新增失敗");
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">管理頁 / Admin</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          這是 A 版：用管理密碼做簡易保護。之後可以再升級成正式登入。
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="輸入管理密碼"
            className={inputClass}
          />
          <button
            onClick={saveAdminKey}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-white"
          >
            儲存管理密碼
          </button>
        </div>

        {message && (
          <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            {message}
          </p>
        )}
      </section>

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold">新增美妝產品</h2>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className={inputClass}
            placeholder="產品名稱"
            value={beauty.name}
            onChange={(e) => setBeauty({ ...beauty, name: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="品牌"
            value={beauty.brand}
            onChange={(e) => setBeauty({ ...beauty, brand: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="功能，例如保濕修護"
            value={beauty.function}
            onChange={(e) => setBeauty({ ...beauty, function: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="價位文字，例如 NT$780"
            value={beauty.price_text}
            onChange={(e) =>
              setBeauty({ ...beauty, price_text: e.target.value })
            }
          />
          <input
            className={inputClass}
            placeholder="價位分級，例如 平價 / 中價位"
            value={beauty.price_level}
            onChange={(e) =>
              setBeauty({ ...beauty, price_level: e.target.value })
            }
          />
          <input
            className={inputClass}
            placeholder="使用部位，例如 臉部"
            value={beauty.area}
            onChange={(e) => setBeauty({ ...beauty, area: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="類型，例如 精華液"
            value={beauty.type}
            onChange={(e) => setBeauty({ ...beauty, type: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="適合膚質，例如 敏感肌"
            value={beauty.skin}
            onChange={(e) => setBeauty({ ...beauty, skin: e.target.value })}
          />
        </div>

        <textarea
          className={`${inputClass} min-h-[110px]`}
          placeholder="標籤，用逗號分隔，例如 清爽, 低刺激, 回購高"
          value={beauty.notesText}
          onChange={(e) => setBeauty({ ...beauty, notesText: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBeautyFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={createBeauty}
          disabled={!adminKey || loading === "beauty"}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-white disabled:opacity-50"
        >
          {loading === "beauty" ? "新增中..." : "新增美妝產品"}
        </button>
      </section>

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold">新增店家</h2>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className={inputClass}
            placeholder="店名"
            value={food.name}
            onChange={(e) => setFood({ ...food, name: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="城市"
            value={food.city}
            onChange={(e) => setFood({ ...food, city: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="地區"
            value={food.district}
            onChange={(e) => setFood({ ...food, district: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="地址"
            value={food.address}
            onChange={(e) => setFood({ ...food, address: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="價位文字，例如 NT$250–450"
            value={food.price_text}
            onChange={(e) =>
              setFood({ ...food, price_text: e.target.value })
            }
          />
          <input
            className={inputClass}
            placeholder="價位分級，例如 平價 / 中價位"
            value={food.price_level}
            onChange={(e) =>
              setFood({ ...food, price_level: e.target.value })
            }
          />
          <input
            className={inputClass}
            placeholder="營業時間"
            value={food.hours}
            onChange={(e) => setFood({ ...food, hours: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="風格，例如 日式定食"
            value={food.style}
            onChange={(e) => setFood({ ...food, style: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="Google Maps 分享連結（建議填）"
            value={food.google_maps_url}
            onChange={(e) =>
              setFood({ ...food, google_maps_url: e.target.value })
            }
          />
          <input
            className={inputClass}
            placeholder="Google Place ID（可選，但最穩）"
            value={food.google_place_id}
            onChange={(e) =>
              setFood({ ...food, google_place_id: e.target.value })
            }
          />
        </div>

        <textarea
          className={`${inputClass} min-h-[110px]`}
          placeholder="標籤，用逗號分隔，例如 適合聚餐, 可訂位, 晚餐熱門"
          value={food.notesText}
          onChange={(e) => setFood({ ...food, notesText: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFoodFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={createFood}
          disabled={!adminKey || loading === "food"}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-white disabled:opacity-50"
        >
          {loading === "food" ? "新增中..." : "新增店家"}
        </button>
      </section>

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold">新增景點</h2>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className={inputClass}
            placeholder="景點名稱"
            value={place.name}
            onChange={(e) => setPlace({ ...place, name: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="城市"
            value={place.city}
            onChange={(e) => setPlace({ ...place, city: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="地區"
            value={place.district}
            onChange={(e) => setPlace({ ...place, district: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="地址"
            value={place.address}
            onChange={(e) => setPlace({ ...place, address: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="價位文字，例如 免費 / NT$120"
            value={place.price_text}
            onChange={(e) =>
              setPlace({ ...place, price_text: e.target.value })
            }
          />
          <input
            className={inputClass}
            placeholder="價位分級，例如 免費 / 低價位"
            value={place.price_level}
            onChange={(e) =>
              setPlace({ ...place, price_level: e.target.value })
            }
          />
          <input
            className={inputClass}
            placeholder="開放時間"
            value={place.hours}
            onChange={(e) => setPlace({ ...place, hours: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="性質，例如 博物館 / 步道"
            value={place.category}
            onChange={(e) => setPlace({ ...place, category: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="Google Maps 分享連結（建議填）"
            value={place.google_maps_url}
            onChange={(e) =>
              setPlace({ ...place, google_maps_url: e.target.value })
            }
          />
          <input
            className={inputClass}
            placeholder="Google Place ID（可選，但最穩）"
            value={place.google_place_id}
            onChange={(e) =>
              setPlace({ ...place, google_place_id: e.target.value })
            }
          />
        </div>

        <textarea
          className={`${inputClass} min-h-[110px]`}
          placeholder="標籤，用逗號分隔，例如 室內, 雨天可去, 展覽型"
          value={place.notesText}
          onChange={(e) => setPlace({ ...place, notesText: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPlaceFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={createPlace}
          disabled={!adminKey || loading === "place"}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-white disabled:opacity-50"
        >
          {loading === "place" ? "新增中..." : "新增景點"}
        </button>
      </section>
    </div>
  );
}