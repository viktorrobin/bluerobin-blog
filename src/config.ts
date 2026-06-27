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
