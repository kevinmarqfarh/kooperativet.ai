import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  BadgeCheck,
  Bell,
  BookOpen,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  CircleDot,
  Code2,
  Command,
  Eye,
  Flag,
  Flame,
  FolderKanban,
  GitPullRequest,
  Hammer,
  Handshake,
  Hash,
  HelpCircle,
  LayoutDashboard,
  Layers,
  Leaf,
  Link2,
  Languages,
  Lock,
  Megaphone,
  MessageCircle,
  Moon,
  Palette,
  Plus,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Send,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  ThumbsDown,
  ThumbsUp,
  UserRound,
  UsersRound,
  Vote,
  Wand2,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type View =
  | "overview"
  | "forum"
  | "reviewRooms"
  | "prompts"
  | "buildLogs"
  | "mvp"
  | "profiles"
  | "guilds"
  | "governance"
  | "moderation"
  | "thread"
  | "settings";

type Language = "en" | "sv";
type Theme = "light" | "dark";
type ParticipationSettings = {
  trustedDms: boolean;
  constructiveDownvotes: boolean;
  belongingPulse: boolean;
};

type Topic = {
  id: string;
  title: string;
  category: string;
  author: string;
  excerpt: string;
  replies: number;
  baseVotes: number;
  tags: string[];
  updated: string;
  status: "open" | "verified" | "locked";
};

type ThreadReply = {
  id: string;
  author: string;
  handle: string;
  role: string;
  time: string;
  body: string;
  baseVotes: number;
  badges: string[];
  tone: "green" | "blue" | "violet" | "photo" | "photo-woman";
  accepted?: boolean;
  moderatorNote?: string;
};

type PromptItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  model: string;
  risk: "low" | "medium" | "high";
  baseVotes: number;
  versions: number;
  lastTested: string;
  markers: string[];
  tags: string[];
};

type BuildLog = {
  id: string;
  title: string;
  owner: string;
  status: string;
  stack: string;
  update: string;
  blockers: string;
  followers: number;
};

type MvpProject = {
  id: string;
  name: string;
  pitch: string;
  status: "idea" | "prototype" | "beta" | "launched";
  lookingFor: string[];
  stack: string;
  interest: number;
};

type Profile = {
  id: string;
  name: string;
  role: string;
  skills: string[];
  building: string;
  helpsWith: string[];
  reputation: number;
  badges: string[];
};

type Report = {
  id: string;
  target: string;
  targetType: string;
  reason: string;
  reporter: string;
  priority: "low" | "medium" | "high";
  status: "open" | "reviewing" | "resolved" | "dismissed" | "escalated";
  createdAt: string;
};

type Proposal = {
  id: string;
  title: string;
  summary: string;
  status: "proposed" | "discussing" | "voting" | "accepted" | "implemented";
  votes: number;
  owner: string;
};

const translations = {
  en: {
    nav: {
      settings: "Settings",
      help: "Help & Docs",
      shortcuts: "Shortcuts",
    },
    topbar: {
      search: "Search discussions, prompts, users...",
      newPost: "New Post",
      titles: {
        overview: ["Forum", "Collaborate, build, and ship together."],
        forum: ["Forum", "Collaborate, build, and ship together."],
        reviewRooms: ["Review Rooms", "Choose feedback mode before the review begins."],
        prompts: ["Prompt Bank", "Verified prompts, evals and reusable workflows."],
        buildLogs: ["Build Logs", "Follow what members are building in public."],
        mvp: ["MVP Scene", "Find projects, testers and co-builders."],
        profiles: ["Profiles", "See what people build and how they contribute."],
        guilds: ["Guilds", "Focused working groups for deeper practice."],
        governance: ["Governance", "Transparent proposals, votes and decisions."],
        moderation: ["Moderation", "Human review, flagged items and audit trails."],
        thread: ["Thread", "Context, replies and cooperative next steps."],
        settings: ["Settings", "Language, theme and participation controls."],
      },
    },
    overview: {
      categories: "Categories",
      viewAll: "View all",
      latest: "Latest Discussions",
      verifiedPrompts: "Verified Prompts",
      buildLogs: "Active Build Logs",
      mvp: "MVP Collaborations",
      reviewRooms: "Review Rooms",
      promptEvals: "Prompt Evals & Drift",
      inclusion: "Inclusion Systems",
      browsePrompts: "Browse Prompt Bank",
      goBuildLogs: "Go to Build Logs",
      exploreMvp: "Explore MVP Scene",
      openReviewRooms: "Open Review Rooms",
      viewEvals: "View evals",
      viewInclusion: "View systems",
    },
    rail: {
      flagged: "Flagged Items",
      rituals: "Upcoming Community Rituals",
      badges: "Badges",
      viewAll: "View all",
    },
    settings: {
      title: "Settings",
      language: "Language",
      swedish: "Swedish",
      english: "English",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      participation: "Participation defaults",
      dms: "Only allow DMs from trusted members",
      constructive: "Require constructive feedback on downvotes in review rooms",
      pulse: "Include me in anonymous belonging pulse surveys",
    },
  },
  sv: {
    nav: {
      settings: "Inställningar",
      help: "Hjälp & docs",
      shortcuts: "Genvägar",
    },
    topbar: {
      search: "Sök diskussioner, prompts, användare...",
      newPost: "Ny post",
      titles: {
        overview: ["Forum", "Samarbeta, bygg och skeppa tillsammans."],
        forum: ["Forum", "Samarbeta, bygg och skeppa tillsammans."],
        reviewRooms: ["Reviewrum", "Välj feedbackläge innan granskningen börjar."],
        prompts: ["Promptbank", "Verifierade prompts, evals och återanvändbara workflows."],
        buildLogs: ["Byggloggar", "Följ vad medlemmar bygger öppet."],
        mvp: ["MVP-scenen", "Hitta projekt, testare och medbyggare."],
        profiles: ["Profiler", "Se vad människor bygger och bidrar med."],
        guilds: ["Gillen", "Fokuserade arbetsgrupper för djupare praktik."],
        governance: ["Governance", "Transparenta förslag, röster och beslut."],
        moderation: ["Moderering", "Mänsklig granskning, flaggningar och audit trails."],
        thread: ["Tråd", "Kontext, svar och kooperativa nästa steg."],
        settings: ["Inställningar", "Språk, tema och tryggt deltagande."],
      },
    },
    overview: {
      categories: "Kategorier",
      viewAll: "Visa alla",
      latest: "Senaste diskussioner",
      verifiedPrompts: "Verifierade prompts",
      buildLogs: "Aktiva byggloggar",
      mvp: "MVP-samarbeten",
      reviewRooms: "Reviewrum",
      promptEvals: "Prompt-evals & drift",
      inclusion: "Inkluderingssystem",
      browsePrompts: "Öppna promptbank",
      goBuildLogs: "Gå till byggloggar",
      exploreMvp: "Utforska MVP-scenen",
      openReviewRooms: "Öppna reviewrum",
      viewEvals: "Visa evals",
      viewInclusion: "Visa system",
    },
    rail: {
      flagged: "Flaggade objekt",
      rituals: "Kommande community-ritualer",
      badges: "Badges",
      viewAll: "Visa alla",
    },
    settings: {
      title: "Inställningar",
      language: "Språk",
      swedish: "Svenska",
      english: "Engelska",
      theme: "Tema",
      light: "Ljust",
      dark: "Mörkt",
      participation: "Standard för deltagande",
      dms: "Tillåt endast DM från betrodda medlemmar",
      constructive: "Kräv konstruktiv feedback vid downvotes i reviewrum",
      pulse: "Ta med mig i anonym belonging pulse",
    },
  },
} as const;

type Labels = (typeof translations)[Language];

const navItems: Array<{ id: View; label: Record<Language, string>; icon: ReactNode }> = [
  { id: "forum", label: { en: "Forum", sv: "Forum" }, icon: <MessageCircle size={18} /> },
  { id: "reviewRooms", label: { en: "Review Rooms", sv: "Reviewrum" }, icon: <BadgeCheck size={18} /> },
  { id: "prompts", label: { en: "Prompt Bank", sv: "Promptbank" }, icon: <Layers size={18} /> },
  { id: "buildLogs", label: { en: "Build Logs", sv: "Byggloggar" }, icon: <Code2 size={18} /> },
  { id: "mvp", label: { en: "MVP Scene", sv: "MVP-scenen" }, icon: <Rocket size={18} /> },
  { id: "guilds", label: { en: "Guilds", sv: "Gillen" }, icon: <UsersRound size={18} /> },
  { id: "governance", label: { en: "Governance", sv: "Governance" }, icon: <BookOpen size={18} /> },
  { id: "moderation", label: { en: "Moderation", sv: "Moderering" }, icon: <Flag size={18} /> },
];

