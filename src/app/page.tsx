"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mail,
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
} from "lucide-react";

const STORAGE_KEY = "pulse-functional-sandbox-v1";

const navItems = [
  { label: "Overview", icon: Activity },
  { label: "Accounts", icon: Users },
  { label: "Activity", icon: Clock },
  { label: "Intelligence", icon: Sparkles },
  { label: "AI Task Manager", icon: Bot },
  { label: "Reports", icon: BarChart3 },
  { label: "Admin", icon: Settings },
];

const starterAccounts = [
  {
    id: "northstar",
    name: "Northstar Logistics",
    owner: "Sarah Mitchell",
    value: 142000,
    stage: "Renewal window",
    lastTouch: "Today",
    priority: "Good timing",
  },
  {
    id: "summit",
    name: "Summit Insurance Group",
    owner: "James Carter",
    value: 98000,
    stage: "Implementation",
    lastTouch: "Yesterday",
    priority: "Follow up",
  },
  {
    id: "harbortech",
    name: "HarborTech Services",
    owner: "Jasper Milligan",
    value: 185000,
    stage: "Project recovery",
    lastTouch: "4 days ago",
    priority: "Needs a look",
  },
  {
    id: "evergreen",
    name: "Evergreen Medical",
    owner: "Nora Patel",
    value: 76000,
    stage: "Onboarding",
    lastTouch: "Today",
    priority: "Looking good",
  },
  {
    id: "atlas",
    name: "Atlas Retail Partners",
    owner: "Marcus Flynn",
    value: 121000,
    stage: "Budget review",
    lastTouch: "2 days ago",
    priority: "Keep an eye on",
  },
  {
    id: "ironwood",
    name: "Ironwood Systems",
    owner: "Dana Lewis",
    value: 201000,
    stage: "Escalation risk",
    lastTouch: "5 days ago",
    priority: "Needs a look",
  },
];

const starterTouches = [
  {
    id: "t1",
    accountId: "northstar",
    type: "Email",
    sentiment: "positive",
    direction: "inbound",
    summary: "Austyn replied and asked for the latest renewal summary.",
    content:
      "Hi Danielle,\n\nThanks for sending this over. The renewal timing makes sense. Could you send the latest summary of unresolved requests and meeting participation before our next call?\n\nBest,\nAustyn",
    occurredAt: daysAgo(0),
  },
  {
    id: "t2",
    accountId: "summit",
    type: "Meeting",
    sentiment: "neutral",
    direction: "inbound",
    summary: "Brogan accepted the implementation timeline review meeting.",
    content: "Meeting accepted for today at 2:30 PM. No additional comment included.",
    occurredAt: daysAgo(1),
  },
  {
    id: "t3",
    accountId: "harbortech",
    type: "Email",
    sentiment: "concerned",
    direction: "inbound",
    summary: "Client requested a callback about a delayed milestone.",
    content:
      "We need to talk through the delay on the current milestone. Please call me when you have time today.",
    occurredAt: daysAgo(4),
  },
  {
    id: "t4",
    accountId: "harbortech",
    type: "Meeting",
    sentiment: "negative",
    direction: "internal",
    summary: "Meeting sentiment declined after project delay discussion.",
    content:
      "Internal note: client seemed frustrated with the lack of timeline clarity. Follow-up needed.",
    occurredAt: daysAgo(6),
  },
  {
    id: "t5",
    accountId: "evergreen",
    type: "Call",
    sentiment: "positive",
    direction: "outbound",
    summary: "Onboarding call went well and client confirmed next milestone.",
    content: "Client gave positive feedback on the onboarding process.",
    occurredAt: daysAgo(0),
  },
];

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatMoney(value: number) {
  return `$${Math.round(value / 1000)}K`;
}

function daysSince(dateString: string) {
  const then = new Date(dateString).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - then) / (1000 * 60 * 60 * 24)));
}

function calculateScore(account: any, touches: any[]) {
  const accountTouches = touches
    .filter((touch) => touch.accountId === account.id)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  const latestTouch = accountTouches[0];
  const days = latestTouch ? daysSince(latestTouch.occurredAt) : 30;

  const sentimentMap: any = {
    positive: 92,
    neutral: 76,
    concerned: 56,
    negative: 38,
  };

  const recentTouches = accountTouches.slice(0, 6);
  const sentimentQuality = recentTouches.length
    ? Math.round(
        recentTouches.reduce((sum, touch) => sum + (sentimentMap[touch.sentiment] || 70), 0) /
          recentTouches.length
      )
    : 60;

  const engagementRhythm = Math.max(20, Math.min(100, 100 - days * 6));
  const trustLevel = Math.min(100, 55 + accountTouches.filter((t) => t.direction === "inbound").length * 9);
  const futurePotential = Math.min(100, 55 + Math.round(account.value / 7000));
  const priorConcern = accountTouches.filter((t) => t.sentiment === "concerned" || t.sentiment === "negative").length;
  const driftVelocity = Math.max(-45, Math.min(30, sentimentQuality - 72 - priorConcern * 4));

  const overall = Math.round(
    sentimentQuality * 0.3 +
      engagementRhythm * 0.25 +
      trustLevel * 0.15 +
      futurePotential * 0.15 +
      (driftVelocity + 70) * 0.15
  );

  const risk =
    overall >= 82 ? "Low" : overall >= 68 ? "Medium" : overall >= 56 ? "Elevated" : "High";

  const priority =
    overall >= 85
      ? "Looking good"
      : overall >= 76
      ? "Good timing"
      : overall >= 65
      ? "Follow up"
      : "Needs a look";

  const trend =
    driftVelocity > 8 ? "Improving" : driftVelocity < -8 ? "Declining" : "Stable";

  const narrative =
    overall >= 85
      ? `${account.name} is showing strong relationship momentum. Engagement is recent, tone is healthy, and the next step can be handled as a relationship-building opportunity.`
      : overall >= 70
      ? `${account.name} appears stable, but there are a few signals worth monitoring. A timely follow-up would help maintain momentum and reduce drift.`
      : overall >= 58
      ? `${account.name} may need attention. Recent signals suggest communication is slowing or tone has become less confident. A direct, thoughtful follow-up is recommended.`
      : `${account.name} is showing elevated relationship risk. Recent activity suggests possible drift, unresolved concern, or loss of momentum. Prioritize a human touchpoint soon.`;

  const recommendedAction =
    priority === "Needs a look"
      ? "Send a direct check-in and offer a clear next step."
      : priority === "Follow up"
      ? "Close the open loop with a concise follow-up."
      : priority === "Good timing"
      ? "Use the current momentum to start a strategic conversation."
      : "Maintain cadence and continue monitoring.";

  return {
    overall,
    sentimentQuality,
    engagementRhythm,
    trustLevel,
    futurePotential,
    driftVelocity,
    risk,
    priority,
    trend,
    narrative,
    recommendedAction,
    lastTouchDays: days,
  };
}

