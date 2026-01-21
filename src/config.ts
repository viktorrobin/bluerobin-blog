export const SITE = {
  website: "https://blog.bluerobin.local",
  author: "Victor Robin",
  desc: "BlueRobin Technical Blog - A homelab journey from medical document search to production AI. Deep dives into .NET, Kubernetes, LLM integration, and Domain-Driven Design.",
  title: "BlueRobin Tech Blog",
  ogImage: "og-default.png",
  lightAndDarkMode: true,
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
    name: "Github",
    href: "https://github.com/victorrentea",
    linkTitle: `Victor on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/victorrentea",
    linkTitle: `Victor on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:victor@bluerobin.local",
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
    color: "quantum",
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
    description: "Building production RAG pipelines and LLM applications",
    color: "neural",
  },
} as const;

// Category metadata
export const CATEGORIES = {
  architecture: {
    title: "Architecture",
    description: "System design and patterns",
    icon: "🏗️",
    color: "aurora",
  },
  messaging: {
    title: "Messaging",
    description: "Event-driven and async communication",
    icon: "📨",
    color: "quantum",
  },
  infrastructure: {
    title: "Infrastructure",
    description: "Kubernetes, GitOps, and DevOps",
    icon: "⚙️",
    color: "neural",
  },
  security: {
    title: "Security",
    description: "Authentication, encryption, and compliance",
    icon: "🔒",
    color: "glow",
  },
  ai: {
    title: "AI/ML",
    description: "Machine learning and LLM integration",
    icon: "🤖",
    color: "neural",
  },
  frontend: {
    title: "Frontend",
    description: "Blazor and UI development",
    icon: "🎨",
    color: "aurora",
  },
  backend: {
    title: "Backend",
    description: ".NET, APIs, and server-side",
    icon: "⚡",
    color: "quantum",
  },
  database: {
    title: "Database",
    description: "PostgreSQL, EF Core, and data storage",
    icon: "🗄️",
    color: "glow",
  },
  "ci-cd": {
    title: "CI/CD",
    description: "Pipelines and automation",
    icon: "🚀",
    color: "aurora",
  },
  observability: {
    title: "Observability",
    description: "Monitoring, logging, and tracing",
    icon: "📊",
    color: "neural",
  },
  storage: {
    title: "Storage",
    description: "Object storage and file management",
    icon: "💾",
    color: "quantum",
  },
} as const;

// Difficulty metadata
export const DIFFICULTIES = {
  beginner: {
    label: "Beginner",
    description: "Basic concepts, minimal prerequisites",
    color: "emerald",
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
