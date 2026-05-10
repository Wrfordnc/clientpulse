"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mail,
  Menu,
  MessageSquare,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react";

const STORAGE_KEY = "pulse-clean-sandbox-v3";
const SIGNIN_KEY = "pulse-signed-in-v3";

type Account = {
  id: string;
  name: string;
  owner: string;
  value: number;
  stage: string;
};

type Touch = {
  id: string;
  accountId: string;
  type: string;
  summary: string;
  content: string;
  sentiment: "positive" | "neutral" | "concerned" | "negative";
  direction: "inbound" | "outbound" | "internal";
  occurredAt: string;
};

type ScoredAccount = Account & {
  score: ReturnType<typeof calculateScore>;
};

const navItems = ["Overview", "Accounts", "Activity", "Intelligence", "AI Task Manager", "Reports", "Admin"];

const starterAccounts: Account[] = [
  { id: "northstar", name: "Northstar Logistics", owner: "Danielle Hart", value: 142000, stage: "Expansion review" },
  { id: "summit", name: "Summit Insurance Group", owner: "James Carter", value: 98000, stage: "Renewal planning" },
  { id: "harbortech", name: "HarborTech Services", owner: "Nora Patel", value: 201000, stage: "Recovery discussion" },
  { id: "evergreen", name: "Evergreen Medical", owner: "Marcus Flynn", value: 76000, stage: "Onboarding" },
  { id: "atlas", name: "Atlas Retail Partners", owner: "Sarah Mitchell", value: 121000, stage: "Budget planning" },
  { id: "ironwood", name: "Ironwood Systems", owner: "Dana Lewis", value: 189000, stage: "Executive alignment" },
  { id: "silvergate", name: "Silvergate Pharma", owner: "Henry Liu", value: 168000, stage: "Expansion signal" },
  { id: "clearwater", name: "Clearwater Supply", owner: "Janelle Price", value: 96000, stage: "Healthy cadence" },
];

const starterTouches: Touch[] = [
  {
    id: "1",
    accountId: "northstar",
    type: "Email",
    summary: "Client requested updated expansion projections.",
    content: "Austyn asked for updated expansion projections before the next planning call.",
    sentiment: "positive",
    direction: "inbound",
    occurredAt: daysAgo(1),
  },
  {
    id: "2",
    accountId: "harbortech",
    type: "Meeting",
    summary: "Concern around delayed implementation milestone.",
    content: "Client raised concern about delayed milestone and requested a clearer recovery plan.",
    sentiment: "concerned",
    direction: "inbound",
    occurredAt: daysAgo(4),
  },
  {
    id: "3",
    accountId: "summit",
    type: "Call",
    summary: "Renewal timing discussion completed successfully.",
    content: "Renewal timing conversation was positive. Client asked for a concise implementation timeline.",
    sentiment: "positive",
    direction: "outbound",
    occurredAt: daysAgo(2),
  },
  {
    id: "4",
    accountId: "atlas",
    type: "Email",
    summary: "Budget review timing is unclear.",
    content: "Account owner noted that budget review timing may have shifted.",
    sentiment: "neutral",
    direction: "internal",
    occurredAt: daysAgo(6),
  },
];

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function daysSince(dateString: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)));
}

function money(value: number) {
  return `$${Math.round(value / 1000)}K`;
}

