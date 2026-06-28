export const SITE = {
  website: "https://blog.bluerobin.io",
  author: "Victor Robin",
  desc: "BlueRobin Technical Blog - A homelab journey from medical document search to production AI. Deep dives into .NET, Kubernetes, LLM integration, and Domain-Driven Design.",
  title: "BlueRobin",
  ogImage: "og-default.png",
  // The blog ships a single, deliberate light theme — no dark mode. Keep false so
  // the value reflects reality (BaseLayout also pins color-scheme: light).
  lightAndDarkMode: false,
  // Public contact address. NOTE: confirm victor@bluerobin.io is a live mailbox
  // (Cloudflare Email Routing is free on bluerobin.io) — the old @bluerobin.local
  // was an unroutable internal domain.
  email: "victor@bluerobin.io",
  // Public profile + CV. Leave cvUrl "" to hide the download button; set it to
  // e.g. "/victor-robin-cv.pdf" once the file is added to /public.
  github: "https://github.com/viktorrobin",
  linkedin: "https://www.linkedin.com/in/dr-victor-robin/",
  cvUrl: "",
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/dr-victor-robin/",
    linkTitle: `Victor on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:victor@bluerobin.io",
    linkTitle: `Send an email`,
    active: true,
  },
];

// Series definitions for grouping related articles
export const SERIES = {
  "ddd-series": {
    title: "Domain-Driven Design in .NET",
    description: "Building robust domain models with DDD patterns",
    color: "neural",
  },
  "nats-series": {
    title: "Event-Driven Architecture with NATS",
    description: "Async messaging patterns for distributed systems",
    color: "complement",
  },
  "gitops-series": {
    title: "GitOps with Flux",
    description: "Infrastructure as Code and declarative deployments",
    color: "aurora",
  },
  "testing-series": {
    title: "Testing Strategies",
    description: "From unit tests to contract testing",
    color: "glow",
  },
  "security-series": {
    title: "Security & Compliance",
    description: "Authentication, encryption, and GDPR compliance",
    color: "aurora",
  },
  "ai-series": {
    title: "AI/LLM Integration",
    description: "Building production AI agents, retrieval, and LLM pipelines",
    color: "neural",
  },
} as const;

// Category metadata
export const CATEGORIES = {
  architecture: {
    title: "Architecture",
    description: "System design and patterns",
    icon: "",
    color: "neural",
  },
  messaging: {
    title: "Messaging",
    description: "Event-driven and async communication",
    icon: "",
    color: "glow",
  },
  infrastructure: {
    title: "Infrastructure",
    description: "Kubernetes, GitOps, and DevOps",
    icon: "",
    color: "complement",
  },
  security: {
    title: "Security",
    description: "Authentication, encryption, and compliance",
    icon: "",
    color: "aurora",
  },
  ai: {
    title: "AI/ML",
    description: "Machine learning and LLM integration",
    icon: "",
    color: "neural",
  },
  frontend: {
    title: "Frontend",
    description: "Blazor and UI development",
    icon: "",
    color: "neural",
  },
  backend: {
    title: "Backend",
    description: ".NET, APIs, and server-side",
    icon: "",
    color: "complement",
  },
  database: {
    title: "Database",
    description: "PostgreSQL, EF Core, and data storage",
    icon: "",
    color: "complement",
  },
  "ci-cd": {
    title: "CI/CD",
    description: "Pipelines and automation",
    icon: "",
    color: "glow",
  },
  observability: {
    title: "Observability",
    description: "Monitoring, logging, and tracing",
    icon: "",
    color: "glow",
  },
  storage: {
    title: "Storage",
    description: "Object storage and file management",
    icon: "",
    color: "complement",
  },
} as const;

// Project metadata — the two BlueRobin project areas surfaced on the landing page
export const PROJECTS = {
  archives: {
    slug: "archives",
    label: "The Archives",
    tagline: "A self-hosted team of document AI agents",
    description:
      "A self-hosted team of AI agents that read, organize, and reason over your documents — specialists for retrieval, finance, health, and tax, backed by ensemble entity extraction, a knowledge graph, and multi-model vector search, running end-to-end on a homelab K3s cluster.",
    href: "/archives/",
    color: "neural", // blue
    accent: "complement", // orange
  },
  "debug-agent": {
    slug: "debug-agent",
    label: "The Debug Agent",
    tagline: "Autonomous, graph-grounded root-cause analysis",
    description:
      "An LLM agent that investigates production incidents: a FalkorDB world-model graph, correlation-first blame propagation, an externalized verification gate, and bi-temporal incident memory — research-grade RCA at homelab cost.",
    href: "/debug-agent/",
    color: "complement", // orange
    accent: "neural", // blue
  },
} as const;

// Library theme metadata — the grouping dimension for the reviewed bookshelf at
// /library/. Keep keys in sync with the `theme` enum in src/content/config.ts.
// `flagged: true` marks themes that are off-topic for an engineering portfolio
// (kept, but surfaced in a "confirm keep or drop" strip on the hub).
export const LIBRARY_THEMES = {
  "software-architecture": {
    title: "Software Architecture",
    description: "System design, DDD, distributed systems, and the patterns behind the platform",
    color: "neural",
    flagged: false,
  },
  "programming-craft": {
    title: "Programming Craft",
    description: "Clean code, refactoring, testing, and the languages I build in",
    color: "complement",
    flagged: false,
  },
  "sre-devops": {
    title: "SRE & DevOps",
    description: "Reliability, observability, Kubernetes, and GitOps delivery",
    color: "glow",
    flagged: false,
  },
  "ai-ml": {
    title: "AI & Machine Learning",
    description: "LLMs, retrieval, MLOps, and the science the agents run on",
    color: "neural",
    flagged: false,
  },
  "security-cyber": {
    title: "Security & Cyber",
    description: "Cryptography, threat history, and the human element of security",
    color: "aurora",
    flagged: false,
  },
  "algorithms-math": {
    title: "Algorithms & Maths",
    description: "Algorithms, linear algebra, causality, and the foundations underneath",
    color: "complement",
    flagged: false,
  },
  "leadership-management": {
    title: "Leadership & Management",
    description: "Teams, culture, org design, and the craft of leading engineering",
    color: "neural",
    flagged: false,
  },
  "product-startup": {
    title: "Product & Startup",
    description: "Product management, lean delivery, UX, and building things people want",
    color: "glow",
    flagged: false,
  },
  "strategy-influence": {
    title: "Strategy & Influence",
    description: "Strategy, persuasion, systems thinking, and clearer decisions",
    color: "aurora",
    flagged: false,
  },
  "productivity-mind": {
    title: "Productivity & Mind",
    description: "Habits, focus, and how the mind actually gets hard things done",
    color: "complement",
    flagged: true,
  },
  "money-finance": {
    title: "Money & Finance",
    description: "Investing, the psychology of money, and personal finance",
    color: "glow",
    flagged: true,
  },
  "philosophy-reflection": {
    title: "Philosophy & Reflection",
    description: "Stoicism, Taoism, and quality — the books I think with, not from",
    color: "neural",
    flagged: true,
  },
  "fiction-literature": {
    title: "Fiction & Literature",
    description: "Science fiction and novels — the off-duty shelf",
    color: "aurora",
    flagged: true,
  },
  "history-society": {
    title: "History & Society",
    description: "Intelligence, conflict, capitalism, and the world the tech lives in",
    color: "complement",
    flagged: true,
  },
  "craft-hobbies": {
    title: "Craft & Hobbies",
    description: "Chess, photography, cars, and cooking — practice away from the keyboard",
    color: "glow",
    flagged: true,
  },
} as const;

// Verdict metadata for library entries — "should I use this or not".
export const RECOMMENDATIONS = {
  essential: {
    label: "Essential",
    description: "A book I'd hand to anyone working in this area",
    color: "neural",
  },
  recommended: {
    label: "Recommended",
    description: "Worth your time if the topic is on your path",
    color: "complement",
  },
  situational: {
    label: "Situational",
    description: "Useful for a specific need or moment, not a must-read",
    color: "glow",
  },
  skip: {
    label: "Skip",
    description: "I read it so you don't have to — borrow the summary instead",
    color: "aurora",
  },
} as const;

// Difficulty metadata
export const DIFFICULTIES = {
  beginner: {
    label: "Beginner",
    description: "Basic concepts, minimal prerequisites",
    color: "complement",
  },
  intermediate: {
    label: "Intermediate",
    description: "Requires foundational knowledge",
    color: "glow",
  },
  advanced: {
    label: "Advanced",
    description: "Complex patterns and deep expertise",
    color: "aurora",
  },
  expert: {
    label: "Expert",
    description: "Deep system-level knowledge required",
    color: "neural",
  },
} as const;
