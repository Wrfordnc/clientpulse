"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  Menu,
  Plus,
  Search,
  Settings,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

/*
  CLIENTPULSE
  Luxury Mobile + Desktop Sandbox
  Full replacement page.tsx
*/

const STORAGE_KEY = "pulse-luxury-v2";
const SIGNIN_KEY = "pulse-signed-in";

const navItems = [
  "Overview",
  "Accounts",
  "Activity",
  "Intelligence",
  "AI",
  "Reports",
  "Admin",
];

const starterAccounts = [
  {
    id: "northstar",
    name: "Northstar Logistics",
    owner: "Danielle Hart",
    value: 142000,
    stage: "Expansion review",
  },
  {
    id: "summit",
    name: "Summit Insurance Group",
    owner: "James Carter",
    value: 98000,
    stage: "Renewal planning",
  },
  {
    id: "harbortech",
    name: "HarborTech Services",
    owner: "Nora Patel",
    value: 201000,
    stage: "Recovery discussion",
  },
  {
    id: "evergreen",
    name: "Evergreen Medical",
    owner: "Marcus Flynn",
    value: 76000,
    stage: "Onboarding",
  },
  {
    id: "atlas",
    name: "Atlas Retail Partners",
    owner: "Sarah Mitchell",
    value: 121000,
    stage: "Budget planning",
  },
];