function calculateScore(account: Account, touches: Touch[]) {
  const accountTouches = touches
    .filter((touch) => touch.accountId === account.id)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  const latest = accountTouches[0];
  const days = latest ? daysSince(latest.occurredAt) : 30;
  const positive = accountTouches.filter((t) => t.sentiment === "positive").length;
  const concerned = accountTouches.filter((t) => t.sentiment === "concerned" || t.sentiment === "negative").length;
  const inbound = accountTouches.filter((t) => t.direction === "inbound").length;

  const trust = clamp(78 + positive * 4 - concerned * 8 + inbound * 2, 45, 98);
  const engagement = clamp(96 - days * 5 + accountTouches.length * 3, 35, 98);
  const momentum = clamp(78 + positive * 5 - concerned * 7 - days * 2, 38, 96);
  const stability = clamp(84 - concerned * 8 + Math.min(accountTouches.length * 2, 8), 42, 96);
  const opportunity = clamp(48 + Math.round(account.value / 6500) + positive * 2, 40, 95);

  const overall = Math.round(trust * 0.3 + engagement * 0.25 + momentum * 0.2 + stability * 0.15 + opportunity * 0.1);

  const priority = overall >= 84 ? "Looking good" : overall >= 75 ? "Good timing" : overall >= 65 ? "Follow up" : "Needs a look";
  const trend = momentum >= 82 ? "Improving" : momentum < 65 ? "Declining" : "Stable";

  const narrative =
    overall >= 84
      ? `${account.name} shows strong continuity with steady momentum. Attention need is low right now.`
      : overall >= 72
      ? `${account.name} appears stable overall. A timely check-in would help maintain engagement clarity and forward momentum.`
      : `${account.name} may need thoughtful attention. Engagement has softened and a clear follow-up could help rebuild momentum.`;

  const action =
    priority === "Needs a look"
      ? "Schedule a direct check-in with one clear next step."
      : priority === "Follow up"
      ? "Close the open loop with a concise follow-up."
      : priority === "Good timing"
      ? "Use the current momentum to explore next opportunities."
      : "Maintain cadence and continue monitoring.";

  return { overall, trust, engagement, momentum, stability, opportunity, priority, trend, narrative, action };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export default function Page() {
  const [authState, setAuthState] = useState<"login" | "loading" | "dashboard">("login");
  const [activeTab, setActiveTab] = useState("Overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>(starterAccounts);
  const [touches, setTouches] = useState<Touch[]>(starterTouches);
  const [selectedAccountId, setSelectedAccountId] = useState("northstar");
  const [query, setQuery] = useState("");

  const [selectedTouch, setSelectedTouch] = useState<Touch | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [newAccount, setNewAccount] = useState({ name: "", owner: "", value: "" });
  const [newTouch, setNewTouch] = useState({
    type: "Email",
    sentiment: "neutral" as Touch["sentiment"],
    direction: "outbound" as Touch["direction"],
    summary: "",
    content: "",
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
const [theme, setTheme] = useState("Purple graphite");
const [density, setDensity] = useState("Comfortable");
const [showScores, setShowScores] = useState(true);
const [showTimeline, setShowTimeline] = useState(true);
const [mobileSectionsOpen, setMobileSectionsOpen] = useState({
  focus: true,
  metrics: false,
  accounts: true,
  ai: false,
});


  useEffect(() => {
    if (localStorage.getItem(SIGNIN_KEY) === "true") setAuthState("dashboard");
    const savedTheme = localStorage.getItem("pulse-theme");
const savedDensity = localStorage.getItem("pulse-density");

useEffect(() => {
  localStorage.setItem("pulse-theme", theme);
  localStorage.setItem("pulse-density", density);
}, [theme, density]);

if (savedTheme) setTheme(savedTheme);
if (savedDensity) setDensity(savedDensity);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAccounts(parsed.accounts || starterAccounts);
        setTouches(parsed.touches || starterTouches);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accounts, touches }));
  }, [accounts, touches]);

  const scoredAccounts: ScoredAccount[] = useMemo(
    () => accounts.map((account) => ({ ...account, score: calculateScore(account, touches) })),
    [accounts, touches]
  );

  const selectedAccount = scoredAccounts.find((a) => a.id === selectedAccountId) || scoredAccounts[0];
  const accountTouches = touches.filter((t) => t.accountId === selectedAccount?.id).sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  const attention = [...scoredAccounts].sort((a, b) => a.score.overall - b.score.overall).slice(0, 3);
  const filteredAccounts = scoredAccounts.filter((a) => `${a.name} ${a.owner} ${a.stage}`.toLowerCase().includes(query.toLowerCase()));

  function signIn() {
    setAuthState("loading");
    setTimeout(() => {
      localStorage.setItem(SIGNIN_KEY, "true");
      setAuthState("dashboard");
    }, 1400);
  }

  function logout() {
    localStorage.removeItem(SIGNIN_KEY);
    setAuthState("login");
  }

  function goTab(tab: string) {
    setActiveTab(tab);
    setSelectedTouch(null);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

function runSimulatedAI() {
  const lowerPrompt = aiPrompt.toLowerCase();

  const wantsChart =
    lowerPrompt.includes("chart") ||
    lowerPrompt.includes("graph") ||
    lowerPrompt.includes("visual");

  const wantsTable =
    lowerPrompt.includes("table") ||
    lowerPrompt.includes("spreadsheet");

  const lowAccounts = scoredAccounts
    .filter((a: ScoredAccount) => a.score.overall < 75)
    .slice(0, 5);

  const strongestAccounts = [...scoredAccounts]
    .sort((a: ScoredAccount, b: ScoredAccount) => b.score.overall - a.score.overall)
    .slice(0, 5);

  const avgScore = Math.round(
    scoredAccounts.reduce(
      (s: number, a: ScoredAccount) => s + a.score.overall,
      0
    ) / scoredAccounts.length
  );

  let response = `
Relationship Intelligence Report
────────────────────────────

Portfolio Summary
• Average Pulse Score: ${avgScore}
• Accounts Requiring Attention: ${lowAccounts.length}
• Strong Momentum Relationships: ${strongestAccounts.length}

Key Observations
• Engagement stability is generally healthy across the sandbox portfolio.
• Several relationships show declining responsiveness and should receive proactive outreach.
• High-trust accounts continue demonstrating strong momentum after recent strategic conversations.

Recommended Actions
1. Re-engage lower scoring accounts within 7 days.
2. Schedule executive-level continuity conversations for strategic clients.
3. Review relationships showing declining engagement rhythm.

`;

  if (wantsChart) {
    response += `
Relationship Pulse Distribution (Chart)
███████████████ 90-100
███████████     80-89
██████          70-79
███             Below 70

Momentum Trend
↗ Positive momentum detected in enterprise accounts.
`;
  }

  if (wantsTable) {
    response += `
Priority Accounts Table
────────────────────────────────────────
Name                 | Pulse | Attention
────────────────────────────────────────
${lowAccounts
  .map(
    (a: ScoredAccount) =>
      `${a.name.padEnd(20)} | ${String(a.score.overall).padEnd(5)} | High`
  )
  .join("\n")}
`;
  }

  response += `
Narrative Summary
Pulse indicates generally healthy continuity across the portfolio, though several accounts display elevated attention need due to slower engagement patterns and reduced communication consistency.
`;

  setAiResponse(response);
}
  function addAccount() {
    if (!newAccount.name.trim()) return;
    const account: Account = {
      id: newId(),
      name: newAccount.name.trim(),
      owner: newAccount.owner.trim() || "Unassigned",
      value: Number(newAccount.value || 0),
      stage: "New relationship",
    };
    setAccounts((prev) => [account, ...prev]);
    setSelectedAccountId(account.id);
    setNewAccount({ name: "", owner: "", value: "" });
  }

  function logTouch() {
    if (!selectedAccount || !newTouch.summary.trim()) return;
    const touch: Touch = {
      id: newId(),
      accountId: selectedAccount.id,
      ...newTouch,
      occurredAt: new Date().toISOString(),
    };
    setTouches((prev) => [touch, ...prev]);
    setNewTouch({ type: "Email", sentiment: "neutral", direction: "outbound", summary: "", content: "" });
  }

  function resetSandbox() {
    setAccounts(starterAccounts);
    setTouches(starterTouches);
    setSelectedAccountId("northstar");
    localStorage.removeItem(STORAGE_KEY);
  }

  if (authState === "login") return <LoginScreen onSignIn={signIn} />;
  if (authState === "loading") return <LoadingScreen />;

  return (
<main
  className={`min-h-screen text-white ${
    theme === "Soft graphite"
      ? "bg-[radial-gradient(circle_at_top_left,#2b2b35_0%,#13141a_44%,#040406_100%)]"
      : theme === "Deep blush"
      ? "bg-[radial-gradient(circle_at_top_left,#3a1c33_0%,#18111d_44%,#040406_100%)]"
      : "bg-[radial-gradient(circle_at_top_left,#30203b_0%,#13141a_44%,#040406_100%)]"
  }`}
>      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,165,184,0.10),transparent_32%),radial-gradient(circle_at_82%_8%,rgba(190,150,220,0.10),transparent_30%)]" />

      <MobileHeader activeTab={activeTab} goTab={goTab} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
      <DesktopSidebar activeTab={activeTab} goTab={goTab} logout={logout} />

      <section className="relative px-5 pb-32 pt-6 lg:ml-64 lg:px-10 lg:pb-10 lg:pt-8">
        <TopHero

  attention={attention}

  notificationsOpen={notificationsOpen}

  setNotificationsOpen={setNotificationsOpen}

  setSelectedAccountId={setSelectedAccountId}

  goTab={goTab}
  />

        {activeTab === "Overview" && (
<OverviewTab
  scoredAccounts={scoredAccounts}
  accounts={accounts}
  touches={touches}
  attention={attention}
  setSelectedAccountId={setSelectedAccountId}
  goTab={goTab}
  selectedAccount={selectedAccount}
  mobileSectionsOpen={mobileSectionsOpen}
  setMobileSectionsOpen={setMobileSectionsOpen}
/>        )}

        {activeTab === "Accounts" && (
          <AccountsTab
            query={query}
            setQuery={setQuery}
            filteredAccounts={filteredAccounts}
            selectedAccount={selectedAccount}
            selectedAccountId={selectedAccountId}
            setSelectedAccountId={setSelectedAccountId}
            accountTouches={accountTouches}
            newTouch={newTouch}
            setNewTouch={setNewTouch}
            logTouch={logTouch}
            newAccount={newAccount}
            setNewAccount={setNewAccount}
            addAccount={addAccount}
          />
        )}

        {activeTab === "Activity" && (
<ActivityTab
  touches={touches}
  accounts={scoredAccounts}
  selectedTouch={selectedTouch}
  setSelectedTouch={setSelectedTouch}
  selectedAccount={selectedAccount}
  newTouch={newTouch}
  setNewTouch={setNewTouch}
  logTouch={logTouch}
/>        )}

        {activeTab === "Intelligence" && <IntelligenceTab accounts={scoredAccounts} />}

{activeTab === "AI Task Manager" && (          <AITab aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} aiResponse={aiResponse} runAI={runSimulatedAI} />
        )}

        {activeTab === "Reports" && <ReportsTab accounts={scoredAccounts} touches={touches} />}

