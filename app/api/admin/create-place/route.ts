import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  if (!isValidAdminKey(request)) {
    return NextResponse.json({ error: "管理密碼錯誤" }, { status: 401 });
  }

  const body = await request.json();

  const payload = {
    name: String(body.name || "").trim(),
    city: String(body.city || "").trim(),
    district: String(body.district || "").trim(),
    address: String(body.address || "").trim(),
    price_text: String(body.price_text || "").trim(),
    price_level: String(body.price_level || "").trim(),
    hours: String(body.hours || "").trim(),
    category: String(body.category || "").trim(),
    notes: Array.isArray(body.notes) ? body.notes : [],
    image_url: body.image_url ? String(body.image_url) : null,
    google_maps_url: body.google_maps_url
      ? String(body.google_maps_url).trim()
      : null,
    google_place_id: body.google_place_id
      ? String(body.google_place_id).trim()
      : null,
  };

  if (
    !payload.name ||
    !payload.city ||
    !payload.district ||
    !payload.address ||
    !payload.price_text ||
    !payload.price_level ||
    !payload.hours ||
    !payload.category
  ) {
    return NextResponse.json({ error: "請把必填欄位填完整" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("place_items").insert(payload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}