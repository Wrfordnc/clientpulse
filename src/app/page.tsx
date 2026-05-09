"use client";

import React, { useMemo, useState } from "react";
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
  Lightbulb,
  Mail,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Video,
} from "lucide-react";

const navigation = [
  { label: "Overview", icon: Activity },
  { label: "Accounts", icon: Users },
  { label: "Activity", icon: Clock },
  { label: "Intelligence", icon: Sparkles },
  { label: "Tasks", icon: CheckCircle2 },
  { label: "AI Task Manager", icon: Bot },
  { label: "Reports", icon: BarChart3 },
  { label: "Admin", icon: Settings },
];

const clients = [
  {
    name: "Northstar Logistics",
    owner: "Sarah Mitchell",
    health: 91,
    trend: "Improving",
    risk: "Low",
    priority: "Good timing",
    response: "1h 12m",
    lastTouch: "Today",
    value: "$142K",
    stage: "Renewal window",
    nextStep: "Start renewal conversation today",
    insight: "Healthy cadence. Proposal follow-up completed this morning.",
    prompt: "A renewal conversation would land well today because engagement is high.",
    timeline: [
      "Proposal follow-up sent this morning",
      "Austyn opened the renewal summary yesterday",
      "Q2 review sentiment improved after pricing clarification",
    ],
    people: [
      { name: "Austyn Diller", role: "VP Operations", action: "Start renewal conversation today." },
      { name: "Marisa Kane", role: "Finance Lead", action: "Send pricing recap before Friday." },
    ],
  },
  {
    name: "Summit Insurance Group",
    owner: "James Carter",
    health: 74,
    trend: "Stable",
    risk: "Medium",
    priority: "Follow up",
    response: "5h 44m",
    lastTouch: "Yesterday",
    value: "$98K",
    stage: "Implementation",
    nextStep: "Confirm implementation timeline",
    insight: "Implementation timeline question still needs confirmation.",
    prompt: "Send a short timeline confirmation with one clear next step.",
    timeline: [
      "Client asked for implementation timing yesterday",
      "Meeting accepted by Brogan Westra",
      "Timeline concern detected in Teams thread",
    ],
    people: [{ name: "Brogan Westra", role: "Implementation Lead", action: "Meeting starts in 26 minutes." }],
  },
  {
    name: "HarborTech Services",
    owner: "Jasper Milligan",
    health: 58,
    trend: "Declining",
    risk: "High",
    priority: "Needs a look",
    response: "21h 05m",
    lastTouch: "4 days ago",
    value: "$185K",
    stage: "Project recovery",
    nextStep: "Return callback today",
    insight: "Callback request is overdue and meeting sentiment declined.",
    prompt: "A direct, human check-in from the account owner is recommended today.",
    timeline: [
      "Callback request has not been completed",
      "Meeting sentiment declined after project delay discussion",
      "No response detected after client follow-up",
    ],
    people: [
      { name: "Jasper Milligan", role: "COO", action: "Callback request needs a look." },
      { name: "Lena Ortiz", role: "Project Sponsor", action: "Send milestone recovery note." },
    ],
  },
  {
    name: "Evergreen Medical",
    owner: "Nora Patel",
    health: 83,
    trend: "Improving",
    risk: "Low",
    priority: "Looking good",
    response: "2h 08m",
    lastTouch: "Today",
    value: "$76K",
    stage: "Onboarding",
    nextStep: "Confirm next onboarding step",
    insight: "Stakeholder engagement increased after onboarding session.",
    prompt: "Send a quick thank-you note and confirm next onboarding step.",
    timeline: [
      "Onboarding call completed",
      "Client shared positive feedback",
      "Next milestone scheduled for Thursday",
    ],
    people: [{ name: "Camille Reed", role: "Client Success", action: "Confirm next milestone." }],
  },
  {
    name: "Atlas Retail Partners",
    owner: "Marcus Flynn",
    health: 66,
    trend: "Declining",
    risk: "Medium",
    priority: "Keep an eye on",
    response: "9h 18m",
    lastTouch: "2 days ago",
    value: "$121K",
    stage: "Budget review",
    nextStep: "Ask if budget timing changed",
    insight: "Reply speed has slowed across two key contacts.",
    prompt: "A soft check-in would help confirm whether priorities shifted.",
    timeline: [
      "Two delayed replies detected",
      "Budget review mentioned in last meeting",
      "No owner assigned to next decision",
    ],
    people: [{ name: "Tessa Brooks", role: "Director", action: "Ask if budget review changed timing." }],
  },
  {
    name: "BrightPath Consulting",
    owner: "Elaine Monroe",
    health: 88,
    trend: "Stable",
    risk: "Low",
    priority: "Looking good",
    response: "1h 48m",
    lastTouch: "Today",
    value: "$64K",
    stage: "Quarterly review",
    nextStep: "Send review notes",
    insight: "Consistent communication and steady meeting participation.",
    prompt: "Maintain cadence. No major action needed today.",
    timeline: [
      "Quarterly review completed",
      "Meeting participation remains strong",
      "No unresolved client questions detected",
    ],
    people: [{ name: "Drew Holland", role: "Partner", action: "Send quarterly review notes." }],
  },
  {
    name: "Cobalt Manufacturing",
    owner: "Priya Shah",
    health: 72,
    trend: "Stable",
    risk: "Medium",
    priority: "Follow up",
    response: "6h 30m",
    lastTouch: "Yesterday",
    value: "$132K",
    stage: "Expansion discussion",
    nextStep: "Send facility rollout recap",
    insight: "Expansion discussion is active, but next-step ownership is unclear.",
    prompt: "Send a recap with the rollout options and ask who should own the next decision.",
    timeline: [
      "Expansion interest mentioned",
      "Facilities team requested recap",
      "Decision owner not confirmed",
    ],
    people: [{ name: "Owen Price", role: "Facilities Director", action: "Clarify rollout decision owner." }],
  },
  {
    name: "Pioneer Foods",
    owner: "Lena Brooks",
    health: 79,
    trend: "Improving",
    risk: "Low",
    priority: "Good timing",
    response: "3h 10m",
    lastTouch: "Today",
    value: "$89K",
    stage: "Adoption growth",
    nextStep: "Share adoption wins",
    insight: "Usage and meeting participation are both trending up.",
    prompt: "Share a short wins recap while momentum is high.",
    timeline: [
      "Usage increased this week",
      "Team lead praised implementation",
      "Follow-up meeting scheduled",
    ],
    people: [{ name: "Maya Bryant", role: "Operations Manager", action: "Send adoption wins recap." }],
  },
  {
    name: "Meridian Capital",
    owner: "Tom Alvarez",
    health: 61,
    trend: "Declining",
    risk: "Medium",
    priority: "Needs a look",
    response: "14h 12m",
    lastTouch: "3 days ago",
    value: "$156K",
    stage: "Stakeholder change",
    nextStep: "Rebuild stakeholder map",
    insight: "A new stakeholder joined and prior sponsor engagement slowed.",
    prompt: "Send a warm introduction note and confirm who should be included going forward.",
    timeline: [
      "New stakeholder added",
      "Sponsor response rate slowed",
      "Renewal planning paused",
    ],
    people: [{ name: "Kelsey Nolan", role: "New Sponsor", action: "Send introduction and context." }],
  },
  {
    name: "Greenline Energy",
    owner: "Avery Stone",
    health: 84,
    trend: "Stable",
    risk: "Low",
    priority: "Looking good",
    response: "2h 35m",
    lastTouch: "Today",
    value: "$110K",
    stage: "Active success",
    nextStep: "Maintain cadence",
    insight: "Healthy activity and clear ownership across the relationship.",
    prompt: "Maintain current touch cadence. No urgent action needed.",
    timeline: [
      "Weekly check-in completed",
      "Client confirmed next milestone",
      "No unresolved items",
    ],
    people: [{ name: "Noah Pierce", role: "Program Manager", action: "Confirm next check-in agenda." }],
  },
  {
    name: "Lakeshore Hospitality",
    owner: "Rachel Kim",
    health: 69,
    trend: "Stable",
    risk: "Medium",
    priority: "Keep an eye on",
    response: "8h 02m",
    lastTouch: "2 days ago",
    value: "$54K",
    stage: "Service review",
    nextStep: "Send service summary",
    insight: "Recent activity is steady, but service review questions remain open.",
    prompt: "Send a concise service review summary and invite clarification.",
    timeline: [
      "Service review requested",
      "Two open questions remain",
      "Client sentiment neutral",
    ],
    people: [{ name: "Julia Hart", role: "Regional Manager", action: "Send service review summary." }],
  },
  {
    name: "Orchard Lane Group",
    owner: "Ben Wallace",
    health: 93,
    trend: "Improving",
    risk: "Low",
    priority: "Looking good",
    response: "52m",
    lastTouch: "Today",
    value: "$47K",
    stage: "Healthy cadence",
    nextStep: "Celebrate project milestone",
    insight: "Recent milestone was completed and client response is strong.",
    prompt: "Send a quick milestone thank-you while sentiment is positive.",
    timeline: [
      "Milestone completed",
      "Client responded positively",
      "Next step already scheduled",
    ],
    people: [{ name: "Elliot Chase", role: "Founder", action: "Send milestone thank-you." }],
  },
  {
    name: "Ironwood Systems",
    owner: "Dana Lewis",
    health: 55,
    trend: "Declining",
    risk: "High",
    priority: "Needs a look",
    response: "1d 6h",
    lastTouch: "5 days ago",
    value: "$201K",
    stage: "Escalation risk",
    nextStep: "Schedule recovery call",
    insight: "No recent response and two project concerns were raised last week.",
    prompt: "Schedule a recovery call with a clear agenda and ownership.",
    timeline: [
      "Two concerns raised",
      "No response after follow-up",
      "Renewal risk increased",
    ],
    people: [{ name: "Victor Stone", role: "VP Technology", action: "Schedule recovery call." }],
  },
  {
    name: "Briarstone Legal",
    owner: "Michelle Rowe",
    health: 77,
    trend: "Stable",
    risk: "Medium",
    priority: "Follow up",
    response: "4h 22m",
    lastTouch: "Yesterday",
    value: "$73K",
    stage: "Contract review",
    nextStep: "Answer contract question",
    insight: "Contract clarification is open but relationship tone remains positive.",
    prompt: "Answer the contract question in plain language and offer a quick call.",
    timeline: [
      "Contract question received",
      "Legal team requested clarification",
      "Tone remains positive",
    ],
    people: [{ name: "Alana Cross", role: "Managing Partner", action: "Answer contract question." }],
  },
  {
    name: "Silvergate Pharma",
    owner: "Henry Liu",
    health: 82,
    trend: "Improving",
    risk: "Low",
    priority: "Good timing",
    response: "2h 50m",
    lastTouch: "Today",
    value: "$168K",
    stage: "Expansion signal",
    nextStep: "Explore added team rollout",
    insight: "Client mentioned adding two teams during the last call.",
    prompt: "Ask whether the additional team rollout should be scoped this month.",
    timeline: [
      "Expansion mentioned",
      "New team added to meeting",
      "Engagement strong",
    ],
    people: [{ name: "Sofia Bennett", role: "Clinical Ops", action: "Explore added team rollout." }],
  },
  {
    name: "Horizon Education",
    owner: "Chris Martin",
    health: 71,
    trend: "Stable",
    risk: "Medium",
    priority: "Follow up",
    response: "7h 05m",
    lastTouch: "2 days ago",
    value: "$58K",
    stage: "Renewal prep",
    nextStep: "Send renewal prep summary",
    insight: "Renewal timing is approaching and key contact asked for usage highlights.",
    prompt: "Send a short renewal prep summary with usage highlights.",
    timeline: [
      "Renewal prep started",
      "Usage highlight requested",
      "Follow-up not yet sent",
    ],
    people: [{ name: "Megan Torres", role: "District Lead", action: "Send usage highlights." }],
  },
  {
    name: "Clearwater Supply",
    owner: "Janelle Price",
    health: 86,
    trend: "Stable",
    risk: "Low",
    priority: "Looking good",
    response: "1h 35m",
    lastTouch: "Today",
    value: "$96K",
    stage: "Healthy cadence",
    nextStep: "Maintain relationship rhythm",
    insight: "Steady communication and positive response patterns.",
    prompt: "Keep the current rhythm. No immediate action needed.",
    timeline: [
      "Weekly sync completed",
      "No open issues",
      "Positive engagement",
    ],
    people: [{ name: "Derek Miles", role: "Procurement", action: "Confirm next sync." }],
  },
];