export default function PulseDashboard() {
  const [authState, setAuthState] = useState<"login" | "loading" | "dashboard">("login");
  const [accounts, setAccounts] = useState<any[]>(starterAccounts);
  const [touches, setTouches] = useState<any[]>(starterTouches);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedAccountId, setSelectedAccountId] = useState("northstar");
  const [selectedTouch, setSelectedTouch] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [activityView, setActivityView] = useState("Company");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [density, setDensity] = useState("Comfortable");
  const [theme, setTheme] = useState("Purple graphite");
  const [showScores, setShowScores] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);
  const [insightStyle, setInsightStyle] = useState("Gentle narrative");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [newAccount, setNewAccount] = useState({ name: "", owner: "", value: "" });
  const [newTouch, setNewTouch] = useState({
    type: "Email",
    sentiment: "neutral",
    direction: "outbound",
    summary: "",
    content: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
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

  const scoredAccounts = useMemo(() => {
    return accounts.map((account) => ({
      ...account,
      score: calculateScore(account, touches),
    }));
  }, [accounts, touches]);

  const selectedAccount =
    scoredAccounts.find((account) => account.id === selectedAccountId) || scoredAccounts[0];

  const filteredAccounts = scoredAccounts.filter(
    (account) =>
      account.name.toLowerCase().includes(query.toLowerCase()) ||
      account.owner.toLowerCase().includes(query.toLowerCase()) ||
      account.stage.toLowerCase().includes(query.toLowerCase())
  );

  const accountTouches = touches
    .filter((touch) => touch.accountId === selectedAccount?.id)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  const attentionAccounts = [...scoredAccounts].sort((a, b) => a.score.overall - b.score.overall).slice(0, 4);

  const densityPad = density === "Compact" ? "p-4" : density === "Spacious" ? "p-7" : "p-5";
  const densityGap = density === "Compact" ? "space-y-4" : density === "Spacious" ? "space-y-7" : "space-y-5";

  function signIn(mode: "sandbox" | "standard") {
    setAuthState("loading");
    setTimeout(() => setAuthState("dashboard"), 1600);
  }

  function goToTab(tab: string) {
    setActiveTab(tab);
    setSelectedTouch(null);
    setNotificationsOpen(false);
  }

  function resetSandbox() {
    setAccounts(starterAccounts);
    setTouches(starterTouches);
    setSelectedAccountId("northstar");
    localStorage.removeItem(STORAGE_KEY);
  }

  function addAccount() {
    if (!newAccount.name.trim()) return;

    const account = {
      id: newId(),
      name: newAccount.name.trim(),
      owner: newAccount.owner.trim() || "Unassigned",
      value: Number(newAccount.value || 0),
      stage: "New relationship",
      lastTouch: "Not yet logged",
      priority: "Follow up",
    };

    setAccounts((prev) => [account, ...prev]);
    setSelectedAccountId(account.id);
    setNewAccount({ name: "", owner: "", value: "" });
  }

  function logTouch() {
    if (!selectedAccount || !newTouch.summary.trim()) return;

    const touch = {
      id: newId(),
      accountId: selectedAccount.id,
      ...newTouch,
      occurredAt: new Date().toISOString(),
    };

    setTouches((prev) => [touch, ...prev]);
    setNewTouch({
      type: "Email",
      sentiment: "neutral",
      direction: "outbound",
      summary: "",
      content: "",
    });
  }

  function runSimulatedAI() {
    const lowest = attentionAccounts[0];
    const response = lowest
      ? `Pulse reviewed the current sandbox data. ${lowest.name} should be prioritized first because its relationship score is ${lowest.score.overall}, with ${lowest.score.trend.toLowerCase()} momentum. Recommended action: ${lowest.score.recommendedAction}`
      : "Pulse reviewed the current sandbox data. No urgent relationship issues were detected.";

    setAiResponse(response);
  }

  if (authState === "login") {
    return <LoginScreen onSignIn={signIn} />;
  }

  if (authState === "loading") {
    return <LoadingScreen />;
  }

  return (
    <main
      className={`min-h-screen text-white ${
        theme === "Soft graphite"
          ? "bg-[radial-gradient(circle_at_top_left,#30313a_0%,#181a20_38%,#07080b_100%)]"
          : theme === "Deep blush"
          ? "bg-[radial-gradient(circle_at_top_left,#3b1b35_0%,#1c121f_42%,#08070a_100%)]"
          : "bg-[radial-gradient(circle_at_top_left,#352044_0%,#191720_38%,#07080b_100%)]"
      }`}
      style={{ fontFamily: "Satoshi, Inter, sans-serif" }}
    >
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.045),transparent_30%,rgba(157,90,181,0.055)_72%,transparent)]" />

      <aside className="fixed left-0 top-0 hidden h-screen w-60 border-r border-white/10 bg-gradient-to-b from-[#3a2449] via-[#2c2038] to-[#17131f] px-4 py-5 text-purple-100 shadow-2xl shadow-black/40 lg:block">
        <button onClick={() => goToTab("Overview")} className="flex w-full items-center gap-3 rounded-3xl p-2 text-left transition hover:bg-white/5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#130b19] via-[#3b2448] to-[#a35c9f] text-white shadow-lg shadow-black/20">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-[2.35rem] font-semibold leading-none tracking-[0.015em] text-white">
              pulse
            </h1>
            <p className="mt-1.5 text-[11px] font-medium tracking-wide text-purple-200">
              Relationship Intelligence
            </p>
          </div>
        </button>

        <nav className="mt-7 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => goToTab(item.label)}
                className={`flex w-full items-center justify-between rounded-2xl border px-3.5 py-2.5 text-left text-[13px] transition ${
                  activeTab === item.label
                    ? "border-white/25 bg-white/[0.14] text-white shadow-lg shadow-black/20"
                    : "border-white/10 bg-white/[0.045] text-purple-100 hover:border-white/20 hover:bg-white/[0.09] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </span>
                {activeTab === item.label && <ChevronRight className="h-4 w-4" />}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-3xl border border-white/10 bg-white/[0.08] p-3">
          <p className="text-xs text-purple-200">Workspace</p>
          <p className="mt-1 text-sm font-medium text-white">Sandbox Demo</p>
        </div>
      </aside>

      <section className="relative px-4 pb-24 pt-5 sm:px-5 lg:ml-60 lg:px-8 lg:pb-6 xl:px-10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-medium text-purple-100">{getGreeting()}, Danielle.</p>
            <p className="mt-1 text-sm tracking-wide text-purple-300">Here&apos;s what we have:</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative rounded-2xl border border-white/15 bg-white/[0.07] p-3 text-white transition hover:bg-white/[0.12]"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#b86aa6] text-xs font-semibold text-white">
                {attentionAccounts.length}
              </span>
            </button>

            <div className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-sm font-semibold sm:flex">
              DH
            </div>
          </div>

          {notificationsOpen && (
            <div className="absolute right-4 top-16 z-50 w-[360px] rounded-3xl border border-white/10 bg-[#17131f] p-4 shadow-2xl shadow-black/40">
              <p className="text-sm text-purple-100">Important updates</p>
              <h3 className="mt-1 text-xl font-medium text-white">A few things worth reviewing</h3>
              <div className="mt-4 space-y-3">
                {attentionAccounts.slice(0, 3).map((account) => (
                  <button
                    key={account.id}
                    onClick={() => {
                      setSelectedAccountId(account.id);
                      goToTab("Accounts");
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left transition hover:bg-white/[0.10]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-white">{account.name}</p>
                      <StatusChip label={account.score.priority} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-purple-100">{account.score.recommendedAction}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {activeTab === "Overview" && (
          <div className={densityGap}>
            <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
              <Panel title="A few things may need your attention." subtitle="Executive Focus Panel" pad={densityPad}>
                <p className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs tracking-wide text-purple-100">
                  Calm intelligence, not dashboard noise.
                </p>
                <p className="max-w-2xl text-sm leading-7 text-purple-100">
                  Pulse now calculates relationship scores from sandbox touches, sentiment, engagement rhythm, client value, and drift velocity.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => goToTab("Intelligence")} className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-[#17141c] transition hover:scale-[1.01]">
                    Review Attention Items
                  </button>
                  <button onClick={() => goToTab("Accounts")} className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                    View Accounts
                  </button>
                </div>
              </Panel>

              <Panel title="Today’s focus" subtitle="Calculated Attention Queue" pad={densityPad}>
                {attentionAccounts.map((account) => (
                  <SummaryButton
                    key={account.id}
                    label={account.score.priority}
                    value={account.name}
                    showAlert={account.score.priority === "Needs a look"}
                    onClick={() => {
                      setSelectedAccountId(account.id);
                      goToTab("Accounts");
                    }}
                  />
                ))}
              </Panel>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon={Users} label="Tracked clients" value={String(accounts.length)} detail="Sandbox accounts" />
              <MetricCard icon={Clock} label="Logged touches" value={String(touches.length)} detail="Emails, calls, meetings, notes" />
              <MetricCard icon={CheckCircle2} label="Avg score" value={String(Math.round(scoredAccounts.reduce((s, a) => s + a.score.overall, 0) / scoredAccounts.length))} detail="Calculated relationship pulse" />
              <MetricCard icon={Activity} label="Need review" value={String(scoredAccounts.filter((a) => a.score.overall < 68).length)} detail="Based on current scoring model" />
            </section>

            {showScores && <HealthScoreGrid accounts={scoredAccounts} selectAccount={(id: string) => { setSelectedAccountId(id); goToTab("Accounts"); }} />}

            <RecentAccountsCard accounts={scoredAccounts.slice(0, 10)} selectedAccountId={selectedAccountId} setSelectedAccountId={setSelectedAccountId} />
          </div>
        )}

        {activeTab === "Accounts" && (
          <div className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-2">
              <RecentAccountsCard accounts={scoredAccounts.slice(0, 10)} selectedAccountId={selectedAccountId} setSelectedAccountId={setSelectedAccountId} />
              <AccountDetail account={selectedAccount} touches={accountTouches} showTimeline={showTimeline} insightStyle={insightStyle} />
            </div>

            <div className="grid gap-5 xl:grid-cols-[1fr_.8fr]">
              <FullAccountsList accounts={filteredAccounts} query={query} setQuery={setQuery} setSelectedAccountId={setSelectedAccountId} />
              <LogTouchPanel newTouch={newTouch} setNewTouch={setNewTouch} logTouch={logTouch} selectedAccount={selectedAccount} />
            </div>

            <AddAccountPanel newAccount={newAccount} setNewAccount={setNewAccount} addAccount={addAccount} />
          </div>
        )}

        {activeTab === "Activity" && (
          selectedTouch ? (
            <ActivityDetail touch={selectedTouch} onBack={() => setSelectedTouch(null)} />
          ) : (
            <ActivityPanel
              accounts={scoredAccounts}
              touches={touches}
              activityView={activityView}
              setActivityView={setActivityView}
              setSelectedTouch={setSelectedTouch}
            />
          )
        )}

        {activeTab === "Intelligence" && (
          <IntelligencePanel accounts={scoredAccounts} insightStyle={insightStyle} />
        )}

        {activeTab === "AI Task Manager" && (
          <AITaskManager
            aiPrompt={aiPrompt}
            setAiPrompt={setAiPrompt}
            aiResponse={aiResponse}
            runSimulatedAI={runSimulatedAI}
          />
        )}

        {activeTab === "Reports" && <ReportsPanel accounts={scoredAccounts} touches={touches} />}

        {activeTab === "Admin" && (
          <AdminPanel
            density={density}
            setDensity={setDensity}
            theme={theme}
            setTheme={setTheme}
            showScores={showScores}
            setShowScores={setShowScores}
            showTimeline={showTimeline}
            setShowTimeline={setShowTimeline}
            insightStyle={insightStyle}
            setInsightStyle={setInsightStyle}
            resetSandbox={resetSandbox}
          />
        )}
      </section>

      <MobileNav activeTab={activeTab} goToTab={goToTab} />
    </main>
  );
}

function LoginScreen({ onSignIn }: any) {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#2e203b_0%,#111118_45%,#030305_100%)] px-5 py-8 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(173,112,176,0.16),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(112,87,164,0.16),transparent_30%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs tracking-wide text-purple-100">
            <Sparkles className="h-4 w-4" />
            Calm intelligence, not dashboard noise.
          </div>
          <h1 className="mt-8 max-w-2xl text-6xl font-medium leading-[1.05] tracking-[-0.04em]">
            Relationship intelligence that remembers what matters.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-purple-100">
            Pulse centralizes relationship signals, calculates relationship health, and helps teams understand risk before it becomes churn.
          </p>
        </section>

        <section className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.075] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-[#130b19] via-[#3b2448] to-[#a35c9f] text-white shadow-lg shadow-black/30">
              <Activity className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-5xl font-semibold tracking-[0.015em]">pulse</h1>
            <div className="mx-auto mt-2 h-px w-12 rounded-full bg-[#b98bb1]" />
            <p className="mt-4 text-xl font-light text-purple-100">Relationship Intelligence</p>
          </div>

          <div className="mt-10">
            <p className="text-sm text-purple-200">Welcome back</p>
            <h2 className="mt-1 text-2xl font-medium">Sign in to your workspace</h2>
          </div>

          <div className="mt-8 space-y-4">
            <input defaultValue="danielle@pulse.com" className="h-14 w-full rounded-2xl border border-white/15 bg-white/[0.10] px-4 text-white outline-none" />
            <input defaultValue="relationshipintel" type="password" className="h-14 w-full rounded-2xl border border-white/15 bg-white/[0.10] px-4 text-white outline-none" />
            <button onClick={() => onSignIn("sandbox")} className="mt-5 h-14 w-full rounded-2xl bg-[#d8c9df] px-5 text-sm font-semibold text-[#17141c] shadow-lg shadow-black/25 transition hover:scale-[1.01] hover:bg-white">
              Try Sandbox Demo
            </button>
            <button onClick={() => onSignIn("standard")} className="h-12 w-full rounded-2xl border border-white/15 bg-white/[0.08] text-sm font-medium text-purple-100 transition hover:bg-white/[0.13]">
              Sign In
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-purple-200">
            <button>Forgot password?</button>
            <button>Create workspace</button>
          </div>
          <p className="mt-8 text-center text-xs text-purple-300">© 2026 ClientPulse</p>
        </section>
      </div>
    </main>
  );
}

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#111118] via-[#1a1521] to-[#050507] px-5 text-white">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#130b19] via-[#3b2448] to-[#a35c9f] shadow-2xl shadow-black/30">
          <Activity className="h-9 w-9 animate-pulse" />
        </div>
        <div className="relative mt-10 h-24 overflow-hidden rounded-3xl border border-white/10 bg-black/20 px-6 shadow-2xl shadow-black/30">
          <svg viewBox="0 0 600 120" className="absolute left-0 top-0 h-full w-[1200px] animate-heartbeat" preserveAspectRatio="none">
            <path d="M0 60 L60 60 L75 60 L88 25 L105 95 L125 60 L180 60 L195 60 L208 45 L220 72 L235 60 L300 60 L360 60 L375 60 L388 25 L405 95 L425 60 L480 60 L495 60 L508 45 L520 72 L535 60 L600 60" fill="none" stroke="#d8c9df" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="mt-8 text-3xl font-medium">{getGreeting()}, Danielle.</h1>
        <p className="mt-3 text-purple-100">Reading your relationship signals…</p>
        <style jsx>{`
          @keyframes heartbeat {
            0% { transform: translateX(0); }
            100% { transform: translateX(-600px); }
          }
          .animate-heartbeat { animation: heartbeat 2.6s linear infinite; }
        `}</style>
      </div>
    </main>
  );
}

function Panel({ title, subtitle, children, pad = "p-5" }: any) {
  return (
    <div className={`rounded-[1.65rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.095),rgba(255,255,255,0.040))] ${pad} text-white shadow-xl shadow-black/25 backdrop-blur-sm`}>
      <h3 className="text-[1.35rem] font-medium tracking-[-0.015em]">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm text-purple-200/85">{subtitle}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function SummaryButton({ label, value, onClick, showAlert = false }: any) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between rounded-2xl border border-white/12 bg-white/[0.055] px-4 py-3 text-left transition hover:bg-white/[0.10]">
      <span className="flex items-center gap-2 text-sm text-purple-100">
        {showAlert && <AlertTriangle className="h-4 w-4 text-[#d8a2c7]" />}
        {label}
      </span>
      <span className="text-sm font-medium text-white">{value}</span>
    </button>
  );
}

function MetricCard({ icon: Icon, label, value, detail }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.105),rgba(255,255,255,0.045))] p-5 text-white shadow-xl shadow-black/25">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-purple-200/80">{label}</p>
          <p className="mt-2 text-3xl font-medium">{value}</p>
          <p className="mt-1 text-sm text-purple-100">{detail}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-3 text-white">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function HealthScoreGrid({ accounts, selectAccount }: any) {
  return (
    <Panel title="Client health signals" subtitle="Calculated relationship scores from current sandbox data.">
      <div className="grid gap-4 md:grid-cols-3">
        {accounts.slice(0, 6).map((account: any) => (
          <button key={account.id} onClick={() => selectAccount(account.id)} className="rounded-3xl border border-white/10 bg-white/[0.055] p-4 text-left transition hover:bg-white/[0.10]">
            <div className="flex items-center justify-between">
              <p className="font-medium">{account.name}</p>
              {account.score.trend === "Improving" ? <TrendingUp className="h-5 w-5 text-emerald-200" /> : account.score.trend === "Declining" ? <TrendingDown className="h-5 w-5 text-pink-200" /> : <Activity className="h-5 w-5 text-purple-100" />}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <ScoreRing score={account.score.overall} />
              <StatusChip label={account.score.priority} />
            </div>
            <p className="mt-3 text-sm text-purple-100">{account.owner} · {account.lastTouch}</p>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function ScoreRing({ score }: any) {
  const color = score >= 82 ? "#86efac" : score >= 68 ? "#facc15" : score >= 56 ? "#c4b5fd" : "#f9a8d4";
  const dash = `${score}, 100`;
  return (
    <div className="relative h-20 w-20">
      <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2.5" />
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={dash} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xl font-medium">{score}</div>
    </div>
  );
}

function RecentAccountsCard({ accounts, selectedAccountId, setSelectedAccountId }: any) {
  return (
    <Panel title="Recent Accounts" subtitle="Scrollable account list.">
      <div className="max-h-[265px] space-y-3 overflow-y-auto pr-2">
        {accounts.map((account: any) => (
          <button key={account.id} onClick={() => setSelectedAccountId(account.id)} className={`w-full rounded-3xl border p-4 text-left transition ${selectedAccountId === account.id ? "border-white/35 bg-white/[0.12]" : "border-white/10 bg-white/[0.055] hover:bg-white/[0.10]"}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">{account.name}</p>
                <p className="mt-1 text-sm text-purple-100">{account.owner} · {account.stage}</p>
              </div>
              <StatusChip label={account.score.priority} />
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function AccountDetail({ account, touches, showTimeline, insightStyle }: any) {
  return (
    <Panel title={account.name} subtitle={`Owned by ${account.owner}`}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
          <p className="text-sm text-purple-100">Relationship Pulse</p>
          <div className="mt-3 flex items-center justify-between">
            <ScoreRing score={account.score.overall} />
            <RiskBadge risk={account.score.risk} />
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
          <p className="text-sm text-purple-100">Narrative score</p>
          <p className="mt-2 text-sm leading-7 text-white">
            {insightStyle === "Visual only" ? `${account.score.priority} · ${account.score.trend}` : account.score.narrative}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Factor label="Tone" value={account.score.sentimentQuality} />
        <Factor label="Rhythm" value={account.score.engagementRhythm} />
        <Factor label="Trust" value={account.score.trustLevel} />
        <Factor label="Potential" value={account.score.futurePotential} />
        <Factor label="Drift" value={account.score.driftVelocity} />
      </div>

      {showTimeline && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
          <p className="text-sm text-purple-100">Relationship timeline</p>
          <div className="mt-4 space-y-3">
            {touches.length ? touches.map((touch: any) => (
              <div key={touch.id} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{touch.type}</p>
                  <StatusChip label={touch.sentiment} />
                </div>
                <p className="mt-2 text-sm text-purple-100">{touch.summary}</p>
              </div>
            )) : <p className="text-sm text-purple-100">No touches logged yet.</p>}
          </div>
        </div>
      )}
    </Panel>
  );
}

