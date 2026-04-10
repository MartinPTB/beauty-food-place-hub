"use client";

import { TAIWAN_CITIES, TAIWAN_DISTRICTS } from "@/data/taiwanDistricts";

type Props = {
  city: string;
  district: string;
  onCityChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
};

export default function CityDistrictSelector({
  city,
  district,
  onCityChange,
  onDistrictChange,
}: Props) {
  const districts = city ? TAIWAN_DISTRICTS[city] ?? [] : [];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <select
        value={city}
        onChange={(e) => {
          onCityChange(e.target.value);
          onDistrictChange("");
        }}
      >
        <option value="">請選擇縣市</option>
        {TAIWAN_CITIES.map((cityName) => (
          <option key={cityName} value={cityName}>
            {cityName}
          </option>
        ))}
      </select>

      <select
        value={district}
        onChange={(e) => onDistrictChange(e.target.value)}
        disabled={!city}
      >
        <option value="">{city ? "請選擇區域" : "請先選縣市"}</option>
        {districts.map((districtName) => (
          <option key={districtName} value={districtName}>
            {districtName}
          </option>
        ))}
      </select>
    </div>
  );
}