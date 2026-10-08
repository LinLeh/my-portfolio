import Image from "next/image";
import profilePhoto from "../../public/profile.jpg";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import CopyEmail from "@/components/CopyEmail";
import CertificateGallery from "@/components/Certificates";
import Link from "next/link";
import { getProjectAssets } from "@/lib/projectFiles";
import {
  certificates,
  education,
  languages,
  profile,
  projects,
  skillGroups,
  stats,
} from "@/data/resume";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="relative flex-1 overflow-x-clip">
        <About />
        <Projects />
        <Skills />
        <Education />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

/* ---------- Shared ---------- */

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: React.ReactNode; intro?: string }) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">{title}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
    </Reveal>
  );
}

/* ---------- About (intro, profile and key figures) ---------- */

/* Icons for the key-figure cards, keyed by position in `stats` */
const STAT_ICONS = [
  // Projects: folder
  <path key="p" d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  // Core tools: stacked layers
  <path key="t" d="M12 2 2 7l10 5 10-5zM2 12l10 5 10-5M2 17l10 5 10-5" />,
  // GPA: graduation cap
  <path key="g" d="M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />,
  // Certificates: badge
  <path key="b" d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 14 7 21l5-3 5 3-1.5-7" />,
];

function About() {
  const details: { label: string; value: string; href?: string }[] = [
    { label: "Based in", value: profile.location },
    { label: "Education", value: "B.Sc. Information Technology, Assumption University" },
    { label: "Concentration", value: education.concentration },
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  ];

  return (
    <section id="about" className="relative isolate pt-28 pb-20 sm:pt-36 sm:pb-24">
      {/* Anchor for the logo link at the very top of the page */}
      <span id="top" aria-hidden="true" className="absolute top-0" />
      {/* Same blush texture and glow used across the site */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 h-[360px] w-[420px] rounded-full bg-accent-2/10 blur-[110px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
          {/* Photo */}
          <Reveal className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
            <div className="overflow-hidden rounded-[1.75rem] border-[6px] border-surface bg-soft shadow-2xl shadow-accent/20 ring-1 ring-accent/15">
              <Image
                src={profilePhoto}
                alt={`Portrait of ${profile.name}`}
                placeholder="blur"
                priority
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 384px, 320px"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
          </Reveal>

          {/* Intro */}
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">01 &middot; About</p>
                <span aria-hidden="true" className="h-3 w-px bg-line" />
                <p className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
                  {profile.availability}
                </p>
              </div>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl">
                {profile.name}
              </h1>
              <p className="mt-2 text-lg font-medium text-accent sm:text-xl">
                {profile.role} &middot; {profile.focus}
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-muted">
              {profile.about.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </Reveal>

            <Reveal delay={180}>
              <dl className="card mt-8 grid max-w-2xl gap-x-8 gap-y-5 p-6 sm:grid-cols-2">
                {details.map((d) => (
                  <div key={d.label}>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted">{d.label}</dt>
                    <dd className="mt-1 text-sm text-foreground">
                      {d.href ? (
                        <a href={d.href} className="transition hover:text-accent">
                          {d.value}
                        </a>
                      ) : (
                        d.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={240} className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-[#c026d3] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accent/25 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View projects <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center rounded-full border border-line bg-surface px-6 py-3 text-sm font-medium text-foreground transition hover:border-accent/40 hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Contact me
              </a>
            </Reveal>
          </div>
        </div>

        {/* Key figures */}
        <Reveal delay={120}>
          <dl className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="card flex items-start gap-4 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40"
              >
                <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {STAT_ICONS[i]}
                  </svg>
                </span>
                {/* Visually: value above label; DOM keeps dt before dd */}
                <div className="flex min-w-0 flex-col-reverse">
                  <dt className="text-sm leading-snug text-muted">{s.label}</dt>
                  <dd className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{s.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Projects ---------- */

async function Projects() {
  const assets = await Promise.all(projects.map((p) => getProjectAssets(p.slug)));
  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="02 · Selected work"
          title="Projects that turn data into answers."
          intro="End-to-end work covering data cleaning, modeling, analysis and dashboard design, plus a full-stack senior project."
        />
        <ul className="grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal as="li" key={p.title} delay={(i % 2) * 80}>
              <article className="card group relative flex h-full flex-col overflow-hidden p-6 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10">
                {/* Thin accent line that grows on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-2 transition-transform duration-500 group-hover:scale-x-100"
                />

                <header className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="h-3 w-px bg-line" />
                    <p className="text-xs font-medium uppercase tracking-wider text-muted">{p.category}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:rotate-45">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                </header>

                <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                  {/* Stretched link: the whole card is clickable */}
                  <Link
                    href={`/projects/${p.slug}`}
                    className="after:absolute after:inset-0 after:rounded-[0.875rem] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent"
                  >
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{p.description}</p>

                <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label="Technologies">
                  {p.tech.map((t) => (
                    <li key={t} className="rounded-md bg-soft px-2 py-0.5 font-mono text-[11px] text-foreground/70">
                      {t}
                    </li>
                  ))}
                </ul>

                {assets[i].summary.length > 0 && (
                  <p className="mt-4 truncate border-t border-line pt-3 text-xs text-muted">
                    {assets[i].summary.join(" · ")}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Skills ---------- */

function Skills() {
  return (
    <section id="skills" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="03 · Toolkit"
          title="Skills across the analytics stack."
          intro="From querying and cleaning to modeling and storytelling with dashboards."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title} delay={(i % 3) * 80} className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{g.title}</h3>
                <span className="font-mono text-xs text-muted">{String(g.items.length).padStart(2, "0")}</span>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li
                    key={s}
                    className="rounded-lg border border-line bg-soft px-3 py-1.5 text-sm text-foreground/85 transition hover:border-accent/40 hover:text-foreground"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Education and languages ---------- */

function Education() {
  return (
    <section id="education" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="04 · Background" title="Education & languages." />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="card p-8">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">
              {education.school} · {education.location}
            </p>
            <h3 className="mt-3 font-display text-3xl tracking-tight">{education.degree}</h3>
            <p className="mt-2 text-muted">
              Major concentration: <span className="text-foreground">{education.concentration}</span>
            </p>

            <div className="mt-6 inline-flex items-baseline gap-2 rounded-lg border border-line bg-soft px-4 py-2">
              <span className="text-sm text-muted">GPA</span>
              <span className="font-mono text-foreground">{education.gpa}</span>
            </div>

            <ol className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
              {education.timeline.map((t, i) => (
                <li key={t.label} className="relative">
                  <span
                    aria-hidden="true"
                    className={`mb-3 block size-2.5 rounded-full ${i === 1 ? "bg-emerald-400" : "bg-accent"}`}
                  />
                  <div className="text-sm text-muted">{t.label}</div>
                  <div className="mt-1 font-medium">{t.date}</div>
                </li>
              ))}
            </ol>
          </Reveal>

          <div className="grid gap-6">
            <Reveal delay={100} className="card p-8">
              <h3 className="font-medium">Languages</h3>
              <ul className="mt-5 space-y-4">
                {languages.map((l) => (
                  <li key={l.name}>
                    <div className="flex justify-between text-sm">
                      <span>{l.name}</span>
                      <span className="text-muted">{l.level}</span>
                    </div>
                    <div
                      className="mt-2 flex gap-1"
                      role="img"
                      aria-label={`${l.name} proficiency ${l.score} out of 5`}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${i < l.score ? "bg-gradient-to-r from-accent to-accent-2" : "bg-soft-2"}`}
                        />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Certificates ---------- */

function Certificates() {
  return (
    <section id="certificates" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="05 · Certificates"
          title="Verified credentials."
          intro={`${certificates.length} certificates from Google, IBM and DeepLearning.AI. Click a certificate to enlarge it or verify it on Coursera.`}
        />
        <Reveal delay={80}>
          <CertificateGallery items={certificates} />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */

/* Contact methods shown as cards on the right of the contact panel */
const CONTACT_METHODS: { label: string; value: string; href?: string; icon: React.ReactNode }[] = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5zM3.5 6l8.5 7 8.5-7" />,
  },
  {
    label: "Phone",
    value: profile.phoneDisplay,
    href: `tel:${profile.phoneIntl}`,
    icon: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  },
  {
    label: "Location",
    value: profile.location,
    icon: <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  },
  {
    label: "Availability",
    value: profile.availability,
    icon: <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 10h16M8 3v4M16 3v4M9 15l2 2 4-4" />,
  },
];

function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="card overflow-hidden p-2">
          <div className="grid gap-2 lg:grid-cols-[1.15fr_1fr]">
            {/* Message + primary actions */}
            <div className="relative isolate overflow-hidden rounded-xl bg-gradient-to-br from-soft via-surface-2 to-surface px-6 py-12 sm:px-10 sm:py-14">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-grid" />
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-[90px]" />
                <div className="absolute -right-20 -bottom-28 h-72 w-72 rounded-full bg-accent-2/15 blur-[90px]" />
              </div>

              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">06 · Contact</p>
              <h2 className="mt-4 max-w-xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                Let&apos;s turn your data into <em className="text-gradient">clear decisions</em>.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                I&apos;m looking for junior data analyst and BI roles where I can clean, model and visualize data that
                helps teams act. If you have a role or project in mind, I&apos;d be glad to hear about it.
              </p>

              <ul className="mt-7 flex flex-wrap gap-2" aria-label="Roles I'm open to">
                {["Data Analyst", "BI Analyst", "Reporting & Dashboards"].map((r) => (
                  <li
                    key={r}
                    className="rounded-full border border-line bg-surface/80 px-3 py-1 text-xs font-medium text-foreground/80"
                  >
                    {r}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-[#c026d3] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accent/25 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Send me an email <span aria-hidden="true">&rarr;</span>
                </a>
                <CopyEmail email={profile.email} />
              </div>
            </div>

            {/* Contact details */}
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {CONTACT_METHODS.map((m) => {
                const body = (
                  <>
                    <span
                      aria-hidden="true"
                      className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-white"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {m.icon}
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium uppercase tracking-wider text-muted">{m.label}</span>
                      <span className="mt-0.5 block break-words text-sm font-medium text-foreground">{m.value}</span>
                    </span>
                    {m.href && (
                      <span
                        aria-hidden="true"
                        className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition group-hover:border-accent group-hover:text-accent"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7M8 7h9v9" />
                        </svg>
                      </span>
                    )}
                  </>
                );
                const base = "flex h-full items-center gap-4 rounded-xl border border-line bg-surface px-5 py-5";
                return (
                  <li key={m.label}>
                    {m.href ? (
                      <a
                        href={m.href}
                        className={`group ${base} transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md hover:shadow-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
                      >
                        {body}
                      </a>
                    ) : (
                      <div className={base}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>{profile.location}</p>
      </div>
    </footer>
  );
}