function Factor({ label, value }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
      <p className="text-xs text-purple-200">{label}</p>
      <p className="mt-1 text-lg font-medium">{Math.round(value)}</p>
    </div>
  );
}

function FullAccountsList({ accounts, query, setQuery, setSelectedAccountId }: any) {
  return (
    <Panel title="Account list" subtitle="Scrollable CRM-style relationship view.">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-200" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search accounts" className="w-full rounded-2xl border border-white/15 bg-white/[0.07] py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-purple-200" />
      </div>
      <div className="max-h-[520px] overflow-y-auto rounded-3xl border border-white/10">
        {accounts.map((account: any) => (
          <button key={account.id} onClick={() => setSelectedAccountId(account.id)} className="grid w-full grid-cols-1 gap-3 border-b border-white/10 bg-white/[0.045] px-4 py-4 text-left transition hover:bg-white/[0.09] md:grid-cols-[1.3fr_.8fr_.8fr_.8fr_40px]">
            <div>
              <p className="font-medium text-white">{account.name}</p>
              <p className="mt-1 text-xs text-purple-100">{account.stage}</p>
            </div>
            <div>
              <p className="text-xs text-purple-300">Owner</p>
              <p className="text-sm text-white">{account.owner}</p>
            </div>
            <div>
              <p className="text-xs text-purple-300">Value</p>
              <p className="text-sm text-white">{formatMoney(account.value)}</p>
            </div>
            <div>
              <p className="text-xs text-purple-300">Score</p>
              <p className="text-sm text-white">{account.score.overall}</p>
            </div>
            <PulseMark health={account.score.overall} />
          </button>
        ))}
      </div>
    </Panel>
  );
}

