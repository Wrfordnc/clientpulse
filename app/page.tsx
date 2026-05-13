"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  Home,
  Mail,
  Menu,
  MessageSquare,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";

// ─── Keys ──────────────────────────────────────────────────────────────────
const STORAGE_KEY  = "pulse-sandbox-v4";
const SIGNIN_KEY   = "pulse-signed-in-v4";
const WEIGHTS_KEY  = "pulse-weights-v1";
const HISTORY_KEY  = "pulse-history-v1";

// ─── Types ─────────────────────────────────────────────────────────────────
type Account = { id: string; name: string; owner: string; value: number; stage: string };
type Touch   = {
  id: string; accountId: string; type: string; summary: string; content: string;
  sentiment: "positive" | "neutral" | "concerned" | "negative";
  direction:  "inbound"  | "outbound"  | "internal";
  occurredAt: string;
};
type ScoringWeights  = { trust: number; engagement: number; momentum: number; stability: number; opportunity: number };
type ScoreSnapshot   = { date: string; overall: number };
type AccountHistory  = Record<string, ScoreSnapshot[]>;
type ScoreResult = {
  overall: number; trust: number; engagement: number; momentum: number;
  stability: number; opportunity: number; priority: string; priorityColor: string;
  trend: "Improving" | "Declining" | "Stable"; narrative: string; action: string; lastTouchDays: number;
};
type ScoredAccount = Account & { score: ScoreResult };

// ─── Constants ─────────────────────────────────────────────────────────────
const DEFAULT_WEIGHTS: ScoringWeights = { trust: 30, engagement: 25, momentum: 20, stability: 15, opportunity: 10 };
const NAV_ITEMS = ["Overview", "Accounts", "Activity", "Intelligence", "AI Assistant", "Reports", "Admin"];

// ─── Utilities ─────────────────────────────────────────────────────────────
function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); }
function newId() { return (typeof crypto !== "undefined" && "randomUUID" in crypto) ? crypto.randomUUID() : Math.random().toString(36).slice(2); }
function getGreeting() { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; }
function daysSince(s: string) { return Math.max(0, Math.floor((Date.now() - new Date(s).getTime()) / 86400000)); }
function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, Math.round(n))); }

// ─── Score Engine ──────────────────────────────────────────────────────────
function calculateScore(account: Account, touches: Touch[], weights: ScoringWeights): ScoreResult {
  const at = touches.filter(t => t.accountId === account.id)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  const latest       = at[0];
  const lastTouchDays= latest ? daysSince(latest.occurredAt) : 30;
  const positive     = at.filter(t => t.sentiment === "positive").length;
  const concerned    = at.filter(t => t.sentiment === "concerned" || t.sentiment === "negative").length;
  const inbound      = at.filter(t => t.direction === "inbound").length;

  const trust       = clamp(78 + positive * 4 - concerned * 8 + inbound * 2, 45, 98);
  const engagement  = clamp(96 - lastTouchDays * 5 + at.length * 3, 35, 98);
  const momentum    = clamp(78 + positive * 5 - concerned * 7 - lastTouchDays * 2, 38, 96);
  const stability   = clamp(84 - concerned * 8 + Math.min(at.length * 2, 8), 42, 96);
  const opportunity = clamp(48 + Math.round(account.value / 6500) + positive * 2, 40, 95);

  const w = weights;
  const overall = Math.round(
    trust * (w.trust / 100) + engagement * (w.engagement / 100) +
    momentum * (w.momentum / 100) + stability * (w.stability / 100) + opportunity * (w.opportunity / 100)
  );

  const priority      = overall >= 84 ? "Strong" : overall >= 74 ? "Steady" : overall >= 64 ? "Follow up" : "Needs attention";
  const priorityColor = overall >= 84 ? "#9FE6C0" : overall >= 74 ? "#E7C873" : overall >= 64 ? "#C7A7E8" : "#F4A7B9";
  const trend: "Improving" | "Declining" | "Stable" = momentum >= 82 ? "Improving" : momentum < 65 ? "Declining" : "Stable";

  const narrative =
    overall >= 84 ? `${account.name} shows strong continuity with steady momentum. Attention need is low right now.` :
    overall >= 72 ? `${account.name} appears stable overall. A timely check-in would help maintain engagement clarity.` :
    `${account.name} may need thoughtful attention. Engagement has softened — a clear follow-up could help rebuild momentum.`;

  const action =
    priority === "Needs attention" ? "Schedule a direct check-in with one clear next step." :
    priority === "Follow up"       ? "Close the open loop with a concise, context-aware follow-up." :
    priority === "Steady"          ? "Use current momentum to explore the next opportunity together." :
    "Maintain cadence and continue monitoring for any early drift signals.";

  return { overall, trust, engagement, momentum, stability, opportunity, priority, priorityColor, trend, narrative, action, lastTouchDays };
}

// ─── Starter Data ──────────────────────────────────────────────────────────
const starterAccounts: Account[] = [
  { id: "northstar",  name: "Northstar Logistics",    owner: "Danielle Hart",  value: 142000, stage: "Expansion review"    },
  { id: "summit",     name: "Summit Insurance Group", owner: "James Carter",   value: 98000,  stage: "Renewal planning"    },
  { id: "harbortech", name: "HarborTech Services",    owner: "Nora Patel",     value: 201000, stage: "Recovery discussion" },
  { id: "evergreen",  name: "Evergreen Medical",      owner: "Marcus Flynn",   value: 76000,  stage: "Onboarding"          },
  { id: "atlas",      name: "Atlas Retail Partners",  owner: "Sarah Mitchell", value: 121000, stage: "Budget planning"     },
  { id: "ironwood",   name: "Ironwood Systems",        owner: "Dana Lewis",     value: 189000, stage: "Exec alignment"      },
  { id: "silvergate", name: "Silvergate Pharma",      owner: "Henry Liu",      value: 168000, stage: "Expansion signal"    },
  { id: "clearwater", name: "Clearwater Supply",      owner: "Janelle Price",  value: 96000,  stage: "Healthy cadence"     },
];

const starterTouches: Touch[] = [
  { id: "t1", accountId: "northstar",  type: "Email",   summary: "Client requested updated expansion projections.",   content: "Austyn asked for updated projections before the next planning call.", sentiment: "positive",  direction: "inbound",  occurredAt: daysAgo(1) },
  { id: "t2", accountId: "harbortech", type: "Meeting", summary: "Concern around delayed implementation milestone.",  content: "Client raised concern about delayed milestone and requested a clearer recovery plan.", sentiment: "concerned", direction: "inbound",  occurredAt: daysAgo(4) },
  { id: "t3", accountId: "summit",     type: "Call",    summary: "Renewal timing discussion completed successfully.", content: "Renewal timing was positive. Client asked for a concise implementation timeline.", sentiment: "positive",  direction: "outbound", occurredAt: daysAgo(2) },
  { id: "t4", accountId: "atlas",      type: "Email",   summary: "Budget review timing is unclear.",                  content: "Account owner noted that budget review timing may have shifted.", sentiment: "neutral",   direction: "internal", occurredAt: daysAgo(6) },
  { id: "t5", accountId: "ironwood",   type: "Meeting", summary: "Executive alignment session — strong momentum.",    content: "Productive exec session. Client enthusiastic about new roadmap.", sentiment: "positive",  direction: "inbound",  occurredAt: daysAgo(3) },
  { id: "t6", accountId: "silvergate", type: "Call",    summary: "Expansion signal confirmed by procurement lead.",   content: "Procurement is scoping an additional module. Very positive early signal.", sentiment: "positive",  direction: "inbound",  occurredAt: daysAgo(5) },
  { id: "t7", accountId: "harbortech", type: "Email",   summary: "Follow-up on recovery plan timeline.",              content: "Sent updated timeline. Client response was cautious but open.", sentiment: "neutral",   direction: "outbound", occurredAt: daysAgo(2) },
  { id: "t8", accountId: "harbortech", type: "Note",    summary: "Internal note — risk flag from account team.",      content: "Flagged internally as medium churn risk. Owner to schedule call.", sentiment: "negative",  direction: "internal", occurredAt: daysAgo(1) },
];

function generateStarterHistory(accounts: Account[], touches: Touch[], weights: ScoringWeights): AccountHistory {
  const history: AccountHistory = {};
  accounts.forEach(account => {
    const base = calculateScore(account, touches, weights).overall;
    const trajectories: Record<string, number> = { harbortech: -8, atlas: -4, evergreen: 2, summit: 3, northstar: 2, ironwood: 5, silvergate: 4, clearwater: 1 };
    const drift = trajectories[account.id] ?? 0;
    const snapshots: ScoreSnapshot[] = [];
    for (let i = 9; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i * 7);
      const noise = (Math.random() - 0.5) * 8;
      snapshots.push({ date: d.toISOString(), overall: clamp(base - drift + (i * drift / 9) + noise, 35, 99) });
    }
    history[account.id] = snapshots;
  });
  return history;
}

// ─── Font Loader ───────────────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    if (document.getElementById("pulse-fonts")) return;
    const link = document.createElement("link");
    link.id   = "pulse-fonts";
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Sora:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
}

// ─── Grain Overlay ─────────────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-3 opacity-[0.028] mix-blend-overlay"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "160px 160px" }}
    />
  );
}

