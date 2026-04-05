import { FoodList } from "@/components/food-list";
import { supabase } from "@/lib/supabase";
import { FoodItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function FoodPage() {
  const { data, error } = await supabase
    .from("food_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        載入失敗：{error.message}
      </div>
    );
  }

  return <FoodList items={(data ?? []) as FoodItem[]} />;
}