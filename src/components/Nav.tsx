"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// "/#id" links work from the home page (scroll) and from project pages (navigate home)
const links = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/#education", label: "Education" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Highlight the nav link of the section currently in view
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`/#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach(({ href }) => {
      const el = document.getElementById(href.slice(2));
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-background/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/#top" className="group flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-md bg-accent text-xs font-semibold text-white">
            LN
          </span>
          <span className="hidden sm:inline">Lin Leh</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active === l.href ? "true" : undefined}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active === l.href ? "bg-soft-2 font-medium text-accent" : "text-muted hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <a
          href="mailto:linlehshweyie@gmail.com"
          className="hidden rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[#be185d] md:inline-flex"
        >
          Hire me
        </a>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-9 place-items-center rounded-lg border border-line md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="mx-auto flex max-w-6xl flex-col gap-1 px-6 pb-6 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-muted hover:bg-soft hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