function LogTouchPanel({ newTouch, setNewTouch, logTouch, selectedAccount }: any) {
  return (
    <Panel title="Log relationship touch" subtitle={`Add activity for ${selectedAccount?.name || "selected account"}.`}>
      <div className="grid gap-3 md:grid-cols-3">
        <Select value={newTouch.type} onChange={(v: string) => setNewTouch({ ...newTouch, type: v })} options={["Email", "Call", "Meeting", "Note", "Milestone"]} />
        <Select value={newTouch.sentiment} onChange={(v: string) => setNewTouch({ ...newTouch, sentiment: v })} options={["positive", "neutral", "concerned", "negative"]} />
        <Select value={newTouch.direction} onChange={(v: string) => setNewTouch({ ...newTouch, direction: v })} options={["outbound", "inbound", "internal"]} />
      </div>
      <input value={newTouch.summary} onChange={(e) => setNewTouch({ ...newTouch, summary: e.target.value })} placeholder="Summary" className="w-full rounded-2xl border border-white/15 bg-white/[0.07] p-3 text-white outline-none" />
      <textarea value={newTouch.content} onChange={(e) => setNewTouch({ ...newTouch, content: e.target.value })} placeholder="Details or email content" className="min-h-28 w-full rounded-2xl border border-white/15 bg-white/[0.07] p-3 text-white outline-none" />
      <button onClick={logTouch} className="flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#17141c]">
        <Plus className="h-4 w-4" />
        Log Touch
      </button>
    </Panel>
  );
}

