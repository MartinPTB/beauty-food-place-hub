import { PlaceList } from "@/components/place-list";
import { supabase } from "@/lib/supabase";
import { PlaceItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PlacesPage() {
  const { data, error } = await supabase
    .from("place_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        載入失敗：{error.message}
      </div>
    );
  }

  return <PlaceList items={(data ?? []) as PlaceItem[]} />;
}