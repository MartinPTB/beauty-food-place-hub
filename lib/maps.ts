type MapItem = {
  name?: string | null;
  address: string;
  google_maps_url?: string | null;
  google_place_id?: string | null;
};

export function createMapSearchUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function createMapDirectionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function getViewMapUrl(item: MapItem) {
  if (item.google_maps_url?.trim()) {
    return item.google_maps_url;
  }

  if (item.google_place_id?.trim()) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      item.name || item.address
    )}&query_place_id=${encodeURIComponent(item.google_place_id)}`;
  }

  return createMapSearchUrl(item.address);
}

export function getDirectionsUrl(item: MapItem) {
  if (item.google_place_id?.trim()) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      item.name || item.address
    )}&destination_place_id=${encodeURIComponent(item.google_place_id)}`;
  }

  return createMapDirectionsUrl(item.address);
}