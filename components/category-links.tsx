import Link from "next/link";

const cards = [
  {
    href: "/beauty",
    title: "美妝",
    desc: "依功能、價位、品牌、使用部位快速整理與查找。",
  },
  {
    href: "/food",
    title: "美食地圖",
    desc: "依城市、區域、營業時間與風格整理可去的店家。",
  },
  {
    href: "/places",
    title: "景點",
    desc: "依地區、價位、類型與開放時間整理景點資訊。",
  },
];

export function CategoryLinks() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">{card.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{card.desc}</p>
        </Link>
      ))}
    </section>
  );
}