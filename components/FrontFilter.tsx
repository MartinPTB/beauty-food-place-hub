"use client";

import { useMemo, useState } from "react";
import CityDistrictSelector from "@/components/CityDistrictSelector";

type Item = {
  id: string;
  name: string;
  city: string;
  district: string;
  address?: string;
};

type Props = {
  items: Item[];
};

export default function FrontFilter({ items }: Props) {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCity = !selectedCity || item.city === selectedCity;
      const matchDistrict = !selectedDistrict || item.district === selectedDistrict;
      return matchCity && matchDistrict;
    });
  }, [items, selectedCity, selectedDistrict]);

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <CityDistrictSelector
        city={selectedCity}
        district={selectedDistrict}
        onCityChange={(value) => {
          setSelectedCity(value);
          setSelectedDistrict("");
        }}
        onDistrictChange={setSelectedDistrict}
      />

      <div style={{ display: "grid", gap: 12 }}>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <p><strong>{item.name}</strong></p>
            <p>{item.city} {item.district}</p>
            {item.address && <p>{item.address}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}