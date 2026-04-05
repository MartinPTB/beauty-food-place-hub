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
    brand: String(body.brand || "").trim(),
    function: String(body.function || "").trim(),
    price_text: String(body.price_text || "").trim(),
    price_level: String(body.price_level || "").trim(),
    area: String(body.area || "").trim(),
    type: String(body.type || "").trim(),
    skin: String(body.skin || "").trim(),
    notes: Array.isArray(body.notes) ? body.notes : [],
    image_url: body.image_url ? String(body.image_url) : null,
  };

  if (
    !payload.name ||
    !payload.brand ||
    !payload.function ||
    !payload.price_text ||
    !payload.price_level ||
    !payload.area ||
    !payload.type ||
    !payload.skin
  ) {
    return NextResponse.json({ error: "請把必填欄位填完整" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("beauty_items").insert(payload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}