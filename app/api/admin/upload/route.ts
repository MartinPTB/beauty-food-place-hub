import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isValidAdminKey(request)) {
    return NextResponse.json({ error: "管理密碼錯誤" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") || "misc");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "沒有收到圖片檔案" }, { status: 400 });
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const safeExt = ext || "jpg";
  const filePath = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${safeExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from("catalog-images")
    .upload(filePath, fileBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage
    .from("catalog-images")
    .getPublicUrl(filePath);

  return NextResponse.json({
    success: true,
    path: filePath,
    publicUrl: data.publicUrl,
  });
}