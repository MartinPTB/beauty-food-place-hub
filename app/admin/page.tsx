"use client";

import { CSSProperties, useMemo, useState } from "react";
import BeautyPartSelector, {
  type BeautyPart,
} from "@/components/BeautyPartSelector";
import BrandInput from "@/components/BrandInput";
import BusinessHoursEditor from "@/components/BusinessHoursEditor";
import CityDistrictSelector from "@/components/CityDistrictSelector";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  BusinessHours,
  EMPTY_BUSINESS_HOURS,
  formatBusinessHours,
  normalizeBusinessHours,
} from "@/lib/businessHours";

type AdminTab = "password" | "beauty" | "place" | "shop";

type BeautyItem = {
  id: string;
  name: string;
  brand: string;
  shade?: string;
  parts?: BeautyPart[];
  note: string;
};

type PlaceItem = {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  businessHours?: BusinessHours;
};

type ShopItem = {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  businessHours?: BusinessHours;
};

const DEFAULT_BRANDS = [
  "1028",
  "3CE",
  "CLIO",
  "Dior",
  "ETUDE",
  "Fenty Beauty",
  "heme",
  "INTEGRATE",
  "KATE",
  "MAYBELLINE",
  "NARS",
  "rom&nd",
  "Solone",
];

const pageGridStyle: CSSProperties = {
  display: "grid",
  gap: 20,
};

const sectionCardStyle: CSSProperties = {
  border: "1px solid #d9d9d9",
  borderRadius: 14,
  padding: 20,
  background: "#fff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
};

const dataCardStyle: CSSProperties = {
  border: "1px solid #dcdcdc",
  borderRadius: 12,
  padding: 16,
  background: "#fafafa",
  display: "grid",
  gap: 6,
};

const tabButtonRowStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const listBlockStyle: CSSProperties = {
  display: "grid",
  gap: 12,
};

const fieldGroupStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const fieldLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  fontWeight: 600,
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("beauty");

  const [adminPassword, setAdminPassword] = useLocalStorage<string>(
    "adminPassword",
    ""
  );
  const [brands, setBrands] = useLocalStorage<string[]>(
    "beautyBrands",
    DEFAULT_BRANDS
  );
  const [beautyItems, setBeautyItems] = useLocalStorage<BeautyItem[]>(
    "beautyItems",
    []
  );
  const [placeItems, setPlaceItems] = useLocalStorage<PlaceItem[]>(
    "placeItems",
    []
  );
  const [shopItems, setShopItems] = useLocalStorage<ShopItem[]>(
    "shopItems",
    []
  );

  const [passwordInput, setPasswordInput] = useState(adminPassword);

  const [beautyForm, setBeautyForm] = useState({
    name: "",
    brand: "",
    shade: "",
    parts: [] as BeautyPart[],
    note: "",
  });

  const [placeForm, setPlaceForm] = useState({
    name: "",
    city: "",
    district: "",
    address: "",
    businessHours: EMPTY_BUSINESS_HOURS,
  });

  const [shopForm, setShopForm] = useState({
    name: "",
    city: "",
    district: "",
    address: "",
    businessHours: EMPTY_BUSINESS_HOURS,
  });

  const sortedBrands = useMemo(
    () => [...brands].sort((a, b) => a.localeCompare(b, "zh-Hant")),
    [brands]
  );

  const addBrandIfNeeded = (newBrand: string) => {
    const trimmed = newBrand.trim();
    if (!trimmed) return;

    const exists = brands.some(
      (brand) => brand.toLowerCase() === trimmed.toLowerCase()
    );

    if (!exists) {
      setBrands((prev) => [...prev, trimmed]);
    }
  };

  const savePassword = () => {
    setAdminPassword(passwordInput.trim());
    alert("密碼已儲存");
  };

  const saveBeauty = (e: React.FormEvent) => {
    e.preventDefault();

    if (!beautyForm.name || !beautyForm.brand) {
      alert("請完整填寫美妝資料");
      return;
    }

    addBrandIfNeeded(beautyForm.brand);

    const newItem: BeautyItem = {
      id: crypto.randomUUID(),
      name: beautyForm.name.trim(),
      brand: beautyForm.brand.trim(),
      shade: beautyForm.shade.trim(),
      parts: beautyForm.parts,
      note: beautyForm.note.trim(),
    };

    setBeautyItems((prev) => [newItem, ...prev]);
    setBeautyForm({
      name: "",
      brand: "",
      shade: "",
      parts: [],
      note: "",
    });

    alert("美妝資料已新增");
  };

  const savePlace = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !placeForm.name ||
      !placeForm.city ||
      !placeForm.district ||
      !placeForm.address
    ) {
      alert("請完整填寫地點資料");
      return;
    }

    const newItem: PlaceItem = {
      id: crypto.randomUUID(),
      name: placeForm.name.trim(),
      city: placeForm.city,
      district: placeForm.district,
      address: placeForm.address.trim(),
      businessHours: normalizeBusinessHours(placeForm.businessHours),
    };

    setPlaceItems((prev) => [newItem, ...prev]);
    setPlaceForm({
      name: "",
      city: "",
      district: "",
      address: "",
      businessHours: EMPTY_BUSINESS_HOURS,
    });

    alert("地點資料已新增");
  };

  const saveShop = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !shopForm.name ||
      !shopForm.city ||
      !shopForm.district ||
      !shopForm.address
    ) {
      alert("請完整填寫店家資料");
      return;
    }

    const newItem: ShopItem = {
      id: crypto.randomUUID(),
      name: shopForm.name.trim(),
      city: shopForm.city,
      district: shopForm.district,
      address: shopForm.address.trim(),
      businessHours: normalizeBusinessHours(shopForm.businessHours),
    };

    setShopItems((prev) => [newItem, ...prev]);
    setShopForm({
      name: "",
      city: "",
      district: "",
      address: "",
      businessHours: EMPTY_BUSINESS_HOURS,
    });

    alert("店家資料已新增");
  };

  const deleteBeauty = (id: string) => {
    setBeautyItems((prev) => prev.filter((item) => item.id !== id));
  };

  const deletePlace = (id: string) => {
    setPlaceItems((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteShop = (id: string) => {
    setShopItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <div style={pageGridStyle}>
        <h1 style={{ marginBottom: 0 }}>後台管理</h1>

        <section style={{ ...sectionCardStyle, display: "grid", gap: 16 }}>
          <div style={tabButtonRowStyle}>
            <button onClick={() => setActiveTab("password")}>儲存密碼</button>
            <button onClick={() => setActiveTab("beauty")}>新增美妝</button>
            <button onClick={() => setActiveTab("place")}>新增地點</button>
            <button onClick={() => setActiveTab("shop")}>新增店家</button>
          </div>
        </section>

        {activeTab === "password" && (
          <section style={{ ...sectionCardStyle, display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0 }}>儲存密碼</h2>
            <input
              type="text"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="請輸入後台密碼"
            />
            <button onClick={savePassword}>儲存密碼</button>
          </section>
        )}

        {activeTab === "beauty" && (
          <section style={{ ...sectionCardStyle, display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0 }}>新增美妝</h2>
            <form onSubmit={saveBeauty} style={{ display: "grid", gap: 12 }}>
              <input
                value={beautyForm.name}
                onChange={(e) =>
                  setBeautyForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="美妝名稱"
              />

              <div style={fieldGroupStyle}>
                <p style={fieldLabelStyle}>品牌</p>
                <BrandInput
                  value={beautyForm.brand}
                  brands={sortedBrands}
                  onChange={(value) =>
                    setBeautyForm((prev) => ({ ...prev, brand: value }))
                  }
                  onAddBrand={addBrandIfNeeded}
                  placeholder="請輸入或選擇品牌"
                />
              </div>

              <div style={fieldGroupStyle}>
                <p style={fieldLabelStyle}>色號</p>
                <input
                  value={beautyForm.shade}
                  onChange={(e) =>
                    setBeautyForm((prev) => ({
                      ...prev,
                      shade: e.target.value,
                    }))
                  }
                  placeholder="可直接輸入色號，例如 N21、#05、BR401"
                />
              </div>

              <div style={fieldGroupStyle}>
                <p style={fieldLabelStyle}>使用部位</p>
                <BeautyPartSelector
                  value={beautyForm.parts}
                  onChange={(value) =>
                    setBeautyForm((prev) => ({ ...prev, parts: value }))
                  }
                />
              </div>

              <input
                value={beautyForm.note}
                onChange={(e) =>
                  setBeautyForm((prev) => ({
                    ...prev,
                    note: e.target.value,
                  }))
                }
                placeholder="備註（可選）"
              />

              <button type="submit">儲存美妝資料</button>
            </form>
          </section>
        )}

        {activeTab === "place" && (
          <section style={{ ...sectionCardStyle, display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0 }}>新增地點</h2>
            <form onSubmit={savePlace} style={{ display: "grid", gap: 12 }}>
              <input
                value={placeForm.name}
                onChange={(e) =>
                  setPlaceForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="地點名稱"
              />

              <CityDistrictSelector
                city={placeForm.city}
                district={placeForm.district}
                onCityChange={(value) =>
                  setPlaceForm((prev) => ({
                    ...prev,
                    city: value,
                    district: "",
                  }))
                }
                onDistrictChange={(value) =>
                  setPlaceForm((prev) => ({ ...prev, district: value }))
                }
              />

              <input
                value={placeForm.address}
                onChange={(e) =>
                  setPlaceForm((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="地址"
              />

              <BusinessHoursEditor
                value={placeForm.businessHours}
                onChange={(value) =>
                  setPlaceForm((prev) => ({
                    ...prev,
                    businessHours: value,
                  }))
                }
              />

              <button type="submit">儲存地點資料</button>
            </form>
          </section>
        )}

        {activeTab === "shop" && (
          <section style={{ ...sectionCardStyle, display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0 }}>新增店家</h2>
            <form onSubmit={saveShop} style={{ display: "grid", gap: 12 }}>
              <input
                value={shopForm.name}
                onChange={(e) =>
                  setShopForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="店家名稱"
              />

              <CityDistrictSelector
                city={shopForm.city}
                district={shopForm.district}
                onCityChange={(value) =>
                  setShopForm((prev) => ({
                    ...prev,
                    city: value,
                    district: "",
                  }))
                }
                onDistrictChange={(value) =>
                  setShopForm((prev) => ({ ...prev, district: value }))
                }
              />

              <input
                value={shopForm.address}
                onChange={(e) =>
                  setShopForm((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="地址"
              />

              <BusinessHoursEditor
                value={shopForm.businessHours}
                onChange={(value) =>
                  setShopForm((prev) => ({
                    ...prev,
                    businessHours: value,
                  }))
                }
              />

              <button type="submit">儲存店家資料</button>
            </form>
          </section>
        )}

        <section style={{ ...sectionCardStyle, display: "grid", gap: 24 }}>
          <h2 style={{ margin: 0 }}>目前資料</h2>

          <div style={listBlockStyle}>
            <h3 style={{ margin: 0 }}>美妝資料</h3>
            {beautyItems.length === 0 ? (
              <p style={{ margin: 0 }}>目前沒有美妝資料</p>
            ) : (
              beautyItems.map((item) => (
                <div key={item.id} style={dataCardStyle}>
                  <p style={{ margin: 0 }}>
                    <strong>{item.name}</strong>
                  </p>
                  <p style={{ margin: 0 }}>品牌：{item.brand}</p>
                  <p style={{ margin: 0 }}>色號：{item.shade?.trim() || "—"}</p>
                  <p style={{ margin: 0 }}>
                    使用部位：
                    {item.parts && item.parts.length > 0
                      ? item.parts.join("、")
                      : "—"}
                  </p>
                  <p style={{ margin: 0 }}>備註：{item.note || "—"}</p>
                  <div>
                    <button onClick={() => deleteBeauty(item.id)}>刪除</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={listBlockStyle}>
            <h3 style={{ margin: 0 }}>地點資料</h3>
            {placeItems.length === 0 ? (
              <p style={{ margin: 0 }}>目前沒有地點資料</p>
            ) : (
              placeItems.map((item) => (
                <div key={item.id} style={dataCardStyle}>
                  <p style={{ margin: 0 }}>
                    <strong>{item.name}</strong>
                  </p>
                  <p style={{ margin: 0 }}>
                    地區：{item.city} {item.district}
                  </p>
                  <p style={{ margin: 0 }}>地址：{item.address}</p>

                  <div>
                    <strong>營業時間：</strong>
                    {formatBusinessHours(item.businessHours).length > 0 ? (
                      <div style={{ marginTop: 6 }}>
                        {formatBusinessHours(item.businessHours).map((line) => (
                          <p key={line} style={{ margin: "4px 0" }}>
                            {line}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <span> 未填寫</span>
                    )}
                  </div>

                  <div>
                    <button onClick={() => deletePlace(item.id)}>刪除</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={listBlockStyle}>
            <h3 style={{ margin: 0 }}>店家資料</h3>
            {shopItems.length === 0 ? (
              <p style={{ margin: 0 }}>目前沒有店家資料</p>
            ) : (
              shopItems.map((item) => (
                <div key={item.id} style={dataCardStyle}>
                  <p style={{ margin: 0 }}>
                    <strong>{item.name}</strong>
                  </p>
                  <p style={{ margin: 0 }}>
                    地區：{item.city} {item.district}
                  </p>
                  <p style={{ margin: 0 }}>地址：{item.address}</p>

                  <div>
                    <strong>營業時間：</strong>
                    {formatBusinessHours(item.businessHours).length > 0 ? (
                      <div style={{ marginTop: 6 }}>
                        {formatBusinessHours(item.businessHours).map((line) => (
                          <p key={line} style={{ margin: "4px 0" }}>
                            {line}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <span> 未填寫</span>
                    )}
                  </div>

                  <div>
                    <button onClick={() => deleteShop(item.id)}>刪除</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
