import { CategoryLinks } from "@/components/category-links";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm md:p-12">
        <p className="mb-3 text-sm font-medium text-slate-500">
          生活資料整理平台
        </p>
        <h1 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
          把美妝、美食地圖與景點，
          <br className="hidden md:block" />
          整理成一個可持續更新、可快速搜尋、可直接導航的網站
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
          第一版先聚焦在穩定上線與持續更新。你可以直接在 Supabase
          後台新增資料，網站會自動同步顯示。
        </p>
      </section>

      <CategoryLinks />
    </div>
  );
}