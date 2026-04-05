import { BeautyList } from "@/components/beauty-list";
import { supabase } from "@/lib/supabase";
import { BeautyItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BeautyPage() {
  const { data, error } = await supabase
    .from("beauty_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        載入失敗：{error.message}
      </div>
    );
  }

  return <BeautyList items={(data ?? []) as BeautyItem[]} />;
}