const categories = [
  {
    name: "General Discussion",
    description: "Introductions, open questions and community coordination.",
    topics: 1200,
    posts: 1200,
    locked: false,
  },
  {
    name: "AI & Prompting",
    description: "Model behavior, prompts, evals and AI-native workflows.",
    topics: 842,
    posts: 842,
    locked: false,
  },
  {
    name: "Vibe Coding",
    description: "Fast building loops, product experiments and shipping patterns.",
    topics: 1600,
    posts: 1600,
    locked: false,
  },
  {
    name: "Tools & Integrations",
    description: "Stacks, integrations, deployment and developer tooling.",
    topics: 642,
    posts: 642,
    locked: false,
  },
  {
    name: "Design & UX",
    description: "Product design, onboarding, interfaces and usability reviews.",
    topics: 421,
    posts: 421,
    locked: false,
  },
  {
    name: "Launch & Growth",
    description: "MVP launches, feedback loops, growth and first customers.",
    topics: 512,
    posts: 512,
    locked: false,
  },
  {
    name: "Off-topic",
    description: "Lightweight conversation that still follows the guidelines.",
    topics: 189,
    posts: 189,
    locked: false,
  },
];

const seedTopics: Topic[] = [
  {
    id: "topic-rls",
    title: "Best patterns for AI-native onboarding flows?",
    category: "AI & Prompting",
    author: "Alex P.",
    excerpt:
      "Looking for examples where the first session teaches the product without hiding the real builder workflow.",
    replies: 24,
    baseVotes: 91,
    tags: ["onboarding", "product", "ai-native"],
    updated: "12m",
    status: "verified",
  },
  {
    id: "topic-agents",
    title: "I built a Supabase + RAG boilerplate (open source)",
    category: "Vibe Coding",
    author: "jina",
    excerpt:
      "Auth, pgvector, ingestion jobs and a small eval harness. Would appreciate review before I tag v1.",
    replies: 18,
    baseVotes: 48,
    tags: ["supabase", "rag", "open-source"],
    updated: "1h",
    status: "open",
  },
  {
    id: "topic-dsa",
    title: "What's your go-to stack right now?",
    category: "General Discussion",
    author: "Marco",
    excerpt:
      "Curious what people actually use after the hype settles: Next, Vite, Supabase, Neon, Convex, Turso?",
    replies: 37,
    baseVotes: 39,
    tags: ["stack", "tools"],
    updated: "2h",
    status: "open",
  },
  {
    id: "topic-mvp",
    title: "Prompt chaining for complex UI generation",
    category: "AI & Prompting",
    author: "Tess",
    excerpt:
      "Sharing a pattern for splitting IA, visual direction, component anatomy and implementation passes.",
    replies: 9,
    baseVotes: 77,
    tags: ["prompts", "ui", "workflow"],
    updated: "3h",
    status: "open",
  },
  {
    id: "topic-turso",
    title: "Ship faster with SQLite + Turso",
    category: "Tools & Integrations",
    author: "Lea",
    excerpt:
      "Notes from moving a small AI SaaS from Postgres to SQLite at the edge without losing migration discipline.",
    replies: 14,
    baseVotes: 64,
    tags: ["sqlite", "turso", "edge"],
    updated: "5h",
    status: "open",
  },
];

const threadReplies: Record<string, ThreadReply[]> = {
  "topic-rls": [
    {
      id: "reply-lea",
      author: "Lea Nord",
      handle: "@lean",
      role: "Product Builder",
      time: "8m",
      body:
        "The strongest flow I have shipped starts with a real user job, not a tour. First screen asks what the person is trying to build, then shows one editable working example with the assumptions visible.",
      baseVotes: 38,
      badges: ["Builder", "UX reviewer"],
      tone: "photo-woman",
      accepted: true,
    },
    {
      id: "reply-nora",
      author: "Nora",
      handle: "@nora-sec",
      role: "Security Reviewer",
      time: "18m",
      body:
        "For AI-native products I would add a data boundary step before the first generation. Let people choose sample data, private data, or no data. That makes onboarding safer without making it feel like compliance homework.",
      baseVotes: 27,
      badges: ["Security", "Trusted"],
      tone: "green",
    },
    {
      id: "reply-maja",
      author: "Maja",
      handle: "@maja-gov",
      role: "Governance Guide",
      time: "26m",
      body:
        "Useful pattern: separate inspiration from instructions. Show a tiny finished artifact, then ask for consent before using templates, tracking, or community examples. It lowers pressure for newer builders.",
      baseVotes: 19,
      badges: ["Governance", "Inclusive review"],
      tone: "violet",
      moderatorNote: "Lyft som bra exempel på nybörjarvänlig feedback.",
    },
  ],
  default: [
    {
      id: "reply-default-1",
      author: "Jina",
      handle: "@jina",
      role: "Open Source Builder",
      time: "14m",
      body:
        "I would start by posting the smallest reproducible example, what you already tried, and one specific decision you want feedback on. That makes it easier for others to help without guessing.",
      baseVotes: 22,
      badges: ["Open source", "Helpful"],
      tone: "blue",
    },
    {
      id: "reply-default-2",
      author: "Tess",
      handle: "@tess",
      role: "Prompt Designer",
      time: "31m",
      body:
        "Add a before and after snippet. People can then review the actual change, not only the idea. It also makes the thread easier to turn into a future guide.",
      baseVotes: 15,
      badges: ["Prompt Smith"],
      tone: "photo-woman",
    },
  ],
};

const seedPrompts: PromptItem[] = [
  {
    id: "prompt-security-review",
    title: "SaaS Landing Page Generator",
    category: "UI Generation",
    summary:
      "Turns a product brief into a complete first-screen app/site structure with non-generic copy.",
    model: "GPT-5",
    risk: "low",
    baseVotes: 125,
    versions: 4,
    lastTested: "2026-05-18",
    markers: ["Verified", "Reusable"],
    tags: ["ui", "landing", "product"],
  },
  {
    id: "prompt-product-prd",
    title: "PRD to Feature Spec (Markdown)",
    category: "Docs",
    summary:
      "Converts a raw idea into scope, acceptance criteria, anti-features and release notes.",
    model: "GPT-5",
    risk: "low",
    baseVotes: 98,
    versions: 6,
    lastTested: "2026-05-15",
    markers: ["Verified", "Community tested"],
    tags: ["product", "docs", "scope"],
  },
  {
    id: "prompt-rls-tests",
    title: "Data Explorer GPT (Charts + SQL)",
    category: "Data Analysis",
    summary:
      "Creates a safe SQL analysis loop with chart suggestions and explicit assumptions.",
    model: "GPT-5",
    risk: "medium",
    baseVotes: 87,
    versions: 2,
    lastTested: "2026-05-12",
    markers: ["Tested", "Needs data review"],
    tags: ["sql", "charts", "analysis"],
  },
  {
    id: "prompt-auth-scaffold",
    title: "Auth System Scaffold (Next.js)",
    category: "Code Generation",
    summary:
      "Scaffolds auth flows, protected routes and role checks with a review checklist.",
    model: "GPT-5",
    risk: "medium",
    baseVotes: 76,
    versions: 3,
    lastTested: "2026-05-10",
    markers: ["Security review"],
    tags: ["auth", "nextjs", "roles"],
  },
  {
    id: "prompt-user-testing",
    title: "User Testing Interview Guide",
    category: "Research",
    summary:
      "Creates a non-leading interview script for early MVP feedback.",
    model: "GPT-5",
    risk: "low",
    baseVotes: 64,
    versions: 2,
    lastTested: "2026-05-08",
    markers: ["Verified"],
    tags: ["research", "ux"],
  },
];

const seedBuildLogs: BuildLog[] = [
  {
    id: "build-ops",
    title: "ai-meeting-notes",
    owner: "@simon",
    status: "Live",
    stack: "Next.js",
    update:
      "Meeting summaries with explicit action owners and human approval before sharing.",
    blockers: "Needs a better consent flow for recorded meetings.",
    followers: 32,
  },
  {
    id: "build-legal",
    title: "habit-tracker-ai",
    owner: "@leah",
    status: "Live",
    stack: "React Native",
    update:
      "Daily check-ins with gentle AI reflections and no streak-shaming mechanics.",
    blockers: "Needs inclusive notification settings.",
    followers: 18,
  },
  {
    id: "build-open-llm",
    title: "open-source-llm-toolkit",
    owner: "@mxdev",
    status: "Live",
    stack: "Python",
    update:
      "Local eval runner for prompts, model drift and reproducible examples.",
    blockers: "Needs Windows setup testing.",
    followers: 47,
  },
  {
    id: "build-micro",
    title: "micro-saas-starter",
    owner: "@anton",
    status: "WIP",
    stack: "Vite, Supabase",
    update:
      "A starter kit focused on billing, settings and admin workflows.",
    blockers: "Needs stronger RLS defaults.",
    followers: 23,
  },
  {
    id: "build-design",
    title: "design-system-koop",
    owner: "@jules",
    status: "WIP",
    stack: "React, Tokens",
    update:
      "Accessible UI primitives for forum, review rooms and governance flows.",
    blockers: "Needs mobile density review.",
    followers: 15,
  },
];