const tasks = [
  { client: "HarborTech Services", task: "Return client call regarding delayed project milestone", due: "Waiting too long", priority: "Needs a look" },
  { client: "Summit Insurance Group", task: "Send implementation timeline confirmation", due: "Today", priority: "Follow up" },
  { client: "Northstar Logistics", task: "Confirm pricing review meeting", due: "Tomorrow", priority: "Good timing" },
];

const recentActivity = [
  {
    id: "email-event",
    text: "Chuck Folker sent Austyn Diller an email 8 minutes ago",
    type: "Email",
    subject: "Invitation to Pulse Executive Event — New York City",
    from: "Chuck Folker <chuck.folker@pulse.com>",
    to: "Austyn Diller <austyn.diller@northstarlogistics.com>",
    body:
      "Hi Austyn,\n\nI wanted to personally invite you to the upcoming Pulse Executive Relationship Intelligence event in New York City. We’ll be discussing how leading teams are improving client visibility, reducing missed follow-ups, and identifying relationship risk earlier.\n\nI think this would be especially relevant based on the renewal conversations coming up with your team.\n\nBest,\nChuck",
    summary: "Chuck invited Austyn to a relationship intelligence event and connected the invitation to Northstar’s upcoming renewal timing.",
  },
  {
    id: "reply-event",
    text: "Austyn Diller replied to your email 1 hour ago",
    type: "Reply",
    subject: "Re: Renewal Planning Conversation",
    from: "Austyn Diller <austyn.diller@northstarlogistics.com>",
    to: "Danielle Hart <danielle@pulse.com>",
    body:
      "Hi Danielle,\n\nThanks for sending this over. The renewal timing makes sense, and I’d like to review the engagement data before our next call. Could you send the latest summary of unresolved requests and meeting participation?\n\nBest,\nAustyn",
    summary: "Austyn is engaged and asking for more detail before the renewal conversation. This is a good timing signal.",
  },
  {
    id: "meeting-event",
    text: "Brogan Westra accepted the timeline review meeting",
    type: "Meeting",
    subject: "Implementation Timeline Review Accepted",
    from: "Brogan Westra <brogan@summitinsurance.com>",
    to: "James Carter <james@pulse.com>",
    body: "Brogan accepted the implementation timeline review meeting scheduled for today at 2:30 PM. No additional note was included.",
    summary: "The meeting is confirmed. Pulse recommends preparing open milestones, blockers, and one clear decision request.",
  },
];