const starterTouches = [
  {
    id: "1",
    accountId: "northstar",
    type: "Email",
    summary: "Client requested updated expansion projections.",
    sentiment: "positive",
    occurredAt: daysAgo(1),
  },
  {
    id: "2",
    accountId: "harbortech",
    type: "Meeting",
    summary: "Concern around delayed implementation milestone.",
    sentiment: "concerned",
    occurredAt: daysAgo(4),
  },
  {
    id: "3",
    accountId: "summit",
    type: "Call",
    summary: "Renewal timing discussion completed successfully.",
    sentiment: "positive",
    occurredAt: daysAgo(2),
  },
];

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function calculateScore(account: any, touches: any[]) {
  const accountTouches = touches.filter(
    (touch) => touch.accountId === account.id
  );

  const positive = accountTouches.filter(
    (touch) => touch.sentiment === "positive"
  ).length;

  const concerned = accountTouches.filter(
    (touch) => touch.sentiment === "concerned"
  ).length;

  const daysSinceTouch = accountTouches.length
    ? Math.floor(
        (Date.now() -
          new Date(
            accountTouches[0].occurredAt
          ).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 30;

  const trust = Math.max(
    55,
    92 - concerned * 8 + positive * 3
  );

  const engagement = Math.max(
    40,
    95 - daysSinceTouch * 4
  );

  const momentum = Math.max(
    45,
    88 + positive * 2 - concerned * 5
  );

  const stability = Math.max(
    50,
    90 - concerned * 6
  );

  const opportunity = Math.min(
    95,
    50 + Math.round(account.value / 6000)
  );

  const overall = Math.round(
    trust * 0.3 +
      engagement * 0.25 +
      momentum * 0.2 +
      stability * 0.15 +
      opportunity * 0.1
  );

  const narrative =
    overall >= 85
      ? `${account.name} remains a strong, healthy relationship with positive momentum and low attention need.`
      : overall >= 72
      ? `${account.name} appears stable overall, though maintaining engagement consistency would help preserve momentum.`
      : `${account.name} may benefit from thoughtful follow-up to reinforce continuity and reduce relationship drift.`;

  return {
    overall,
    trust,
    engagement,
    momentum,
    stability,
    opportunity,
    narrative,
  };
}

export default function Page() {
  const [authState, setAuthState] = useState<
    "login" | "loading" | "dashboard"
  >("login");

  const [activeTab, setActiveTab] =
    useState("Overview");

  const [accounts, setAccounts] = useState<any[]>(
    starterAccounts
  );

  const [touches, setTouches] = useState<any[]>(
    starterTouches
  );

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [selectedAccountId, setSelectedAccountId] =
    useState("northstar");

  const [aiPrompt, setAiPrompt] = useState("");

  const [aiResponse, setAiResponse] = useState("");

  useEffect(() => {
    const signedIn = localStorage.getItem(
      SIGNIN_KEY
    );

    if (signedIn === "true") {
      setAuthState("dashboard");
    }

    const stored = localStorage.getItem(
      STORAGE_KEY
    );

    if (stored) {
      const parsed = JSON.parse(stored);
      setAccounts(parsed.accounts || starterAccounts);
      setTouches(parsed.touches || starterTouches);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ accounts, touches })
    );
  }, [accounts, touches]);

  const scoredAccounts = useMemo(() => {
    return accounts.map((account) => ({
      ...account,
      score: calculateScore(account, touches),
    }));
  }, [accounts, touches]);

  const selectedAccount =
    scoredAccounts.find(
      (a) => a.id === selectedAccountId
    ) || scoredAccounts[0];

  function signIn() {
    setAuthState("loading");

    setTimeout(() => {
      localStorage.setItem(SIGNIN_KEY, "true");
      setAuthState("dashboard");
    }, 1800);
  }

  function logout() {
    localStorage.removeItem(SIGNIN_KEY);
    setAuthState("login");
  }

  function runAI() {
    const lowest = [...scoredAccounts].sort(
      (a, b) =>
        a.score.overall - b.score.overall
    )[0];

    setAiResponse(
      `${lowest.name} currently shows the highest attention need. Engagement consistency has softened recently, though the relationship foundation remains stable. A thoughtful follow-up tied to recent initiatives would likely improve momentum.`
    );
  }

  if (authState === "login") {
    return (
      <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#3a2444_0%,#111118_44%,#030305_100%)] text-white">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,165,184,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(190,150,220,0.14),transparent_30%)]" />

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
  Pulse centralizes relationship signals, interprets engagement momentum,
  and surfaces continuity insights before small gaps become churn risk.
</p>

<div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
  <div className="rounded-3xl border border-[#d8a5b8]/12 bg-white/[0.055] p-4 backdrop-blur">
    <p className="text-3xl font-medium tracking-[-0.04em] text-white">84</p>
    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#d8a5b8]/70">Avg Pulse</p>
  </div>

  <div className="rounded-3xl border border-[#d8a5b8]/12 bg-white/[0.055] p-4 backdrop-blur">
    <p className="text-3xl font-medium tracking-[-0.04em] text-white">3</p>
    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#d8a5b8]/70">Need Attention</p>
  </div>

  <div className="rounded-3xl border border-[#d8a5b8]/12 bg-white/[0.055] p-4 backdrop-blur">
    <p className="text-3xl font-medium tracking-[-0.04em] text-white">18%</p>
    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#d8a5b8]/70">Less Drift</p>
  </div>
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

                <h1 className="mt-6 text-6xl font-semibold tracking-[-0.04em]">
                  pulse
                </h1>

                <div className="mx-auto mt-4 h-px w-16 rounded-full bg-[#d8a5b8]" />

                <p className="mt-5 text-xl font-light text-[#e7dbe9]">
                  Relationship Intelligence
                </p>
              </div>

              <div className="mt-12 space-y-4">
                <input
                  placeholder="Email"
                  className="h-14 w-full rounded-2xl border border-[#d8a5b8]/12 bg-white/[0.07] px-4 text-white outline-none"
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="h-14 w-full rounded-2xl border border-[#d8a5b8]/12 bg-white/[0.07] px-4 text-white outline-none"
                />

                <button
                  onClick={signIn}
                  className="mt-6 h-14 w-full rounded-2xl bg-[linear-gradient(135deg,#f1dbe5_0%,#d8a5b8_45%,#b98bb1_100%)] text-sm font-semibold text-[#17141c] shadow-[0_18px_60px_rgba(216,165,184,0.24)] transition hover:scale-[1.015]"
                >
                  Try Sandbox Demo
                </button>

                <button className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] text-sm text-white transition hover:bg-white/[0.10]">
                  Sign In
                </button>
              </div>

              <div className="mt-8 flex items-center justify-between text-sm text-[#d8c8dc]/72">
                <button>Forgot password?</button>
                <button>Create workspace</button>
              </div>

              <p className="mt-10 text-center text-xs text-[#d8c8dc]/45">
                © 2026 ClientPulse
              </p>
            </section>
          </div>
        </div>
      </main>
    );
  }

  if (authState === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#34203e_0%,#121119_42%,#040406_100%)] px-6 text-white">
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[linear-gradient(145deg,#17101f_0%,#4a334f_55%,#c79eb3_100%)] shadow-[0_24px_80px_rgba(216,165,184,0.22)]">
            <Activity className="h-10 w-10 animate-pulse" />
          </div>

          <div className="relative mt-12 h-24 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
            <svg
              viewBox="0 0 600 120"
              className="absolute left-0 top-0 h-full w-[1200px] animate-heartbeat"
            >
              <path
                d="M0 60 L70 60 L88 20 L105 92 L125 60 L210 60 L230 45 L245 75 L260 60 L350 60 L370 20 L388 92 L405 60 L490 60 L510 45 L525 75 L540 60 L600 60"
                fill="none"
                stroke="#d8a5b8"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="mt-10 text-4xl font-medium tracking-[-0.03em]">
            Reading relationship signals…
          </h1>

          <style jsx>{`
            @keyframes heartbeat {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-600px);
              }
            }

            .animate-heartbeat {
              animation: heartbeat 2.8s linear infinite;
            }
          `}</style>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#30203b_0%,#13141a_44%,#040406_100%)] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,165,184,0.10),transparent_32%),radial-gradient(circle_at_82%_8%,rgba(190,150,220,0.10),transparent_30%)]" />

      {/* MOBILE TOPBAR */}
      <div className="sticky top-0 z-50 border-b border-white/6 bg-[#0e0f14]/75 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em]">
              pulse
            </h1>
            <p className="text-xs tracking-wide text-[#d8c8dc]/65">
              Relationship Intelligence
            </p>
          </div>

          <button
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            className="rounded-2xl border border-white/10 bg-white/[0.06] p-3"
          >
            {mobileMenu ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileMenu && (
          <div className="space-y-2 px-5 pb-5">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveTab(item);
                  setMobileMenu(false);
                }}
                className={`w-full rounded-2xl px-4 py-3 text-left ${
                  activeTab === item
                    ? "bg-white text-[#17141c]"
                    : "bg-white/[0.05]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-[#d8a5b8]/12 bg-[linear-gradient(180deg,#32203e_0%,#211827_50%,#13111a_100%)] px-5 py-6 lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[linear-gradient(145deg,#17101f_0%,#4a334f_55%,#c79eb3_100%)] shadow-[0_18px_50px_rgba(216,165,184,0.22)]">
            <Activity className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-[2.7rem] font-semibold leading-none tracking-[-0.04em]">
              pulse
            </h1>
            <p className="mt-1 text-xs tracking-wide text-[#d8c8dc]/65">
              Relationship Intelligence
            </p>
          </div>
        </div>

        <nav className="mt-12 space-y-2">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
                activeTab === item
                  ? "bg-white text-[#17141c]"
                  : "bg-white/[0.05] text-white hover:bg-white/[0.09]"
              }`}
            >
              {item}
              <ChevronRight className="h-4 w-4" />
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="absolute bottom-6 left-5 right-5 rounded-2xl border border-white/10 bg-white/[0.05] py-3 text-sm hover:bg-white/[0.09]"
        >
          Sign Out
        </button>
      </aside>

      <section className="relative px-5 pb-32 pt-6 lg:ml-64 lg:px-10 lg:pb-10 lg:pt-8">
        {/* HERO */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-lg text-[#d8c8dc]/75">
              {getGreeting()}, Danielle.
            </p>

            <h1 className="mt-3 max-w-4xl text-[2.75rem] font-medium leading-[1.02] tracking-[-0.055em] sm:text-5xl lg:text-[4rem]">
  Relationship continuity at a glance.
</h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#d8c8dc]/70">
              Pulse helps account teams interpret
              relationship patterns, maintain continuity,
              and identify attention needs before they
              become churn risk.
            </p>
          </div>

          
            <div className="flex items-center gap-3 rounded-3xl border border-[#d8a5b8]/12 bg-white/[0.045] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
  <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d8a5b8]/12 bg-[#d8a5b8]/8 text-[#f1d6e2] transition hover:bg-[#d8a5b8]/14">
    <Bell className="h-5 w-5" />

    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#d8a5b8] text-[11px] font-semibold text-[#17141c] shadow-[0_8px_24px_rgba(216,165,184,0.35)]">
      3
    </span>
  </button>

  <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#f1dbe5_0%,#d8a5b8_55%,#b98bb1_100%)] text-sm font-semibold text-[#17141c] shadow-[0_12px_35px_rgba(216,165,184,0.20)] lg:flex">
    DH
  </div>
</div>
        </div>

        {/* EXECUTIVE */}
        <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
          <Panel
            title="A few relationships may need attention."
            subtitle="Executive Focus Panel"
          >
            <div className="inline-flex w-fit rounded-full border border-[#d8a5b8]/15 bg-[#d8a5b8]/10 px-3 py-1 text-xs tracking-wide text-[#f1d6e2]">
              Calm intelligence, not dashboard noise.
            </div>

            <p className="max-w-2xl text-sm leading-8 text-[#d8c8dc]/76">
              Pulse interprets relationship continuity,
              engagement patterns, momentum, and trust
              signals to help teams prioritize thoughtful
              action without creating operational noise.
            </p>

            <div className="flex flex-wrap gap-3">
              <button className="rounded-2xl bg-[linear-gradient(135deg,#f1dbe5_0%,#d8a5b8_45%,#b98bb1_100%)] px-5 py-3 text-sm font-semibold text-[#17141c]">
                Review Attention Items
              </button>

              <button className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm">
                Open Accounts
              </button>
            </div>
          </Panel>

          <Panel
            title="Today’s focus"
            subtitle="Current relationship attention queue"
          >
            {scoredAccounts
              .sort(
                (a, b) =>
                  a.score.overall -
                  b.score.overall
              )
              .slice(0, 3)
              .map((account) => (
                <div
                  key={account.id}
                  className="rounded-3xl border border-white/8 bg-white/[0.05] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {account.name}
                      </p>

                      <p className="mt-1 text-sm text-[#d8c8dc]/65">
                        {account.stage}
                      </p>
                    </div>

                    <ScorePill
                      score={
                        account.score.overall
                      }
                    />
                  </div>
                </div>
              ))}
          </Panel>
        </div>

        {/* KPI */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Users}
            label="Tracked Accounts"
            value={String(accounts.length)}
            detail="Sandbox relationships"
          />

          <MetricCard
            icon={Clock}
            label="Relationship Touches"
            value={String(touches.length)}
            detail="Emails, calls, meetings"
          />

          <MetricCard
            icon={CheckCircle2}
            label="Average Pulse"
            value="84"
            detail="Healthy continuity"
          />

          <MetricCard
            icon={TrendingDown}
            label="Attention Need"
            value="3"
            detail="Relationships to review"
          />
        </div>

        {/* ACCOUNT GRID */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
          <Panel
            title="Recent Accounts"
            subtitle="Relationship overview"
          >
            <div className="max-h-[500px] space-y-3 overflow-y-auto pr-2">
              {scoredAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() =>
                    setSelectedAccountId(
                      account.id
                    )
                  }
                  className={`w-full rounded-3xl border p-5 text-left transition ${
                    selectedAccountId ===
                    account.id
                      ? "border-[#d8a5b8]/24 bg-[#d8a5b8]/10"
                      : "border-white/8 bg-white/[0.045] hover:bg-white/[0.08]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-medium">
                        {account.name}
                      </p>

                      <p className="mt-2 text-sm text-[#d8c8dc]/65">
                        {account.owner} ·{" "}
                        {account.stage}
                      </p>
                    </div>

                    <PulseMark
                      health={
                        account.score.overall
                      }
                    />
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel
            title={selectedAccount.name}
            subtitle="Relationship Pulse"
          >
            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
              <div className="flex flex-col items-center rounded-[2rem] border border-[#d8a5b8]/10 bg-white/[0.04] p-6">
                <ScoreRing
                  score={
                    selectedAccount.score
                      .overall
                  }
                />

                <p className="mt-5 text-center text-sm leading-7 text-[#d8c8dc]/70">
                  {
                    selectedAccount.score
                      .narrative
                  }
                </p>
              </div>

              <div className="space-y-4">
                <Dimension
                  label="Trust"
                  value={
                    selectedAccount.score
                      .trust
                  }
                />

                <Dimension
                  label="Engagement"
                  value={
                    selectedAccount.score
                      .engagement
                  }
                />

                <Dimension
                  label="Momentum"
                  value={
                    selectedAccount.score
                      .momentum
                  }
                />

                <Dimension
                  label="Stability"
                  value={
                    selectedAccount.score
                      .stability
                  }
                />

                <Dimension
                  label="Opportunity"
                  value={
                    selectedAccount.score
                      .opportunity
                  }
                />
              </div>
            </div>
          </Panel>
        </div>

        {/* AI */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_.8fr]">
          <Panel
            title="AI Relationship Assistant"
            subtitle="Interpretation layer"
          >
            <textarea
              value={aiPrompt}
              onChange={(e) =>
                setAiPrompt(e.target.value)
              }
              placeholder="Ask Pulse to summarize relationship attention needs, explain momentum changes, or identify accounts requiring thoughtful follow-up..."
              className="min-h-[220px] w-full rounded-[2rem] border border-[#d8a5b8]/15 bg-[linear-gradient(180deg,#f8f3f7_0%,#ece6ef_100%)] p-5 text-[#17141c] outline-none"
            />

            <button
              onClick={runAI}
              className="mt-4 rounded-2xl bg-[linear-gradient(135deg,#f1dbe5_0%,#d8a5b8_45%,#b98bb1_100%)] px-5 py-3 text-sm font-semibold text-[#17141c]"
            >
              Generate Insight
            </button>

            {aiResponse && (
              <div className="mt-5 rounded-[2rem] border border-[#d8a5b8]/10 bg-white/[0.05] p-5 text-sm leading-8 text-[#f1e9f4]">
                {aiResponse}
              </div>
            )}
          </Panel>

          <Panel
            title="Suggested prompts"
            subtitle="Relationship-focused workflows"
          >
            <Prompt
              title="Prioritize attention"
              detail="Which accounts may need thoughtful follow-up this week?"
            />

            <Prompt
              title="Explain score changes"
              detail="Why did HarborTech’s momentum decline?"
            />

            <Prompt
              title="Engagement review"
              detail="Summarize communication consistency over the last 60 days."
            />
          </Panel>
        </div>
      </section>
    </main>
  );
}

/* COMPONENTS */

function Panel({
  title,
  subtitle,
  children,
}: any) {
  return (
    <div className="rounded-[2rem] border border-[#d8a5b8]/12 bg-[linear-gradient(145deg,rgba(42,32,55,0.92),rgba(20,16,27,0.88))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-sm">
      <h3 className="text-[1.6rem] font-medium tracking-[-0.03em]">
        {title}
      </h3>

      <p className="mt-2 text-sm text-[#d8c8dc]/68">
        {subtitle}
      </p>

      <div className="mt-6 space-y-4">
        {children}
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: any) {
  return (
    <div className="rounded-[1.8rem] border border-[#d8a5b8]/10 bg-[linear-gradient(145deg,rgba(48,38,61,0.86),rgba(18,16,25,0.90))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/68">
            {label}
          </p>

          <p className="mt-3 text-4xl font-medium tracking-[-0.04em]">
            {value}
          </p>

          <p className="mt-2 text-sm text-[#d8c8dc]/68">
            {detail}
          </p>
        </div>

        <div className="rounded-2xl border border-[#d8a5b8]/14 bg-[#d8a5b8]/10 p-3 text-[#f1d6e2]">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function Dimension({
  label,
  value,
}: any) {
  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.045] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#d8c8dc]/68">
          {label}
        </p>

        <p className="text-lg font-medium">
          {value}
        </p>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/6">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#d8a5b8_0%,#c7a7e8_100%)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ScoreRing({
  score,
}: any) {
  const color =
    score >= 82
      ? "#9FE6C0"
      : score >= 68
      ? "#E7C873"
      : score >= 56
      ? "#C7A7E8"
      : "#D8A5B8";

  return (
    <div className="relative h-32 w-32">
      <svg
        viewBox="0 0 36 36"
        className="h-32 w-32 -rotate-90"
      >
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="rgba(255,255,255,.08)"
          strokeWidth="2.2"
        />

        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeDasharray={`${score},100`}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl font-medium tracking-[-0.04em]">
          {score}
        </p>

        <p className="mt-1 text-xs tracking-wide text-[#d8c8dc]/62">
          Pulse
        </p>
      </div>
    </div>
  );
}

function ScorePill({
  score,
}: any) {
  return (
    <div className="rounded-full border border-[#d8a5b8]/12 bg-[#d8a5b8]/10 px-3 py-1 text-sm text-[#f1d6e2]">
      {score}
    </div>
  );
}

function Prompt({
  title,
  detail,
}: any) {
  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.045] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-medium">
            {title}
          </p>

          <p className="mt-2 text-sm leading-7 text-[#d8c8dc]/68">
            {detail}
          </p>
        </div>

        <ArrowUpRight className="h-5 w-5 text-[#d8c8dc]/55" />
      </div>
    </div>
  );
}

function PulseMark({
  health,
}: any) {
  const color =
    health >= 82
      ? "#9FE6C0"
      : health >= 68
      ? "#E7C873"
      : health >= 56
      ? "#C7A7E8"
      : "#D8A5B8";

  return (
    <svg
      viewBox="0 0 60 28"
      className="h-8 w-12"
    >
      <path
        d="M2 14 H12 L16 7 L22 22 L28 14 H38 L42 10 L47 18 L52 14 H58"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}