const seedMvps: MvpProject[] = [
  {
    id: "mvp-reviewbot",
    name: "StudyBuddy AI",
    pitch:
      "Peer study rooms for learners who want guided review without public pressure.",
    status: "prototype",
    lookingFor: ["3/5 members"],
    stack: "React, Supabase",
    interest: 3,
  },
  {
    id: "mvp-promptradar",
    name: "InvoicePilot",
    pitch:
      "AI-assisted invoice follow-up with approvals and customer-safe tone controls.",
    status: "prototype",
    lookingFor: ["2/4 members"],
    stack: "Next.js, Postgres",
    interest: 2,
  },
  {
    id: "mvp-cobuild",
    name: "LegalDoc Assistant",
    pitch:
      "Document intake assistant with clear human handoff and audit trail.",
    status: "beta",
    lookingFor: ["4/5 members"],
    stack: "Next.js",
    interest: 4,
  },
  {
    id: "mvp-local-llm",
    name: "Local LLM Gateway",
    pitch:
      "Switches between local and hosted models based on privacy class.",
    status: "beta",
    lookingFor: ["1/4 members"],
    stack: "Ollama, Node",
    interest: 1,
  },
  {
    id: "mvp-tweet",
    name: "AI Tweet Analyzer",
    pitch:
      "Turns noisy social feedback into themes and product insights.",
    status: "idea",
    lookingFor: ["2/3 members"],
    stack: "Python, React",
    interest: 2,
  },
];

const seedProfiles: Profile[] = [
  {
    id: "profile-nora",
    name: "Nora",
    role: "Security Reviewer",
    skills: ["RLS", "Auth", "Threat modeling"],
    building: "Säkerhetsmallar för AI-byggda SaaS-produkter",
    helpsWith: ["säkerhet", "compliance"],
    reputation: 1840,
    badges: ["Security Reviewer", "Trusted Member"],
  },
  {
    id: "profile-elias",
    name: "Elias",
    role: "Agent Builder",
    skills: ["Agents", "Workflows", "Vercel"],
    building: "Durable workflows för support och ops",
    helpsWith: ["arkitektur", "debugging"],
    reputation: 1260,
    badges: ["Helpful Builder", "Prompt Smith"],
  },
  {
    id: "profile-maja",
    name: "Maja",
    role: "Governance Guide",
    skills: ["GDPR", "DSA", "Policy"],
    building: "Community governance playbooks",
    helpsWith: ["governance", "moderation"],
    reputation: 1515,
    badges: ["Governance Guide", "Steward"],
  },
];

const guilds = [
  {
    name: "Security Guild",
    steward: "Nora",
    focus: "Auth, RLS, hotmodeller och säkra deploy-flöden.",
    members: 128,
  },
  {
    name: "Prompt Guild",
    steward: "Elias",
    focus: "Verifierade prompts, versionshistorik och evals.",
    members: 211,
  },
  {
    name: "Compliance Guild",
    steward: "Maja",
    focus: "GDPR, DSA, dataminimering och beslut med audit trail.",
    members: 86,
  },
  {
    name: "Indie SaaS",
    steward: "Samir",
    focus: "MVP-scope, betalflöden, onboarding och första kunder.",
    members: 174,
  },
];

const seedProposals: Proposal[] = [
  {
    id: "proposal-open-source-charter",
    title: "Anta open-source charter",
    summary:
      "Repot kopplas till GitHub med MIT-licens, tydlig governance, code of conduct och RFC-flöde för större beslut.",
    status: "proposed",
    votes: 41,
    owner: "Kevin",
  },
  {
    id: "proposal-ritual",
    title: "Inför månadens MVP-demo",
    summary:
      "En återkommande demo där tre projekt får strukturerad feedback från communityt.",
    status: "voting",
    votes: 72,
    owner: "Felicia",
  },
  {
    id: "proposal-guides",
    title: "Skapa guideprocess för verifierad kunskap",
    summary:
      "Bästa trådar ska kunna lyftas till guider med steward-review och versionsstatus.",
    status: "accepted",
    votes: 118,
    owner: "Maja",
  },
  {
    id: "proposal-links",
    title: "Begränsa länkar för nya konton",
    summary:
      "New-konton får maximalt två länkar per dygn tills de blivit Member.",
    status: "implemented",
    votes: 96,
    owner: "Nora",
  },
];

const reviewRooms = [
  {
    name: "Gentle First Review",
    mode: "Pedagogical feedback",
    focus: "For new AI builders who want context, examples and next steps before critique.",
    safeguards: ["No dogpile", "Constructive downvotes", "New voices first"],
    open: 8,
  },
  {
    name: "Security Teardown",
    mode: "Strict technical review",
    focus: "Threat boundaries, auth, RLS, secrets, data flow and deploy risk.",
    safeguards: ["Evidence required", "Moderator watch", "Actionable findings"],
    open: 5,
  },
  {
    name: "Product Signal",
    mode: "MVP and UX review",
    focus: "Positioning, onboarding, activation and whether the product solves a real job.",
    safeguards: ["Tone selected by author", "Role-based feedback", "No pile-on"],
    open: 11,
  },
];

const promptEvals = [
  {
    name: "Model Drift Watch",
    metric: "14 changed prompts",
    detail: "Members report when model behavior shifts after releases or provider changes.",
  },
  {
    name: "Test Receipts",
    metric: "42 verified runs",
    detail: "Prompt output is tied to model, date, input, output and reviewer notes.",
  },
  {
    name: "Production Provenance",
    metric: "18 shipped workflows",
    detail: "Work can be marked manual, AI-assisted, AI-generated, or human-reviewed.",
  },
];

const inclusionSystems = [
  {
    name: "Sponsorship Circles",
    detail: "Trusted members can offer intros, portfolio reviews and co-build office hours.",
  },
  {
    name: "Women in AI Builders",
    detail: "Opt-in group and demo slot for women and underrepresented builders.",
  },
  {
    name: "Belonging Pulse",
    detail: "Anonymous monthly check on psychological safety, respect and feedback quality.",
  },
];

const initialReports: Report[] = [
  {
    id: "report-1",
    target: "Kommentar i 'AI-nyheter: modellsläpp vecka 21'",
    targetType: "comment",
    reason: "Spam eller vilseledande innehåll",
    reporter: "Maja",
    priority: "medium",
    status: "open",
    createdAt: "11 min",
  },
  {
    id: "report-2",
    target: "Prompt: automatiserad scraping utan samtycke",
    targetType: "prompt",
    reason: "Olagligt innehåll",
    reporter: "Nora",
    priority: "high",
    status: "reviewing",
    createdAt: "34 min",
  },
];

const rituals = [
  { title: "Weekly Build Sprint", date: "May 24, 2026 • Sun 16:00 CEST" },
  { title: "Prompt Review Circle", date: "May 26, 2026 • Tue 18:00 CEST" },
  { title: "MVP Feedback Friday", date: "May 31, 2026 • Sun 17:00 CEST" },
  { title: "Kooperative Town Hall", date: "Jun 2, 2026 • Tue 19:00 CEST" },
];

