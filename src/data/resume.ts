// Single source of truth for portfolio content. Edit here to update the site.

export const profile = {
  name: "Lin Leh Shwe Yie Nyein",
  shortName: "Lin Leh",
  initials: "LN",
  role: "Junior Data Analyst",
  focus: "BI & Analytics",
  location: "Bang Bo, Samut Prakan, Thailand",
  email: "linlehshweyie@gmail.com",
  phone: "0964062359",
  phoneIntl: "+66964062359",
  phoneDisplay: "+66 96 406 2359",
  availability: "Available full-time from November 2026",
  summary:
    "Final-year Information Technology student at Assumption University of Thailand specializing in Informatics and Data Science. I turn raw data into clear, actionable business insights with SQL, Python, Power BI and Tableau.",
  about: [
    "I'm a final-year IT student at Assumption University of Thailand, concentrating in Informatics and Data Science. My work sits where data meets decisions: cleaning messy datasets, modeling them properly, and building dashboards people actually use.",
    "Through academic and personal projects I've built financial performance, retail sales and content analytics solutions, covering the full pipeline from data cleaning and transformation to exploratory analysis, star-schema modeling and interactive reporting.",
  ],
};

export const stats = [
  { value: "4", label: "End-to-end projects" },
  { value: "4", label: "Core analytics tools" },
  { value: "3.36", label: "Current GPA / 4.00" },
  { value: "3", label: "Professional certificates" },
];

export type ProjectVisual = "finance" | "netflix" | "sql" | "platform";

/**
 * Live dashboard embed. Paste the public share link from:
 *  - Tableau Public:  Share → copy link (https://public.tableau.com/views/...)
 *  - Power BI:        File → Embed report → Publish to web (https://app.powerbi.com/view?r=...)
 *  - Looker Studio:   Share → Embed report (https://lookerstudio.google.com/embed/...)
 */
export type DashboardEmbed = { title: string; url: string };

export type Project = {
  /** URL slug. Upload files for this project to public/project-files/<slug>/ */
  slug: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  tech: string[];
  visual: ProjectVisual;
  embeds?: DashboardEmbed[];
  /** Power BI "Publish to web" link (https://app.powerbi.com/view?r=...). Makes every report page interactive. */
  powerBiUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "financial-performance-dashboard",
    title: "Financial Performance Dashboard",
    category: "Power BI · Business Intelligence",
    description:
      "A multi-page interactive financial performance dashboard built on Microsoft's Financial Sample dataset, analyzing sales, profit, discounts, products, countries, customer segments and monthly performance.",
    highlights: [
      "Cleaned and transformed data with Power Query",
      "Designed a star schema data model",
      "Built DAX measures and KPIs for interactive analysis",
    ],
    tech: ["Power BI", "Power Query", "DAX", "Star Schema", "KPI Development"],
    visual: "finance",
  },
  {
    slug: "netflix-content-analysis",
    title: "Netflix Content Analysis",
    category: "Python · Tableau",
    description:
      "An end-to-end analytics project on the Netflix Movies & TV Shows dataset, from preprocessing in Pandas to an interactive Tableau dashboard enabling dynamic exploration of 8,807 titles.",
    highlights: [
      "Cleaned and preprocessed the dataset with Pandas",
      "Performed exploratory data analysis (EDA)",
      "KPI cards, content trends, Top 10 countries & genres, interactive filters",
    ],
    tech: ["Python", "Pandas", "EDA", "Tableau", "Dashboard Design"],
    visual: "netflix",
  },
  {
    slug: "retail-sales-analysis",
    title: "Retail Sales Analysis",
    category: "MySQL · Advanced SQL",
    description:
      "End-to-end retail sales analysis in MySQL, cleaning and transforming raw sales data to uncover sales trends, customer behavior and product performance for data-driven decisions.",
    highlights: [
      "Window functions, CTEs and views",
      "Stored procedures and indexing",
      "Aggregations with GROUP BY / HAVING for business insights",
    ],
    tech: ["MySQL", "DDL / DML", "Window Functions", "CTEs", "Stored Procedures"],
    visual: "sql",
  },
  {
    slug: "story-sharing-platform",
    title: "Story Sharing Platform",
    category: "Senior Project · Full-stack",
    description:
      "A collaborative web-based story sharing platform with multiple monetization models, reader engagement tools, AI-powered content moderation, a coin-based payment system and LINE integration.",
    highlights: [
      "Business requirements analysis",
      "System design and feature implementation",
      "Focus on engagement and content management",
    ],
    tech: ["Next.js", "React Native", "NestJS", "PostgreSQL", "Redis", "Typesense", "Stripe API", "LINE API"],
    visual: "platform",
  },
];

export const skillGroups = [
  { title: "Programming & Query", items: ["Python", "SQL"] },
  {
    title: "Data Analysis",
    items: ["Data Cleaning", "Data Transformation", "Exploratory Data Analysis", "Data Visualization", "Business Analytics"],
  },
  {
    title: "Business Intelligence",
    items: ["Power BI", "Power Query", "DAX", "Tableau", "Dashboard Development", "KPI Development"],
  },
  { title: "Data Modeling", items: ["Data Modeling", "Star Schema"] },
  { title: "Databases", items: ["MySQL", "PostgreSQL", "NoSQL"] },
  { title: "Spreadsheets", items: ["Microsoft Excel", "Google Sheets"] },
];

export const education = {
  degree: "Bachelor of Science in Information Technology",
  school: "Assumption University of Thailand",
  location: "Bangkok, Thailand",
  concentration: "Informatics and Data Science",
  gpa: "3.36 / 4.00",
  timeline: [
    { label: "Coursework completion", date: "October 2026" },
    { label: "Full-time availability", date: "November 2026" },
    { label: "Expected graduation", date: "January 2027" },
  ],
};

export type Certificate = {
  title: string;
  /** Organization that authored the course */
  provider: string;
  /** Platform that issued the certificate */
  issuer: string;
  /** e.g. "Professional Certificate · 9 courses" */
  kind: string;
  date: string;
  /** Rendered preview in public/certificates/ */
  image: string;
  /** Original PDF in public/certificates/ */
  pdf: string;
  verifyUrl: string;
};

export const certificates: Certificate[] = [
  {
    title: "Google Data Analytics",
    provider: "Google",
    issuer: "Coursera",
    kind: "Professional Certificate · 9 courses",
    date: "Feb 14, 2026",
    image: "/certificates/google-data-analytics.png",
    pdf: "/certificates/google-data-analytics.pdf",
    verifyUrl: "https://coursera.org/verify/professional-cert/DKUQSF8HL5YX",
  },
  {
    title: "Python for Data Science, AI & Development",
    provider: "IBM",
    issuer: "Coursera",
    kind: "Course Certificate",
    date: "Feb 14, 2026",
    image: "/certificates/python-for-data-science.png",
    pdf: "/certificates/python-for-data-science.pdf",
    verifyUrl: "https://coursera.org/verify/CZFRB3F63KO4",
  },
  {
    title: "AI For Everyone",
    provider: "DeepLearning.AI",
    issuer: "Coursera",
    kind: "Course Certificate",
    date: "Feb 16, 2026",
    image: "/certificates/ai-for-everyone.png",
    pdf: "/certificates/ai-for-everyone.pdf",
    verifyUrl: "https://coursera.org/verify/QEZ2GHFH1MLV",
  },
];

export const languages = [
  { name: "English", level: "Professional working", score: 4 },
  { name: "Myanmar", level: "Native", score: 5 },
  { name: "Thai", level: "Basic (learning)", score: 1 },
];