function AddAccountPanel({ newAccount, setNewAccount, addAccount }: any) {
  return (
    <Panel title="Add account" subtitle="Creates a persistent sandbox account in localStorage.">
      <div className="grid gap-3 md:grid-cols-3">
        <input value={newAccount.name} onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })} placeholder="Account name" className="rounded-2xl border border-white/15 bg-white/[0.07] p-3 text-white outline-none" />
        <input value={newAccount.owner} onChange={(e) => setNewAccount({ ...newAccount, owner: e.target.value })} placeholder="Owner" className="rounded-2xl border border-white/15 bg-white/[0.07] p-3 text-white outline-none" />
        <input value={newAccount.value} onChange={(e) => setNewAccount({ ...newAccount, value: e.target.value })} placeholder="Value" className="rounded-2xl border border-white/15 bg-white/[0.07] p-3 text-white outline-none" />
      </div>
      <button onClick={addAccount} className="flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#17141c]">
        <Plus className="h-4 w-4" />
        Add Account
      </button>
    </Panel>
  );
}

function ActivityPanel({ accounts, touches, activityView, setActivityView, setSelectedTouch }: any) {
  const activityRows = touches
  .map((touch: any) => ({
    ...touch,
    account: accounts.find((a: any) => a.id === touch.accountId),
  }))
  .sort(
    (a: any, b: any) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Upcoming Activity" subtitle="Scrollable relationship actions.">
          <div className="flex w-fit rounded-2xl border border-white/15 bg-white/[0.06] p-1">
            {["Company", "People"].map((view) => (
              <button key={view} onClick={() => setActivityView(view)} className={`rounded-xl px-4 py-2 text-sm ${activityView === view ? "bg-white text-[#17141c]" : "text-white"}`}>
                {view}
              </button>
            ))}
          </div>
          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-2">
            {accounts.map((account: any) => (
              <div key={account.id} className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{activityView === "Company" ? account.name : account.owner}</p>
                  <StatusChip label={account.score.priority} />
                </div>
                <p className="mt-2 text-sm text-purple-100">{account.score.recommendedAction}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Traction" subtitle="Engagement performance">
          <Factor label="Email engagement" value={68} />
          <Factor label="Response efficiency" value={74} />
          <Factor label="Meeting acceptance" value={81} />
          <Factor label="Follow-up completion" value={72} />
        </Panel>
      </div>

      <Panel title="Recent Activity" subtitle="Click an item to view the content and AI summary.">
        {activityRows.map((touch: any) => (
          <button key={touch.id} onClick={() => setSelectedTouch(touch)} className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-white/[0.055] p-4 text-left transition hover:bg-white/[0.10]">
            <div>
              <p className="font-medium">{touch.account?.name || "Unknown account"} · {touch.type}</p>
              <p className="mt-1 text-sm text-purple-100">{touch.summary}</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-purple-100" />
          </button>
        ))}
      </Panel>
    </div>
  );
}

function ActivityDetail({ touch, onBack }: any) {
  return (
    <Panel title={touch.summary} subtitle={touch.type}>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-purple-100">
        <ArrowLeft className="h-4 w-4" />
        Back to Activity
      </button>
      <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
        <p className="text-sm text-purple-100">Direction: {touch.direction}</p>
        <p className="text-sm text-purple-100">Sentiment: {touch.sentiment}</p>
        <div className="mt-5 whitespace-pre-line rounded-2xl bg-white/[0.06] p-4 text-sm leading-7 text-purple-50">
          {touch.content || touch.summary}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
        <p className="text-sm text-purple-100">AI summary</p>
        <p className="mt-2 leading-7 text-white">
          This touch contributes to the account’s current score through sentiment, recency, and engagement rhythm.
        </p>
      </div>
    </Panel>
  );
}

function IntelligencePanel({ accounts, insightStyle }: any) {
  const sorted = [...accounts].sort((a, b) => a.score.overall - b.score.overall);
  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <Panel title="Relationship intelligence" subtitle="AI-style interpretation from sandbox scoring.">
        {sorted.slice(0, 5).map((account: any) => (
          <div key={account.id} className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{account.name}</p>
              <StatusChip label={account.score.priority} />
            </div>
            <p className="mt-2 text-sm leading-6 text-purple-100">
              {insightStyle === "Short bullets"
                ? `Score ${account.score.overall}. ${account.score.trend}. ${account.score.recommendedAction}`
                : account.score.narrative}
            </p>
          </div>
        ))}
      </Panel>

      <Panel title="Scoring model" subtitle="Current sandbox factors.">
        <Factor label="Tone weight" value={30} />
        <Factor label="Rhythm weight" value={25} />
        <Factor label="Trust weight" value={15} />
        <Factor label="Potential weight" value={15} />
        <Factor label="Drift weight" value={15} />
      </Panel>
    </div>
  );
}

function AITaskManager({ aiPrompt, setAiPrompt, aiResponse, runSimulatedAI }: any) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_.8fr]">
      <Panel title="How can I help?" subtitle="Simulated AI response from sandbox data.">
        <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Ask Pulse to summarize relationship risk, draft next actions, or prioritize outreach..." className="min-h-44 w-full rounded-3xl border border-white/30 bg-[linear-gradient(180deg,#fbf8fc_0%,#eee8f3_100%)] p-5 text-[#17141c] outline-none placeholder:text-[#5b5262]" />
        <button onClick={runSimulatedAI} className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#17141c]">
          Generate Sandbox Insight
        </button>
        {aiResponse && <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 text-sm leading-7 text-purple-50">{aiResponse}</div>}
      </Panel>

      <Panel title="Suggested prompts" subtitle="Starter workflows.">
        <Prompt title="Prioritize outreach" detail="Which clients need attention today?" />
        <Prompt title="Explain score changes" detail="Why is HarborTech declining?" />
        <Prompt title="Draft follow-up" detail="Write a calm follow-up for Summit." />
      </Panel>
    </div>
  );
}

function ReportsPanel({ accounts, touches }: any) {
  const avg = Math.round(accounts.reduce((s: number, a: any) => s + a.score.overall, 0) / accounts.length);
  return (
    <div className="space-y-5">
      <Panel title="Describe the report you want to make." subtitle="">
        <textarea placeholder="Example: Show accounts with declining scores and no touch in the last 7 days..." className="min-h-28 w-full max-w-3xl rounded-3xl border border-white/30 bg-[linear-gradient(180deg,#fbf8fc_0%,#eee8f3_100%)] p-5 text-[#17141c] outline-none placeholder:text-[#5b5262]" />
      </Panel>
      <Panel title="Weekly digest preview" subtitle="Generated from sandbox data.">
        <p className="leading-7 text-purple-50">
          Average relationship score is {avg}. {accounts.filter((a: any) => a.score.overall < 68).length} accounts need review. {touches.length} touches are currently logged in the sandbox.
        </p>
      </Panel>
    </div>
  );
}

function AdminPanel({ density, setDensity, theme, setTheme, showScores, setShowScores, showTimeline, setShowTimeline, insightStyle, setInsightStyle, resetSandbox }: any) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Integrations" subtitle="Demo integration controls.">
          <button className="w-fit rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#17141c]">Connect Integration</button>
          <div className="grid gap-4 md:grid-cols-2">
            <Integration name="Outlook" status="Demo connected" icon={Mail} />
            <Integration name="Zoom" status="Demo connected" icon={Video} />
            <Integration name="Teams" status="Pending" icon={MessageSquare} />
            <Integration name="CRM" status="Not connected" icon={Users} />
          </div>
        </Panel>

        <Panel title="Manage Team" subtitle="Workspace people and permissions.">
          <button className="flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#17141c]">
            <UserPlus className="h-4 w-4" />
            Invite Team Member
          </button>
          {["Danielle Hart · Admin", "James Carter · Relationship Lead", "Nora Patel · Viewer"].map((person) => (
            <div key={person} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">{person}</div>
          ))}
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Preferences" subtitle="These affect the sandbox immediately.">
          <PreferenceToggle label="Show health scores" value={showScores} setValue={setShowScores} />
          <PreferenceToggle label="Show timelines" value={showTimeline} setValue={setShowTimeline} />
          <PreferenceSelect label="Density" value={density} setValue={setDensity} options={["Compact", "Comfortable", "Spacious"]} />
          <PreferenceSelect label="Theme" value={theme} setValue={setTheme} options={["Purple graphite", "Soft graphite", "Deep blush"]} />
          <PreferenceSelect label="Insight style" value={insightStyle} setValue={setInsightStyle} options={["Short bullets", "Gentle narrative", "Visual only"]} />
          <button onClick={resetSandbox} className="flex w-fit items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white hover:bg-white/[0.10]">
            <RefreshCcw className="h-4 w-4" />
            Reset Sandbox
          </button>
        </Panel>

        <Panel title="Live Preview" subtitle="Preference changes appear here.">
          <div className={`rounded-3xl border border-white/10 bg-white/[0.055] ${density === "Compact" ? "p-3" : density === "Spacious" ? "p-6" : "p-4"}`}>
            <div className="flex items-center justify-between">
              <p className="font-medium">Preview Account</p>
              <StatusChip label="Good timing" />
            </div>
            {showScores && <p className="mt-3 text-3xl font-medium">84</p>}
            <p className="mt-2 text-sm text-purple-100">{insightStyle}</p>
            {showTimeline && <div className="mt-4 rounded-2xl bg-white/[0.06] p-3 text-sm text-purple-100">Timeline preview visible.</div>}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Select({ value, onChange, options }: any) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-2xl border border-white/15 bg-[#17131f] p-3 text-white outline-none">
      {options.map((option: string) => <option key={option}>{option}</option>)}
    </select>
  );
}

function PreferenceToggle({ label, value, setValue }: any) {
  return (
    <button onClick={() => setValue(!value)} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-left hover:bg-white/[0.10]">
      <span>{label}</span>
      <span className={`rounded-full px-3 py-1 text-xs ${value ? "bg-emerald-100 text-emerald-800" : "bg-white/12 text-purple-100"}`}>{value ? "On" : "Off"}</span>
    </button>
  );
}

function PreferenceSelect({ label, value, setValue, options }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
      <p className="text-sm text-purple-100">{label}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {options.map((option: string) => (
          <button key={option} onClick={() => setValue(option)} className={`rounded-2xl px-3 py-2 text-xs ${value === option ? "bg-white text-[#17141c]" : "bg-white/[0.07] text-purple-100 hover:bg-white/[0.12]"}`}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function Prompt({ title, detail }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-purple-100">{detail}</p>
    </div>
  );
}

function Integration({ name, status, icon: Icon }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-purple-100">{status}</p>
        </div>
      </div>
    </div>
  );
}

function StatusChip({ label }: any) {
  const styles: any = {
    "Needs a look": "bg-pink-100 text-pink-800",
    "Follow up": "bg-amber-100 text-amber-800",
    "Good timing": "bg-emerald-100 text-emerald-800",
    "Looking good": "bg-sky-100 text-sky-800",
    "Keep an eye on": "bg-violet-100 text-violet-800",
    positive: "bg-emerald-100 text-emerald-800",
    neutral: "bg-sky-100 text-sky-800",
    concerned: "bg-amber-100 text-amber-800",
    negative: "bg-pink-100 text-pink-800",
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[label] || "bg-white/15 text-purple-100"}`}>{label}</span>;
}

function RiskBadge({ risk }: any) {
  const styles: any = {
    Low: "bg-emerald-50 text-emerald-700",
    Medium: "bg-amber-50 text-amber-700",
    Elevated: "bg-violet-50 text-violet-700",
    High: "bg-pink-50 text-pink-700",
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[risk]}`}>{risk}</span>;
}

function PulseMark({ health }: any) {
  const color = health >= 82 ? "#86efac" : health >= 68 ? "#facc15" : health >= 56 ? "#c4b5fd" : "#f9a8d4";
  return (
    <svg viewBox="0 0 60 28" className="h-8 w-12">
      <path d="M2 14 H12 L16 7 L22 22 L28 14 H38 L42 10 L47 18 L52 14 H58" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MobileNav({ activeTab, goToTab }: any) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#17131f]/95 px-3 py-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: "Home", tab: "Overview", icon: Activity },
          { label: "Accounts", tab: "Accounts", icon: Users },
          { label: "Activity", tab: "Activity", icon: Clock },
          { label: "AI", tab: "AI Task Manager", icon: Bot },
          { label: "Admin", tab: "Admin", icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.tab} onClick={() => goToTab(item.tab)} className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs transition ${activeTab === item.tab ? "bg-white/15 text-white" : "text-purple-200 hover:bg-white/10 hover:text-white"}`}>
              <Icon className="mb-1 h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}