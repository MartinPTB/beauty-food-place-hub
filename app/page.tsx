"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./home-page.module.css";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "美妝保養", href: "/beauty" },
  { label: "服飾品牌", href: "/brands" },
  { label: "美食地圖", href: "/food-map" },
  { label: "景點收藏", href: "/favorites" },
];

function FloatingHeader({ visible }: { visible: boolean }) {
  return (
    <header
      className={`${styles.header} ${visible ? styles.headerVisible : styles.headerHidden}`}
    >
      <div className={styles.headerInner}>
        <button
          type="button"
          className={styles.brandButton}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          My Everyday Life Collection
        </button>

        <nav className={styles.headerNav} aria-label="首頁導覽">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} className={styles.headerLink}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function DestinationCard() {
  return (
    <div className={styles.destinationCard}>
      {NAV_ITEMS.map((item) => (
        <Link key={item.label} href={item.href} className={styles.destinationButton}>
          <span className={styles.destinationLabel}>{item.label}</span>
          <span className={styles.destinationArrow} aria-hidden="true">
            →
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = Math.max(window.innerHeight * 0.72, 320);
      setShowHeader(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className={styles.page}>
      <FloatingHeader visible={showHeader} />

      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>My Everyday Life Collection</h1>
          <p className={styles.heroSubtitle}>by Amino</p>
          <button
            type="button"
            className={styles.scrollHint}
            onClick={() => {
              const element = document.getElementById("destination-section");
              element?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            往下探索
          </button>
        </div>
      </section>

      <section id="destination-section" className={styles.destinationSection}>
        <div className={styles.destinationInner}>
          <div className={styles.destinationIntro}>
            <p className={styles.eyebrow}>My Everyday Life Collection</p>
            <h2 className={styles.destinationTitle}>
              Choose
              <br />
              Your
              <br />
              Destination
            </h2>
          </div>

          <DestinationCard />
        </div>
      </section>
    </main>
  );
}