function App() {
  const [activeView, setActiveView] = useState<View>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [topics, setTopics] = useState(seedTopics);
  const [selectedTopicId, setSelectedTopicId] = useState(seedTopics[0].id);
  const [reports, setReports] = useState(initialReports);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [composerOpen, setComposerOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; title: string; type: string } | null>(null);
  const [rightRailExpanded, setRightRailExpanded] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    return window.localStorage.getItem("kooperativet-language") === "sv" ? "sv" : "en";
  });
  const [theme, setTheme] = useState<Theme>(() => {
    return window.localStorage.getItem("kooperativet-theme") === "dark" ? "dark" : "light";
  });
  const [participationSettings, setParticipationSettings] = useState<ParticipationSettings>({
    trustedDms: true,
    constructiveDownvotes: true,
    belongingPulse: true,
  });
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(() => {
    return window.localStorage.getItem("kooperativet-guidelines") === "accepted";
  });

  const labels = translations[language];
  const openReports = reports.filter((report) => report.status === "open" || report.status === "reviewing");
  const voteScore = (id: string, base: number) => base + (votes[id] ?? 0);
  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("kooperativet-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language === "sv" ? "sv" : "en";
    window.localStorage.setItem("kooperativet-language", language);
  }, [language]);

  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return topics;

    return topics.filter((topic) => {
      return [
        topic.title,
        topic.category,
        topic.author,
        topic.excerpt,
        ...topic.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [searchQuery, topics]);

  function handleAcceptGuidelines() {
    window.localStorage.setItem("kooperativet-guidelines", "accepted");
    setGuidelinesAccepted(true);
  }

  function handleVote(id: string, delta: number) {
    setVotes((current) => ({ ...current, [id]: (current[id] ?? 0) + delta }));
  }

  function handleBookmark(id: string) {
    setBookmarks((current) => ({ ...current, [id]: !current[id] }));
  }

  function handleOpenTopic(topic: Topic) {
    setSelectedTopicId(topic.id);
    setActiveView("thread");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCreateTopic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") || "").trim();
    const category = String(formData.get("category") || "Start här");
    const excerpt = String(formData.get("excerpt") || "").trim();

    if (!title || !excerpt) return;

    setTopics((current) => [
      {
        id: `topic-${Date.now()}`,
        title,
        category,
        author: "Kevin",
        excerpt,
        replies: 0,
        baseVotes: 1,
        tags: ["new", "community"],
        updated: "nu",
        status: "open",
      },
      ...current,
    ]);
    setComposerOpen(false);
    event.currentTarget.reset();
  }

  function handleReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reportTarget) return;
    const formData = new FormData(event.currentTarget);
    const reason = String(formData.get("reason") || "Annat");

    setReports((current) => [
      {
        id: `report-${Date.now()}`,
        target: reportTarget.title,
        targetType: reportTarget.type,
        reason,
        reporter: "Kevin",
        priority: reason.includes("Olagligt") || reason.includes("Doxxing") ? "high" : "medium",
        status: "open",
        createdAt: "nu",
      },
      ...current,
    ]);
    setReportTarget(null);
    event.currentTarget.reset();
  }

  function updateReportStatus(id: string, status: Report["status"]) {
    setReports((current) =>
      current.map((report) => (report.id === id ? { ...report, status } : report)),
    );
  }

  function toggleParticipationSetting(key: keyof ParticipationSettings) {
    setParticipationSettings((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div
      className={`app-shell ${rightRailExpanded ? "right-rail-expanded" : "right-rail-collapsed"}`}
      data-theme={theme}
    >
      <Sidebar
        activeView={activeView}
        language={language}
        labels={labels}
        onNavigate={setActiveView}
        openReports={openReports.length}
      />

      <main className="main-area">
        <Topbar
          activeView={activeView}
          labels={labels}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreate={() => setComposerOpen(true)}
          guidelinesAccepted={guidelinesAccepted}
        />

        {activeView === "overview" && (
          <Overview
            topics={filteredTopics}
            prompts={seedPrompts}
            buildLogs={seedBuildLogs}
            mvps={seedMvps}
            voteScore={voteScore}
            onVote={handleVote}
            onReport={setReportTarget}
            onNavigate={setActiveView}
            onOpenTopic={handleOpenTopic}
            labels={labels}
          />
        )}

        {activeView === "reviewRooms" && <ReviewRoomsView labels={labels} />}

        {activeView === "forum" && (
          <ForumView
            categories={categories}
            topics={filteredTopics}
            voteScore={voteScore}
            onVote={handleVote}
            onReport={setReportTarget}
            onOpenTopic={handleOpenTopic}
          />
        )}

        {activeView === "thread" && selectedTopic && (
          <ThreadDetail
            topic={selectedTopic}
            replies={threadReplies[selectedTopic.id] ?? threadReplies.default}
            voteScore={voteScore}
            onVote={handleVote}
            onBack={() => setActiveView("forum")}
            onReport={setReportTarget}
          />
        )}

        {activeView === "prompts" && (
          <PromptBank
            prompts={seedPrompts}
            bookmarks={bookmarks}
            voteScore={voteScore}
            onVote={handleVote}
            onBookmark={handleBookmark}
            onReport={setReportTarget}
          />
        )}

        {activeView === "buildLogs" && <BuildLogs logs={seedBuildLogs} />}

        {activeView === "mvp" && <MvpScene projects={seedMvps} />}

        {activeView === "profiles" && <Profiles profiles={seedProfiles} />}

        {activeView === "guilds" && <Guilds />}

        {activeView === "governance" && <Governance proposals={seedProposals} />}

        {activeView === "moderation" && (
          <Moderation reports={reports} onUpdateStatus={updateReportStatus} />
        )}

        {activeView === "settings" && (
          <SettingsView
            labels={labels}
            language={language}
            theme={theme}
            participationSettings={participationSettings}
            onLanguageChange={setLanguage}
            onThemeChange={setTheme}
            onToggleParticipation={toggleParticipationSetting}
          />
        )}
      </main>

      <RightRail
        openReports={openReports}
        labels={labels}
        onNavigate={setActiveView}
        expanded={rightRailExpanded}
        onToggle={() => setRightRailExpanded((current) => !current)}
      />

      {composerOpen && (
        <ComposerModal
          guidelinesAccepted={guidelinesAccepted}
          onClose={() => setComposerOpen(false)}
          onAcceptGuidelines={handleAcceptGuidelines}
          onSubmit={handleCreateTopic}
        />
      )}

      {reportTarget && (
        <ReportModal
          target={reportTarget}
          onClose={() => setReportTarget(null)}
          onSubmit={handleReport}
        />
      )}
    </div>
  );
}

function Sidebar({
  activeView,
  language,
  labels,
  onNavigate,
  openReports,
}: {
  activeView: View;
  language: Language;
  labels: Labels;
  onNavigate: (view: View) => void;
  openReports: number;
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <LogoMark />
        <strong>kooperativet.ai</strong>
      </div>

      <nav className="nav-list" aria-label="Huvudnavigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${
              activeView === item.id || (activeView === "overview" && item.id === "forum")
                || (activeView === "thread" && item.id === "forum")
                ? "is-active"
                : ""
            }`}
            onClick={() => onNavigate(item.id)}
          >
            {item.icon}
            <span>{item.label[language]}</span>
            {item.id === "moderation" && openReports > 0 && (
              <small>{openReports}</small>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-shortcuts">
        <div className="shortcut-heading">
          <span>{labels.nav.shortcuts}</span>
          <Plus size={15} />
        </div>
        {["introduce-yourself", "review-rooms", "prompt-evals", "women-in-ai-builders", "sponsorship-circle"].map(
          (shortcut) => (
            <button key={shortcut} type="button">
              <Hash size={14} />
              <span>{shortcut}</span>
            </button>
          ),
        )}
      </div>

      <div className="sidebar-footer">
        <button type="button">
          <HelpCircle size={17} />
          {labels.nav.help}
        </button>
        <button type="button" onClick={() => onNavigate("settings")}>
          <Settings size={17} />
          {labels.nav.settings}
        </button>
        <button className="collapse-button" type="button" aria-label="Collapse sidebar">
          <ChevronsLeft size={18} />
        </button>
      </div>
    </aside>
  );
}

function Topbar({
  activeView,
  labels,
  searchQuery,
  setSearchQuery,
  onCreate,
  guidelinesAccepted,
}: {
  activeView: View;
  labels: Labels;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreate: () => void;
  guidelinesAccepted: boolean;
}) {
  const currentTitle = labels.topbar.titles[activeView];

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>{currentTitle[0]}</h1>
        <p>{currentTitle[1]}</p>
      </div>
      <div className="topbar-actions">
        <label className="search-box">
          <Search size={17} />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={labels.topbar.search}
          />
          <kbd>
            <Command size={13} />K
          </kbd>
        </label>
        <button
          className="primary-button"
          type="button"
          onClick={onCreate}
        >
          <Plus size={17} />
          {labels.topbar.newPost}
        </button>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 5v30" />
      <path d="M5 20h30" />
      <path d="M9.4 9.4 30.6 30.6" />
      <path d="M30.6 9.4 9.4 30.6" />
    </svg>
  );
}

function GuidelinesBanner({ onAccept }: { onAccept: () => void }) {
  return (
    <section className="guidelines-banner">
      <div>
        <h2>Godkänn community guidelines innan du deltar</h2>
        <p>
          Respektfullt språk, inga scams, ingen doxxing, ingen plagiering och
          inga farliga instruktioner. Rapporter hanteras av moderatorer och
          admins, inte av automatiserad AI.
        </p>
      </div>
      <button className="primary-button" type="button" onClick={onAccept}>
        <CheckCircle2 size={17} />
        Jag godkänner
      </button>
    </section>
  );
}

function Overview({
  topics,
  prompts,
  buildLogs,
  mvps,
  voteScore,
  onVote,
  onReport,
  onNavigate,
  onOpenTopic,
  labels,
}: {
  topics: Topic[];
  prompts: PromptItem[];
  buildLogs: BuildLog[];
  mvps: MvpProject[];
  voteScore: (id: string, base: number) => number;
  onVote: (id: string, delta: number) => void;
  onReport: (target: { id: string; title: string; type: string }) => void;
  onNavigate: (view: View) => void;
  onOpenTopic: (topic: Topic) => void;
  labels: Labels;
}) {
  return (
    <div className="forum-home">
      <div className="forum-hero-grid">
        <ReferencePanel title={labels.overview.categories} footer={labels.overview.viewAll} onFooter={() => onNavigate("forum")}>
          <CategoryOverview />
        </ReferencePanel>

        <ReferencePanel title={labels.overview.latest} action={labels.overview.viewAll} onAction={() => onNavigate("forum")} footer={labels.overview.viewAll}>
          <LatestDiscussionList topics={topics.slice(0, 5)} onOpenTopic={onOpenTopic} />
        </ReferencePanel>
      </div>

      <div className="forum-bottom-grid">
        <ReferencePanel title={labels.overview.verifiedPrompts} action={labels.overview.viewAll} onAction={() => onNavigate("prompts")} footer={labels.overview.browsePrompts}>
          <VerifiedPromptsPanel prompts={prompts.slice(0, 5)} />
        </ReferencePanel>

        <ReferencePanel title={labels.overview.buildLogs} action={labels.overview.viewAll} onAction={() => onNavigate("buildLogs")} footer={labels.overview.goBuildLogs}>
          <ActiveBuildLogsPanel logs={buildLogs.slice(0, 5)} />
        </ReferencePanel>

        <ReferencePanel title={labels.overview.mvp} action={labels.overview.viewAll} onAction={() => onNavigate("mvp")} footer={labels.overview.exploreMvp}>
          <MvpCollaborationsPanel projects={mvps.slice(0, 5)} />
        </ReferencePanel>
      </div>

      <div className="forum-bottom-grid modern-feature-grid">
        <ReferencePanel title={labels.overview.reviewRooms} action={labels.overview.viewAll} onAction={() => onNavigate("reviewRooms")} footer={labels.overview.openReviewRooms}>
          <ReviewRoomsCompact />
        </ReferencePanel>

        <ReferencePanel title={labels.overview.promptEvals} action={labels.overview.viewAll} onAction={() => onNavigate("prompts")} footer={labels.overview.viewEvals}>
          <PromptEvalsCompact />
        </ReferencePanel>

        <ReferencePanel title={labels.overview.inclusion} action={labels.overview.viewAll} onAction={() => onNavigate("settings")} footer={labels.overview.viewInclusion}>
          <InclusionSystemsCompact />
        </ReferencePanel>
      </div>
    </div>
  );
}

function ReferencePanel({
  title,
  action,
  footer,
  children,
  onAction,
  onFooter,
}: {
  title: string;
  action?: string;
  footer?: string;
  children: ReactNode;
  onAction?: () => void;
  onFooter?: () => void;
}) {
  return (
    <section className="reference-panel">
      <div className="reference-panel-heading">
        <h2>{title}</h2>
        {action && (
          <button className="reference-link" type="button" onClick={onAction}>
            {action}
          </button>
        )}
      </div>
      {children}
      {footer && (
        <button className="reference-footer" type="button" onClick={onFooter ?? onAction}>
          {footer}
        </button>
      )}
    </section>
  );
}

function CategoryOverview() {
  const categoryIcons = [MessageCircle, Sparkles, Code2, Hammer, Palette, Flame, UserRound];

  return (
    <div className="reference-category-list">
      {categories.map((category, index) => {
        const Icon = categoryIcons[index] ?? MessageCircle;
        return (
          <button className={index === 0 ? "is-selected" : ""} type="button" key={category.name}>
            <span>
              <Icon size={18} />
              {category.name}
            </span>
            <strong>{formatCount(category.topics)}</strong>
          </button>
        );
      })}
    </div>
  );
}

function LatestDiscussionList({
  topics,
  onOpenTopic,
}: {
  topics: Topic[];
  onOpenTopic?: (topic: Topic) => void;
}) {
  const colors = ["green", "violet", "photo", "blue", "photo-woman"];

  return (
    <div className="reference-discussion-list">
      {topics.map((topic, index) => (
        <article
          className={`reference-discussion-row ${onOpenTopic ? "is-clickable" : ""}`}
          key={topic.id}
          onClick={() => onOpenTopic?.(topic)}
          onKeyDown={(event) => {
            if (!onOpenTopic) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpenTopic(topic);
            }
          }}
          role={onOpenTopic ? "button" : undefined}
          tabIndex={onOpenTopic ? 0 : undefined}
        >
          <Avatar label={topic.author} tone={colors[index] ?? "green"} />
          <div>
            <h3>{topic.title}</h3>
            <p>
              {topic.author} in {topic.category}
            </p>
          </div>
          <span className="discussion-comments">
            <MessageCircle size={16} />
            {topic.replies}
          </span>
          <time>{topic.updated}</time>
        </article>
      ))}
    </div>
  );
}

function VerifiedPromptsPanel({ prompts }: { prompts: PromptItem[] }) {
  return (
    <div className="reference-small-list">
      {prompts.map((prompt) => (
        <article className="reference-small-row prompt-row" key={prompt.id}>
          <span className="prompt-diamond" />
          <div>
            <h3>{prompt.title}</h3>
            <p>{prompt.category}</p>
          </div>
          <span className="prompt-score">
            <Bookmark size={15} />
            {prompt.baseVotes}
          </span>
        </article>
      ))}
    </div>
  );
}

function ActiveBuildLogsPanel({ logs }: { logs: BuildLog[] }) {
  return (
    <div className="reference-small-list">
      {logs.map((log) => (
        <article className="reference-small-row build-reference-row" key={log.id}>
          <span className="repo-icon">
            <GitPullRequest size={15} />
          </span>
          <div>
            <h3>{log.title}</h3>
            <p>
              by {log.owner} <Eye size={13} /> {log.followers} <MessageCircle size={13} />{" "}
              {log.status === "Live" ? 5 : 2}
            </p>
          </div>
          <span className={`live-state ${log.status === "Live" ? "live" : "wip"}`}>
            {log.status}
          </span>
        </article>
      ))}
    </div>
  );
}

function MvpCollaborationsPanel({ projects }: { projects: MvpProject[] }) {
  const iconClasses = ["blue", "blue", "purple", "green", "purple"];

  return (
    <div className="reference-small-list">
      {projects.map((project, index) => (
        <article className="reference-small-row mvp-reference-row" key={project.id}>
          <span className={`mvp-icon ${iconClasses[index] ?? "blue"}`}>
            {index === 2 || index === 4 ? <Star size={16} /> : index === 3 ? <Leaf size={16} /> : <ShieldCheck size={16} />}
          </span>
          <div>
            <h3>{project.name}</h3>
            <p>{project.lookingFor[0]}</p>
          </div>
          <span className={`mvp-state ${project.status}`}>{project.status === "idea" ? "Planning" : project.status === "beta" ? "Seeking" : "Building"}</span>
        </article>
      ))}
    </div>
  );
}

function ReviewRoomsCompact() {
  return (
    <div className="reference-small-list">
      {reviewRooms.map((room) => (
        <article className="reference-small-row modern-row" key={room.name}>
          <span className="modern-icon review">
            <BadgeCheck size={16} />
          </span>
          <div>
            <h3>{room.name}</h3>
            <p>{room.mode}</p>
          </div>
          <strong>{room.open}</strong>
        </article>
      ))}
    </div>
  );
}

function PromptEvalsCompact() {
  return (
    <div className="reference-small-list">
      {promptEvals.map((evalItem) => (
        <article className="reference-small-row modern-row" key={evalItem.name}>
          <span className="modern-icon eval">
            <Wand2 size={16} />
          </span>
          <div>
            <h3>{evalItem.name}</h3>
            <p>{evalItem.metric}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function InclusionSystemsCompact() {
  return (
    <div className="reference-small-list">
      {inclusionSystems.map((system) => (
        <article className="reference-small-row modern-row" key={system.name}>
          <span className="modern-icon inclusion">
            <Handshake size={16} />
          </span>
          <div>
            <h3>{system.name}</h3>
            <p>{system.detail}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function Avatar({ label, tone }: { label: string; tone: string }) {
  const initials = label
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return <span className={`reference-avatar ${tone}`}>{initials}</span>;
}

function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

function ForumView({
  categories: forumCategories,
  topics,
  voteScore,
  onVote,
  onReport,
  onOpenTopic,
}: {
  categories: typeof categories;
  topics: Topic[];
  voteScore: (id: string, base: number) => number;
  onVote: (id: string, delta: number) => void;
  onReport: (target: { id: string; title: string; type: string }) => void;
  onOpenTopic: (topic: Topic) => void;
}) {
  return (
    <div className="content-stack">
      <Panel title="Kategorier">
        <div className="category-grid">
          {forumCategories.map((category) => (
            <article className="category-card" key={category.name}>
              <div className="category-heading">
                <h3>{category.name}</h3>
                {category.locked && <Lock size={16} aria-label="Låst kategori" />}
              </div>
              <p>{category.description}</p>
              <div className="category-stats">
                <span>{category.topics} topics</span>
                <span>{category.posts} inlägg</span>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title="Trådar">
        <TopicList
          topics={topics}
          voteScore={voteScore}
          onVote={onVote}
          onReport={onReport}
          onOpenTopic={onOpenTopic}
        />
      </Panel>
    </div>
  );
}

function ReviewRoomsView({ labels }: { labels: Labels }) {
  return (
    <div className="content-stack">
      <SectionIntro
        icon={<BadgeCheck />}
        title={labels.topbar.titles.reviewRooms[0]}
        text={labels.topbar.titles.reviewRooms[1]}
      />

      <div className="review-room-grid">
        {reviewRooms.map((room) => (
          <article className="review-room-card" key={room.name}>
            <div className="review-room-heading">
              <span className="modern-icon review">
                <BadgeCheck size={18} />
              </span>
              <div>
                <h3>{room.name}</h3>
                <p>{room.mode}</p>
              </div>
            </div>
            <p>{room.focus}</p>
            <div className="marker-row">
              {room.safeguards.map((safeguard) => (
                <span key={safeguard}>{safeguard}</span>
              ))}
            </div>
            <div className="review-room-footer">
              <strong>{room.open}</strong>
              <span>open reviews</span>
              <button className="secondary-button" type="button">
                <MessageCircle size={16} />
                Join room
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="settings-grid">
        <Panel title="Prompt evals and provenance">
          <div className="feature-ledger">
            {promptEvals.map((evalItem) => (
              <article key={evalItem.name}>
                <span className="modern-icon eval">
                  <Wand2 size={16} />
                </span>
                <div>
                  <h3>{evalItem.name}</h3>
                  <p>{evalItem.detail}</p>
                  <strong>{evalItem.metric}</strong>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Inclusive participation systems">
          <div className="feature-ledger">
            {inclusionSystems.map((system) => (
              <article key={system.name}>
                <span className="modern-icon inclusion">
                  <Handshake size={16} />
                </span>
                <div>
                  <h3>{system.name}</h3>
                  <p>{system.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function PromptBank({
  prompts,
  bookmarks,
  voteScore,
  onVote,
  onBookmark,
  onReport,
}: {
  prompts: PromptItem[];
  bookmarks: Record<string, boolean>;
  voteScore: (id: string, base: number) => number;
  onVote: (id: string, delta: number) => void;
  onBookmark: (id: string) => void;
  onReport: (target: { id: string; title: string; type: string }) => void;
}) {
  return (
    <div className="content-stack">
      <SectionIntro
        icon={<Wand2 />}
        title="Promptbank med versionshistorik"
        text="Promptar ska vara testbara, förbättringsbara och markerade med risk, modell och senaste testdatum."
      />

      <div className="prompt-grid">
        {prompts.map((prompt) => (
          <article className="prompt-card" key={prompt.id}>
            <div className="card-topline">
              <span className={`risk ${prompt.risk}`}>{prompt.risk}</span>
              <span>v{prompt.versions}</span>
            </div>
            <h3>{prompt.title}</h3>
            <p>{prompt.summary}</p>
            <div className="marker-row">
              {prompt.markers.map((marker) => (
                <span key={marker}>{marker}</span>
              ))}
            </div>
            <dl className="meta-grid">
              <div>
                <dt>Modell</dt>
                <dd>{prompt.model}</dd>
              </div>
              <div>
                <dt>Senast testad</dt>
                <dd>{prompt.lastTested}</dd>
              </div>
            </dl>
            <div className="item-actions">
              <VoteControls
                score={voteScore(prompt.id, prompt.baseVotes)}
                onUp={() => onVote(prompt.id, 1)}
                onDown={() => onVote(prompt.id, -1)}
              />
              <button
                className={`icon-button ${bookmarks[prompt.id] ? "is-selected" : ""}`}
                type="button"
                aria-label="Spara prompt"
                onClick={() => onBookmark(prompt.id)}
              >
                <Bookmark size={17} />
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() => onReport({ id: prompt.id, title: prompt.title, type: "prompt" })}
              >
                <Flag size={16} />
                Flagga
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function BuildLogs({ logs }: { logs: BuildLog[] }) {
  return (
    <div className="content-stack">
      <SectionIntro
        icon={<Hammer />}
        title="Byggloggar"
        text="Följ vad medlemmar bygger, vilka blockers de har och vad communityt kan hjälpa till med."
      />
      <BuildLogList logs={logs} expanded />
    </div>
  );
}

function MvpScene({ projects }: { projects: MvpProject[] }) {
  return (
    <div className="content-stack">
      <SectionIntro
        icon={<FolderKanban />}
        title="MVP-scenen"
        text="Presentera idéer, prototyper och beta-produkter. Markera om du vill testa, ge feedback eller bygga med."
      />
      <MvpList projects={projects} expanded />
    </div>
  );
}

function Profiles({ profiles }: { profiles: Profile[] }) {
  return (
    <div className="content-stack">
      <SectionIntro
        icon={<UserRound />}
        title="Profiler och matchning"
        text="Profiler visar vad medlemmar bygger, kan hjälpa med och söker. Det gör samarbeten konkreta."
      />
      <div className="profile-grid">
        {profiles.map((profile) => (
          <article className="profile-card" key={profile.id}>
            <div className="avatar">{profile.name.slice(0, 1)}</div>
            <div>
              <h3>{profile.name}</h3>
              <p className="profile-role">{profile.role}</p>
            </div>
            <p>{profile.building}</p>
            <div className="tag-row">
              {profile.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <div className="profile-footer">
              <strong>{profile.reputation}</strong>
              <span>{profile.badges.join(" • ")}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Guilds() {
  return (
    <div className="content-stack">
      <SectionIntro
        icon={<UsersRound />}
        title="Arbetsgrupper och gillen"
        text="Mindre grupper skapar ansvar, återkommande diskussioner och bättre kurering än ett öppet flöde ensamt."
      />
      <div className="guild-grid">
        {guilds.map((guild) => (
          <article className="guild-card" key={guild.name}>
            <div className="guild-icon">
              <UsersRound size={20} />
            </div>
            <h3>{guild.name}</h3>
            <p>{guild.focus}</p>
            <div className="guild-footer">
              <span>Steward: {guild.steward}</span>
              <strong>{guild.members} medlemmar</strong>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Governance({ proposals }: { proposals: Proposal[] }) {
  return (
    <div className="content-stack">
      <SectionIntro
        icon={<Vote />}
        title="Förslag & beslut"
        text="Kooperativ governance kräver synliga förslag, öppna diskussioner, omröstningar och beslutshistorik."
      />

      <div className="settings-grid">
        <section className="settings-panel">
          <div className="settings-panel-heading">
            <GitPullRequest size={18} />
            <h2>Open-source arbetsmodell</h2>
          </div>
          <p className="governance-copy">
            Kod, communityregler och större produktbeslut ska kunna diskuteras via GitHub issues, RFCs och pull requests.
          </p>
        </section>

        <section className="settings-panel">
          <div className="settings-panel-heading">
            <ShieldCheck size={18} />
            <h2>Delat ansvar</h2>
          </div>
          <p className="governance-copy">
            Stewards kan äga fokusområden som säkerhet, promptbank, inkludering och moderation, men beslut ska vara spårbara.
          </p>
        </section>
      </div>

      <Panel title="Aktiva förslag">
        <div className="governance-list">
          {proposals.map((proposal) => (
            <article className="governance-row" key={proposal.id}>
              <div>
                <span className={`status-pill ${proposal.status}`}>{proposal.status}</span>
                <h3>{proposal.title}</h3>
                <p>{proposal.summary}</p>
              </div>
              <div className="proposal-score">
                <strong>{proposal.votes}</strong>
                <span>röster</span>
                <small>{proposal.owner}</small>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Moderation({
  reports,
  onUpdateStatus,
}: {
  reports: Report[];
  onUpdateStatus: (id: string, status: Report["status"]) => void;
}) {
  return (
    <div className="content-stack">
      <SectionIntro
        icon={<Flag />}
        title="Manuell moderation"
        text="Flaggade objekt får notis, granskas av moderator/admin och loggas med beslut och motivering."
      />

      <Panel title="Rapporterade objekt">
        <div className="report-list">
          {reports.map((report) => (
            <article className="report-row" key={report.id}>
              <div className="report-priority">
                <span className={`priority-dot ${report.priority}`} />
              </div>
              <div>
                <div className="report-meta">
                  <span>{report.targetType}</span>
                  <span>{report.createdAt}</span>
                  <span>Rapporterad av {report.reporter}</span>
                </div>
                <h3>{report.target}</h3>
                <p>{report.reason}</p>
              </div>
              <div className="moderation-actions">
                <select
                  value={report.status}
                  onChange={(event) => onUpdateStatus(report.id, event.target.value as Report["status"])}
                  aria-label="Uppdatera status"
                >
                  <option value="open">open</option>
                  <option value="reviewing">reviewing</option>
                  <option value="resolved">resolved</option>
                  <option value="dismissed">dismissed</option>
                  <option value="escalated">escalated</option>
                </select>
                <button className="ghost-button" type="button">
                  <Archive size={16} />
                  Logga beslut
                </button>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function SettingsView({
  labels,
  language,
  theme,
  participationSettings,
  onLanguageChange,
  onThemeChange,
  onToggleParticipation,
}: {
  labels: Labels;
  language: Language;
  theme: Theme;
  participationSettings: ParticipationSettings;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: Theme) => void;
  onToggleParticipation: (key: keyof ParticipationSettings) => void;
}) {
  return (
    <div className="content-stack">
      <SectionIntro
        icon={<SlidersHorizontal />}
        title={labels.settings.title}
        text={labels.topbar.titles.settings[1]}
      />

      <div className="settings-grid">
        <section className="settings-panel">
          <div className="settings-panel-heading">
            <Languages size={18} />
            <h2>{labels.settings.language}</h2>
          </div>
          <div className="segmented-control" role="group" aria-label={labels.settings.language}>
            <button
              className={language === "sv" ? "is-selected" : ""}
              type="button"
              onClick={() => onLanguageChange("sv")}
            >
              {labels.settings.swedish}
            </button>
            <button
              className={language === "en" ? "is-selected" : ""}
              type="button"
              onClick={() => onLanguageChange("en")}
            >
              {labels.settings.english}
            </button>
          </div>
        </section>

        <section className="settings-panel">
          <div className="settings-panel-heading">
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            <h2>{labels.settings.theme}</h2>
          </div>
          <div className="segmented-control" role="group" aria-label={labels.settings.theme}>
            <button
              className={theme === "light" ? "is-selected" : ""}
              type="button"
              onClick={() => onThemeChange("light")}
            >
              <Sun size={15} />
              {labels.settings.light}
            </button>
            <button
              className={theme === "dark" ? "is-selected" : ""}
              type="button"
              onClick={() => onThemeChange("dark")}
            >
              <Moon size={15} />
              {labels.settings.dark}
            </button>
          </div>
        </section>
      </div>

      <Panel title={labels.settings.participation}>
        <div className="settings-toggle-list">
          <ToggleRow
            label={labels.settings.dms}
            checked={participationSettings.trustedDms}
            onToggle={() => onToggleParticipation("trustedDms")}
          />
          <ToggleRow
            label={labels.settings.constructive}
            checked={participationSettings.constructiveDownvotes}
            onToggle={() => onToggleParticipation("constructiveDownvotes")}
          />
          <ToggleRow
            label={labels.settings.pulse}
            checked={participationSettings.belongingPulse}
            onToggle={() => onToggleParticipation("belongingPulse")}
          />
        </div>
      </Panel>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <i aria-hidden="true" />
    </label>
  );
}

function ThreadDetail({
  topic,
  replies,
  voteScore,
  onVote,
  onBack,
  onReport,
}: {
  topic: Topic;
  replies: ThreadReply[];
  voteScore: (id: string, base: number) => number;
  onVote: (id: string, delta: number) => void;
  onBack: () => void;
  onReport: (target: { id: string; title: string; type: string }) => void;
}) {
  return (
    <div className="thread-detail">
      <button className="thread-back-button" type="button" onClick={onBack}>
        <ArrowLeft size={16} />
        Tillbaka till trådar
      </button>

      <section className="thread-hero">
        <div className="thread-hero-main">
          <div className="row-meta">
            <span>{topic.category}</span>
            <span>{topic.updated}</span>
            {topic.status === "verified" && (
              <span className="verified">
                <BadgeCheck size={14} />
                verifierad
              </span>
            )}
          </div>
          <h2>{topic.title}</h2>
          <p>{topic.excerpt}</p>
          <div className="tag-row">
            {topic.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="thread-hero-actions">
          <VoteControls
            score={voteScore(topic.id, topic.baseVotes)}
            onUp={() => onVote(topic.id, 1)}
            onDown={() => onVote(topic.id, -1)}
          />
          <button className="secondary-button" type="button">
            <Bell size={16} />
            Följ
          </button>
          <button className="ghost-button" type="button">
            <Link2 size={16} />
            Dela
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => onReport({ id: topic.id, title: topic.title, type: "topic" })}
          >
            <Flag size={16} />
            Flagga
          </button>
        </div>
      </section>

      <div className="thread-layout">
        <section className="thread-post-stack" aria-label="Trådsvar">
          <article className="thread-post original-post">
            <div className="post-author">
              <Avatar label={topic.author} tone="green" />
              <div>
                <strong>{topic.author}</strong>
                <span>Original poster • Product builder</span>
              </div>
            </div>
            <div className="post-body">
              <p>
                I am trying to design the first five minutes of an AI-native product where
                people understand the real workflow quickly, but still feel in control.
                What should the first screen do before the product starts asking for data,
                prompts, or integrations?
              </p>
              <div className="post-callout">
                <ShieldCheck size={18} />
                <span>Feedbackläge: nybörjarvänligt, konkret och utan dogpiling.</span>
              </div>
            </div>
          </article>

          {replies.map((reply) => (
            <article className={`thread-post ${reply.accepted ? "is-accepted" : ""}`} key={reply.id}>
              <div className="post-author">
                <Avatar label={reply.author} tone={reply.tone} />
                <div>
                  <strong>{reply.author}</strong>
                  <span>
                    {reply.handle} • {reply.role} • {reply.time}
                  </span>
                </div>
              </div>
              <div className="post-body">
                {reply.accepted && (
                  <span className="accepted-answer">
                    <BadgeCheck size={15} />
                    Markerad som hjälpsamt svar
                  </span>
                )}
                <p>{reply.body}</p>
                <div className="marker-row">
                  {reply.badges.map((badge) => (
                    <span key={badge}>{badge}</span>
                  ))}
                </div>
                {reply.moderatorNote && (
                  <div className="moderator-note">
                    <ShieldCheck size={16} />
                    <span>{reply.moderatorNote}</span>
                  </div>
                )}
              </div>
              <div className="post-actions">
                <VoteControls
                  score={voteScore(reply.id, reply.baseVotes)}
                  onUp={() => onVote(reply.id, 1)}
                  onDown={() => onVote(reply.id, -1)}
                />
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => onReport({ id: reply.id, title: `Svar av ${reply.author}`, type: "comment" })}
                >
                  <Flag size={15} />
                  Flagga
                </button>
              </div>
            </article>
          ))}

          <section className="reply-composer-panel">
            <div>
              <h3>Skriv ett svar</h3>
              <p>Fokusera på erfarenhet, tydliga exempel och nästa steg.</p>
            </div>
            <textarea
              aria-label="Svarsinnehåll"
              placeholder="Dela ett mönster, en tradeoff eller ett konkret exempel..."
              rows={5}
            />
            <div className="reply-composer-actions">
              <button className="ghost-button" type="button">
                Spara utkast
              </button>
              <button className="primary-button" type="button">
                <Send size={16} />
                Publicera svar
              </button>
            </div>
          </section>
        </section>

        <aside className="thread-aside" aria-label="Trådkontext">
          <section className="thread-context-panel">
            <h3>Trådstatus</h3>
            <dl className="thread-facts">
              <div>
                <dt>Svar</dt>
                <dd>{topic.replies}</dd>
              </div>
              <div>
                <dt>Bevakare</dt>
                <dd>128</dd>
              </div>
              <div>
                <dt>Review mode</dt>
                <dd>Gentle first review</dd>
              </div>
              <div>
                <dt>Moderation</dt>
                <dd>Manuell flaggning</dd>
              </div>
            </dl>
          </section>

          <section className="thread-context-panel">
            <h3>Resurser från tråden</h3>
            <div className="thread-resource-list">
              <button type="button">
                <Wand2 size={16} />
                AI onboarding prompt template
              </button>
              <button type="button">
                <ShieldCheck size={16} />
                Data boundary checklist
              </button>
              <button type="button">
                <BookOpen size={16} />
                Convert thread to guide
              </button>
            </div>
          </section>

          <section className="thread-context-panel">
            <h3>Kooperativ matchning</h3>
            <p>
              2 medlemmar bygger onboardingflöden just nu och 1 söker UX-review.
            </p>
            <button className="secondary-button" type="button">
              <Handshake size={16} />
              Visa matchningar
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function RightRail({
  openReports,
  labels,
  onNavigate,
  expanded,
  onToggle,
}: {
  openReports: Report[];
  labels: Labels;
  onNavigate: (view: View) => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const reportCount = Math.max(openReports.length, 5);

  return (
    <aside className={`right-rail ${expanded ? "is-expanded" : "is-collapsed"}`} aria-label="Community utilities">
      <button
        className="rail-toggle"
        type="button"
        aria-label={expanded ? "Minimera sidopanel" : "Visa sidopanel"}
        aria-expanded={expanded}
        onClick={onToggle}
      >
        {expanded ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
      </button>

      {!expanded && (
        <div className="rail-icon-stack">
          <button className="rail-avatar-button" type="button" aria-label="Visa profilpanel" onClick={onToggle}>
            <span className="profile-photo">
              <span>EN</span>
              <i />
            </span>
          </button>
          <button
            className="rail-utility-button"
            type="button"
            aria-label={`${reportCount} flaggade objekt`}
            onClick={() => onNavigate("moderation")}
          >
            <Flag size={18} />
            <span>{reportCount}</span>
          </button>
          <button className="rail-utility-button" type="button" aria-label="Visa community-ritualer" onClick={onToggle}>
            <CalendarDays size={18} />
          </button>
          <button className="rail-utility-button" type="button" aria-label="Visa badges" onClick={onToggle}>
            <Star size={18} />
          </button>
        </div>
      )}

      {expanded && (
        <>
      <section className="rail-panel profile-summary">
        <div className="profile-head">
          <div className="profile-photo">
            <span>EN</span>
            <i />
          </div>
          <div>
            <strong>Erik Nordström</strong>
            <span>@erikn</span>
            <b>Builder</b>
            <small>Member since Mar 2024</small>
          </div>
        </div>
        <div className="reputation-row">
          <div>
            <span>Reputation</span>
            <strong>1,842</strong>
          </div>
          <div>
            <span>Rank</span>
            <strong>Top 7%</strong>
          </div>
        </div>
        <div className="badges-heading">
          <h2>{labels.rail.badges}</h2>
          <button className="reference-link" type="button">
            {labels.rail.viewAll}
          </button>
        </div>
        <div className="badge-row">
          <BadgeTile tone="dark" icon={<Code2 size={18} />} />
          <BadgeTile tone="green" icon={<Leaf size={18} />} />
          <BadgeTile tone="blue" icon={<UsersRound size={18} />} />
          <BadgeTile tone="purple" icon={<Star size={18} />} />
          <BadgeTile tone="orange" icon={<Flame size={18} />} />
        </div>
      </section>

      <section className="rail-panel">
        <div className="rail-heading">
          <h2>{labels.rail.flagged}</h2>
          <button className="reference-link with-count" type="button" onClick={() => onNavigate("moderation")}>
            {labels.rail.viewAll} <span>{reportCount}</span>
          </button>
        </div>
        <div className="flagged-list">
          {[
            ["Prompt flagged in", "AI & Prompting", "12m"],
            ["Inappropriate content in", "General Discussion", "1h"],
            ["Spam report in", "Vibe Coding", "2h"],
            ["Off-topic in", "Tools & Integrations", "3h"],
            ["Misleading info in", "Launch & Growth", "5h"],
          ].map(([title, context, time]) => (
            <button key={`${title}-${context}`} type="button" onClick={() => onNavigate("moderation")}>
              <span>
                <strong>{title}</strong>
                <small>{context}</small>
              </span>
              <time>{time}</time>
            </button>
          ))}
        </div>
      </section>

      <section className="rail-panel">
        <div className="rail-heading">
          <h2>{labels.rail.rituals}</h2>
          <button className="reference-link" type="button">
            {labels.rail.viewAll}
          </button>
        </div>
        <ul className="ritual-list">
          {rituals.map((ritual, index) => (
            <li key={ritual.title}>
              {index === 0 ? <CalendarDays size={20} /> : index === 1 ? <MessageCircle size={20} /> : index === 2 ? <Rocket size={20} /> : <BookOpen size={20} />}
              <span>
                <strong>{ritual.title}</strong>
                <small>{ritual.date}</small>
              </span>
            </li>
          ))}
        </ul>
      </section>
        </>
      )}
    </aside>
  );
}

function BadgeTile({ tone, icon }: { tone: string; icon: ReactNode }) {
  return <span className={`badge-tile ${tone}`}>{icon}</span>;
}

function TopicList({
  topics,
  voteScore,
  onVote,
  onReport,
  onOpenTopic,
}: {
  topics: Topic[];
  voteScore: (id: string, base: number) => number;
  onVote: (id: string, delta: number) => void;
  onReport: (target: { id: string; title: string; type: string }) => void;
  onOpenTopic?: (topic: Topic) => void;
}) {
  return (
    <div className="topic-list">
      {topics.map((topic) => (
        <article
          className={`topic-row ${onOpenTopic ? "is-clickable" : ""}`}
          key={topic.id}
          onClick={() => onOpenTopic?.(topic)}
          onKeyDown={(event) => {
            if (!onOpenTopic) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpenTopic(topic);
            }
          }}
          role={onOpenTopic ? "button" : undefined}
          tabIndex={onOpenTopic ? 0 : undefined}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <VoteControls
              score={voteScore(topic.id, topic.baseVotes)}
              onUp={() => onVote(topic.id, 1)}
              onDown={() => onVote(topic.id, -1)}
            />
          </div>
          <div className="topic-content">
            <div className="row-meta">
              <span>{topic.category}</span>
              <span>{topic.updated}</span>
              {topic.status === "verified" && (
                <span className="verified">
                  <BadgeCheck size={14} />
                  verifierad
                </span>
              )}
            </div>
            <h3>{topic.title}</h3>
            <p>{topic.excerpt}</p>
            <div className="tag-row">
              {topic.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="row-actions" onClick={(event) => event.stopPropagation()}>
            <span>
              <MessageCircle size={15} />
              {topic.replies}
            </span>
            <button
              className="ghost-button"
              type="button"
              onClick={() => onReport({ id: topic.id, title: topic.title, type: "topic" })}
            >
              <Flag size={15} />
              Flagga
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function BuildLogList({ logs, expanded = false }: { logs: BuildLog[]; expanded?: boolean }) {
  return (
    <div className={`build-list ${expanded ? "is-expanded" : ""}`}>
      {logs.map((log) => (
        <article className="build-row" key={log.id}>
          <div>
            <span className="status-chip">{log.status}</span>
            <h3>{log.title}</h3>
            <p>{log.update}</p>
            {expanded && <p className="blocker">Blocker: {log.blockers}</p>}
          </div>
          <div className="build-meta">
            <span>{log.owner}</span>
            <span>{log.stack}</span>
            <strong>{log.followers} följer</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

function MvpList({ projects, expanded = false }: { projects: MvpProject[]; expanded?: boolean }) {
  return (
    <div className={`mvp-list ${expanded ? "is-expanded" : ""}`}>
      {projects.map((project) => (
        <article className="mvp-row" key={project.id}>
          <div>
            <span className={`status-chip ${project.status}`}>{project.status}</span>
            <h3>{project.name}</h3>
            <p>{project.pitch}</p>
            <div className="tag-row">
              {project.lookingFor.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div className="mvp-actions">
            <strong>{project.interest}</strong>
            <span>intressen</span>
            <button className="secondary-button" type="button">
              <Handshake size={16} />
              Jag kan hjälpa
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function PromptCompact({ prompt, score }: { prompt: PromptItem; score: number }) {
  return (
    <article className="compact-row">
      <div>
        <h3>{prompt.title}</h3>
        <p>{prompt.summary}</p>
      </div>
      <div className="compact-score">
        <BadgeCheck size={16} />
        <strong>{score}</strong>
      </div>
    </article>
  );
}

function Metric({
  icon,
  label,
  value,
  trend,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <article className="metric-card">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{trend}</small>
    </article>
  );
}

function Panel({
  title,
  children,
  actionLabel,
  onAction,
}: {
  title: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>{title}</h2>
        {actionLabel && (
          <button className="text-button" type="button" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function SectionIntro({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <section className="section-intro">
      <div className="section-icon">{icon}</div>
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </section>
  );
}

function VoteControls({
  score,
  onUp,
  onDown,
}: {
  score: number;
  onUp: () => void;
  onDown: () => void;
}) {
  return (
    <div className="vote-controls" aria-label="Röstning">
      <button type="button" onClick={onUp} aria-label="Upvote">
        <ThumbsUp size={15} />
      </button>
      <strong>{score}</strong>
      <button type="button" onClick={onDown} aria-label="Downvote">
        <ThumbsDown size={15} />
      </button>
    </div>
  );
}

function ComposerModal({
  guidelinesAccepted,
  onClose,
  onAcceptGuidelines,
  onSubmit,
}: {
  guidelinesAccepted: boolean;
  onClose: () => void;
  onAcceptGuidelines: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="composer-title">
        <div className="modal-heading">
          <h2 id="composer-title">Skapa ny tråd</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Stäng">
            <ChevronDown size={18} />
          </button>
        </div>
        {!guidelinesAccepted ? (
          <div className="modal-warning">
            <p>Du behöver godkänna community guidelines innan du kan posta.</p>
            <button className="primary-button" type="button" onClick={onAcceptGuidelines}>
              <CheckCircle2 size={17} />
              Jag godkänner
            </button>
          </div>
        ) : (
          <form className="form-stack" onSubmit={onSubmit}>
            <label>
              Titel
              <input name="title" required maxLength={120} placeholder="Vad vill du diskutera?" />
            </label>
            <label>
              Kategori
              <select name="category">
                {categories
                  .filter((category) => !category.locked)
                  .map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Innehåll
              <textarea
                name="excerpt"
                required
                rows={5}
                placeholder="Beskriv kontext, vad du testat och vilken hjälp du vill ha."
              />
            </label>
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={onClose}>
                Avbryt
              </button>
              <button className="primary-button" type="submit">
                Publicera
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

function ReportModal({
  target,
  onClose,
  onSubmit,
}: {
  target: { id: string; title: string; type: string };
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="report-title">
        <div className="modal-heading">
          <h2 id="report-title">Flagga för granskning</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Stäng">
            <ChevronDown size={18} />
          </button>
        </div>
        <p className="muted">Rapporter skickas till moderatorer och admins för manuell granskning.</p>
        <div className="reported-target">
          <span>{target.type}</span>
          <strong>{target.title}</strong>
        </div>
        <form className="form-stack" onSubmit={onSubmit}>
          <label>
            Orsak
            <select name="reason">
              <option>Spam</option>
              <option>Trakasserier</option>
              <option>Hat eller diskriminering</option>
              <option>Olagligt innehåll</option>
              <option>Skadlig kod eller farliga instruktioner</option>
              <option>Doxxing eller privat information</option>
              <option>Scam eller vilseledande innehåll</option>
              <option>Plagiering</option>
              <option>Annat</option>
            </select>
          </label>
          <label>
            Kontext
            <textarea name="context" rows={4} placeholder="Valfritt: vad bör moderatorn titta på?" />
          </label>
          <div className="modal-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Avbryt
            </button>
            <button className="danger-button" type="submit">
              <Flag size={16} />
              Skicka flaggning
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default App;
