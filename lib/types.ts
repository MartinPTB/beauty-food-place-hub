export type BeautyItem = {
  id: string;
  name: string;
  brand: string;
  function: string;
  price_text: string;
  price_level: string;
  area: string;
  type: string;
  skin: string;
  notes: string[];
  image_url: string | null;
};

export type FoodItem = {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  price_text: string;
  price_level: string;
  hours: string;
  style: string;
  notes: string[];
  image_url: string | null;
};

export type PlaceItem = {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  price_text: string;
  price_level: string;
  hours: string;
  category: string;
  notes: string[];
  image_url: string | null;
};