{activeTab === "Admin" && (
  <AdminTab
    resetSandbox={resetSandbox}
    theme={theme}
    setTheme={setTheme}
    density={density}
    setDensity={setDensity}
  />
)}      </section>
    </main>
  );
}

function TopHero({ attention, notificationsOpen, setNotificationsOpen, setSelectedAccountId, goTab }: any) {
  return (
    <div className="relative mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="text-lg text-[#d8c8dc]/75">{getGreeting()}, Danielle.</p>
        <h1 className="mt-3 max-w-4xl text-[2.75rem] font-medium leading-[1.02] tracking-[-0.055em] sm:text-5xl lg:text-[4rem]">
          Relationship continuity at a glance.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#d8c8dc]/70">
          Pulse helps account teams interpret relationship patterns, maintain continuity, and identify attention needs before they become churn risk.
        </p>
      </div>

      <div className="shrink-0 self-start lg:self-start">
        <div className="flex items-center gap-2 rounded-[1.35rem] border border-[#d8a5b8]/12 bg-[#15111d]/75 p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d8a5b8]/12 bg-white/[0.055] text-[#f1d6e2] transition hover:bg-[#d8a5b8]/12"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#d8a5b8] text-[11px] font-semibold text-[#17141c] shadow-[0_8px_24px_rgba(216,165,184,0.35)]">
              {attention.length}
            </span>
          </button>

          <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#f1dbe5_0%,#d8a5b8_55%,#b98bb1_100%)] text-sm font-semibold text-[#17141c] shadow-[0_12px_35px_rgba(216,165,184,0.20)] sm:flex">
            DH
          </div>
        </div>

        {notificationsOpen && (
          <div className="absolute right-0 top-20 z-50 w-[340px] rounded-[2rem] border border-[#d8a5b8]/12 bg-[#15111d] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <p className="text-sm text-[#d8c8dc]/70">Important updates</p>
            <h3 className="mt-1 text-xl font-medium">Attention items</h3>

            <div className="mt-4 space-y-3">
              {attention.map((account: ScoredAccount) => (
                <button
                  key={account.id}
                  onClick={() => {
                    setSelectedAccountId(account.id);
                    setNotificationsOpen(false);
                    goTab("Accounts");
                  }}
                  className="w-full rounded-2xl border border-white/8 bg-white/[0.045] p-4 text-left hover:bg-white/[0.08]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{account.name}</p>
                    <ScorePill score={account.score.overall} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#d8c8dc]/70">{account.score.action}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoginScreen({ onSignIn }: { onSignIn: () => void }) {
  return (
<main
className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#3a2444_0%,#111118_44%,#030305_100%)] text-white">     <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,165,184,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(190,150,220,0.14),transparent_30%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full gap-16 lg:grid-cols-[1.1fr_.9fr]">
          <section className="hidden lg:flex lg:flex-col lg:justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d8a5b8]/20 bg-white/[0.06] px-4 py-2 text-xs tracking-[0.16em] text-[#f1d6e2]">
              <Sparkles className="h-4 w-4" />
              Calm intelligence, not dashboard noise.
            </div>

            <h1 className="mt-10 max-w-3xl text-7xl font-medium leading-[0.95] tracking-[-0.05em]">
              Relationship intelligence that helps teams stay ahead of drift.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-9 text-[#d8c8dc]/78">
              Pulse centralizes relationship signals, interprets engagement momentum, and surfaces continuity insights before small gaps become churn risk.
            </p>

            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
              <MarketingStat value="84" label="Avg Pulse" />
              <MarketingStat value="3" label="Need Attention" />
              <MarketingStat value="18%" label="Less Drift" />
            </div>

            <div className="mt-8 rounded-[2rem] border border-[#d8a5b8]/12 bg-[linear-gradient(145deg,rgba(216,165,184,0.12),rgba(255,255,255,0.04))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#d8c8dc]/70">Live relationship signal</p>
                  <p className="mt-1 text-lg font-medium text-white">HarborTech may need a thoughtful check-in.</p>
                </div>
                <PulseMark health={61} />
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-md rounded-[2.2rem] border border-[#d8a5b8]/16 bg-[linear-gradient(145deg,rgba(42,32,55,0.92),rgba(20,16,27,0.88))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[linear-gradient(145deg,#17101f_0%,#4a334f_55%,#c79eb3_100%)] shadow-[0_18px_60px_rgba(216,165,184,0.22)]">
                <Activity className="h-8 w-8 animate-pulse" />
              </div>
              <h1 className="mt-6 text-6xl font-semibold tracking-[-0.04em]">pulse</h1>
              <div className="mx-auto mt-4 h-px w-16 rounded-full bg-[#d8a5b8]" />
              <p className="mt-5 text-xl font-light text-[#e7dbe9]">Relationship Intelligence</p>
            </div>

            <div className="mt-12 space-y-4">
              <input placeholder="Email" className="h-14 w-full rounded-2xl border border-[#d8a5b8]/12 bg-white/[0.07] px-4 text-white outline-none" />
              <input type="password" placeholder="Password" className="h-14 w-full rounded-2xl border border-[#d8a5b8]/12 bg-white/[0.07] px-4 text-white outline-none" />

              <button
                onClick={onSignIn}
                className="mt-6 h-14 w-full rounded-2xl bg-[linear-gradient(135deg,#f1dbe5_0%,#d8a5b8_45%,#b98bb1_100%)] text-sm font-semibold text-[#17141c] shadow-[0_18px_60px_rgba(216,165,184,0.24)] transition hover:scale-[1.015]"
              >
                Try Sandbox Demo
              </button>

<button
  onClick={onSignIn}
  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] text-sm text-white transition hover:bg-white/[0.10]"
>
  Sign In
</button>            </div>

            <div className="mt-8 flex items-center justify-between text-sm text-[#d8c8dc]/72">
              <button>Forgot password?</button>
              <button>Create workspace</button>
            </div>
            <p className="mt-10 text-center text-xs text-[#d8c8dc]/45">© 2026 ClientPulse</p>
          </section>
        </div>
      </div>
    </main>
  );
}

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#34203e_0%,#121119_42%,#040406_100%)] px-6 text-white">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[linear-gradient(145deg,#17101f_0%,#4a334f_55%,#c79eb3_100%)] shadow-[0_24px_80px_rgba(216,165,184,0.22)]">
          <Activity className="h-10 w-10 animate-pulse" />
        </div>
        <h1 className="mt-10 text-4xl font-medium tracking-[-0.03em]">Reading relationship signals…</h1>
      </div>
    </main>
  );
}

function ActivityTab({
  touches,
  accounts,
  selectedTouch,
  setSelectedTouch,
  selectedAccount,
  newTouch,
  setNewTouch,
  logTouch,
}: any) {
  if (selectedTouch) {
    return (
      <Panel title={selectedTouch.summary} subtitle={selectedTouch.type}>
        <button
          onClick={() => setSelectedTouch(null)}
          className="text-sm text-[#d8c8dc]/75"
        >
          Back to activity
        </button>

        <div className="rounded-3xl border border-white/8 bg-white/[0.045] p-5">
          <p className="text-sm text-[#d8c8dc]/70">
            Sentiment: {selectedTouch.sentiment}
          </p>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white">
            {selectedTouch.content || selectedTouch.summary}
          </p>
        </div>

        <div className="rounded-3xl border border-[#d8a5b8]/12 bg-[#d8a5b8]/8 p-5 text-sm leading-7 text-[#f1e9f4]">
          AI summary: This touch contributes to the account’s current relationship pulse through recency, sentiment, engagement, and continuity.
        </div>
      </Panel>
    );
  }

  <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
  <Panel title="Upcoming Activity" subtitle="Recommended actions based on relationship signals">
    <div className="max-h-[360px] space-y-3 overflow-y-auto pr-2">
      {[...accounts]
        .sort((a: ScoredAccount, b: ScoredAccount) => a.score.overall - b.score.overall)
        .map((account: ScoredAccount) => (
          <div key={account.id} className="rounded-3xl border border-white/8 bg-white/[0.045] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{account.name}</p>
                <p className="mt-2 text-sm leading-6 text-[#d8c8dc]/70">
                  {account.score.action}
                </p>
              </div>
              <ScorePill score={account.score.overall} />
            </div>
          </div>
        ))}
    </div>
  </Panel>

  <LogTouchPanel
    selectedAccount={selectedAccount}
    newTouch={newTouch}
    setNewTouch={setNewTouch}
    logTouch={logTouch}
  />
</div>

  const rows = touches.map((touch: Touch) => ({
    ...touch,
    account: accounts.find((a: ScoredAccount) => a.id === touch.accountId),
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <Panel title="Upcoming Activity" subtitle="Recommended actions based on relationship signals">
          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-2">
            {[...accounts]
              .sort((a: ScoredAccount, b: ScoredAccount) => a.score.overall - b.score.overall)
              .map((account: ScoredAccount) => (
                <div
                  key={account.id}
                  className="rounded-3xl border border-white/8 bg-white/[0.045] p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="mt-2 text-sm leading-6 text-[#d8c8dc]/70">
                        {account.score.action}
                      </p>
                    </div>
                    <ScorePill score={account.score.overall} />
                  </div>
                </div>
              ))}
          </div>
        </Panel>

        <LogTouchPanel
          selectedAccount={selectedAccount}
          newTouch={newTouch}
          setNewTouch={setNewTouch}
          logTouch={logTouch}
        />
      </div>

      <Panel title="Recent Activity" subtitle="Communication activity with contextual drill-down">
        {rows.map((row: any) => (
          <button
            key={row.id}
            onClick={() => setSelectedTouch(row)}
            className="flex w-full items-center justify-between rounded-3xl border border-white/8 bg-white/[0.045] p-5 text-left hover:bg-white/[0.08]"
          >
            <div>
              <p className="font-medium">
                {row.account?.name || "Unknown"} · {row.type}
              </p>
              <p className="mt-1 text-sm text-[#d8c8dc]/65">
                {row.summary}
              </p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[#d8c8dc]/55" />
          </button>
        ))}
      </Panel>
    </div>
  );
}
function OverviewTab({
  scoredAccounts,
  accounts,
  touches,
  attention,
  setSelectedAccountId,
  goTab,
  selectedAccount,
  mobileSectionsOpen,
  setMobileSectionsOpen,
}: any) {
  return (
    <>
      <DesktopOnly>
        <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
          <Panel title="A few relationships may need attention." subtitle="Executive Focus Panel">
            <div className="inline-flex w-fit rounded-full border border-[#d8a5b8]/15 bg-[#d8a5b8]/10 px-3 py-1 text-xs tracking-wide text-[#f1d6e2]">
              Calm intelligence, not dashboard noise.
            </div>
            <p className="max-w-2xl text-sm leading-8 text-[#d8c8dc]/76">
              Pulse interprets trust, engagement, momentum, stability, and opportunity to prioritize thoughtful action without creating workflow noise.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => goTab("Intelligence")}
                className="rounded-2xl bg-[linear-gradient(135deg,#f1dbe5_0%,#d8a5b8_45%,#b98bb1_100%)] px-5 py-3 text-sm font-semibold text-[#17141c]"
              >
                Review Attention Items
              </button>
              <button
                onClick={() => goTab("Accounts")}
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm"
              >
                Open Accounts
              </button>
            </div>
          </Panel>

          <Panel title="Today’s focus" subtitle="Calculated relationship attention queue">
            {attention.map((account: ScoredAccount) => (
              <button
                key={account.id}
                onClick={() => {
                  setSelectedAccountId(account.id);
                  goTab("Accounts");
                }}
                className="w-full rounded-3xl border border-white/8 bg-white/[0.05] p-4 text-left hover:bg-white/[0.08]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="mt-1 text-sm text-[#d8c8dc]/65">{account.score.action}</p>
                  </div>
                  <ScorePill score={account.score.overall} />
                </div>
              </button>
            ))}
          </Panel>
        </div>
      </DesktopOnly>

      <MobileSection
        title="Today’s Focus"
        open={mobileSectionsOpen.focus}
        onToggle={() =>
          setMobileSectionsOpen({
            ...mobileSectionsOpen,
            focus: !mobileSectionsOpen.focus,
          })
        }
      >
        <Panel title="A few relationships may need attention." subtitle="Executive Focus Panel">
          <div className="inline-flex w-fit rounded-full border border-[#d8a5b8]/15 bg-[#d8a5b8]/10 px-3 py-1 text-xs tracking-wide text-[#f1d6e2]">
            Calm intelligence, not dashboard noise.
          </div>
          <p className="max-w-2xl text-sm leading-8 text-[#d8c8dc]/76">
            Pulse interprets trust, engagement, momentum, stability, and opportunity to prioritize thoughtful action without creating workflow noise.
          </p>
        </Panel>

        <Panel title="Attention Queue" subtitle="Current relationship priorities">
          {attention.map((account: ScoredAccount) => (
            <button
              key={account.id}
              onClick={() => {
                setSelectedAccountId(account.id);
                goTab("Accounts");
              }}
              className="w-full rounded-3xl border border-white/8 bg-white/[0.045] p-4 text-left"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="mt-1 text-sm text-[#d8c8dc]/65">{account.score.action}</p>
                </div>
                <ScorePill score={account.score.overall} />
              </div>
            </button>
          ))}
        </Panel>
      </MobileSection>

      <DesktopOnly>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Users} label="Tracked Accounts" value={String(accounts.length)} detail="Sandbox relationships" />
          <MetricCard icon={Clock} label="Relationship Touches" value={String(touches.length)} detail="Emails, calls, meetings" />
          <MetricCard icon={CheckCircle2} label="Average Pulse" value={String(Math.round(scoredAccounts.reduce((s: number, a: ScoredAccount) => s + a.score.overall, 0) / scoredAccounts.length))} detail="Calculated score" />
          <MetricCard icon={TrendingDown} label="Attention Need" value={String(scoredAccounts.filter((a: ScoredAccount) => a.score.overall < 72).length)} detail="Relationships to review" />
        </div>
      </DesktopOnly>

      <MobileSection
        title="Snapshot"
        open={mobileSectionsOpen.metrics}
        onToggle={() =>
          setMobileSectionsOpen({
            ...mobileSectionsOpen,
            metrics: !mobileSectionsOpen.metrics,
          })
        }
      >
        <div className="grid gap-4">
          <MetricCard icon={Users} label="Tracked Accounts" value={String(accounts.length)} detail="Sandbox relationships" />
          <MetricCard icon={Clock} label="Relationship Touches" value={String(touches.length)} detail="Emails, calls, meetings" />
          <MetricCard icon={CheckCircle2} label="Average Pulse" value={String(Math.round(scoredAccounts.reduce((s: number, a: ScoredAccount) => s + a.score.overall, 0) / scoredAccounts.length))} detail="Calculated score" />
        </div>
      </MobileSection>

      <DesktopOnly>
        <div className="mt-8 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
          <AccountList accounts={scoredAccounts} selectedAccountId={selectedAccount.id} setSelectedAccountId={setSelectedAccountId} />
          <AccountPulse account={selectedAccount} />
        </div>
      </DesktopOnly>

      <MobileSection
        title="Accounts"
        open={mobileSectionsOpen.accounts}
        onToggle={() =>
          setMobileSectionsOpen({
            ...mobileSectionsOpen,
            accounts: !mobileSectionsOpen.accounts,
          })
        }
      >
        <AccountList accounts={scoredAccounts} selectedAccountId={selectedAccount.id} setSelectedAccountId={setSelectedAccountId} />
        <AccountPulse account={selectedAccount} />
      </MobileSection>
    </>
  );
}
function AccountsTab(props: any) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <AccountList accounts={props.filteredAccounts} selectedAccountId={props.selectedAccountId} setSelectedAccountId={props.setSelectedAccountId} query={props.query} setQuery={props.setQuery} />
        <AccountPulse account={props.selectedAccount} touches={props.accountTouches} />
      </div>

<div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
  <CompactAccountList
    accounts={props.filteredAccounts}
    selectedAccountId={props.selectedAccountId}
    setSelectedAccountId={props.setSelectedAccountId}
  />
  <AddAccountPanel {...props} />
</div>    </div>
  );
}

function CompactAccountList({ accounts, selectedAccountId, setSelectedAccountId }: any) {
  return (
    <Panel title="Account List" subtitle="Quick account lookup">
      <div className="max-h-[420px] overflow-y-auto rounded-3xl border border-white/8">
        {accounts.map((account: ScoredAccount) => (
          <button
            key={account.id}
            onClick={() => setSelectedAccountId(account.id)}
            className={`grid w-full grid-cols-[1.4fr_.8fr_.55fr_42px] items-center gap-3 border-b border-white/8 px-4 py-3 text-left text-sm transition last:border-b-0 ${
              selectedAccountId === account.id
                ? "bg-[#d8a5b8]/10"
                : "bg-white/[0.035] hover:bg-white/[0.07]"
            }`}
          >
            <div>
              <p className="font-medium text-white">{account.name}</p>
              <p className="mt-0.5 text-xs text-[#d8c8dc]/55">{account.stage}</p>
            </div>

            <div className="hidden sm:block">
              <p className="text-xs text-[#d8c8dc]/45">Owner</p>
              <p className="text-xs text-[#d8c8dc]/75">{account.owner}</p>
            </div>

            <div className="hidden sm:block">
              <p className="text-xs text-[#d8c8dc]/45">Pulse</p>
              <p className="text-xs text-white">{account.score.overall}</p>
            </div>

            <PulseMark health={account.score.overall} />
          </button>
        ))}
      </div>
    </Panel>
  );
}

function IntelligenceTab({ accounts }: { accounts: ScoredAccount[] }) {
  const sorted = [...accounts].sort((a, b) => a.score.overall - b.score.overall);
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
      <Panel title="Relationship Intelligence" subtitle="Pattern interpretation, not judgment">
        {sorted.map((account) => (
          <div key={account.id} className="rounded-3xl border border-white/8 bg-white/[0.045] p-5">
            <div className="flex items-center justify-between">
              <p className="font-medium">{account.name}</p>
              <ScorePill score={account.score.overall} />
            </div>
            <p className="mt-3 text-sm leading-7 text-[#d8c8dc]/75">{account.score.narrative}</p>
            <p className="mt-2 text-sm text-[#f1d6e2]">{account.score.action}</p>
          </div>
        ))}
      </Panel>

      <Panel title="Scoring dimensions" subtitle="Company-customizable model">
        <Dimension label="Trust" value={30} suffix="%" />
        <Dimension label="Engagement" value={25} suffix="%" />
        <Dimension label="Momentum" value={20} suffix="%" />
        <Dimension label="Stability" value={15} suffix="%" />
        <Dimension label="Opportunity" value={10} suffix="%" />
      </Panel>
    </div>
  );
}

function AITab({ aiPrompt, setAiPrompt, aiResponse, runAI }: any) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
      <Panel title="AI Relationship Assistant" subtitle="Press Enter to generate. Shift + Enter adds a new line.">
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              runAI();
            }
          }}
          placeholder="Ask Pulse to summarize attention needs, explain momentum changes, or identify accounts requiring thoughtful follow-up..."
          className="min-h-[220px] w-full rounded-[2rem] border border-[#d8a5b8]/15 bg-[linear-gradient(180deg,#f8f3f7_0%,#ece6ef_100%)] p-5 text-[#17141c] outline-none"
        />
        <button onClick={runAI} className="rounded-2xl bg-[linear-gradient(135deg,#f1dbe5_0%,#d8a5b8_45%,#b98bb1_100%)] px-5 py-3 text-sm font-semibold text-[#17141c]">
          Generate Insight
        </button>
        {aiResponse && <div className="rounded-[2rem] border border-[#d8a5b8]/10 bg-white/[0.05] p-5 text-sm leading-8 text-[#f1e9f4]">{aiResponse}</div>}
      </Panel>

      <Panel title="Suggested prompts" subtitle="Relationship-focused workflows">
        <Prompt title="Prioritize attention" detail="Which accounts may need thoughtful follow-up this week?" />
        <Prompt title="Explain score changes" detail="Why did HarborTech’s momentum decline?" />
        <Prompt title="Engagement review" detail="Summarize communication consistency over the last 60 days." />
      </Panel>
    </div>
  );
}

function ReportsTab({ accounts, touches }: { accounts: ScoredAccount[]; touches: Touch[] }) {
  return (
<Panel title="Describe the report you want to make:" subtitle="AI-generated relationship intelligence reporting">      <textarea placeholder="Example: Create an executive relationship health report with charts showing churn risk, engagement trends, and accounts requiring attention." className="min-h-28 w-full max-w-3xl rounded-[2rem] border border-[#d8a5b8]/15 bg-[linear-gradient(180deg,#f8f3f7_0%,#ece6ef_100%)] p-5 text-[#17141c] outline-none" />
      <div className="rounded-3xl border border-white/8 bg-white/[0.045] p-5 text-sm leading-7 text-[#d8c8dc]/75">
        Average Pulse: {Math.round(accounts.reduce((s, a) => s + a.score.overall, 0) / accounts.length)} · Logged touches: {touches.length}
      </div>
    </Panel>
  );
}

function AdminTab({
  resetSandbox,
  theme,
  setTheme,
  density,
  setDensity,
}: {
  resetSandbox: () => void;
  theme: string;
  setTheme: (value: string) => void;
  density: string;
  setDensity: (value: string) => void;
}) {  const [themeChoice, setThemeChoice] = useState("Purple graphite");
  const [densityChoice, setDensityChoice] = useState("Comfortable");

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Integrations" subtitle="Demo integration controls">
          <button className="w-fit rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#17141c]">
            Connect Integration
          </button>
          <Integration name="Outlook" status="Demo connected" icon={Mail} />
          <Integration name="Zoom" status="Demo connected" icon={Video} />
          <Integration name="Teams" status="Pending" icon={MessageSquare} />
        </Panel>

        <Panel title="Manage Team" subtitle="Workspace people and permissions">
          <button className="flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#17141c]">
            <UserPlus className="h-4 w-4" />
            Invite Team Member
          </button>
<div className="space-y-3">
  <div className="flex items-center justify-between rounded-3xl border border-white/8 bg-white/[0.045] p-5">
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#f1dbe5_0%,#d8a5b8_55%,#b98bb1_100%)] text-sm font-semibold text-[#17141c] shadow-[0_10px_30px_rgba(216,165,184,0.20)]">
        DH
      </div>
      <div>
        <p className="font-medium text-white">Danielle Hart</p>
        <p className="mt-1 text-sm text-[#d8c8dc]/68">
          Workspace Admin · Enterprise Accounts
        </p>
      </div>
    </div>
    <div className="rounded-full border border-[#d8a5b8]/18 bg-[#d8a5b8]/10 px-3 py-1 text-xs text-[#f1d6e2]">
      Active
    </div>
  </div>

  <div className="flex items-center justify-between rounded-3xl border border-white/8 bg-white/[0.045] p-5">
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#d7d9df_0%,#aab0ba_55%,#7d8693_100%)] text-sm font-semibold text-[#17141c]">
        JC
      </div>
      <div>
        <p className="font-medium text-white">James Carter</p>
        <p className="mt-1 text-sm text-[#d8c8dc]/68">
          Relationship Lead · Strategic Accounts
        </p>
      </div>
    </div>
    <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-[#d8c8dc]/75">
      Online
    </div>
  </div>

  <div className="flex items-center justify-between rounded-3xl border border-white/8 bg-white/[0.045] p-5">
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#c7a7e8_0%,#9e82c9_55%,#725f9d_100%)] text-sm font-semibold text-white">
        NP
      </div>
      <div>
        <p className="font-medium text-white">Nora Patel</p>
        <p className="mt-1 text-sm text-[#d8c8dc]/68">
          Viewer · Customer Success
        </p>
      </div>
    </div>
    <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-[#d8c8dc]/75">
      Invited
    </div>
  </div>
</div>        </Panel>
      </div>

      <Panel title="Preferences" subtitle="Demo workspace customization">
<PreferenceButtons
  label="Theme"
  value={theme}
  setValue={setTheme}
  options={["Purple graphite", "Soft graphite", "Deep blush"]}
/>

<PreferenceButtons
  label="Density"
  value={density}
  setValue={setDensity}
  options={["Compact", "Comfortable", "Spacious"]}
/>
        <div className="rounded-3xl border border-white/8 bg-white/[0.045] p-5">
          <p className="text-sm text-[#d8c8dc]/70">Preview</p>
<p className="mt-2 text-lg font-medium">{theme} · {density}</p>          <p className="mt-2 text-sm text-[#d8c8dc]/70">
            These controls are ready to connect to the global theme system in the next architecture pass.
          </p>
        </div>

        <button onClick={resetSandbox} className="flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm">
          <RefreshCcw className="h-4 w-4" />
          Reset Sandbox
        </button>
      </Panel>
    </div>
  );
}

function MobileHeader({ activeTab, goTab, mobileMenu, setMobileMenu }: any) {
  return (
    <div className="sticky top-0 z-50 border-b border-white/6 bg-[#0e0f14]/75 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">pulse</h1>
          <p className="text-xs tracking-wide text-[#d8c8dc]/65">Relationship Intelligence</p>
        </div>
<div className="flex items-center gap-2">
  <button className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-[#f1d6e2]">
    <Bell className="h-5 w-5" />
    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#d8a5b8] text-[11px] font-semibold text-[#17141c]">
      3
    </span>
  </button>

  <button
    onClick={() => setMobileMenu(!mobileMenu)}
    className="rounded-2xl border border-white/10 bg-white/[0.06] p-3"
  >
    {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
  </button>
</div>      </div>
      {mobileMenu && (
        <div className="space-y-2 px-5 pb-5">
          {navItems.map((item) => (
            <button key={item} onClick={() => goTab(item)} className={`w-full rounded-2xl px-4 py-3 text-left ${activeTab === item ? "bg-white text-[#17141c]" : "bg-white/[0.05]"}`}>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DesktopSidebar({ activeTab, goTab, logout }: any) {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-[#d8a5b8]/12 bg-[linear-gradient(180deg,#32203e_0%,#211827_50%,#13111a_100%)] px-5 py-6 lg:block">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[linear-gradient(145deg,#17101f_0%,#4a334f_55%,#c79eb3_100%)] shadow-[0_18px_50px_rgba(216,165,184,0.22)]">
          <Activity className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-[2.7rem] font-semibold leading-none tracking-[-0.04em]">pulse</h1>
          <p className="mt-1 text-xs tracking-wide text-[#d8c8dc]/65">Relationship Intelligence</p>
        </div>
      </div>

      <nav className="mt-12 space-y-2">
        {navItems.map((item) => (
          <button key={item} onClick={() => goTab(item)} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${activeTab === item ? "bg-white text-[#17141c]" : "bg-white/[0.05] text-white hover:bg-white/[0.09]"}`}>
            {item}
            <ChevronRight className="h-4 w-4" />
          </button>
        ))}
      </nav>

      <button onClick={logout} className="absolute bottom-6 left-5 right-5 rounded-2xl border border-white/10 bg-white/[0.05] py-3 text-sm hover:bg-white/[0.09]">
        Sign Out
      </button>
    </aside>
  );
}

function AccountList({ accounts, selectedAccountId, setSelectedAccountId, query, setQuery }: any) {
  return (
    <Panel title="Recent Accounts" subtitle="Scrollable relationship overview">
      {setQuery && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d8c8dc]/55" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search accounts" className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3 pl-10 pr-4 text-sm outline-none" />
        </div>
      )}
<div className="max-h-[560px] space-y-3 overflow-y-auto pr-1 pb-1">        {accounts.map((account: ScoredAccount) => (
          <button key={account.id} onClick={() => setSelectedAccountId(account.id)} className={`w-full rounded-3xl border p-4 text-left transition ${selectedAccountId === account.id ? "border-[#d8a5b8]/24 bg-[#d8a5b8]/10" : "border-white/8 bg-white/[0.045] hover:bg-white/[0.08]"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-medium">{account.name}</p>
                <p className="mt-2 text-sm text-[#d8c8dc]/65">{account.owner} · {account.stage}</p>
              </div>
              <PulseMark health={account.score.overall} />
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function AccountPulse({ account, touches = [] }: { account: ScoredAccount; touches?: Touch[] }) {
  return (
    <Panel title={account.name} subtitle="Relationship Pulse">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-center rounded-[2rem] border border-[#d8a5b8]/10 bg-white/[0.04] p-6">
          <ScoreRing score={account.score.overall} />
          <p className="mt-5 text-center text-sm leading-7 text-[#d8c8dc]/70">{account.score.narrative}</p>
        </div>
        <div className="space-y-4">
          <Dimension label="Trust" value={account.score.trust} />
          <Dimension label="Engagement" value={account.score.engagement} />
          <Dimension label="Momentum" value={account.score.momentum} />
          <Dimension label="Stability" value={account.score.stability} />
          <Dimension label="Opportunity" value={account.score.opportunity} />
        </div>
      </div>

      {touches.length > 0 && (
        <div className="rounded-3xl border border-white/8 bg-white/[0.045] p-5">
          <p className="font-medium">Relationship timeline</p>
          <div className="mt-4 space-y-3">
            {touches.map((touch) => (
              <div key={touch.id} className="rounded-2xl bg-white/[0.05] p-4">
                <p className="text-sm text-[#f1d6e2]">{touch.type} · {touch.sentiment}</p>
                <p className="mt-1 text-sm text-[#d8c8dc]/75">{touch.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

function LogTouchPanel({ selectedAccount, newTouch, setNewTouch, logTouch }: any) {
  return (
    <Panel title="Log relationship touch" subtitle={`Add activity for ${selectedAccount.name}`}>
      <div className="grid gap-3 sm:grid-cols-3">
        <Select value={newTouch.type} onChange={(v: string) => setNewTouch({ ...newTouch, type: v })} options={["Email", "Call", "Meeting", "Note"]} />
        <Select value={newTouch.sentiment} onChange={(v: string) => setNewTouch({ ...newTouch, sentiment: v })} options={["positive", "neutral", "concerned", "negative"]} />
        <Select value={newTouch.direction} onChange={(v: string) => setNewTouch({ ...newTouch, direction: v })} options={["inbound", "outbound", "internal"]} />
      </div>
      <input value={newTouch.summary} onChange={(e) => setNewTouch({ ...newTouch, summary: e.target.value })} placeholder="Summary" className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-3 outline-none" />
      <textarea value={newTouch.content} onChange={(e) => setNewTouch({ ...newTouch, content: e.target.value })} placeholder="Details" className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/[0.05] p-3 outline-none" />
      <button onClick={logTouch} className="flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#17141c]">
        <Plus className="h-4 w-4" /> Log Touch
      </button>
    </Panel>
  );
}

function AddAccountPanel({ newAccount, setNewAccount, addAccount }: any) {
  return (
    <Panel title="Add account" subtitle="Creates a persistent sandbox account">
      <input value={newAccount.name} onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })} placeholder="Account name" className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-3 outline-none" />
      <input value={newAccount.owner} onChange={(e) => setNewAccount({ ...newAccount, owner: e.target.value })} placeholder="Owner" className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-3 outline-none" />
      <input value={newAccount.value} onChange={(e) => setNewAccount({ ...newAccount, value: e.target.value })} placeholder="Value" className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-3 outline-none" />
      <button onClick={addAccount} className="flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#17141c]">
        <Plus className="h-4 w-4" /> Add Account
      </button>
    </Panel>
  );
}

function Panel({ title, subtitle, children }: any) {
  return (
    <div className="rounded-[2rem] border border-[#d8a5b8]/12 bg-[linear-gradient(145deg,rgba(42,32,55,0.92),rgba(20,16,27,0.88))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-sm">
      <h3 className="text-[1.6rem] font-medium tracking-[-0.03em]">{title}</h3>
      {subtitle && <p className="mt-2 text-sm text-[#d8c8dc]/68">{subtitle}</p>}
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail }: any) {
  return (
    <div className="rounded-[1.8rem] border border-[#d8a5b8]/10 bg-[linear-gradient(145deg,rgba(48,38,61,0.86),rgba(18,16,25,0.90))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/68">{label}</p>
          <p className="mt-3 text-4xl font-medium tracking-[-0.04em]">{value}</p>
          <p className="mt-2 text-sm text-[#d8c8dc]/68">{detail}</p>
        </div>
        <div className="rounded-2xl border border-[#d8a5b8]/14 bg-[#d8a5b8]/10 p-3 text-[#f1d6e2]">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function Dimension({ label, value, suffix = "" }: any) {
  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.045] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#d8c8dc]/68">{label}</p>
        <p className="text-lg font-medium">{value}{suffix}</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/6">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#d8a5b8_0%,#c7a7e8_100%)]" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function ScoreRing({ score }: any) {
  const color = score >= 82 ? "#9FE6C0" : score >= 68 ? "#E7C873" : score >= 56 ? "#C7A7E8" : "#D8A5B8";
  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 36 36" className="h-32 w-32 -rotate-90">
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="2.2" />
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="2.2" strokeDasharray={`${score},100`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl font-medium tracking-[-0.04em]">{score}</p>
        <p className="mt-1 text-xs tracking-wide text-[#d8c8dc]/62">Pulse</p>
      </div>
    </div>
  );
}

function ScorePill({ score }: any) {
  return <div className="rounded-full border border-[#d8a5b8]/12 bg-[#d8a5b8]/10 px-3 py-1 text-sm text-[#f1d6e2]">{score}</div>;
}

function Prompt({ title, detail }: any) {
  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.045] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-medium">{title}</p>
          <p className="mt-2 text-sm leading-7 text-[#d8c8dc]/68">{detail}</p>
        </div>
        <ArrowUpRight className="h-5 w-5 text-[#d8c8dc]/55" />
      </div>
    </div>
  );
}

function MarketingStat({ value, label }: any) {
  return (
    <div className="rounded-3xl border border-[#d8a5b8]/12 bg-white/[0.055] p-4 backdrop-blur">
      <p className="text-3xl font-medium tracking-[-0.04em] text-white">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#d8a5b8]/70">{label}</p>
    </div>
  );
}

function PulseMark({ health }: any) {
  const color = health >= 82 ? "#9FE6C0" : health >= 68 ? "#E7C873" : health >= 56 ? "#C7A7E8" : "#D8A5B8";
  return (
    <svg viewBox="0 0 60 28" className="h-8 w-12">
      <path d="M2 14 H12 L16 7 L22 22 L28 14 H38 L42 10 L47 18 L52 14 H58" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Select({ value, onChange, options }: any) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-2xl border border-white/10 bg-[#17131f] p-3 text-white outline-none">
      {options.map((option: string) => <option key={option}>{option}</option>)}
    </select>
  );
}

function Integration({ name, status, icon: Icon }: any) {
  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.045] p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#d8a5b8]/10 p-3 text-[#f1d6e2]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-[#d8c8dc]/65">{status}</p>
        </div>
      </div>
    </div>
  );
}
function PreferenceButtons({ label, value, setValue, options }: any) {
  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.045] p-5">
      <p className="text-sm text-[#d8c8dc]/70">{label}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {options.map((option: string) => (
          <button
            key={option}
            onClick={() => setValue(option)}
            className={`rounded-2xl px-4 py-3 text-sm transition ${
              value === option
                ? "bg-white text-[#17141c]"
                : "bg-white/[0.05] text-white hover:bg-white/[0.09]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
function MobileSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="lg:hidden">
      <button
        onClick={onToggle}
        className="mb-3 flex w-full items-center justify-between rounded-2xl border border-[#d8a5b8]/12 bg-white/[0.045] px-4 py-3 text-left"
      >
        <span className="text-sm font-medium text-[#f1e9f4]">{title}</span>
        <ChevronRight
          className={`h-4 w-4 text-[#d8c8dc]/70 transition ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>

      {open && <div className="space-y-5">{children}</div>}
    </div>
  );
}

function DesktopOnly({ children }: { children: React.ReactNode }) {
  return <div className="hidden lg:block">{children}</div>;
}