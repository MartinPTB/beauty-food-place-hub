import Link from "next/link";

const links = [
  { href: "/", label: "首頁" },
  { href: "/beauty", label: "美妝" },
  { href: "/food", label: "美食地圖" },
  { href: "/places", label: "景點" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Beauty / Food / Places Hub
        </Link>
        <nav className="flex gap-5 text-sm text-slate-600">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}