// ─── Chart Components ─────────────────────────────────────────────────────
function PulseBarChart({ data }: { data: { name: string; score: number }[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
      <p className="mb-5 text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/70">Pulse Score Comparison</p>
      <div className="space-y-3">
        {data.map((item, i) => {
          const color = item.score >= 84 ? "#9FE6C0" : item.score >= 74 ? "#E7C873" : item.score >= 64 ? "#C7A7E8" : "#F4A7B9";
          return (
            <div key={i} className="flex items-center gap-3">
              <p className="w-24 shrink-0 truncate text-right text-xs text-[#d8c8dc]/65">{item.name}</p>
              <div className="h-7 flex-1 overflow-hidden rounded-full bg-white/6">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.score}%`, background: `linear-gradient(90deg, ${color}60, ${color})`, transition: "width 1s ease" }}
                />
              </div>
              <p className="w-7 text-xs font-medium" style={{ color }}>{item.score}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PulseRadarChart({ data }: { data: { name: string; trust: number; engagement: number; momentum: number; stability: number; opportunity: number } }) {
  const cx = 120; const cy = 120; const R = 90;
  const labels = ["Trust", "Engagement", "Momentum", "Stability", "Opportunity"];
  const values = [data.trust, data.engagement, data.momentum, data.stability, data.opportunity];
  const angle  = (i: number) => ((i * 72 - 90) * Math.PI) / 180;
  const pt     = (r: number, i: number) => ({ x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) });
  const outerPts = labels.map((_, i) => pt(R, i));
  const scorePts = values.map((v, i) => pt((v / 100) * R, i));
  const toPath   = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/70">Dimension Radar — {data.name}</p>
      <div className="flex items-center justify-center">
        <svg viewBox="0 0 240 240" className="w-64">
          {[0.25, 0.5, 0.75, 1].map(r => (
            <path key={r} d={toPath(outerPts.map((_, i) => pt(R * r, i)))} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          ))}
          {outerPts.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />)}
          <path d={toPath(scorePts)} fill="rgba(216,165,184,0.18)" stroke="#d8a5b8" strokeWidth="1.5" />
          {scorePts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#d8a5b8" />)}
          {outerPts.map((p, i) => {
            const lx = cx + (R + 18) * Math.cos(angle(i));
            const ly = cy + (R + 18) * Math.sin(angle(i));
            return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="rgba(216,200,220,0.7)">{labels[i]}</text>;
          })}
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1">
        {labels.map((l, i) => (
          <div key={i} className="text-center">
            <p className="text-xs font-medium text-white">{values[i]}</p>
            <p className="text-[10px] text-[#d8c8dc]/50">{l.slice(0, 3)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PulseTrendChart({ data }: { data: { name: string; history: ScoreSnapshot[] }[] }) {
  const W = 500; const H = 120; const PAD = 20;
  const colors = ["#d8a5b8", "#9FE6C0", "#E7C873", "#C7A7E8"];
  if (!data.length || !data[0].history.length) return null;
  const allScores = data.flatMap(d => d.history.map(h => h.overall));
  const minS = Math.max(0, Math.min(...allScores) - 10);
  const maxS = Math.min(100, Math.max(...allScores) + 10);
  const xScale = (i: number, len: number) => PAD + (i / (len - 1)) * (W - PAD * 2);
  const yScale = (v: number) => H - PAD - ((v - minS) / (maxS - minS)) * (H - PAD * 2);
  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/70">Score Trend Over Time</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[40, 60, 80].map(v => (
          <g key={v}>
            <line x1={PAD} x2={W - PAD} y1={yScale(v)} y2={yScale(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={PAD - 4} y={yScale(v)} textAnchor="end" dominantBaseline="middle" fontSize="8" fill="rgba(216,200,220,0.4)">{v}</text>
          </g>
        ))}
        {data.map((series, si) => {
          if (!series.history.length) return null;
          const pts = series.history.map((h, i) => `${xScale(i, series.history.length).toFixed(1)},${yScale(h.overall).toFixed(1)}`).join(" ");
          return <polyline key={si} points={pts} fill="none" stroke={colors[si % colors.length]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />;
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-3">
        {data.map((series, si) => (
          <div key={si} className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-full" style={{ background: colors[si % colors.length] }} />
            <p className="text-xs text-[#d8c8dc]/65">{series.name.split(" ")[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PulseTable({ data }: { data: { name: string; score: number; status: string; owner: string; trend: string }[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 overflow-hidden">
      <p className="px-5 pt-4 pb-3 text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/70">Account Intelligence Table</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left">
              <th className="px-5 py-3 text-xs font-medium text-[#d8c8dc]/50 uppercase tracking-wider">Account</th>
              <th className="px-5 py-3 text-xs font-medium text-[#d8c8dc]/50 uppercase tracking-wider">Owner</th>
              <th className="px-5 py-3 text-xs font-medium text-[#d8c8dc]/50 uppercase tracking-wider">Pulse</th>
              <th className="px-5 py-3 text-xs font-medium text-[#d8c8dc]/50 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-xs font-medium text-[#d8c8dc]/50 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const color = row.score >= 84 ? "#9FE6C0" : row.score >= 74 ? "#E7C873" : row.score >= 64 ? "#C7A7E8" : "#F4A7B9";
              return (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3">
                  <td className="px-5 py-3 font-medium text-white">{row.name}</td>
                  <td className="px-5 py-3 text-[#d8c8dc]/65">{row.owner}</td>
                  <td className="px-5 py-3 font-semibold" style={{ color }}>{row.score}</td>
                  <td className="px-5 py-3"><StatusBadge label={row.status} score={row.score} /></td>
                  <td className="px-5 py-3 text-[#d8c8dc]/65">{row.trend === "Improving" ? "↑" : row.trend === "Declining" ? "↓" : "→"} {row.trend}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type ChartType = "bar" | "radar" | "trend" | "table" | null;
type ReportOutput = { text: string; chartType: ChartType; chartData: any };
type AssistantResult = {
  message: string;
  action?: string;
};

function buildReport(prompt: string, accounts: ScoredAccount[], touches: Touch[], history: AccountHistory): ReportOutput {
  const lower = prompt.toLowerCase();
  const avg   = Math.round(accounts.reduce((s, a) => s + a.score.overall, 0) / accounts.length);
  const attn  = accounts.filter(a => a.score.overall < 74);
  const strong= accounts.filter(a => a.score.overall >= 84);

  let chartType: ChartType = "bar";
  let chartData: any = accounts.map(a => ({ name: a.name.split(" ")[0], score: a.score.overall }));

  if (lower.includes("radar") || lower.includes("dimension") || lower.includes("breakdown")) {
    chartType = "radar";
    const target = [...accounts].sort((a, b) => a.score.overall - b.score.overall)[0];
    chartData = { name: target.name, trust: target.score.trust, engagement: target.score.engagement, momentum: target.score.momentum, stability: target.score.stability, opportunity: target.score.opportunity };
  } else if (lower.includes("trend") || lower.includes("history") || lower.includes("over time") || lower.includes("change")) {
    chartType = "trend";
    chartData = accounts.slice(0, 4).map(a => ({ name: a.name, history: history[a.id] || [] }));
  } else if (lower.includes("table") || lower.includes("list all") || lower.includes("spreadsheet")) {
    chartType = "table";
    chartData = accounts.map(a => ({ name: a.name, score: a.score.overall, status: a.score.priority, owner: a.owner, trend: a.score.trend }));
  }

  const text = `Relationship Intelligence Report

Portfolio Summary
• Average Pulse Score: ${avg} / 100
• Accounts Requiring Attention: ${attn.length}
• Healthy Momentum Relationships: ${strong.length}
• Total Tracked: ${accounts.length}

${attn.length ? `Attention Required\n${attn.map(a => `• ${a.name} (${a.score.overall}) — ${a.score.action}`).join("\n")}` : "No critical attention items at this time."}

${strong.length ? `Strong Relationships\n${strong.map(a => `• ${a.name} (${a.score.overall}) — ${a.score.narrative.split(".")[0]}.`).join("\n")}` : ""}

Recommended Priorities
${accounts.filter(a => a.score.overall < 84).slice(0, 3).map((a, i) => `${i + 1}. ${a.score.action} → ${a.name}`).join("\n")}

Narrative Summary
Pulse indicates ${avg >= 78 ? "generally healthy continuity" : "some relationship gaps that warrant proactive attention"} across the portfolio. ${attn.length > 0 ? `${attn.length} account${attn.length > 1 ? "s" : ""} show elevated attention need.` : "No urgent risks detected."}`;

  return { text, chartType, chartData };
}

function ChartOutput({ type, data }: { type: ChartType; data: any }) {
  if (!type || !data) return null;
  if (type === "bar")   return <PulseBarChart data={data} />;
  if (type === "radar") return <PulseRadarChart data={data} />;
  if (type === "trend") return <PulseTrendChart data={data} />;
  if (type === "table") return <PulseTable data={data} />;
  return null;
}

// ─── Status Badge ──────────────────────────────────────────────────────────
function StatusBadge({ label, score }: { label: string; score: number }) {
  const color  = score >= 84 ? "#9FE6C0" : score >= 74 ? "#E7C873" : score >= 64 ? "#C7A7E8" : "#F4A7B9";
  const bgRgba = score >= 84 ? "rgba(159,230,192,0.12)" : score >= 74 ? "rgba(231,200,115,0.12)" : score >= 64 ? "rgba(199,167,232,0.12)" : "rgba(244,167,185,0.12)";
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium" style={{ color, background: bgRgba, border: `1px solid ${color}28` }}>
      {label}
    </span>
  );
}

// ─── Score Ring ────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const color = score >= 84 ? "#9FE6C0" : score >= 74 ? "#E7C873" : score >= 64 ? "#C7A7E8" : "#F4A7B9";
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 36 36" className="h-32 w-32 -rotate-90">
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="2.5" />
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={`${score},100`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl font-medium tracking-[-0.04em]" style={{ fontFamily: "Sora, sans-serif" }}>{score}</p>
        <p className="mt-1 text-xs tracking-wide text-[#d8c8dc]/55">Pulse</p>
      </div>
    </div>
  );
}

function PulseMark({ health }: { health: number }) {
  const color = health >= 84 ? "#9FE6C0" : health >= 74 ? "#E7C873" : health >= 64 ? "#C7A7E8" : "#F4A7B9";
  return (
    <svg viewBox="0 0 60 28" className="h-8 w-12 shrink-0">
      <path d="M2 14 H12 L16 7 L22 22 L28 14 H38 L42 10 L47 18 L52 14 H58" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function TrendIcon({ trend, compact }: { trend: string; compact?: boolean }) {
  if (trend === "Improving") return <TrendingUp className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} text-[#9FE6C0]`} />;
  if (trend === "Declining") return <TrendingDown className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} text-[#F4A7B9]`} />;
  return <span className={`${compact ? "text-xs" : "text-sm"} text-[#d8c8dc]/45`}>→</span>;
}

// ─── Panel ─────────────────────────────────────────────────────────────────
function Panel({ title, subtitle, children, className = "" }: { title?: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[2rem] border border-[#d8a5b8]/10 bg-[linear-gradient(145deg,rgba(38,28,52,0.90),rgba(16,12,22,0.92))] p-6 shadow-[0_32px_120px_rgba(0,0,0,0.42)] backdrop-blur-sm ${className}`}>
      {title && <h3 className="text-[1.55rem] font-medium tracking-[-0.03em] text-white" style={{ fontFamily: "Cormorant Garamond, serif" }}>{title}</h3>}
      {subtitle && <p className="mt-1.5 text-sm text-[#d8c8dc]/60">{subtitle}</p>}
      <div className={`${title ? "mt-5" : ""} space-y-4`}>{children}</div>
    </div>
  );
}

function Dimension({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const color = value >= 84 ? "#9FE6C0" : value >= 70 ? "#E7C873" : "#C7A7E8";
  return (
    <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#d8c8dc]/65">{label}</p>
        <p className="text-lg font-medium" style={{ color }}>{value}{suffix}</p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/6">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, value)}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail, color = "#d8a5b8" }: any) {
  return (
    <div className="rounded-[1.8rem] border border-white/8 bg-[linear-gradient(145deg,rgba(44,34,58,0.88),rgba(14,11,20,0.92))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.30)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/60">{label}</p>
          <p className="mt-3 text-4xl font-medium tracking-[-0.04em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>{value}</p>
          <p className="mt-2 text-sm text-[#d8c8dc]/58">{detail}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/6 p-3" style={{ color }}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

// ─── Landing Page ──────────────────────────────────────────────────────────
function LandingPage({ onSignIn }: { onSignIn: () => void }) {
  const [showAuth, setShowAuth] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white" style={{ background: "#070510", fontFamily: "Sora, sans-serif" }}>
      <style>{`
        @keyframes pulse-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse-beat { 0%,100%{opacity:.7} 50%{opacity:1} }
        @keyframes hb-trail { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .float { animation: pulse-float 5s ease-in-out infinite }
        .beat  { animation: pulse-beat 2.4s ease-in-out infinite }
        .hb    { animation: hb-trail 7s linear infinite }
        .fade-up { animation: fade-up .55s ease both }
        .delay-1 { animation-delay:.08s } .delay-2 { animation-delay:.16s }
        .delay-3 { animation-delay:.24s } .delay-4 { animation-delay:.32s }
        .delay-5 { animation-delay:.40s } .delay-6 { animation-delay:.48s }
      `}</style>

      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0" style={{ background: "radial-gradient(ellipse at 20% 10%, rgba(120,60,160,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(216,165,184,0.12) 0%, transparent 40%)" }} />
      <GrainOverlay />

      {/* ── Nav ── */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrollY > 40 ? "border-b border-white/8 bg-[rgba(7,5,16,0.88)] backdrop-blur-2xl" : ""}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#2a1a38,#6b3f7a,#c79eb3)]">
              <Activity className="h-5 w-5 beat" />
            </div>
            <span className="text-2xl font-semibold tracking-[-0.04em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>pulse</span>
          </div>
          <div className="hidden items-center gap-8 lg:flex">
            {["Features", "Intelligence", "Pricing", "About"].map(item => (
              <button key={item} className="text-sm text-[#d8c8dc]/65 transition hover:text-white">{item}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAuth(true)} className="hidden text-sm text-[#d8c8dc]/70 transition hover:text-white lg:block">Sign In</button>
            <button onClick={onSignIn} className="rounded-2xl bg-[linear-gradient(135deg,#f1dbe5,#d8a5b8,#b98bb1)] px-4 py-2.5 text-sm font-semibold text-[#17141c] shadow-[0_8px_30px_rgba(216,165,184,0.25)] transition hover:scale-[1.02]">
              Try Sandbox →
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-36 lg:pt-44">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="fade-up inline-flex items-center gap-2 rounded-full border border-[#d8a5b8]/20 bg-[#d8a5b8]/8 px-4 py-2 text-xs tracking-[0.14em] text-[#f1d6e2]">
              <Sparkles className="h-3.5 w-3.5" />
              Relationship Intelligence Platform
            </div>
            <h1 className="fade-up delay-1 mt-8 text-[4.2rem] font-medium leading-[0.95] tracking-[-0.04em] lg:text-[5.5rem]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Stay ahead of every relationship<br />
              <em className="font-normal not-italic text-[#d8a5b8]">that matters.</em>
            </h1>
            <p className="fade-up delay-2 mt-7 max-w-xl text-lg leading-9 text-[#d8c8dc]/65">
              Pulse centralizes your relationship signals, interprets engagement patterns, and surfaces continuity gaps — before small drift becomes churn risk.
            </p>
            <div className="fade-up delay-3 mt-10 flex flex-wrap gap-4">
              <button onClick={onSignIn} className="rounded-2xl bg-[linear-gradient(135deg,#f1dbe5,#d8a5b8,#b98bb1)] px-7 py-4 text-sm font-semibold text-[#17141c] shadow-[0_18px_55px_rgba(216,165,184,0.28)] transition hover:scale-[1.02]">
                Try Sandbox Demo
              </button>
              <button onClick={() => setShowAuth(true)} className="rounded-2xl border border-white/12 bg-white/6 px-7 py-4 text-sm text-white backdrop-blur transition hover:bg-white/10">
                Sign In to Workspace
              </button>
            </div>
            <div className="fade-up delay-4 mt-10 flex items-center gap-5">
              {["14-day trial", "No credit card", "Sandbox included"].map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-[#d8c8dc]/50">
                  <Check className="h-3.5 w-3.5 text-[#9FE6C0]" /> {t}
                </div>
              ))}
            </div>
          </div>

          {/* Hero card mockup */}
          <div className="fade-up delay-3 float relative">
            <div className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle,rgba(216,165,184,0.12),transparent_70%)]" />
            <div className="relative rounded-[2.2rem] border border-[#d8a5b8]/18 bg-[linear-gradient(145deg,rgba(42,28,58,0.95),rgba(16,11,24,0.98))] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs tracking-widest text-[#d8c8dc]/50">RELATIONSHIP PULSE</p>
                  <p className="mt-1 text-lg font-medium">Northstar Logistics</p>
                </div>
                <div className="rounded-3xl border border-[#9FE6C0]/20 bg-[#9FE6C0]/10 px-3 py-1.5">
                  <span className="text-xs font-medium text-[#9FE6C0]">Strong</span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="relative h-24 w-24">
                  <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="2.5" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#9FE6C0" strokeWidth="2.5" strokeDasharray="89,100" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-medium">89</p>
                    <p className="text-[10px] text-[#d8c8dc]/50">Pulse</p>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {[["Trust", 94, "#9FE6C0"], ["Engagement", 82, "#E7C873"], ["Momentum", 91, "#9FE6C0"]].map(([l, v, c]) => (
                    <div key={String(l)}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#d8c8dc]/55">{l}</span>
                        <span style={{ color: String(c) }}>{v}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                        <div className="h-full rounded-full" style={{ width: `${v}%`, background: String(c) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-5 text-xs leading-6 text-[#d8c8dc]/55">Northstar remains a high-trust partner with good forward momentum. A light check-in on their upcoming initiatives would help maintain engagement.</p>
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                <p className="text-xs text-[#d8c8dc]/55">Last touch: 1 day ago</p>
                <span className="text-xs font-medium text-[#9FE6C0]">↑ Improving</span>
              </div>

              {/* Mini attention cards */}
              <div className="mt-4 space-y-2">
                {[["HarborTech Services", "61", "Needs attention"], ["Atlas Retail", "71", "Follow up"]].map(([n, s, p]) => (
                  <div key={String(n)} className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/3 px-4 py-2.5">
                    <p className="text-xs text-[#d8c8dc]/70">{n}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#F4A7B9]">{s}</span>
                      <span className="rounded-full bg-[#F4A7B9]/12 px-2 py-0.5 text-[10px] text-[#F4A7B9]">{p}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="border-y border-white/6 bg-white/2 py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:justify-between">
            <p className="text-xs tracking-[0.14em] text-[#d8c8dc]/38 uppercase">Trusted by relationship-driven teams at</p>
            {["Meridian Advisory", "Vantage Solutions", "Clearline Agency", "Northlight Consulting", "Apex Partners"].map(n => (
              <p key={n} className="text-sm font-medium text-[#d8c8dc]/35 tracking-wide">{n}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/70">Why Pulse</p>
          <h2 className="mt-4 text-5xl font-medium tracking-[-0.03em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Calm intelligence, not dashboard noise.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#d8c8dc]/60">
            Pulse is built for teams who care deeply about their relationships — not those who want another metrics tool to ignore.
          </p>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            { icon: Brain, title: "Relationship Pulse Scoring", body: "A five-dimension model — Trust, Engagement, Momentum, Stability, and Opportunity — gives you a nuanced, weighted view of every relationship in your portfolio.", tag: "Multi-signal intelligence" },
            { icon: Eye,   title: "Intelligent Continuity",     body: "Pulse interprets communication patterns, response rhythms, and sentiment shifts to surface insights before small gaps become costly churn events.",              tag: "Pattern interpretation"    },
            { icon: Zap,   title: "Calm Executive UX",          body: "An Attention Queue that prioritizes the right relationships at the right time — with AI-generated narratives and suggested actions, never noise.",               tag: "Zero cognitive overload"   },
          ].map((f, i) => (
            <div key={i} className="rounded-[2rem] border border-[#d8a5b8]/10 bg-[linear-gradient(145deg,rgba(38,25,55,0.88),rgba(14,10,20,0.94))] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
              <div className="inline-flex items-center justify-center rounded-2xl border border-[#d8a5b8]/15 bg-[#d8a5b8]/10 p-3 text-[#f1d6e2]">
                <f.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#d8a5b8]/55">{f.tag}</p>
              <h3 className="mt-2 text-xl font-medium" style={{ fontFamily: "Cormorant Garamond, serif" }}>{f.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#d8c8dc]/60">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-y border-white/6 bg-white/1.5 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/70">How Pulse works</p>
            <h2 className="mt-4 text-5xl font-medium tracking-[-0.03em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Three steps to relationship clarity.</h2>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              { n: "01", title: "Centralize your signals",   body: "Log emails, calls, meetings, and notes. Connect your existing tools — or simply add context manually in the sandbox." },
              { n: "02", title: "Pulse interprets patterns", body: "Our scoring engine analyzes tone, recency, depth, and momentum across every relationship touch to build a real-time Pulse score." },
              { n: "03", title: "Act with calm clarity",     body: "Your Attention Queue surfaces the right accounts at the right time — with AI-generated narratives and one clear next step." },
            ].map((step, i) => (
              <div key={i} className="relative">
                {i < 2 && <div className="absolute right-0 top-8 hidden h-px flex-1 bg-[linear-gradient(90deg,rgba(216,165,184,0.3),transparent)] lg:block" style={{ width: "calc(100% - 80px)", left: "80px" }} />}
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#d8a5b8]/20 bg-[#d8a5b8]/8 text-lg font-medium text-[#f1d6e2]" style={{ fontFamily: "Cormorant Garamond, serif" }}>{step.n}</div>
                  <div>
                    <h3 className="text-xl font-medium" style={{ fontFamily: "Cormorant Garamond, serif" }}>{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#d8c8dc]/58">{step.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scoring dimensions showcase ── */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/70">The scoring model</p>
            <h2 className="mt-4 text-5xl font-medium tracking-[-0.03em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Five dimensions. One clear Pulse.</h2>
            <p className="mt-5 text-base leading-8 text-[#d8c8dc]/60">Every relationship is scored across five weighted dimensions — and every workspace can customize the weights to reflect their own priorities.</p>
            <div className="mt-8 space-y-3">
              {[["Trust", 30, "#d8a5b8"], ["Engagement", 25, "#C7A7E8"], ["Momentum", 20, "#9FE6C0"], ["Stability", 15, "#E7C873"], ["Opportunity", 10, "#f1d6e2"]].map(([l, v, c]) => (
                <div key={String(l)} className="flex items-center gap-4">
                  <p className="w-24 text-sm text-[#d8c8dc]/65">{l}</p>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full" style={{ width: `${(Number(v) / 30) * 100}%`, background: String(c) }} />
                  </div>
                  <p className="w-8 text-right text-sm font-medium text-white">{v}%</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-[#d8a5b8]/12 bg-[linear-gradient(145deg,rgba(42,28,58,0.90),rgba(14,10,20,0.96))] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <p className="text-xs uppercase tracking-widest text-[#d8c8dc]/45">Northstar Logistics · Pulse 89</p>
<p className="mt-3 text-sm leading-7 text-[#d8c8dc]/65">
  &ldquo;Northstar remains a high-trust partner with good forward momentum. A light check-in on their upcoming initiatives would help maintain engagement and explore identified opportunities.&rdquo;
</p>            <div className="mt-5 grid gap-2">
              {[["Trust", 94, "#9FE6C0"], ["Engagement", 82, "#E7C873"], ["Momentum", 91, "#9FE6C0"], ["Stability", 88, "#E7C873"], ["Opportunity", 76, "#C7A7E8"]].map(([l, v, c]) => (
                <div key={String(l)} className="flex items-center gap-3">
                  <p className="w-22 text-xs text-[#d8c8dc]/55">{l}</p>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/6">
                    <div className="h-full rounded-full" style={{ width: `${v}%`, background: String(c) }} />
                  </div>
                  <p className="w-6 text-right text-xs" style={{ color: String(c) }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-y border-white/6 bg-white/1.5 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/70">What teams say</p>
            <h2 className="mt-4 text-5xl font-medium tracking-[-0.03em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Built for people who care deeply.</h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {[
              { quote: "Pulse changed how we think about relationship health. The attention queue alone saved three at-risk accounts in our first month.", name: "Danielle Hart", role: "VP of Accounts, Meridian Advisory", rating: 5 },
              { quote: "I stopped dreading the 'how are things going?' question. Pulse gives me a clear narrative for every client before I even open my calendar.", name: "Sarah Chen",    role: "Principal, Northlight Consulting",  rating: 5 },
              { quote: "The scoring model actually respects the nuance of client relationships. It doesn't reduce people to numbers — it helps you understand them.", name: "James Okafor",  role: "CS Director, Vantage Solutions",    rating: 5 },
            ].map((t, i) => (
              <div key={i} className="rounded-[2rem] border border-white/8 bg-[linear-gradient(145deg,rgba(36,24,50,0.88),rgba(12,9,18,0.94))] p-7">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-[#d8a5b8] text-[#d8a5b8]" />)}
                </div>
<p className="mt-4 text-base leading-8 text-[#d8c8dc]/75">
  &ldquo;{t.quote}&rdquo;
</p>
                <div className="mt-6 border-t border-white/8 pt-5">
                  <p className="font-medium text-white">{t.name}</p>
                  <p className="mt-1 text-sm text-[#d8c8dc]/50">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="mx-auto max-w-7xl px-6 py-28" id="pricing">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/70">Pricing</p>
          <h2 className="mt-4 text-5xl font-medium tracking-[-0.03em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Simple, transparent pricing.</h2>
          <p className="mx-auto mt-4 max-w-md text-base text-[#d8c8dc]/55">All plans include the full scoring engine, sandbox mode, and AI assistant.</p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {[
            { name: "Starter",      price: "$49",     period: "/mo", sub: "Up to 25 accounts",       features: ["5 team members", "Core Pulse scoring", "Activity timeline", "AI Assistant", "Sandbox mode"],           highlight: false },
            { name: "Professional", price: "$129",    period: "/mo", sub: "Up to 150 accounts",      features: ["15 team members", "Advanced scoring", "AI Reports + Charts", "Custom scoring weights", "Integrations", "Priority support"], highlight: true  },
            { name: "Enterprise",   price: "Custom",  period: "",    sub: "Unlimited accounts",      features: ["Unlimited members", "Custom dimensions", "SSO + Security", "Dedicated success manager", "API access", "White-label option"], highlight: false },
          ].map((plan, i) => (
            <div key={i} className={`rounded-[2rem] border p-7 ${plan.highlight ? "border-[#d8a5b8]/30 bg-[linear-gradient(145deg,rgba(60,38,78,0.94),rgba(22,15,34,0.98))] shadow-[0_30px_120px_rgba(216,165,184,0.12)]" : "border-white/8 bg-[linear-gradient(145deg,rgba(36,24,50,0.88),rgba(12,9,18,0.94))]"}`}>
              {plan.highlight && <div className="mb-4 inline-flex rounded-full border border-[#d8a5b8]/20 bg-[#d8a5b8]/10 px-3 py-1 text-xs tracking-wide text-[#f1d6e2]">Most popular</div>}
              <p className="text-sm font-medium text-[#d8c8dc]/60">{plan.name}</p>
              <div className="mt-2 flex items-end gap-1">
                <p className="text-5xl font-medium tracking-[-0.04em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>{plan.price}</p>
                <p className="mb-2 text-sm text-[#d8c8dc]/50">{plan.period}</p>
              </div>
              <p className="mt-1 text-xs text-[#d8c8dc]/45">{plan.sub}</p>
              <div className="my-6 h-px bg-white/8" />
              <div className="space-y-3">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 shrink-0 text-[#9FE6C0]" />
                    <p className="text-sm text-[#d8c8dc]/70">{f}</p>
                  </div>
                ))}
              </div>
              <button onClick={plan.name === "Enterprise" ? undefined : onSignIn} className={`mt-8 w-full rounded-2xl py-3.5 text-sm font-semibold transition ${plan.highlight ? "bg-[linear-gradient(135deg,#f1dbe5,#d8a5b8,#b98bb1)] text-[#17141c] shadow-[0_12px_40px_rgba(216,165,184,0.25)] hover:scale-[1.01]" : "border border-white/12 bg-white/6 text-white hover:bg-white/10"}`}>
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="border-t border-white/8 bg-[linear-gradient(145deg,rgba(48,28,65,0.5),rgba(10,7,18,0.7))] py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-5xl font-medium tracking-[-0.03em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Relationship intelligence,<br /><em className="text-[#d8a5b8] not-italic">finally within reach.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-[#d8c8dc]/58">
            Try the sandbox — no account required. See how Pulse interprets your most important relationships in minutes.
          </p>
          <button onClick={onSignIn} className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#f1dbe5,#d8a5b8,#b98bb1)] px-8 py-4 text-sm font-semibold text-[#17141c] shadow-[0_18px_60px_rgba(216,165,184,0.30)] transition hover:scale-[1.02]">
            Try Sandbox Free <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/6 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[linear-gradient(145deg,#2a1a38,#6b3f7a,#c79eb3)]">
                <Activity className="h-4 w-4" />
              </div>
              <span className="text-xl font-medium tracking-[-0.03em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>pulse</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-[#d8c8dc]/42">
              {["Privacy", "Terms", "Security", "Status", "Blog", "Contact"].map(l => <button key={l} className="hover:text-white transition">{l}</button>)}
            </div>
            <p className="text-xs text-[#d8c8dc]/30">© 2026 Pulse. Relationship Intelligence.</p>
          </div>
        </div>
      </footer>

      {/* ── Sign In Overlay ── */}
      {showAuth && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 px-5 backdrop-blur-md" onClick={() => setShowAuth(false)}>
          <div className="w-full max-w-md rounded-[2.2rem] border border-[#d8a5b8]/18 bg-[linear-gradient(145deg,rgba(42,28,58,0.98),rgba(12,9,18,0.99))] p-8 shadow-[0_40px_140px_rgba(0,0,0,0.60)]" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[linear-gradient(145deg,#17101f,#4a334f,#c79eb3)] shadow-[0_14px_50px_rgba(216,165,184,0.22)]">
                <Activity className="h-7 w-7 beat" />
              </div>
              <h2 className="mt-5 text-4xl font-medium tracking-[-0.04em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Sign in to Pulse</h2>
            </div>
            <div className="mt-8 space-y-3">
              <input placeholder="Email address" className="h-14 w-full rounded-2xl border border-[#d8a5b8]/12 bg-white/6 px-4 text-white outline-none placeholder:text-[#d8c8dc]/40 focus:border-[#d8a5b8]/30" />
              <input type="password" placeholder="Password" className="h-14 w-full rounded-2xl border border-[#d8a5b8]/12 bg-white/6 px-4 text-white outline-none placeholder:text-[#d8c8dc]/40 focus:border-[#d8a5b8]/30" />
              <button onClick={onSignIn} className="mt-4 h-14 w-full rounded-2xl bg-[linear-gradient(135deg,#f1dbe5,#d8a5b8,#b98bb1)] text-sm font-semibold text-[#17141c] shadow-[0_14px_50px_rgba(216,165,184,0.24)] transition hover:scale-[1.01]">
                Sign In
              </button>
              <button onClick={onSignIn} className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 text-sm text-white transition hover:bg-white/8">
                Try Sandbox Demo Instead
              </button>
            </div>
            <button onClick={() => setShowAuth(false)} className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/6 p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ─── Loading Screen ────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-white" style={{ background: "radial-gradient(ellipse at top, #34203e 0%, #121119 42%, #040406 100%)", fontFamily: "Sora, sans-serif" }}>
      <style>{`
        @keyframes hb { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .hb-trail { animation: hb 4.2s linear infinite }
        @keyframes fade-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fu { animation: fade-up .5s ease both }
        .delay-1 { animation-delay:.1s } .delay-2 { animation-delay:.22s }
        @keyframes beat { 0%,100%{opacity:.65} 50%{opacity:1} }
        .beat { animation: beat 2.4s ease-in-out infinite }
      `}</style>
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[linear-gradient(145deg,#17101f,#4a334f,#c79eb3)] shadow-[0_20px_70px_rgba(216,165,184,0.22)]">
          <Activity className="h-10 w-10 beat" />
        </div>
        <div className="relative fu delay-1 mt-10 h-20 overflow-hidden rounded-[2rem] border border-white/10 bg-white/4 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,165,184,0.08),transparent_60%)]" />
          <svg viewBox="0 0 600 80" className="hb-trail absolute left-0 top-0 h-full w-300" preserveAspectRatio="none">
            <path d="M0 40 L60 40 L75 15 L92 65 L110 40 H185 L200 30 L215 52 L228 40 H300 L315 15 L332 65 L350 40 H425 L440 30 L455 52 L468 40 H540 L555 15 L572 65 L590 40 H600" fill="none" stroke="rgba(216,165,184,0.18)" strokeWidth="8" strokeLinecap="round" filter="url(#glow)" />
            <path d="M0 40 L60 40 L75 15 L92 65 L110 40 H185 L200 30 L215 52 L228 40 H300 L315 15 L332 65 L350 40 H425 L440 30 L455 52 L468 40 H540 L555 15 L572 65 L590 40 H600" fill="none" stroke="#d8a5b8" strokeWidth="2.5" strokeLinecap="round" />
            <defs><filter id="glow"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
          </svg>
          <div className="absolute inset-y-0 left-0 w-20 bg-[linear-gradient(90deg,#121119,transparent)]" />
          <div className="absolute inset-y-0 right-0 w-20 bg-[linear-gradient(270deg,#121119,transparent)]" />
        </div>
        <h1 className="fu delay-2 mt-8 text-4xl font-medium tracking-[-0.03em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Reading relationship signals…</h1>
        <p className="fu delay-2 mt-3 text-sm text-[#d8c8dc]/55">Building your relationship pulse.</p>
      </div>
    </main>
  );
}

// ─── Desktop Sidebar ───────────────────────────────────────────────────────
function DesktopSidebar({ activeTab, goTab, logout }: any) {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-[#d8a5b8]/10 bg-[rgba(18,12,26,0.88)] px-5 py-6 backdrop-blur-2xl lg:block" style={{ fontFamily: "Sora, sans-serif" }}>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#17101f,#4a334f,#c79eb3)] shadow-[0_14px_45px_rgba(216,165,184,0.20)]">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-[2.2rem] font-semibold leading-none tracking-[-0.04em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>pulse</h1>
          <p className="mt-0.5 text-[10px] tracking-wider text-[#d8c8dc]/50 uppercase">Relationship Intelligence</p>
        </div>
      </div>

      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#E7C873]/20 bg-[#E7C873]/8 px-3 py-1 text-[10px] tracking-[0.12em] uppercase text-[#E7C873]/80">
        <div className="h-1.5 w-1.5 rounded-full bg-[#E7C873] animate-pulse" />
        Sandbox Mode
      </div>

      <nav className="mt-8 space-y-1">
        {NAV_ITEMS.map(item => (
          <button key={item} onClick={() => goTab(item)} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${activeTab === item ? "bg-[linear-gradient(135deg,rgba(216,165,184,0.18),rgba(216,165,184,0.08))] text-white border border-[#d8a5b8]/15" : "text-[#d8c8dc]/62 hover:bg-white/6 hover:text-white"}`}>
            {item}
            {activeTab === item && <ChevronRight className="h-4 w-4 text-[#d8a5b8]" />}
          </button>
        ))}
      </nav>

      <button onClick={logout} className="absolute bottom-6 left-5 right-5 rounded-2xl border border-white/8 bg-white/4 py-3 text-sm text-[#d8c8dc]/55 transition hover:bg-white/8 hover:text-white">
        Sign Out
      </button>
    </aside>
  );
}

// ─── Mobile Header + Bottom Nav ────────────────────────────────────────────
function MobileHeader({ activeTab, attention, goTab }: any) {
  const [notiOpen, setNotiOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(10,7,16,0.88)] backdrop-blur-2xl lg:hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>pulse</h1>
          <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#E7C873]/70">
            <div className="h-1.5 w-1.5 rounded-full bg-[#E7C873] animate-pulse" /> Sandbox
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button onClick={() => { setNotiOpen(!notiOpen); setMenuOpen(false); }} className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-[#f1d6e2]">
              <Bell className="h-5 w-5" />
              {attention.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d8a5b8] text-[11px] font-semibold text-[#17141c]">{attention.length}</span>}
            </button>
            {notiOpen && (
              <div className="absolute right-0 top-14 w-72 rounded-[1.8rem] border border-[#d8a5b8]/12 bg-[#0e0a18] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.50)]" style={{ zIndex: 300 }}>
                <p className="mb-3 text-sm font-medium text-white">Attention items</p>
                <div className="space-y-2">
                  {attention.map((a: ScoredAccount) => (
                    <button key={a.id} onClick={() => { goTab("Accounts"); setNotiOpen(false); }} className="w-full rounded-2xl border border-white/8 bg-white/4 p-3 text-left hover:bg-white/8">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{a.name}</p>
                        <StatusBadge label={a.score.priority} score={a.score.overall} />
                      </div>
                      <p className="text-xs text-[#d8c8dc]/55">{a.score.action}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#f1dbe5,#d8a5b8,#b98bb1)] text-xs font-semibold text-[#17141c]">DH</div>
          <button onClick={() => { setMenuOpen(!menuOpen); setNotiOpen(false); }} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="space-y-1 px-5 pb-4">
          {NAV_ITEMS.map(item => (
            <button key={item} onClick={() => { goTab(item); setMenuOpen(false); }} className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${activeTab === item ? "bg-white font-medium text-[#17141c]" : "bg-white/5 text-white hover:bg-white/9"}`}>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileBottomNav({ activeTab, goTab }: any) {
  const [moreOpen, setMoreOpen] = useState(false);
  const mobileMainTabs = [
    { label: "Overview",  icon: Home,          tab: "Overview"    },
    { label: "Accounts",  icon: Users,         tab: "Accounts"    },
    { label: "Activity",  icon: Activity,      tab: "Activity"    },
    { label: "Intel",     icon: Brain,         tab: "Intelligence"},
    { label: "More",      icon: ChevronDown,   tab: "more"        },
  ];
  const moreTabs = ["AI Assistant", "Reports", "Admin"];

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setMoreOpen(false)}>
          <div className="absolute bottom-24 left-4 right-4 rounded-[2rem] border border-[#d8a5b8]/12 bg-[rgba(18,12,26,0.98)] p-4 shadow-[0_-20px_80px_rgba(0,0,0,0.50)]" onClick={e => e.stopPropagation()}>
            <p className="mb-3 text-xs uppercase tracking-widest text-[#d8c8dc]/40 px-1">More</p>
            <div className="space-y-1">
              {moreTabs.map(tab => (
                <button key={tab} onClick={() => { goTab(tab); setMoreOpen(false); }} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm transition ${activeTab === tab ? "bg-[#d8a5b8]/12 text-white border border-[#d8a5b8]/15" : "text-[#d8c8dc]/70 hover:bg-white/6"}`}>
                  {tab}
                  <ChevronRight className="h-4 w-4 text-[#d8c8dc]/35" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-[rgba(10,7,16,0.92)] backdrop-blur-2xl pb-safe lg:hidden">
        <div className="flex items-center justify-around px-2 py-3">
          {mobileMainTabs.map(({ label, icon: Icon, tab }) => {
            const isMore = tab === "more";
            const isActive = isMore ? moreOpen || moreTabs.includes(activeTab) : activeTab === tab;
            return (
              <button key={tab} onClick={() => isMore ? setMoreOpen(!moreOpen) : goTab(tab)} className="flex flex-col items-center gap-1 min-w-13 py-1">
                <Icon className={`h-5 w-5 transition ${isActive ? "text-[#d8a5b8]" : "text-[#d8c8dc]/40"}`} />
                <span className={`text-[10px] transition ${isActive ? "text-[#d8a5b8]" : "text-[#d8c8dc]/40"}`}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

// ─── Top Hero ──────────────────────────────────────────────────────────────
function TopHero({ attention, setSelectedAccountId, goTab }: any) {
  const [notiOpen, setNotiOpen] = useState(false);
  return (
    <div className="relative mb-8 flex items-start justify-between gap-6">
      <div className="flex-1">
        <p className="text-base text-[#d8c8dc]/55">{getGreeting()}, Danielle.</p>
        <h1 className="mt-2 max-w-4xl text-[2.8rem] font-medium leading-[1.02] tracking-tighter lg:text-[3.8rem]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          Relationship continuity at a glance.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-[#d8c8dc]/58">
          Pulse helps account teams interpret relationship patterns, maintain continuity, and identify attention needs before they become churn risk.
        </p>
        {attention.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {attention.slice(0, 3).map((a: ScoredAccount) => (
              <button key={a.id} onClick={() => { setSelectedAccountId(a.id); goTab("Accounts"); }} className="flex items-center gap-2.5 rounded-2xl border border-white/8 bg-white/5 px-4 py-2.5 text-sm transition hover:bg-white/8">
                <div className="h-2 w-2 rounded-full" style={{ background: a.score.priorityColor }} />
                {a.name}
                <span className="text-xs text-[#d8c8dc]/45">{a.score.overall}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bell + Avatar — desktop only */}
      <div className="hidden shrink-0 lg:block" style={{ position: "relative", zIndex: 200 }}>
        <div className="flex items-center gap-2 rounded-[1.35rem] border border-[#d8a5b8]/12 bg-[#0e0b18]/75 p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
          <div className="relative">
            <button
              onClick={() => setNotiOpen(!notiOpen)}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d8a5b8]/12 bg-white/5.5 text-[#f1d6e2] transition hover:bg-[#d8a5b8]/12"
            >
              <Bell className="h-5 w-5" />
              {attention.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#d8a5b8] text-[11px] font-semibold text-[#17141c] shadow-[0_6px_18px_rgba(216,165,184,0.35)]">
                  {attention.length}
                </span>
              )}
            </button>

            {notiOpen && (
              <div className="absolute right-0 top-14 w-[320px] rounded-[2rem] border border-[#d8a5b8]/12 bg-[#0e0b18] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.60)]" style={{ zIndex: 300 }}>
                <p className="text-xs uppercase tracking-widest text-[#d8c8dc]/40 mb-1">Notifications</p>
                <h3 className="text-lg font-medium text-white mb-4">Attention items</h3>
                <div className="space-y-2">
                  {attention.map((a: ScoredAccount) => (
                    <button
                      key={a.id}
                      onClick={() => { setSelectedAccountId(a.id); goTab("Accounts"); setNotiOpen(false); }}
                      className="w-full rounded-2xl border border-white/8 bg-white/4 p-4 text-left transition hover:bg-white/8"
                    >
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <p className="font-medium text-white">{a.name}</p>
                        <StatusBadge label={a.score.priority} score={a.score.overall} />
                      </div>
                      <p className="text-xs text-[#d8c8dc]/55 leading-5">{a.score.action}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#f1dbe5,#d8a5b8,#b98bb1)] text-sm font-semibold text-[#17141c] shadow-[0_10px_30px_rgba(216,165,184,0.20)]">
            DH
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Account List ──────────────────────────────────────────────────────────
function AccountList({ accounts, selectedAccountId, setSelectedAccountId, query, setQuery, history }: any) {
  return (
    <Panel title="Accounts" subtitle="Scrollable relationship overview">
      {setQuery !== undefined && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d8c8dc]/40" />
          <input value={query ?? ""} onChange={e => setQuery(e.target.value)} placeholder="Search accounts…" className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-[#d8c8dc]/35 focus:border-[#d8a5b8]/25" style={{ fontFamily: "Sora, sans-serif" }} />
        </div>
      )}
      <div className="max-h-140 overflow-y-auto rounded-2xl border border-white/6">
        {accounts.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/4">
              <Users className="h-5 w-5 text-[#d8c8dc]/40" />
            </div>
            <p className="text-sm font-medium text-white">No accounts yet</p>
            <p className="mt-1 text-xs text-[#d8c8dc]/45">Add your first account below to get started.</p>
          </div>
        )}
        {accounts.map((account: ScoredAccount) => {
          const hist = history?.[account.id] ?? [];
          const prevScore = hist.length >= 2 ? hist[hist.length - 2]?.overall : null;
          const scoreDelta = prevScore !== null ? account.score.overall - prevScore : 0;
          const isSelected = selectedAccountId === account.id;
          return (
            <button
              key={account.id}
              onClick={() => setSelectedAccountId(account.id)}
              className={`flex w-full items-center gap-3 border-b border-white/6 px-4 py-3 text-left transition last:border-b-0 ${isSelected ? "bg-[#d8a5b8]/10" : "bg-white/2 hover:bg-white/5.5"}`}
            >
              <div className="h-8 w-1 shrink-0 rounded-full" style={{ background: account.score.priorityColor, opacity: isSelected ? 1 : 0.45 }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-white">{account.name}</p>
                  <StatusBadge label={account.score.priority} score={account.score.overall} />
                </div>
                <p className="mt-0.5 truncate text-xs text-[#d8c8dc]/45">{account.owner} · {account.stage}</p>
                <p className="mt-0.5 text-xs text-[#d8c8dc]/30">
                  {account.score.lastTouchDays === 0 ? "Today" : `${account.score.lastTouchDays}d ago`}
                  {scoreDelta !== 0 && <span className={`ml-1.5 ${scoreDelta > 0 ? "text-[#9FE6C0]" : "text-[#F4A7B9]"}`}>{scoreDelta > 0 ? "↑" : "↓"}{Math.abs(Math.round(scoreDelta))}</span>}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <p className="text-sm font-semibold" style={{ color: account.score.priorityColor }}>{account.score.overall}</p>
                <TrendIcon trend={account.score.trend} compact />
              </div>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

// ─── Account Pulse Detail ──────────────────────────────────────────────────
function AccountPulse({ account, touches = [], history = [] }: { account: ScoredAccount; touches?: Touch[]; history?: ScoreSnapshot[] }) {
  return (
    <Panel title={account.name} subtitle="Relationship Pulse">
      <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center rounded-[1.8rem] border border-[#d8a5b8]/10 bg-white/[0.035] p-5">
          <ScoreRing score={account.score.overall} />
          <StatusBadge label={account.score.priority} score={account.score.overall} />
          <div className="mt-3 flex items-center gap-1.5">
            <TrendIcon trend={account.score.trend} />
            <p className="text-xs text-[#d8c8dc]/55">{account.score.trend}</p>
          </div>
          <p className="mt-3 text-center text-xs leading-6 text-[#d8c8dc]/55">{account.score.narrative}</p>
        </div>
        <div className="space-y-3">
          <Dimension label="Trust"       value={account.score.trust}       />
          <Dimension label="Engagement"  value={account.score.engagement}  />
          <Dimension label="Momentum"    value={account.score.momentum}    />
          <Dimension label="Stability"   value={account.score.stability}   />
          <Dimension label="Opportunity" value={account.score.opportunity} />
        </div>
      </div>

      <div className="rounded-3xl border border-[#d8a5b8]/10 bg-[#d8a5b8]/6 p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-[#d8a5b8]/65">Suggested Next Step</p>
        <p className="mt-2 text-sm leading-7 text-[#f1e9f4]">{account.score.action}</p>
      </div>

      {history.length > 1 && (
        <PulseTrendChart data={[{ name: account.name, history }]} />
      )}

      {touches.length > 0 && (
        <div className="rounded-3xl border border-white/8 bg-white/4 p-5">
          <p className="font-medium text-white mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>Relationship timeline</p>
          <div className="space-y-3">
            {touches.map(touch => {
              const sColor = touch.sentiment === "positive" ? "#9FE6C0" : touch.sentiment === "concerned" ? "#E7C873" : touch.sentiment === "negative" ? "#F4A7B9" : "#d8c8dc";
              return (
                <div key={touch.id} className="flex items-start gap-3 rounded-2xl bg-white/4 p-4">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: sColor }} />
                  <div>
                    <p className="text-sm font-medium text-white">{touch.type} · <span className="text-xs font-normal text-[#d8c8dc]/55 capitalize">{touch.sentiment}</span></p>
                    <p className="mt-0.5 text-sm text-[#d8c8dc]/65">{touch.summary}</p>
                    <p className="mt-1 text-xs text-[#d8c8dc]/35">{daysSince(touch.occurredAt) === 0 ? "Today" : `${daysSince(touch.occurredAt)}d ago`}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Panel>
  );
}

// ─── Log Touch Panel ───────────────────────────────────────────────────────
function LogTouchPanel({ selectedAccount, newTouch, setNewTouch, logTouch }: any) {
  return (
    <Panel title={`Log touch — ${selectedAccount?.name ?? "Select an account"}`} subtitle="Record a relationship interaction">
      <div className="grid gap-3 sm:grid-cols-3">
        {(["Email", "Call", "Meeting", "Note"] as const).map(type => (
          <button key={type} onClick={() => setNewTouch({ ...newTouch, type })} className={`rounded-2xl border px-3 py-2.5 text-sm transition ${newTouch.type === type ? "border-[#d8a5b8]/25 bg-[#d8a5b8]/12 text-white" : "border-white/8 bg-white/4 text-[#d8c8dc]/65 hover:bg-white/[0.07]"}`}>{type}</button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {(["positive", "neutral", "concerned", "negative"] as const).map(s => {
          const color = s === "positive" ? "#9FE6C0" : s === "concerned" ? "#E7C873" : s === "negative" ? "#F4A7B9" : "#d8c8dc";
          return <button key={s} onClick={() => setNewTouch({ ...newTouch, sentiment: s })} className={`rounded-2xl border px-3 py-2.5 text-sm capitalize transition ${newTouch.sentiment === s ? "border-white/20 text-white" : "border-white/8 bg-white/4 text-[#d8c8dc]/55 hover:bg-white/[0.07]"}`} style={newTouch.sentiment === s ? { borderColor: `${color}40`, background: `${color}12`, color } : {}}>{s}</button>;
        })}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {(["inbound", "outbound", "internal"] as const).map(dir => (
          <button key={dir} onClick={() => setNewTouch({ ...newTouch, direction: dir })} className={`rounded-2xl border px-3 py-2.5 text-sm capitalize transition ${newTouch.direction === dir ? "border-[#d8a5b8]/25 bg-[#d8a5b8]/12 text-white" : "border-white/8 bg-white/4 text-[#d8c8dc]/55 hover:bg-white/[0.07]"}`}>{dir}</button>
        ))}
      </div>
      <input value={newTouch.summary} onChange={e => setNewTouch({ ...newTouch, summary: e.target.value })} placeholder="Summary (required)" className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm outline-none placeholder:text-[#d8c8dc]/30 focus:border-[#d8a5b8]/25" style={{ fontFamily: "Sora, sans-serif" }} />
      <textarea value={newTouch.content} onChange={e => setNewTouch({ ...newTouch, content: e.target.value })} placeholder="Details or notes (optional)" className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm outline-none placeholder:text-[#d8c8dc]/30 focus:border-[#d8a5b8]/25" style={{ fontFamily: "Sora, sans-serif" }} />
      <button onClick={logTouch} disabled={!newTouch.summary.trim()} className="flex w-fit items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#f1dbe5,#d8a5b8,#b98bb1)] px-5 py-3 text-sm font-semibold text-[#17141c] shadow-[0_10px_35px_rgba(216,165,184,0.22)] transition hover:scale-[1.02] disabled:opacity-50 disabled:scale-100">
        <Plus className="h-4 w-4" /> Log Touch
      </button>
    </Panel>
  );
}

// ─── Overview Tab ──────────────────────────────────────────────────────────
function OverviewTab({ scoredAccounts, accounts, touches, attention, setSelectedAccountId, goTab, selectedAccount, history }: any) {
  const avg = Math.round(scoredAccounts.reduce((s: number, a: ScoredAccount) => s + a.score.overall, 0) / scoredAccounts.length);
  return (
    <div className="space-y-6">
      <style>{`@keyframes fade-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.fade-up{animation:fade-up .45s ease both}`}</style>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Users,        label: "Tracked Accounts",    value: String(accounts.length), detail: "Sandbox relationships",   color: "#C7A7E8" },
          { icon: Clock,        label: "Relationship Touches", value: String(touches.length),  detail: "Logged interactions",     color: "#d8a5b8" },
          { icon: CheckCircle2, label: "Average Pulse",        value: String(avg),             detail: "Weighted portfolio score", color: "#9FE6C0" },
          { icon: TrendingDown, label: "Attention Need",       value: String(scoredAccounts.filter((a: ScoredAccount) => a.score.overall < 74).length), detail: "Accounts to review", color: "#F4A7B9" },
        ].map((m, i) => (
          <div key={i} className="fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <MetricCard {...m} />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <Panel title="Executive focus." subtitle="Today's relationship attention queue">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#d8a5b8]/15 bg-[#d8a5b8]/8 px-3 py-1 text-xs tracking-wide text-[#f1d6e2]">
            <Sparkles className="h-3.5 w-3.5" /> Calm intelligence, not dashboard noise.
          </div>
          <p className="max-w-lg text-sm leading-8 text-[#d8c8dc]/60">
            Pulse interprets trust, engagement, momentum, stability, and opportunity to prioritize thoughtful action — without creating workflow noise.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => goTab("Intelligence")} className="rounded-2xl bg-[linear-gradient(135deg,#f1dbe5,#d8a5b8,#b98bb1)] px-5 py-3 text-sm font-semibold text-[#17141c] shadow-[0_10px_35px_rgba(216,165,184,0.22)] transition hover:scale-[1.02]">Review Intelligence</button>
            <button onClick={() => goTab("Accounts")} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:bg-white/9">Open Accounts</button>
          </div>
        </Panel>
        <Panel title="Attention queue" subtitle="Lowest-scoring relationships">
          <div className="space-y-2">
            {attention.map((account: ScoredAccount) => (
              <button key={account.id} onClick={() => { setSelectedAccountId(account.id); goTab("Accounts"); }} className="w-full rounded-3xl border border-white/8 bg-white/4 p-4 text-left transition hover:bg-white/8">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{account.name}</p>
                    <p className="mt-1 text-xs text-[#d8c8dc]/50">{account.score.action.substring(0, 55)}…</p>
                  </div>
                  <StatusBadge label={account.score.priority} score={account.score.overall} />
                </div>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <AccountList accounts={scoredAccounts} selectedAccountId={selectedAccount?.id} setSelectedAccountId={setSelectedAccountId} history={history} />
        {selectedAccount && <AccountPulse account={selectedAccount} history={history[selectedAccount.id] ?? []} />}
      </div>
    </div>
  );
}

// ─── Accounts Tab ──────────────────────────────────────────────────────────
function AccountsTab({ query, setQuery, filteredAccounts, selectedAccount, selectedAccountId, setSelectedAccountId, accountTouches, newTouch, setNewTouch, logTouch, newAccount, setNewAccount, addAccount, history }: any) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <AccountList accounts={filteredAccounts} selectedAccountId={selectedAccountId} setSelectedAccountId={setSelectedAccountId} query={query} setQuery={setQuery} history={history} />
        {selectedAccount && <AccountPulse account={selectedAccount} touches={accountTouches} history={history[selectedAccount.id] ?? []} />}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_.75fr]">
        <LogTouchPanel selectedAccount={selectedAccount} newTouch={newTouch} setNewTouch={setNewTouch} logTouch={logTouch} />
        <Panel title="Add account" subtitle="Creates a persistent sandbox account">
          <input value={newAccount.name} onChange={e => setNewAccount({ ...newAccount, name: e.target.value })} placeholder="Account name (required)" className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm outline-none placeholder:text-[#d8c8dc]/30 focus:border-[#d8a5b8]/25" style={{ fontFamily: "Sora, sans-serif" }} />
          <input value={newAccount.owner} onChange={e => setNewAccount({ ...newAccount, owner: e.target.value })} placeholder="Account owner" className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm outline-none placeholder:text-[#d8c8dc]/30 focus:border-[#d8a5b8]/25" style={{ fontFamily: "Sora, sans-serif" }} />
          <input value={newAccount.value} onChange={e => setNewAccount({ ...newAccount, value: e.target.value })} placeholder="Annual value (e.g. 120000)" className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm outline-none placeholder:text-[#d8c8dc]/30 focus:border-[#d8a5b8]/25" style={{ fontFamily: "Sora, sans-serif" }} />
          <button onClick={addAccount} disabled={!newAccount.name.trim()} className="flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-[#17141c] transition hover:scale-[1.02] disabled:opacity-50">
            <Plus className="h-4 w-4" /> Add Account
          </button>
        </Panel>
      </div>
    </div>
  );
}

// ─── Activity Tab ──────────────────────────────────────────────────────────
function ActivityTab({ touches, accounts, selectedTouch, setSelectedTouch, selectedAccount, newTouch, setNewTouch, logTouch }: any) {
  if (selectedTouch) {
    const relatedAccount = accounts.find((a: ScoredAccount) => a.id === selectedTouch.accountId);
    return (
      <div className="space-y-4">
        <button onClick={() => setSelectedTouch(null)} className="flex items-center gap-2 text-sm text-[#d8c8dc]/60 transition hover:text-white">
          <ChevronRight className="h-4 w-4 rotate-180" /> Back to activity
        </button>
        <Panel title={selectedTouch.summary} subtitle={`${relatedAccount?.name ?? "Account"} · ${selectedTouch.type} · ${daysSince(selectedTouch.occurredAt) === 0 ? "Today" : `${daysSince(selectedTouch.occurredAt)}d ago`}`}>
          <div className="rounded-3xl border border-white/8 bg-white/4 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/65 mb-3">Original {selectedTouch.type}</p>
            <div className="rounded-3xl border border-black/10 bg-[#f8f3f7] p-5 text-[#17141c]">
              <div className="border-b border-black/8 pb-4 space-y-1 text-sm">
                <p><span className="font-semibold">From:</span> {selectedTouch.direction === "inbound" ? `${relatedAccount?.name ?? "Client"} Team` : "Danielle Hart"}</p>
                <p><span className="font-semibold">To:</span> {selectedTouch.direction === "inbound" ? "Danielle Hart" : `${relatedAccount?.name ?? "Client"} Team`}</p>
                <p><span className="font-semibold">Subject:</span> {selectedTouch.summary}</p>
              </div>
              <div className="mt-4 whitespace-pre-line text-sm leading-7">{selectedTouch.content || `Hi Danielle,\n\nFollowing up on our recent conversation. Please let me know the best time to connect.\n\nThank you.`}</div>
            </div>
          </div>
          <div className="rounded-3xl border border-[#d8a5b8]/12 bg-[#d8a5b8]/6 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#d8a5b8]/65 mb-2">AI Narrative</p>
            <p className="text-sm leading-7 text-[#f1e9f4]">
This {selectedTouch.type.toLowerCase()} contributes to{" "}
{relatedAccount?.name}&apos;s current Relationship Pulse through recency, sentiment, and engagement signals.{" "}              {selectedTouch.sentiment === "positive" ? "The positive tone reinforces trust and engagement momentum." : selectedTouch.sentiment === "concerned" ? "The concerned tone suggests an attention need — a thoughtful, direct follow-up is recommended." : selectedTouch.sentiment === "negative" ? "This signal elevates relationship risk and may require direct account-owner intervention." : "This neutral signal should be read in the context of recent activity."}
            </p>
            <div className="mt-3 rounded-2xl border border-white/8 bg-white/4 p-3 text-sm text-[#d8c8dc]/65">Suggested next step: {relatedAccount?.score?.action ?? "Review recent context and determine next steps."}</div>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_.75fr]">
        <Panel title="Upcoming Activity" subtitle="Recommended actions based on relationship signals">
          <div className="max-h-95 space-y-2 overflow-y-auto pr-1">
            {[...accounts].sort((a: ScoredAccount, b: ScoredAccount) => a.score.overall - b.score.overall).map((account: ScoredAccount) => (
              <div key={account.id} className="rounded-3xl border border-white/8 bg-white/4 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{account.name}</p>
                      <StatusBadge label={account.score.priority} score={account.score.overall} />
                    </div>
                    <p className="mt-1.5 text-sm text-[#d8c8dc]/58">{account.score.action}</p>
                  </div>
                  <PulseMark health={account.score.overall} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <LogTouchPanel selectedAccount={selectedAccount} newTouch={newTouch} setNewTouch={setNewTouch} logTouch={logTouch} />
      </div>
      <Panel title="Recent Activity" subtitle="Click to view original message and AI narrative">
        <div className="space-y-2">
          {touches.map((touch: Touch) => {
            const acct = accounts.find((a: ScoredAccount) => a.id === touch.accountId);
            const sColor = touch.sentiment === "positive" ? "#9FE6C0" : touch.sentiment === "concerned" ? "#E7C873" : touch.sentiment === "negative" ? "#F4A7B9" : "#d8c8dc";
            return (
              <button key={touch.id} onClick={() => setSelectedTouch(touch)} className="flex w-full items-center justify-between rounded-3xl border border-white/8 bg-white/4 p-4 text-left transition hover:bg-white/8">
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: sColor }} />
                  <div>
                    <p className="font-medium text-white">{acct?.name ?? "Account"} · {touch.type}</p>
                    <p className="mt-0.5 text-sm text-[#d8c8dc]/55">{touch.summary}</p>
                    <p className="mt-1 text-xs text-[#d8c8dc]/35">{daysSince(touch.occurredAt) === 0 ? "Today" : `${daysSince(touch.occurredAt)}d ago`} · {touch.direction}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#d8c8dc]/35" />
              </button>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

// ─── Intelligence Tab ──────────────────────────────────────────────────────
function IntelligenceTab({ accounts, history }: { accounts: ScoredAccount[]; history: AccountHistory }) {
  const sorted = [...accounts].sort((a, b) => a.score.overall - b.score.overall);
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <Panel title="Relationship Intelligence" subtitle="Pattern interpretation, not judgment">
          <div className="space-y-3">
            {sorted.map(account => (
              <div key={account.id} className="rounded-3xl border border-white/8 bg-white/4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-white">{account.name}</p>
                      <StatusBadge label={account.score.priority} score={account.score.overall} />
                      <div className="flex items-center gap-1">
                        <TrendIcon trend={account.score.trend} compact />
                        <span className="text-xs text-[#d8c8dc]/40">{account.score.trend}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[#d8c8dc]/65">{account.score.narrative}</p>
                    <p className="mt-2 text-sm text-[#f1d6e2]">{account.score.action}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-3xl font-medium" style={{ fontFamily: "Cormorant Garamond, serif", color: account.score.priorityColor }}>{account.score.overall}</p>
                    <p className="text-xs text-[#d8c8dc]/40">Pulse</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel title="Scoring model" subtitle="Current dimension weights">
            <Dimension label="Trust"       value={30} suffix="%" />
            <Dimension label="Engagement"  value={25} suffix="%" />
            <Dimension label="Momentum"    value={20} suffix="%" />
            <Dimension label="Stability"   value={15} suffix="%" />
            <Dimension label="Opportunity" value={10} suffix="%" />
            <p className="text-xs text-[#d8c8dc]/40">Customize weights in Admin → Scoring.</p>
          </Panel>
          <PulseRadarChart data={{ name: sorted[sorted.length - 1]?.name ?? "Account", trust: sorted[sorted.length - 1]?.score.trust ?? 80, engagement: sorted[sorted.length - 1]?.score.engagement ?? 80, momentum: sorted[sorted.length - 1]?.score.momentum ?? 80, stability: sorted[sorted.length - 1]?.score.stability ?? 80, opportunity: sorted[sorted.length - 1]?.score.opportunity ?? 80 }} />
        </div>
      </div>
      <PulseTrendChart data={accounts.slice(0, 4).map(a => ({ name: a.name, history: history[a.id] ?? [] }))} />
    </div>
  );
}

// ─── AI Assistant Tab ──────────────────────────────────────────────────────
function findAccountByPrompt(prompt: string, accounts: ScoredAccount[]) {
  const lower = prompt.toLowerCase();

  return accounts.find((account) => {
    const accountName = account.name.toLowerCase();
    const firstWord = accountName.split(" ")[0];

    return lower.includes(accountName) || lower.includes(firstWord);
  });
}

function extractAccountName(prompt: string) {
  const patterns = [
    /add an account called (.+?)(?: owned by| with value|$)/i,
    /add account called (.+?)(?: owned by| with value|$)/i,
    /create an account called (.+?)(?: owned by| with value|$)/i,
    /create account called (.+?)(?: owned by| with value|$)/i,
    /new account called (.+?)(?: owned by| with value|$)/i,
  ];

  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return "";
}

function extractOwner(prompt: string) {
  const match = prompt.match(/owned by (.+?)(?: with value| worth|$)/i);
  return match?.[1]?.trim() || "";
}

function extractValue(prompt: string) {
  const match = prompt.match(/(?:value|worth)\s+\$?([\d,]+)/i);
  if (!match?.[1]) return 0;

  return Number(match[1].replaceAll(",", ""));
}

function buildDraftResponse(account: ScoredAccount) {
  return `Subject: Following up on our recent conversation

Hi,

I wanted to follow up and make sure we are aligned on next steps.

Based on our recent conversations, I thought it would be helpful to reconnect, review what is still open, and make sure we are supporting the priorities that matter most right now.

Would you be open to a brief check-in this week?

Best,
Danielle`;
}
function AITab({
  aiPrompt,
  setAiPrompt,
  aiReport,
  setAiReport,
  accounts,
  touches,
  history,
  goTab,
  setSelectedAccountId,
  addAccountFromAI,
}: any) {  function runAI() {
  const prompt = aiPrompt.trim();
  if (!prompt) return;

  const lower = prompt.toLowerCase();

  // Clear the prior result first so repeated clicks still visibly refresh.
  setAiReport(null);

  setTimeout(() => {
    // Navigate
    if (
      lower.includes("go to reports") ||
      lower.includes("open reports") ||
      lower.includes("take me to reports")
    ) {
      goTab("Reports");
      setAiReport({
        text: "Opened Reports.",
        chartType: null,
        chartData: null,
      });
      return;
    }

    if (
      lower.includes("go to accounts") ||
      lower.includes("open accounts") ||
      lower.includes("take me to accounts")
    ) {
      goTab("Accounts");
      setAiReport({
        text: "Opened Accounts.",
        chartType: null,
        chartData: null,
      });
      return;
    }

    if (
      lower.includes("go to activity") ||
      lower.includes("open activity") ||
      lower.includes("take me to activity")
    ) {
      goTab("Activity");
      setAiReport({
        text: "Opened Activity.",
        chartType: null,
        chartData: null,
      });
      return;
    }

    if (
      lower.includes("go to intelligence") ||
      lower.includes("open intelligence") ||
      lower.includes("take me to intelligence")
    ) {
      goTab("Intelligence");
      setAiReport({
        text: "Opened Intelligence.",
        chartType: null,
        chartData: null,
      });
      return;
    }

    if (
      lower.includes("go to admin") ||
      lower.includes("open admin") ||
      lower.includes("take me to admin")
    ) {
      goTab("Admin");
      setAiReport({
        text: "Opened Admin.",
        chartType: null,
        chartData: null,
      });
      return;
    }

    // Add account
    if (
      lower.includes("add account") ||
      lower.includes("add an account") ||
      lower.includes("create account") ||
      lower.includes("create an account") ||
      lower.includes("new account")
    ) {
      const name = extractAccountName(prompt);
      const owner = extractOwner(prompt);
      const value = extractValue(prompt);

      if (!name) {
        setAiReport({
          text:
            "I can add the account, but I need the account name. Try: “Add an account called Blue Ridge Parts owned by Sarah with value 90000.”",
          chartType: null,
          chartData: null,
        });
        return;
      }

      const newAccount = addAccountFromAI({
        name,
        owner: owner || "Unassigned",
        value: value || 0,
      });

      setAiReport({
        text: `Added ${newAccount.name} to Accounts. Owner: ${newAccount.owner}. Value: $${newAccount.value.toLocaleString()}.`,
        chartType: null,
        chartData: null,
      });

      goTab("Accounts");
      return;
    }

    // Select/open account
    if (
      lower.includes("show me") ||
      lower.includes("open account") ||
      lower.includes("select account") ||
      lower.includes("pull up") ||
      lower.includes("find account")
    ) {
      const account = findAccountByPrompt(prompt, accounts);

      if (account) {
        setSelectedAccountId(account.id);
        goTab("Accounts");

        setAiReport({
          text: `Opened ${account.name}. Current Pulse Score: ${account.score.overall}. ${account.score.narrative}`,
          chartType: null,
          chartData: null,
        });
        return;
      }

      setAiReport({
        text: "I could not find that account in the sandbox.",
        chartType: null,
        chartData: null,
      });
      return;
    }

    // Explain account
    if (
      lower.includes("explain") ||
      lower.includes("why") ||
      lower.includes("what is going on") ||
      lower.includes("at risk") ||
      lower.includes("health")
    ) {
      const account = findAccountByPrompt(prompt, accounts);

      if (account) {
        setAiReport({
          text: `${account.name} currently has a Pulse Score of ${account.score.overall}.

Trust: ${account.score.trust}
Engagement: ${account.score.engagement}
Momentum: ${account.score.momentum}
Stability: ${account.score.stability}
Opportunity: ${account.score.opportunity}

Interpretation:
${account.score.narrative}

Recommended action:
${account.score.action}`,
          chartType: "radar",
          chartData: {
            name: account.name,
            trust: account.score.trust,
            engagement: account.score.engagement,
            momentum: account.score.momentum,
            stability: account.score.stability,
            opportunity: account.score.opportunity,
          },
        });
        return;
      }

      setAiReport({
        text: "I could not find that account to explain.",
        chartType: null,
        chartData: null,
      });
      return;
    }

    // Draft response
    if (
      lower.includes("draft") ||
      lower.includes("write an email") ||
      lower.includes("write a response") ||
      lower.includes("follow-up email") ||
      lower.includes("follow up email")
    ) {
      const account = findAccountByPrompt(prompt, accounts) || accounts[0];

      setAiReport({
        text: `Draft response for ${account.name}:

${buildDraftResponse(account)}`,
        chartType: null,
        chartData: null,
      });
      return;
    }

    // Only generate report/chart/table if specifically requested
    if (
      lower.includes("report") ||
      lower.includes("chart") ||
      lower.includes("graph") ||
      lower.includes("table") ||
      lower.includes("trend")
    ) {
      const output = buildReport(prompt, accounts, touches, history);
      setAiReport(output);
      return;
    }

    // General fallback
    setAiReport({
      text:
        "I can help navigate the app, add sandbox accounts, select accounts, explain account health, draft follow-ups, or generate reports when requested. Try: “Show me HarborTech” or “Draft a follow-up email for Northstar.”",
      chartType: null,
      chartData: null,
    });
  }, 50);
}
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_.75fr]">
        <Panel
          title="AI Relationship Assistant"
          subtitle="Ask Pulse to navigate, add sandbox accounts, explain account health, draft follow-ups, or generate reports when requested."
        >
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                runAI();
              }
            }}
            placeholder="Try: “Show me HarborTech”, “Explain Northstar”, “Add an account called Blue Ridge Parts owned by Sarah with value 90000”, or “Draft a follow-up email for Summit.”"
            className="min-h-40 w-full rounded-[1.8rem] border border-[#d8a5b8]/15 bg-[linear-gradient(180deg,#f8f3f7,#ece6ef)] p-5 text-sm leading-7 text-[#17141c] outline-none placeholder:text-[#8a7a8e]"
            style={{ fontFamily: "Sora, sans-serif" }}
          />

          <div className="flex items-center gap-3">
            <button
              onClick={runAI}
              className="rounded-2xl bg-[linear-gradient(135deg,#f1dbe5,#d8a5b8,#b98bb1)] px-5 py-3 text-sm font-semibold text-[#17141c] shadow-[0_10px_35px_rgba(216,165,184,0.22)] transition hover:scale-[1.02]"
            >
              Generate
            </button>

            <p className="text-xs text-[#d8c8dc]/38">
              Enter to generate · Shift+Enter for newline
            </p>
          </div>

          {aiReport && (
            <div className="space-y-4">
              <ChartOutput type={aiReport.chartType} data={aiReport.chartData} />

              <div className="rounded-[1.8rem] border border-white/8 bg-white/4 p-5">
                <pre
                  className="whitespace-pre-wrap text-sm leading-7 text-[#f1e9f4]"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  {aiReport.text}
                </pre>
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Suggested tasks" subtitle="Examples of what Pulse can do">
          {[
            "Open Reports",
            "Show me HarborTech",
            "Explain Northstar",
            "Draft a follow-up email for Summit",
            "Add an account called Blue Ridge Parts owned by Sarah with value 90000",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setAiPrompt(prompt)}
              className="w-full rounded-3xl border border-white/8 bg-white/4 p-4 text-left text-sm text-[#d8c8dc]/70 transition hover:bg-white/8 hover:text-white"
            >
              {prompt}
            </button>
          ))}
        </Panel>
      </div>
    </div>
  );
}

// ─── Reports Tab ───────────────────────────────────────────────────────────
function ReportsTab({ accounts, touches, history }: { accounts: ScoredAccount[]; touches: Touch[]; history: AccountHistory }) {
  const [prompt, setPrompt] = useState("");
  const [report, setReport]  = useState<ReportOutput | null>(null);

  function generate() {
    if (!prompt.trim()) return;
    setReport(buildReport(prompt, accounts, touches, history));
  }

  return (
    <div className="space-y-5">
      <Panel title="Report Generator" subtitle="Describe the report you need — charts are generated automatically from your sandbox data.">
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); } }} placeholder="Example: Create an executive report with bar chart showing churn risk and engagement across all accounts." className="mt-2 min-h-32.5 w-full rounded-[1.8rem] border border-[#d8a5b8]/15 bg-[linear-gradient(180deg,#f8f3f7,#ece6ef)] p-5 text-sm leading-7 text-[#17141c] outline-none placeholder:text-[#8a7a8e]" style={{ fontFamily: "Sora, sans-serif" }} />
        <div className="flex flex-wrap gap-3">
          <button onClick={generate} className="rounded-2xl bg-[linear-gradient(135deg,#f1dbe5,#d8a5b8,#b98bb1)] px-5 py-3 text-sm font-semibold text-[#17141c] shadow-[0_10px_35px_rgba(216,165,184,0.22)] transition hover:scale-[1.02]">Generate Report</button>
          {["Bar chart", "Radar", "Trend lines", "Table"].map(hint => (
            <button key={hint} onClick={() => setPrompt(`Show me a ${hint.toLowerCase()} of portfolio health`)} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-2.5 text-xs text-[#d8c8dc]/55 transition hover:bg-white/8 hover:text-white">{hint}</button>
          ))}
        </div>
      </Panel>

      {report && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#d8c8dc]/40">Generated Report</p>
              <h2 className="mt-1 text-2xl font-medium" style={{ fontFamily: "Cormorant Garamond, serif" }}>Relationship Intelligence Report</h2>
            </div>
            <span className="rounded-full border border-[#d8a5b8]/15 bg-[#d8a5b8]/8 px-3 py-1 text-xs text-[#f1d6e2]">Sandbox output</span>
          </div>
          <ChartOutput type={report.chartType} data={report.chartData} />
          <div className="rounded-[1.8rem] border border-white/10 bg-[#0d0b16]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <pre className="whitespace-pre-wrap text-sm leading-7 text-[#f3edf5]" style={{ fontFamily: "Sora, sans-serif" }}>{report.text}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Tab ─────────────────────────────────────────────────────────────
function AdminTab({ resetSandbox, theme, setTheme, density, setDensity, weights, setWeights }: any) {
  const dimensionKeys = ["trust", "engagement", "momentum", "stability", "opportunity"] as const;
  const total = dimensionKeys.reduce((s, k) => s + Number(weights[k]), 0);

  function updateWeight(key: string, value: number) {
    setWeights((prev: ScoringWeights) => ({ ...prev, [key]: value }));
  }

  function normalize() {
    const t = dimensionKeys.reduce((s, k) => s + Number(weights[k]), 0);
    if (t === 0) return;
    const normalized: any = {};
    dimensionKeys.forEach(k => { normalized[k] = Math.round((Number(weights[k]) / t) * 100); });
    const sum = dimensionKeys.reduce((s, k) => s + normalized[k], 0);
    normalized.trust += 100 - sum;
    setWeights(normalized);
  }

  function resetWeights() { setWeights(DEFAULT_WEIGHTS); }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Scoring weights" subtitle="Customize how Pulse calculates relationship health. Weights should sum to 100.">
          <div className="space-y-4">
            {dimensionKeys.map(key => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm capitalize text-[#d8c8dc]/70">{key}</p>
                  <p className="text-sm font-medium text-white">{weights[key]}%</p>
                </div>
                <input type="range" min="5" max="60" value={weights[key]} onChange={e => updateWeight(key, Number(e.target.value))} className="w-full accent-[#d8a5b8]" />
              </div>
            ))}
          </div>
          <div className={`rounded-2xl border px-4 py-3 text-sm ${Math.abs(total - 100) < 1 ? "border-[#9FE6C0]/20 bg-[#9FE6C0]/8 text-[#9FE6C0]" : "border-[#F4A7B9]/20 bg-[#F4A7B9]/8 text-[#F4A7B9]"}`}>
            Current total: {total}% {Math.abs(total - 100) < 1 ? "✓ Balanced" : `— ${total > 100 ? "reduce" : "increase"} by ${Math.abs(100 - total)}%`}
          </div>
          <div className="flex gap-3">
            <button onClick={normalize} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-[#17141c] transition hover:scale-[1.01]">Auto-Normalize to 100%</button>
            <button onClick={resetWeights} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:bg-white/9">Reset Defaults</button>
          </div>
        </Panel>

        <Panel title="Display preferences" subtitle="Sandbox workspace customization">
          <div className="rounded-3xl border border-white/8 bg-white/4 p-5">
            <p className="mb-3 text-sm text-[#d8c8dc]/60">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {["Purple graphite", "Soft graphite", "Deep blush"].map(t => (
                <button key={t} onClick={() => setTheme(t)} className={`rounded-2xl px-3 py-2.5 text-xs transition ${theme === t ? "bg-white text-[#17141c]" : "bg-white/5 text-white hover:bg-white/9"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/8 bg-white/4 p-5">
            <p className="mb-3 text-sm text-[#d8c8dc]/60">Density</p>
            <div className="grid grid-cols-3 gap-2">
              {["Compact", "Comfortable", "Spacious"].map(d => (
                <button key={d} onClick={() => setDensity(d)} className={`rounded-2xl px-3 py-2.5 text-xs transition ${density === d ? "bg-white text-[#17141c]" : "bg-white/5 text-white hover:bg-white/9"}`}>{d}</button>
              ))}
            </div>
          </div>
          <button onClick={resetSandbox} className="flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:bg-white/9">
            <RefreshCcw className="h-4 w-4" /> Reset All Sandbox Data
          </button>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Integrations" subtitle="Demo integration status">
          <button className="w-fit rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-[#17141c]">Connect Integration</button>
          {[{ name: "Outlook", icon: Mail, status: "Demo connected" }, { name: "Zoom", icon: Video, status: "Demo connected" }, { name: "Teams", icon: MessageSquare, status: "Pending" }].map(({ name, icon: Icon, status }) => (
            <div key={name} className="flex items-center justify-between rounded-3xl border border-white/8 bg-white/4 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-[#d8a5b8]/12 bg-[#d8a5b8]/8 p-2.5 text-[#f1d6e2]"><Icon className="h-4 w-4" /></div>
                <div><p className="font-medium text-white">{name}</p><p className="text-sm text-[#d8c8dc]/50">{status}</p></div>
              </div>
              <div className={`rounded-full px-2.5 py-1 text-xs ${status === "Pending" ? "border border-white/10 bg-white/4 text-[#d8c8dc]/55" : "border border-[#9FE6C0]/20 bg-[#9FE6C0]/10 text-[#9FE6C0]"}`}>{status === "Pending" ? "Connect" : "Active"}</div>
            </div>
          ))}
        </Panel>

        <Panel title="Team" subtitle="Workspace members">
          <button className="flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-[#17141c]"><UserPlus className="h-4 w-4" /> Invite Member</button>
          {[
            { initials: "DH", name: "Danielle Hart",  role: "Workspace Admin · Enterprise Accounts", badge: "Admin",   gradient: "linear-gradient(145deg,#f1dbe5,#d8a5b8,#b98bb1)", badgeColor: "#d8a5b8" },
            { initials: "JC", name: "James Carter",   role: "Relationship Lead · Strategic Accounts", badge: "Online",  gradient: "linear-gradient(145deg,#d7d9df,#aab0ba,#7d8693)",  badgeColor: "#9FE6C0" },
            { initials: "NP", name: "Nora Patel",     role: "Viewer · Customer Success",              badge: "Invited", gradient: "linear-gradient(145deg,#c7a7e8,#9e82c9,#725f9d)",  badgeColor: "#C7A7E8" },
          ].map(({ initials, name, role, badge, gradient, badgeColor }) => (
            <div key={name} className="flex items-center justify-between rounded-3xl border border-white/8 bg-white/4 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold text-[#17141c]" style={{ background: gradient }}>{initials}</div>
                <div><p className="font-medium text-white">{name}</p><p className="text-xs text-[#d8c8dc]/50 mt-0.5">{role}</p></div>
              </div>
              <span className="rounded-full px-2.5 py-1 text-xs" style={{ color: badgeColor, background: `${badgeColor}15`, border: `1px solid ${badgeColor}25` }}>{badge}</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function Page() {
  const [authState, setAuthState] = useState<"landing" | "loading" | "dashboard">("landing");
  const [activeTab, setActiveTab] = useState("Overview");
  const [accounts,  setAccounts]  = useState<Account[]>(starterAccounts);
  const [touches,   setTouches]   = useState<Touch[]>(starterTouches);
  const [selectedAccountId, setSelectedAccountId] = useState("northstar");
  const [query,     setQuery]     = useState("");
  const [selectedTouch, setSelectedTouch] = useState<Touch | null>(null);
  const [aiPrompt,  setAiPrompt]  = useState("");
  const [aiReport,  setAiReport]  = useState<ReportOutput | null>(null);
  const [newAccount, setNewAccount] = useState({ name: "", owner: "", value: "" });
  const [newTouch,  setNewTouch]  = useState<{ type: string; sentiment: Touch["sentiment"]; direction: Touch["direction"]; summary: string; content: string }>({ type: "Email", sentiment: "neutral", direction: "outbound", summary: "", content: "" });
  const [weights,   setWeights]   = useState<ScoringWeights>(DEFAULT_WEIGHTS);
  const [history,   setHistory]   = useState<AccountHistory>({});
  const [theme,     setTheme]     = useState("Purple graphite");
  const [density,   setDensity]   = useState("Comfortable");

  // Load from localStorage
  useEffect(() => {
    const signed = localStorage.getItem(SIGNIN_KEY) === "true";
    if (signed) setAuthState("dashboard");
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) { try { const p = JSON.parse(stored); setAccounts(p.accounts || starterAccounts); setTouches(p.touches || starterTouches); } catch { localStorage.removeItem(STORAGE_KEY); } }
    const storedWeights = localStorage.getItem(WEIGHTS_KEY);
    if (storedWeights) { try { setWeights(JSON.parse(storedWeights)); } catch { } }
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    if (storedHistory) { try { setHistory(JSON.parse(storedHistory)); } catch { } }
    const savedTheme = localStorage.getItem("pulse-theme");
    const savedDensity = localStorage.getItem("pulse-density");
    if (savedTheme)   setTheme(savedTheme);
    if (savedDensity) setDensity(savedDensity);
  }, []);

  // Persist data
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ accounts, touches })); }, [accounts, touches]);
  useEffect(() => { localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights)); }, [weights]);
  useEffect(() => { localStorage.setItem("pulse-theme", theme); localStorage.setItem("pulse-density", density); }, [theme, density]);

  const scoredAccounts: ScoredAccount[] = useMemo(
    () => accounts.map(a => ({ ...a, score: calculateScore(a, touches, weights) })),
    [accounts, touches, weights]
  );

  // Initialize starter history once
  useEffect(() => {
    if (Object.keys(history).length === 0 && scoredAccounts.length > 0) {
      const h = generateStarterHistory(starterAccounts, starterTouches, weights);
      setHistory(h);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
    }
  }, [scoredAccounts.length]);

  // Save score snapshot when touches change
  useEffect(() => {
    if (scoredAccounts.length === 0) return;
    setHistory(prev => {
      const next = { ...prev };
      scoredAccounts.forEach(a => {
        const snaps = next[a.id] ?? [];
        const today = new Date().toDateString();
        const alreadyToday = snaps.some(s => new Date(s.date).toDateString() === today);
        if (!alreadyToday) {
          next[a.id] = [...snaps.slice(-9), { date: new Date().toISOString(), overall: a.score.overall }];
        }
      });
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, [touches]);

  const selectedAccount   = scoredAccounts.find(a => a.id === selectedAccountId) ?? scoredAccounts[0];
  const accountTouches    = touches.filter(t => t.accountId === selectedAccount?.id).sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  const attention         = [...scoredAccounts].sort((a, b) => a.score.overall - b.score.overall).slice(0, 3);
  const filteredAccounts  = scoredAccounts.filter(a => `${a.name} ${a.owner} ${a.stage}`.toLowerCase().includes(query.toLowerCase()));

  function signIn() { setAuthState("loading"); setTimeout(() => { localStorage.setItem(SIGNIN_KEY, "true"); setAuthState("dashboard"); }, 1500); }
  function logout() { localStorage.removeItem(SIGNIN_KEY); setAuthState("landing"); }
  function goTab(tab: string) { setActiveTab(tab); setSelectedTouch(null); window.scrollTo({ top: 0, behavior: "smooth" }); }

  function logTouch() {
    if (!selectedAccount || !newTouch.summary.trim()) return;
    const touch: Touch = { id: newId(), accountId: selectedAccount.id, ...newTouch, occurredAt: new Date().toISOString() };
    setTouches(prev => [touch, ...prev]);
    setNewTouch({ type: "Email", sentiment: "neutral", direction: "outbound", summary: "", content: "" });
  }

  function addAccount() {
    if (!newAccount.name.trim()) return;
    const account: Account = { id: newId(), name: newAccount.name.trim(), owner: newAccount.owner.trim() || "Unassigned", value: Number(newAccount.value || 0), stage: "New relationship" };
    setAccounts(prev => [account, ...prev]);
    setSelectedAccountId(account.id);
    setNewAccount({ name: "", owner: "", value: "" });
  }
  function addAccountFromAI({
  name,
  owner,
  value,
}: {
  name: string;
  owner?: string;
  value?: number;
}) {
  const account: Account = {
    id: newId(),
    name,
    owner: owner || "Unassigned",
    value: value || 0,
    stage: "New relationship",
  };

  setAccounts((prev) => [account, ...prev]);
  setSelectedAccountId(account.id);

  return account;
}

  function resetSandbox() {
    setAccounts(starterAccounts); setTouches(starterTouches); setSelectedAccountId("northstar");
    setHistory(generateStarterHistory(starterAccounts, starterTouches, DEFAULT_WEIGHTS));
    localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(HISTORY_KEY);
  }

  const bgGradient =
    theme === "Soft graphite" ? "radial-gradient(circle at top left,#2b2b35 0%,#13141a 44%,#040406 100%)" :
    theme === "Deep blush"    ? "radial-gradient(circle at top left,#3a1c33 0%,#18111d 44%,#040406 100%)" :
    "radial-gradient(circle at top left,#28193a 0%,#0e0b17 44%,#040406 100%)";

  if (authState === "landing") return <><FontLoader /><LandingPage onSignIn={signIn} /></>;
  if (authState === "loading") return <><FontLoader /><LoadingScreen /></>;

  return (
    <>
      <FontLoader />
      <main className="min-h-screen text-white" style={{ background: bgGradient, fontFamily: "Sora, sans-serif" }}>
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(216,165,184,0.09),transparent_32%),radial-gradient(circle_at_84%_6%,rgba(190,150,220,0.08),transparent_30%)]" />
        <GrainOverlay />
        <MobileHeader activeTab={activeTab} attention={attention} goTab={goTab} />
        <DesktopSidebar activeTab={activeTab} goTab={goTab} logout={logout} />

        <section className="relative px-5 pb-10 pt-5 lg:ml-64 lg:px-10 lg:pb-10 lg:pt-8">
          <TopHero attention={attention} setSelectedAccountId={setSelectedAccountId} goTab={goTab} />

          {activeTab === "Overview" && (
  <OverviewTab
    scoredAccounts={scoredAccounts}
    accounts={accounts}
    touches={touches}
    attention={attention}
    setSelectedAccountId={setSelectedAccountId}
    goTab={goTab}
    selectedAccount={selectedAccount}
    history={history}
  />
)}

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
    history={history}
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
  />
)}

{activeTab === "Intelligence" && (
  <IntelligenceTab accounts={scoredAccounts} history={history} />
)}

{activeTab === "AI Assistant" && (
  <AITab
    aiPrompt={aiPrompt}
    setAiPrompt={setAiPrompt}
    aiReport={aiReport}
    setAiReport={setAiReport}
    accounts={scoredAccounts}
    touches={touches}
    history={history}
    goTab={goTab}
    setSelectedAccountId={setSelectedAccountId}
    addAccountFromAI={addAccountFromAI}
  />
)}

{activeTab === "Reports" && (
  <ReportsTab
    accounts={scoredAccounts}
    touches={touches}
    history={history}
  />
)}

{activeTab === "Admin" && (
  <AdminTab
    resetSandbox={resetSandbox}
    theme={theme}
    setTheme={setTheme}
    density={density}
    setDensity={setDensity}
    weights={weights}
    setWeights={setWeights}
  />
)}
        </section>
      </main>
    </>
  );
}