const notifications = [
  { title: "HarborTech needs a look", detail: "Client requested a callback and no completed response has been detected.", urgency: "Needs a look" },
  { title: "Summit needs a follow-up", detail: "Timeline confirmation remains unresolved after client follow-up.", urgency: "Follow up" },
  { title: "Northstar is good timing", detail: "Pulse recommends beginning renewal conversation while engagement is high.", urgency: "Good timing" },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function PulseDashboard() {
  const [authState, setAuthState] = useState<"login" | "loading" | "dashboard">("login");
  const [activeTab, setActiveTab] = useState("Overview");
  const [query, setQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [activityView, setActivityView] = useState("Company");
  const [activityDetail, setActivityDetail] = useState<any>(null);
  const [tractionOpen, setTractionOpen] = useState(false);
  const [adminPage, setAdminPage] = useState("Admin");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(true);
  const [density, setDensity] = useState("Comfortable");
  const [insightStyle, setInsightStyle] = useState("Gentle narrative");
  const [showScores, setShowScores] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);
  const [theme, setTheme] = useState("Purple graphite");

  const densityPad = density === "Compact" ? "p-4" : density === "Spacious" ? "p-7" : "p-5";
  const densityGap = density === "Compact" ? "space-y-3" : density === "Spacious" ? "space-y-6" : "space-y-5";

  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        client.owner.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  function handleSignIn(mode: "sandbox" | "standard" = "sandbox") {
    setSandboxMode(mode === "sandbox");
    setAuthState("loading");
    setTimeout(() => setAuthState("dashboard"), 2200);
  }

  function goHome() {
    setActiveTab("Overview");
    setActivityDetail(null);
    setTractionOpen(false);
    setAdminPage("Admin");
    setNotificationsOpen(false);
  }

  function goToTab(tab: string) {
    setActiveTab(tab);
    setActivityDetail(null);
    setTractionOpen(false);
    setNotificationsOpen(false);
    if (tab !== "Admin") setAdminPage("Admin");
  }

  if (authState === "login") return <LoginScreen onSignIn={handleSignIn} />;
  if (authState === "loading") return <PulseLoadingScreen />;

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
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.10),transparent_35%)]" />

      <div className="relative flex min-h-screen">
        <aside className="fixed left-0 top-0 hidden h-screen w-60 border-r border-white/10 bg-gradient-to-b from-[#3a2449] via-[#2c2038] to-[#17131f] px-4 py-5 text-purple-100 shadow-2xl shadow-black/40 lg:block">
          <button onClick={goHome} className="flex w-full items-center gap-3 rounded-3xl p-2 text-left transition hover:bg-white/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#130b19] via-[#3b2448] to-[#a35c9f] text-white shadow-lg shadow-black/20">
              <Activity className="h-6 w-6" />
            </div>
            <div className="leading-none">
              <h1
                className="text-[2.35rem] font-semibold leading-none tracking-[0.015em] text-white"
                style={{ fontFamily: "ui-rounded, Satoshi, Inter, sans-serif" }}
              >
                pulse
              </h1>
              <p className="mt-1.5 text-[11px] font-medium tracking-wide text-purple-200">Relationship Intelligence</p>
            </div>
          </button>

          <nav className="mt-7 space-y-2">
            {navigation.map((item) => {
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
            <p className="mt-1 text-sm font-medium text-white">{sandboxMode ? "Sandbox Demo" : "ClientPulse Team"}</p>
          </div>
        </aside>

        <section className="flex-1 px-4 pb-24 pt-5 sm:px-5 lg:ml-60 lg:px-8 lg:pb-6 xl:px-10">
          {sandboxMode && (
            <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-purple-100 shadow-lg shadow-black/10">
              Sandbox mode is on — this workspace uses sample clients and demo activity.
            </div>
          )}

          {activeTab === "Overview" && (
            <header className="relative mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-medium text-purple-100">{getGreeting()}, Danielle.</p>
                <h2 className="mt-1 text-sm font-medium tracking-wide text-purple-300">
                  Here&apos;s what we have:
                </h2>
              </div>

              <NotificationBell
                notificationsOpen={notificationsOpen}
                setNotificationsOpen={setNotificationsOpen}
                setSelectedClient={setSelectedClient}
                goToTab={goToTab}
              />
            </header>
          )}

          {activeTab === "Overview" && (
            <div className={densityGap}>
              <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
                <Panel title="A few things may need your attention." subtitle="Executive Focus Panel" pad={densityPad}>
                  <p className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs tracking-wide text-purple-100">
                    Calm intelligence, not dashboard noise.
                  </p>
                  <p className="max-w-2xl text-sm leading-7 text-purple-100">
                    {insightStyle === "Short bullets"
                      ? "Three priority signals surfaced from client communication, timing, and engagement patterns."
                      : insightStyle === "Visual only"
                      ? "A few relationship signals are ready for review."
                      : "Pulse filters fragmented communication across Outlook, Zoom, Teams, calls, and CRM data into the few things worth reviewing."}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => goToTab("Intelligence")} className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-[#17141c] transition hover:scale-[1.01] hover:bg-purple-50">
                      Review Attention Items
                    </button>
                    <button onClick={() => goToTab("Activity")} className="rounded-2xl border border-white/18 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                      View Account Timeline
                    </button>
                  </div>
                </Panel>

                <Panel title="Today’s focus" subtitle="Attention Queue" pad={densityPad}>
                  <SummaryButton label="Needs a look" value="HarborTech Services" showAlert onClick={() => { setSelectedClient(clients[2]); goToTab("Accounts"); }} />
                  <SummaryButton label="Follow up" value="Summit Insurance Group" onClick={() => { setSelectedClient(clients[1]); goToTab("Accounts"); }} />
                  <SummaryButton label="Good timing" value="Northstar Logistics" onClick={() => { setSelectedClient(clients[0]); goToTab("Accounts"); }} />
                  <SummaryButton label="Looking good" value="86%" onClick={() => { setSelectedClient(clients[0]); goToTab("Accounts"); }} />
                </Panel>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard icon={Users} label="Tracked clients" value="128" detail="Across 14 account owners" />
                <MetricCard icon={Clock} label="Avg response" value="3h 18m" detail="18% faster than last week" />
                <MetricCard icon={CheckCircle2} label="Closed follow-ups" value="42" detail="This week" />
                <MetricCard icon={Activity} label="Looking good" value="86%" detail="Healthy relationship signals" />
              </section>

              {showScores && <HealthScoreGrid clients={clients} setSelectedClient={setSelectedClient} goToTab={goToTab} pad={densityPad} />}

              <RecentAccountsCard
                clients={clients.slice(0, 10)}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                pad={densityPad}
              />
            </div>
          )}

          {activeTab === "Accounts" && (
            <div className="space-y-5">
              <div className="grid gap-5 xl:grid-cols-2">
                <RecentAccountsCard
                  clients={clients.slice(0, 10)}
                  selectedClient={selectedClient}
                  setSelectedClient={setSelectedClient}
                  pad={densityPad}
                />
                {selectedClient ? (
                  <ClientDetail client={selectedClient} showTimeline={showTimeline} pad={densityPad} insightStyle={insightStyle} compact />
                ) : (
                  <EmptyClientState pad={densityPad} />
                )}
              </div>

              <FullAccountsList clients={filteredClients} setSelectedClient={setSelectedClient} query={query} setQuery={setQuery} pad={densityPad} />
            </div>
          )}

          {activeTab === "Activity" &&
            (activityDetail ? (
              <ActivityDetail item={activityDetail} onBack={() => setActivityDetail(null)} pad={densityPad} />
            ) : tractionOpen ? (
              <TractionDetail onBack={() => setTractionOpen(false)} pad={densityPad} />
            ) : (
              <ActivityPanel
                activityView={activityView}
                setActivityView={setActivityView}
                setActivityDetail={setActivityDetail}
                setTractionOpen={setTractionOpen}
                pad={densityPad}
              />
            ))}

          {activeTab === "Intelligence" && <IntelligencePanel pad={densityPad} insightStyle={insightStyle} />}
          {activeTab === "Tasks" && <TasksPanel pad={densityPad} />}
          {activeTab === "AI Task Manager" && <AITaskManager pad={densityPad} />}
          {activeTab === "Reports" && <ReportsPanel pad={densityPad} />}
          {activeTab === "Admin" &&
            (adminPage === "Admin" ? (
              <AdminPanel
                setAdminPage={setAdminPage}
                sandboxMode={sandboxMode}
                setSandboxMode={setSandboxMode}
                density={density}
                setDensity={setDensity}
                insightStyle={insightStyle}
                setInsightStyle={setInsightStyle}
                showScores={showScores}
                setShowScores={setShowScores}
                showTimeline={showTimeline}
                setShowTimeline={setShowTimeline}
                theme={theme}
                setTheme={setTheme}
                pad={densityPad}
              />
            ) : (
              <PreferencesPanel
                setAdminPage={setAdminPage}
                theme={theme}
                setTheme={setTheme}
                pad={densityPad}
                density={density}
                insightStyle={insightStyle}
                showScores={showScores}
                showTimeline={showTimeline}
              />
            ))}
        </section>
      </div>

      <MobileNav activeTab={activeTab} goToTab={goToTab} />
    </main>
  );
}

function NotificationBell({ notificationsOpen, setNotificationsOpen, setSelectedClient, goToTab }: any) {
  return (
    <div className="relative">
      <button
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        className="relative rounded-2xl border border-white/15 bg-gradient-to-br from-[#24112f] via-[#3b2448] to-[#8b5b86] p-3 text-white shadow-lg shadow-black/20 transition hover:scale-[1.03]"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#b86aa6] text-xs font-semibold text-white">3</span>
      </button>

      {notificationsOpen && (
        <div className="absolute right-0 top-14 z-50 w-[340px] rounded-3xl border border-white/10 bg-[#17131f] p-4 shadow-2xl shadow-black/40 sm:w-[360px]">
          <p className="text-sm text-purple-100">Important updates</p>
          <h3 className="mt-1 text-xl font-medium text-white">A few things worth reviewing</h3>

          <div className="mt-4 space-y-3">
            {notifications.map((item) => (
              <button
                key={item.title}
                onClick={() => {
                  if (item.title.includes("HarborTech")) setSelectedClient(clients[2]);
                  else if (item.title.includes("Summit")) setSelectedClient(clients[1]);
                  else setSelectedClient(clients[0]);
                  goToTab("Accounts");
                }}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left transition hover:bg-white/[0.10]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{item.title}</p>
                  <StatusChip label={item.urgency} />
                </div>
                <p className="mt-2 text-sm leading-6 text-purple-100">{item.detail}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
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
            See relationship risk before it becomes a problem.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-purple-100">
            Pulse turns scattered client communication into a calm, focused view of what needs attention, what is trending well, and where to follow up next.
          </p>

          <div className="mt-10 grid max-w-2xl gap-4 md:grid-cols-3">
            <MarketingCard title="Attention Queue" detail="Prioritized next actions without alert fatigue." />
            <MarketingCard title="Client Timeline" detail="A living memory of emails, calls, meetings, and signals." />
            <MarketingCard title="AI Insights" detail="Gentle recommendations that help teams act sooner." />
          </div>
        </section>

        <section className="mx-auto w-full max-w-md animate-[fadeIn_700ms_ease-out] rounded-[2rem] border border-white/10 bg-white/[0.075] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#130b19] via-[#3b2448] to-[#a35c9f] text-white shadow-lg shadow-black/30">
              <Activity className="h-7 w-7" />
            </div>
            <h1
              className="mt-5 text-5xl font-semibold tracking-[0.015em]"
              style={{ fontFamily: "ui-rounded, Satoshi, Inter, sans-serif" }}
            >
              pulse
            </h1>
            <div className="mx-auto mt-2 h-px w-12 rounded-full bg-[#b98bb1]" />
            <p className="mt-4 text-xl font-light text-purple-100">Relationship Intelligence</p>
          </div>

          <div className="mt-10">
            <p className="text-sm text-purple-200">Welcome back</p>
            <h2 className="mt-1 text-2xl font-medium">Sign in to your workspace</h2>
          </div>

          <div className="mt-7 space-y-4">
            <input
              defaultValue="danielle@pulse.com"
              className="h-14 w-full rounded-2xl border border-white/15 bg-white/[0.10] px-4 text-white outline-none placeholder:text-purple-200 focus:border-white/35 focus:ring-4 focus:ring-white/10"
              placeholder="Email"
            />
            <input
              defaultValue="relationshipintel"
              type="password"
              className="h-14 w-full rounded-2xl border border-white/15 bg-white/[0.10] px-4 text-white outline-none placeholder:text-purple-200 focus:border-white/35 focus:ring-4 focus:ring-white/10"
              placeholder="Password"
            />

            <button
              onClick={() => onSignIn("sandbox")}
              className="mt-3 h-14 w-full rounded-2xl bg-[#d8c9df] px-5 text-sm font-semibold text-[#17141c] shadow-lg shadow-black/25 transition hover:scale-[1.01] hover:bg-white"
            >
              Try Sandbox Demo
            </button>

            <button
              onClick={() => onSignIn("standard")}
              className="h-12 w-full rounded-2xl border border-white/15 bg-white/[0.08] text-sm font-medium text-purple-100 transition hover:bg-white/[0.13]"
            >
              Sign In
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-purple-200">
            <button className="hover:text-white">Forgot password?</button>
            <button className="hover:text-white">Create workspace</button>
          </div>

          <p className="mt-8 text-center text-xs text-purple-300">© 2026 ClientPulse</p>
        </section>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

function PulseLoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#111118] via-[#1a1521] to-[#050507] px-5 text-white">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#130b19] via-[#3b2448] to-[#a35c9f] shadow-2xl shadow-black/30">
          <Activity className="h-9 w-9 animate-pulse" />
        </div>

        <div className="relative mt-10 h-24 overflow-hidden rounded-3xl border border-white/10 bg-black/20 px-6 shadow-2xl shadow-black/30">
          <div className="absolute left-0 top-1/2 h-px w-full bg-purple-200/15" />
          <svg viewBox="0 0 600 120" className="absolute left-0 top-0 h-full w-[1200px] animate-heartbeat" preserveAspectRatio="none">
            <path
              d="M0 60 L60 60 L75 60 L88 25 L105 95 L125 60 L180 60 L195 60 L208 45 L220 72 L235 60 L300 60 L360 60 L375 60 L388 25 L405 95 L425 60 L480 60 L495 60 L508 45 L520 72 L535 60 L600 60"
              fill="none"
              stroke="#d8c9df"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-r from-[#111118] via-transparent to-[#111118]" />
        </div>

        <h1 className="mt-8 text-3xl font-medium">{getGreeting()}, Danielle.</h1>
        <p className="mt-3 text-purple-100">Reading your relationship signals…</p>

        <style jsx>{`
          @keyframes heartbeat {
            0% { transform: translateX(0); }
            100% { transform: translateX(-600px); }
          }
          .animate-heartbeat { animation: heartbeat 2.2s linear infinite; }
        `}</style>
      </div>
    </main>
  );
}

function MarketingCard({ title, detail }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
      <p className="font-medium text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-purple-100">{detail}</p>
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
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function HealthScoreGrid({ clients, setSelectedClient, goToTab, pad }: any) {
  return (
    <Panel title="Client health signals" subtitle="A simple view of relationship movement." pad={pad}>
      <div className="grid gap-4 md:grid-cols-3">
        {clients.slice(0, 6).map((client: any) => (
          <button
            key={client.name}
            onClick={() => {
              setSelectedClient(client);
              goToTab("Accounts");
            }}
            className="rounded-3xl border border-white/10 bg-white/[0.055] p-4 text-left transition hover:bg-white/[0.10]"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{client.name}</p>
              {client.trend === "Improving" ? (
                <TrendingUp className="h-5 w-5 text-emerald-200" />
              ) : client.trend === "Declining" ? (
                <TrendingDown className="h-5 w-5 text-pink-200" />
              ) : (
                <Activity className="h-5 w-5 text-purple-100" />
              )}
            </div>
            <p className="mt-3 text-4xl font-medium">{client.health}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-purple-100">{client.trend} · {client.value}</p>
              <StatusChip label={client.priority} />
            </div>
            <MiniSparkline trend={client.trend} />
          </button>
        ))}
      </div>
    </Panel>
  );
}

function MiniSparkline({ trend }: any) {
  const path =
    trend === "Improving"
      ? "M0 34 C20 32 28 24 42 25 C58 27 70 15 90 10"
      : trend === "Declining"
      ? "M0 12 C20 14 28 22 42 21 C58 20 70 32 90 36"
      : "M0 24 C20 22 32 26 45 24 C60 22 75 24 90 23";

  return (
    <svg viewBox="0 0 90 45" className="mt-4 h-12 w-full">
      <path d={path} fill="none" stroke="rgba(255,255,255,.68)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function RecentAccountsCard({ clients, selectedClient, setSelectedClient, pad }: any) {
  return (
    <Panel title="Recent Accounts" subtitle="Recently active relationships." pad={pad}>
      <div className="max-h-[265px] space-y-3 overflow-y-auto pr-2">
        {clients.map((client: any) => (
          <button
            key={client.name}
            onClick={() => setSelectedClient(client)}
            className={`w-full rounded-3xl border p-4 text-left transition ${
              selectedClient?.name === client.name ? "border-white/35 bg-white/[0.12]" : "border-white/10 bg-white/[0.055] hover:bg-white/[0.10]"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">{client.name}</p>
                <p className="mt-1 text-sm text-purple-100">{client.owner} · {client.stage}</p>
              </div>
              <StatusChip label={client.priority} />
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function FullAccountsList({ clients, setSelectedClient, query, setQuery, pad }: any) {
  return (
    <Panel title="Account list" subtitle="Scrollable CRM-style relationship view." pad={pad}>
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-200" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search accounts"
          className="w-full rounded-2xl border border-white/15 bg-white/[0.07] py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-purple-200 focus:ring-4 focus:ring-white/10"
        />
      </div>

      <div className="max-h-[520px] overflow-y-auto rounded-3xl border border-white/10">
        {clients.map((client: any) => (
          <button
            key={client.name}
            onClick={() => setSelectedClient(client)}
            className="grid w-full grid-cols-1 gap-3 border-b border-white/10 bg-white/[0.045] px-4 py-4 text-left transition hover:bg-white/[0.09] md:grid-cols-[1.3fr_.8fr_.8fr_.8fr_.8fr_40px]"
          >
            <div>
              <p className="font-medium text-white">{client.name}</p>
              <p className="mt-1 text-xs text-purple-100">{client.stage}</p>
            </div>
            <div>
              <p className="text-xs text-purple-300">Owner</p>
              <p className="text-sm text-white">{client.owner}</p>
            </div>
            <div>
              <p className="text-xs text-purple-300">Value</p>
              <p className="text-sm text-white">{client.value}</p>
            </div>
            <div>
              <p className="text-xs text-purple-300">Last touch</p>
              <p className="text-sm text-white">{client.lastTouch}</p>
            </div>
            <div>
              <p className="text-xs text-purple-300">Next step</p>
              <p className="text-sm text-white">{client.nextStep}</p>
            </div>
            <div className="flex items-center justify-end">
              <PulseMark health={client.health} />
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function PulseMark({ health }: any) {
  const color = health >= 82 ? "#86efac" : health >= 70 ? "#facc15" : health >= 60 ? "#c4b5fd" : "#f9a8d4";
  return (
    <svg viewBox="0 0 60 28" className="h-8 w-12">
      <path
        d="M2 14 H12 L16 7 L22 22 L28 14 H38 L42 10 L47 18 L52 14 H58"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClientDetail({ client, showTimeline, pad, insightStyle, compact = false }: any) {
  return (
    <div className="space-y-5">
      <Panel title={client.name} subtitle={`Owned by ${client.owner}`} pad={pad}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
            <p className="text-sm text-purple-100">Health score</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-4xl font-medium">{client.health}</p>
              <RiskBadge risk={client.risk} />
            </div>
            <p className="mt-3 text-sm leading-6 text-purple-50">
              {insightStyle === "Short bullets"
                ? `Status: ${client.priority}. Trend: ${client.trend}. Last touch: ${client.lastTouch}.`
                : insightStyle === "Visual only"
                ? `${client.priority} · ${client.trend}`
                : client.insight}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
            <p className="text-sm text-purple-100">Suggested outreach</p>
            <p className="mt-2 text-base font-medium leading-7 text-white">{client.prompt}</p>
          </div>
        </div>

        {!compact && (
          <div className="grid gap-4 md:grid-cols-3">
            <MetricMini label="Account value" value={client.value} detail="Estimated ARR" />
            <MetricMini label="Response time" value={client.response} detail="Current average" />
            <MetricMini label="Last touch" value={client.lastTouch} detail={client.trend} />
          </div>
        )}
      </Panel>

      {showTimeline && !compact && (
        <Panel title="Relationship timeline" subtitle="The memory of the relationship." pad={pad}>
          {client.timeline.map((item: string) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-sm text-purple-50">
              {item}
            </div>
          ))}
        </Panel>
      )}

      {!compact && (
        <Panel title="People needing attention" subtitle="Useful when more than one stakeholder is active inside a company." pad={pad}>
          <div className="grid gap-4 md:grid-cols-2">
            {client.people.map((person: any) => (
              <div key={person.name} className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
                <p className="font-medium">{person.name}</p>
                <p className="mt-1 text-sm text-purple-100">{person.role}</p>
                <p className="mt-3 text-sm text-purple-50">{person.action}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

function EmptyClientState({ pad }: any) {
  return (
    <Panel title="Select an account" subtitle="Client page with insights" pad={pad}>
      <p className="leading-7 text-purple-100">
        Choose an account from Recent Accounts or the full account list to view health score, suggested outreach, timeline, people, and relationship context.
      </p>
    </Panel>
  );
}

function ActivityPanel({ activityView, setActivityView, setActivityDetail, setTractionOpen, pad }: any) {
  const peopleRows = clients.flatMap((client) =>
    client.people.map((person) => ({ ...person, company: client.name, priority: client.priority }))
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Upcoming Activity" subtitle="Scroll through what is coming up next." pad={pad}>
          <div className="flex w-fit rounded-2xl border border-white/15 bg-white/[0.06] p-1">
            {["Company", "People"].map((view) => (
              <button
                key={view}
                onClick={() => setActivityView(view)}
                className={`rounded-xl px-4 py-2 text-sm ${activityView === view ? "bg-white text-[#17141c]" : "text-white"}`}
              >
                {view}
              </button>
            ))}
          </div>

          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-2">
            {activityView === "Company"
              ? clients.map((client) => (
                  <div key={client.name} className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{client.name}</p>
                      <StatusChip label={client.priority} />
                    </div>
                    <p className="mt-2 text-sm text-purple-100">{client.prompt}</p>
                  </div>
                ))
              : peopleRows.map((person) => (
                  <div key={`${person.company}-${person.name}`} className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{person.name}</p>
                      <StatusChip label={person.priority} />
                    </div>
                    <p className="mt-1 text-sm text-purple-100">
                      {person.company} · {person.role}
                    </p>
                    <p className="mt-2 text-sm text-purple-50">{person.action}</p>
                  </div>
                ))}
          </div>
        </Panel>

        <button
          onClick={() => setTractionOpen(true)}
          className="rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.10),rgba(255,255,255,0.045))] p-5 text-left text-white shadow-xl shadow-black/25 transition hover:scale-[1.01]"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-purple-200">Traction</p>
          <h3 className="mt-2 text-2xl font-medium">Engagement performance</h3>
          <div className="mt-5 grid gap-3">
            <StatRow label="Email engagement" value="68%" />
            <StatRow label="Response efficiency" value="+22%" />
            <StatRow label="Meeting acceptance" value="81%" />
            <StatRow label="Follow-up completion" value="74%" />
          </div>
          <p className="mt-5 text-sm leading-6 text-purple-100">
            Engagement is improving overall, but two accounts still have open loops worth reviewing.
          </p>
        </button>
      </div>

      <Panel title="Recent Activity" subtitle="Communication activity with contextual drill-down." pad={pad}>
        {recentActivity.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivityDetail(item)}
            className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-white/[0.055] p-4 text-left transition hover:bg-white/[0.10]"
          >
            <div>
              <p className="font-medium">{item.text}</p>
              <p className="mt-1 text-sm text-purple-100">{item.type}</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-purple-100" />
          </button>
        ))}
      </Panel>
    </div>
  );
}

function ActivityDetail({ item, onBack, pad }: any) {
  return (
    <Panel title={item.subject} subtitle={item.type} pad={pad}>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-purple-100 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to Activity
      </button>

      <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
        <p className="text-sm text-purple-100">From: {item.from}</p>
        <p className="text-sm text-purple-100">To: {item.to}</p>
        <div className="mt-5 whitespace-pre-line rounded-2xl bg-white/[0.06] p-4 text-sm leading-7 text-purple-50">{item.body}</div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
        <p className="text-sm text-purple-100">AI summary</p>
        <p className="mt-2 leading-7 text-white">{item.summary}</p>
      </div>
    </Panel>
  );
}

function TractionDetail({ onBack, pad }: any) {
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-purple-100 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to Activity
      </button>
      <Panel title="Activity engagement is improving, but renewal activity needs attention." subtitle="Traction insights" pad={pad}>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricMini label="Engagement rate" value="68%" detail="+9% this week" />
          <MetricMini label="Response speed" value="2h 14m" detail="22% faster" />
          <MetricMini label="Meeting conversion" value="41%" detail="7 accepted" />
          <MetricMini label="Open loops" value="5" detail="2 needs a look" />
        </div>
      </Panel>
    </div>
  );
}

function AITaskManager({ pad }: any) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_.8fr]">
      <Panel title="How can I help?" subtitle="AI Task Manager" pad={pad}>
        <textarea
          placeholder="Ask Pulse to summarize open questions, draft a follow-up, identify accounts that need a look, or prepare your next client action..."
          className="min-h-44 w-full rounded-3xl border border-white/30 bg-[linear-gradient(180deg,#fbf8fc_0%,#eee8f3_100%)] p-5 text-[#17141c] shadow-inner shadow-white/50 outline-none placeholder:text-[#5b5262] focus:ring-4 focus:ring-white/20"
        />
      </Panel>

      <Panel title="Suggested prompts" subtitle="Common ways teams use Pulse." pad={pad}>
        <SignalItem icon={Mail} title="Draft a follow-up" detail="Create a response to an unanswered client request." />
        <SignalItem icon={AlertTriangle} title="Find what needs a look" detail="Show accounts with declining communication quality." />
        <SignalItem icon={Calendar} title="Prepare my day" detail="Summarize meetings, open items, and recommended actions." />
      </Panel>
    </div>
  );
}

function AdminPanel({
  setAdminPage,
  sandboxMode,
  setSandboxMode,
  density,
  setDensity,
  insightStyle,
  setInsightStyle,
  showScores,
  setShowScores,
  showTimeline,
  setShowTimeline,
  theme,
  setTheme,
  pad,
}: any) {
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-white hover:bg-white/[0.10]">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Integrations" subtitle="Connected communication systems." pad={pad}>
          <div className="flex justify-end">
            <button className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-[#17141c] hover:bg-purple-50">
              Connect Integration
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Integration name="Outlook" status="Connected" icon={Mail} />
            <Integration name="Zoom" status="Connected" icon={Video} />
            <Integration name="Teams" status="Pending" icon={MessageSquare} />
            <Integration name="CRM" status="Not connected" icon={Users} />
          </div>
        </Panel>

        <Panel title="Manage Team" subtitle="Workspace people and permissions." pad={pad}>
          <button className="flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-[#17141c] hover:bg-purple-50">
            <UserPlus className="h-4 w-4" />
            Invite Team Member
          </button>

          <div className="space-y-3">
            {[
              ["Danielle Hart", "Admin", "14 accounts", "Active today"],
              ["James Carter", "Relationship Lead", "11 accounts", "Active 1h ago"],
              ["Nora Patel", "Viewer", "6 accounts", "Active yesterday"],
            ].map((row) => (
              <div key={row[0]} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{row[0]}</p>
                    <p className="mt-1 text-sm text-purple-100">{row[2]} · {row[3]}</p>
                  </div>
                  <span className="rounded-full bg-white/12 px-3 py-1 text-xs text-purple-100">{row[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Preferences" subtitle="These settings change the demo view immediately." pad={pad}>
          <div className="grid gap-4 md:grid-cols-2">
            <PreferenceToggle label="Sandbox mode" value={sandboxMode} setValue={setSandboxMode} />
            <PreferenceToggle label="Show health scores" value={showScores} setValue={setShowScores} />
            <PreferenceToggle label="Show client timeline" value={showTimeline} setValue={setShowTimeline} />
          </div>

          <PreferenceSelect label="Card density" value={density} setValue={setDensity} options={["Compact", "Comfortable", "Spacious"]} />
          <PreferenceSelect label="Insight style" value={insightStyle} setValue={setInsightStyle} options={["Short bullets", "Gentle narrative", "Visual only"]} />
          <PreferenceSelect label="Theme" value={theme} setValue={setTheme} options={["Purple graphite", "Soft graphite", "Deep blush"]} />

          <button onClick={() => setAdminPage("Preferences")} className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-left hover:bg-white/[0.10]">
            Open theme preferences
          </button>
        </Panel>

        <PreferencePreview density={density} insightStyle={insightStyle} theme={theme} showScores={showScores} showTimeline={showTimeline} />
      </div>
    </div>
  );
}

function PreferencePreview({ density, insightStyle, theme, showScores, showTimeline }: any) {
  return (
    <Panel title="Live Preview" subtitle="See preference changes immediately.">
      <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
        <p className="text-sm text-purple-100">Theme</p>
        <p className="mt-1 text-lg font-medium">{theme}</p>
      </div>

      <div className={`rounded-3xl border border-white/10 bg-white/[0.055] ${density === "Compact" ? "p-3" : density === "Spacious" ? "p-6" : "p-4"}`}>
        <div className="flex items-center justify-between">
          <p className="font-medium">Preview Account</p>
          <StatusChip label="Good timing" />
        </div>
        {showScores && <p className="mt-3 text-3xl font-medium">84</p>}
        <p className="mt-2 text-sm text-purple-100">
          {insightStyle === "Short bullets"
            ? "Status: Good timing. Trend: Improving."
            : insightStyle === "Visual only"
            ? "Good timing · Improving"
            : "Engagement is improving and a renewal conversation would be well-timed."}
        </p>
        {showTimeline && (
          <div className="mt-4 rounded-2xl bg-white/[0.06] p-3 text-sm text-purple-100">
            Timeline preview is visible.
          </div>
        )}
      </div>
    </Panel>
  );
}

function PreferencesPanel({ setAdminPage, theme, setTheme, pad, density, insightStyle, showScores, showTimeline }: any) {
  return (
    <div className="grid gap-5 xl:grid-cols-[.45fr_1fr]">
      <Panel title="Preferences" subtitle="Workspace settings" pad={pad}>
        <button onClick={() => setAdminPage("Admin")} className="flex items-center gap-2 text-sm text-purple-100 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </button>
        <button className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-left hover:bg-white/[0.10]">
          <span>Customize Theme</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </Panel>

      <div className="space-y-5">
        <Panel title="Customize Theme" subtitle="Pick a working demo theme." pad={pad}>
          <PreferenceSelect label="Theme" value={theme} setValue={setTheme} options={["Purple graphite", "Soft graphite", "Deep blush"]} />
          <p className="text-purple-100">Current theme: {theme}. The page background updates immediately.</p>
        </Panel>

        <PreferencePreview density={density} insightStyle={insightStyle} theme={theme} showScores={showScores} showTimeline={showTimeline} />
      </div>
    </div>
  );
}

function PreferenceToggle({ label, value, setValue }: any) {
  return (
    <button onClick={() => setValue(!value)} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-left hover:bg-white/[0.10]">
      <span>{label}</span>
      <span className={`rounded-full px-3 py-1 text-xs ${value ? "bg-emerald-100 text-emerald-800" : "bg-white/12 text-purple-100"}`}>
        {value ? "On" : "Off"}
      </span>
    </button>
  );
}

function PreferenceSelect({ label, value, setValue, options }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
      <p className="text-sm text-purple-100">{label}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {options.map((option: string) => (
          <button
            key={option}
            onClick={() => setValue(option)}
            className={`rounded-2xl px-3 py-2 text-xs transition ${
              value === option ? "bg-white text-[#17141c] shadow-lg shadow-black/10" : "bg-white/[0.07] text-purple-100 hover:bg-white/[0.12]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function IntelligencePanel({ pad, insightStyle }: any) {
  const subtitle =
    insightStyle === "Short bullets"
      ? "Compact AI observations."
      : insightStyle === "Visual only"
      ? "Signal-based relationship movement."
      : "Gentle, advisory relationship intelligence.";

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <Panel title="AI insights" subtitle={subtitle} pad={pad}>
        <SignalItem icon={TrendingUp} title="Northstar is gaining momentum" detail="Engagement improved after the last proposal follow-up." />
        <SignalItem icon={Lightbulb} title="Summit needs clarity" detail="Implementation timeline language suggests the client is waiting for a concise confirmation." />
        <SignalItem icon={MessageSquare} title="HarborTech needs a human touchpoint" detail="A direct response from the account owner would likely reduce relationship friction." />
        <SignalItem icon={Users} title="Coverage gap detected" detail="Two accounts rely on a single relationship owner for most communication." />
      </Panel>

      <Panel title="Suggested outreach" subtitle="Low-pressure message starters." pad={pad}>
        <SignalItem icon={Mail} title="Gentle check-in" detail="Wanted to circle back on the timeline question and make sure we are aligned." />
        <SignalItem icon={Calendar} title="Meeting prep" detail="Bring one clear decision request and a concise milestone summary." />
        <SignalItem icon={Activity} title="Relationship nurture" detail="Northstar is showing good engagement. A renewal conversation is well-timed." />
      </Panel>
    </div>
  );
}

function TasksPanel({ pad }: any) {
  return (
    <Panel title="Tasks" subtitle="Follow-ups generated from emails, meetings, calls, and chats." pad={pad}>
      <div className="grid gap-4 md:grid-cols-3">
        {tasks.map((item) => (
          <div key={item.task} className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">{item.client}</p>
              <StatusChip label={item.priority} />
            </div>
            <p className="mt-3 text-sm leading-6 text-purple-50">{item.task}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-purple-100">
              <Calendar className="h-4 w-4" />
              Due: {item.due}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ReportsPanel({ pad }: any) {
  return (
    <div className="space-y-5">
      <Panel title="Describe the report you want to make." subtitle="" pad={pad}>
        <textarea
          placeholder="Example: Show unanswered client requests by account owner for the last 30 days..."
          className="min-h-28 w-full max-w-3xl rounded-3xl border border-white/30 bg-[linear-gradient(180deg,#fbf8fc_0%,#eee8f3_100%)] p-5 text-[#17141c] shadow-inner shadow-white/50 outline-none placeholder:text-[#5b5262] focus:ring-4 focus:ring-white/20"
        />
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="Weekly digest preview" subtitle="A calm Monday summary." pad={pad}>
          <p className="leading-7 text-purple-50">
            3 relationships need a look, 2 are trending positively, and 1 account has an unanswered implementation question.
            Suggested priority: HarborTech callback, Summit timeline confirmation, Northstar renewal opener.
          </p>
        </Panel>

        <Panel title="Account trend table" subtitle="A simple technical view of where attention is needed." pad={pad}>
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="grid grid-cols-4 bg-gradient-to-r from-white/[0.13] to-white/[0.06] px-4 py-3 text-sm font-medium text-purple-50">
              <div>Account</div>
              <div>Open Items</div>
              <div>Response</div>
              <div>Trend</div>
            </div>
            {[
              ["HarborTech", "5", "21h 05m", "Needs a look"],
              ["Summit", "3", "5h 44m", "Follow up"],
              ["Northstar", "1", "1h 12m", "Good timing"],
              ["Evergreen", "0", "2h 08m", "Looking good"],
            ].map((row) => (
              <div key={row[0]} className="grid grid-cols-4 border-t border-white/10 px-4 py-3 text-sm text-purple-100">
                <div className="text-white">{row[0]}</div>
                <div>{row[1]}</div>
                <div>{row[2]}</div>
                <div>{row[3]}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children, pad = "p-5" }: any) {
  return (
    <div className={`rounded-[1.65rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.095),rgba(255,255,255,0.040))] ${pad} text-white shadow-xl shadow-black/25 backdrop-blur-sm`}>
      <h3 className="text-[1.35rem] font-medium tracking-[-0.015em] text-white">{title}</h3>
      {subtitle !== "" && <p className="mt-1.5 text-sm font-normal text-purple-200/85">{subtitle}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function SignalItem({ icon: Icon, title, detail }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="mt-1 text-sm text-purple-100">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3">
      <span className="text-sm text-purple-100">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function MetricMini({ label, value, detail }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-purple-200/80">{label}</p>
      <p className="mt-2 text-3xl font-medium">{value}</p>
      <p className="mt-1 text-sm text-purple-100">{detail}</p>
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
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[label] || "bg-white/15 text-purple-100"}`}>{label}</span>;
}

function RiskBadge({ risk }: any) {
  const styles: any = {
    Low: "bg-emerald-50 text-emerald-700",
    Medium: "bg-amber-50 text-amber-700",
    High: "bg-pink-50 text-pink-700",
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[risk]}`}>{risk} risk</span>;
}

function Integration({ name, status, icon: Icon }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
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

function MobileNav({ activeTab, goToTab }: any) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#17131f]/95 px-3 py-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: "Home", tab: "Overview", icon: Activity },
          { label: "Activity", tab: "Activity", icon: Clock },
          { label: "AI", tab: "AI Task Manager", icon: Bot },
          { label: "Reports", tab: "Reports", icon: BarChart3 },
          { label: "Admin", tab: "Admin", icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.tab}
              onClick={() => goToTab(item.tab)}
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs transition ${
                activeTab === item.tab ? "bg-white/15 text-white" : "text-purple-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="mb-1 h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}