"use client";

import { CSSProperties, useMemo } from "react";

type BrandInputProps = {
  value: string;
  brands: string[];
  onChange: (value: string) => void;
  onAddBrand: (brand: string) => void;
  placeholder?: string;
};

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
  padding: "6px 12px",
  background: "#fff",
  cursor: "pointer",
  fontSize: 14,
};

const selectedChipStyle: CSSProperties = {
  ...chipStyle,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
};

const hintTextStyle: CSSProperties = {
  margin: 0,
  color: "#777",
  fontSize: 13,
};

export default function BrandInput({
  value,
  brands,
  onChange,
  onAddBrand,
  placeholder = "品牌",
}: BrandInputProps) {
  const trimmedValue = value.trim();

  const filteredBrands = useMemo(() => {
    if (!trimmedValue) return brands.slice(0, 20);

    return brands
      .filter((brand) =>
        brand.toLowerCase().includes(trimmedValue.toLowerCase())
      )
      .slice(0, 20);
  }, [brands, trimmedValue]);

  const exactMatch = brands.some(
    (brand) => brand.toLowerCase() === trimmedValue.toLowerCase()
  );

  const handleAddBrand = () => {
    const nextValue = trimmedValue;
    if (!nextValue) return;
    onAddBrand(nextValue);
    onChange(nextValue);
  };

  return (
    <div style={wrapperStyle}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />

      <p style={hintTextStyle}>
        直接打字可過濾品牌；有出現的品牌可直接點選，沒有的可新增。
      </p>

      {filteredBrands.length > 0 && (
        <div style={chipListStyle}>
          {filteredBrands.map((brand) => {
            const isSelected =
              brand.toLowerCase() === trimmedValue.toLowerCase() &&
              trimmedValue.length > 0;

            return (
              <button
                key={brand}
                type="button"
                style={isSelected ? selectedChipStyle : chipStyle}
                onClick={() => onChange(brand)}
              >
                {brand}
              </button>
            );
          })}
        </div>
      )}

      {trimmedValue && !exactMatch && (
        <div>
          <button type="button" style={chipStyle} onClick={handleAddBrand}>
            + 新增品牌「{trimmedValue}」
          </button>
        </div>
      )}
    </div>
  );
}
