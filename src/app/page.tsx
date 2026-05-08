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
  Palette,
  Search,
  Settings,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";

const navigation = [
  "Overview",
  "Accounts",
  "Activity",
  "Intelligence",
  "Tasks",
  "AI Task Manager",
  "Reports",
  "Admin",
];

const clients = [
  {
    name: "Northstar Logistics",
    owner: "Sarah Mitchell",
    health: 91,
    risk: "Low",
    response: "1h 12m",
    lastTouch: "Today",
    insight: "Healthy cadence. Proposal follow-up completed this morning.",
  },
  {
    name: "Summit Insurance Group",
    owner: "James Carter",
    health: 74,
    risk: "Medium",
    response: "5h 44m",
    lastTouch: "Yesterday",
    insight: "Implementation timeline question still needs confirmation.",
  },
  {
    name: "HarborTech Services",
    owner: "Jasper Milligan",
    health: 58,
    risk: "High",
    response: "21h 05m",
    lastTouch: "4 days ago",
    insight: "Callback request is overdue and meeting sentiment declined.",
  },
];

const tasks = [
  {
    client: "HarborTech Services",
    task: "Return client call regarding delayed project milestone",
    due: "Overdue",
    priority: "High",
  },
  {
    client: "Summit Insurance Group",
    task: "Send implementation timeline confirmation",
    due: "Today",
    priority: "Medium",
  },
  {
    client: "Northstar Logistics",
    task: "Confirm pricing review meeting",
    due: "Tomorrow",
    priority: "Low",
  },
];

const activityAccounts = [
  {
    name: "Northstar Logistics",
    person: "Austyn Diller",
    aiSummary: "You should start renewal conversations with Austyn Diller today.",
    upcoming: "Renewal planning window opens today.",
  },
  {
    name: "Summit Insurance Group",
    person: "Brogan Westra",
    aiSummary: "You have a meeting with Brogan Westra in 26 minutes.",
    upcoming: "Implementation timeline review at 2:30 PM.",
  },
  {
    name: "HarborTech Services",
    person: "Jasper Milligan",
    aiSummary: "You should follow up with Jasper Milligan before end of day.",
    upcoming: "Open callback request is approaching escalation.",
  },
];

const recentActivity = [
  {
    id: "email-event",
    text: "Chuck Folker sent Austyn Diller an email 8 minutes ago",
    type: "Email",
  },
  {
    id: "reply-event",
    text: "Austyn Diller replied to your email 1 hour ago",
    type: "Reply",
  },
  {
    id: "meeting-event",
    text: "Brogan Westra accepted the timeline review meeting",
    type: "Meeting",
  },
];

const notifications = [
  {
    title: "HarborTech callback is now overdue",
    detail: "Client requested a callback and no completed response has been detected.",
    urgency: "High",
  },
  {
    title: "Summit implementation question is still open",
    detail: "Timeline confirmation remains unresolved after client follow-up.",
    urgency: "Medium",
  },
  {
    title: "Northstar renewal window opened today",
    detail: "Pulse recommends beginning renewal conversation while engagement is high.",
    urgency: "Opportunity",
  },
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
  const [selectedActivityAccount, setSelectedActivityAccount] = useState(activityAccounts[0]);
  const [activityView, setActivityView] = useState("Company");
  const [activityDetail, setActivityDetail] = useState<any>(null);
  const [tractionOpen, setTractionOpen] = useState(false);
  const [adminPage, setAdminPage] = useState("Admin");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        client.owner.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  function handleSignIn() {
    setAuthState("loading");
    setTimeout(() => {
      setAuthState("dashboard");
    }, 2200);
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

  if (authState === "login") {
    return <LoginScreen onSignIn={handleSignIn} />;
  }

  if (authState === "loading") {
    return <PulseLoadingScreen />;
  }

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-[#17141c] via-[#1d1725] to-[#24162c] text-white"
      style={{ fontFamily: "Satoshi, Inter, sans-serif" }}
    >
      <div className="flex min-h-screen">
        <aside className="fixed left-0 top-0 hidden h-screen w-60 bg-gradient-to-b from-[#1d1725] via-[#22162d] to-[#281734] px-4 py-5 text-purple-100 lg:block">
          <button
            onClick={goHome}
            className="flex w-full items-center gap-3 rounded-3xl p-2 text-left transition hover:bg-white/5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f0617] via-[#32104b] to-[#ff3df2] text-white shadow-lg shadow-fuchsia-500/20">
              <Activity className="h-6 w-6" />
            </div>

            <div className="leading-none">
              <h1 className="text-3xl font-semibold tracking-[0.025em] text-white">pulse</h1>
              <p className="mt-1.5 text-[11px] font-medium tracking-wide text-purple-200">
                Relationship Intelligence
              </p>
            </div>
          </button>

          <nav className="mt-7 space-y-1.5">
            {navigation.map((item) => (
              <button
                key={item}
                onClick={() => goToTab(item)}
                className={`flex w-full items-center justify-between rounded-2xl border px-3.5 py-2.5 text-left text-sm transition ${
                  activeTab === item
                    ? "border-white/35 bg-white/15 text-white"
                    : "border-white/10 text-purple-100 hover:border-white/25 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item}</span>
                {activeTab === item && <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 px-4 pb-24 pt-5 sm:px-5 lg:ml-60 lg:px-7 lg:pb-5 xl:px-8">
          {activeTab === "Overview" && (
            <header className="relative mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-medium text-purple-100">
                  {getGreeting()}, Danielle.
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                  Here&apos;s what we have:
                </h2>
              </div>

              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative rounded-2xl border border-white/15 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-3 text-white shadow-lg shadow-black/20 transition hover:scale-[1.03]"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-xs font-semibold text-white">
                    3
                  </span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-14 z-50 w-[340px] rounded-3xl border border-white/10 bg-[#21142c] p-4 shadow-2xl shadow-black/40 sm:w-[360px]">
                    <p className="text-sm text-purple-100">Priority notifications</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">Needs attention</h3>

                    <div className="mt-4 space-y-3">
                      {notifications.map((item) => (
                        <button
                          key={item.title}
                          onClick={() => {
                            if (item.title.includes("HarborTech")) {
                              setSelectedClient(clients[2]);
                              goToTab("Accounts");
                            } else if (item.title.includes("Summit")) {
                              setSelectedClient(clients[1]);
                              goToTab("Accounts");
                            } else {
                              setSelectedClient(clients[0]);
                              goToTab("Accounts");
                            }
                          }}
                          className="w-full rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-white/15"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-white">{item.title}</p>
                            <span className="rounded-full bg-white/15 px-2 py-1 text-xs text-purple-100">
                              {item.urgency}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-purple-100">{item.detail}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </header>
          )}

          {activeTab === "Overview" && (
            <div className="space-y-5">
              <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
                <div className="rounded-3xl bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-white shadow-xl shadow-black/20 sm:p-7">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                    <Activity className="h-4 w-4" />
                    Executive Focus Panel
                  </div>

                  <h3 className="mt-5 max-w-3xl text-3xl font-semibold md:text-4xl">
                    3 relationship signals may need review.
                  </h3>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-purple-100">
                    Pulse filters fragmented communication across Outlook, Zoom, Teams, calls,
                    and CRM data into the few items leadership should actually review.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => goToTab("Intelligence")}
                      className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-[#24112f] hover:bg-purple-50"
                    >
                      Review Attention Items
                    </button>

                    <button
                      onClick={() => goToTab("Activity")}
                      className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
                    >
                      View Account Timeline
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-5 text-white shadow-xl shadow-black/20">
                  <div>
                    <p className="text-sm text-purple-100">Executive summary</p>
                    <h3 className="mt-1 text-2xl font-semibold">Today’s focus</h3>
                  </div>

                  <div className="mt-5 space-y-3">
                    <SummaryButton
                      label="High-risk account"
                      value="HarborTech Services"
                      showAlert
                      onClick={() => {
                        setSelectedClient(clients[2]);
                        goToTab("Accounts");
                      }}
                    />
                    <SummaryButton
                      label="Unanswered request"
                      value="Summit Insurance Group"
                      onClick={() => {
                        setSelectedClient(clients[1]);
                        goToTab("Accounts");
                      }}
                    />
                    <SummaryButton label="Overdue follow-up" value="1 item" onClick={() => goToTab("Tasks")} />
                    <SummaryButton
                      label="Healthy accounts"
                      value="86%"
                      onClick={() => {
                        setSelectedClient(clients[0]);
                        goToTab("Accounts");
                      }}
                    />
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard icon={Users} label="Tracked clients" value="128" detail="Across 14 account owners" />
                <MetricCard icon={Clock} label="Avg response" value="3h 18m" detail="18% faster than last week" />
                <MetricCard icon={CheckCircle2} label="Closed follow-ups" value="42" detail="This week" />
                <MetricCard icon={Activity} label="Healthy accounts" value="86%" detail="Low-risk relationship score" />
              </section>

              <AccountsPanel
                query={query}
                setQuery={setQuery}
                filteredClients={filteredClients}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
              />
            </div>
          )}

          {activeTab === "Accounts" && (
            <div className="grid gap-5 xl:grid-cols-[1fr_.72fr]">
              <AccountsPanel
                query={query}
                setQuery={setQuery}
                filteredClients={filteredClients}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
              />
              {selectedClient ? <ClientDetail client={selectedClient} /> : <EmptyClientState />}
            </div>
          )}

          {activeTab === "Activity" &&
            (activityDetail ? (
              <ActivityDetail item={activityDetail} onBack={() => setActivityDetail(null)} />
            ) : tractionOpen ? (
              <TractionDetail onBack={() => setTractionOpen(false)} />
            ) : (
              <ActivityPanel
                selectedActivityAccount={selectedActivityAccount}
                setSelectedActivityAccount={setSelectedActivityAccount}
                activityView={activityView}
                setActivityView={setActivityView}
                setActivityDetail={setActivityDetail}
                setTractionOpen={setTractionOpen}
              />
            ))}

          {activeTab === "Intelligence" && <IntelligencePanel />}
          {activeTab === "Tasks" && <TasksPanel />}
          {activeTab === "AI Task Manager" && <AITaskManager />}
          {activeTab === "Reports" && <ReportsPanel />}
          {activeTab === "Admin" &&
            (adminPage === "Admin" ? (
              <AdminPanel setAdminPage={setAdminPage} />
            ) : (
              <PreferencesPanel setAdminPage={setAdminPage} />
            ))}
        </section>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#21142c]/95 px-3 py-2 backdrop-blur lg:hidden">
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
                  activeTab === item.tab
                    ? "bg-white/15 text-white"
                    : "text-purple-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="mb-1 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

function LoginScreen({ onSignIn }: any) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#17141c] via-[#1d1725] to-[#291536] px-5 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/8 p-7 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f0617] via-[#32104b] to-[#ff3df2] shadow-lg shadow-fuchsia-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-[0.025em]">pulse</h1>
            <p className="mt-1 text-xs text-purple-200">Relationship Intelligence</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-purple-100">Welcome back</p>
          <h2 className="mt-1 text-3xl font-semibold">Sign in to your workspace</h2>
        </div>

        <div className="mt-7 space-y-4">
          <input
            defaultValue="danielle@pulse.com"
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-purple-200 focus:ring-4 focus:ring-white/10"
            placeholder="Email"
          />
          <input
            defaultValue="relationshipintel"
            type="password"
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-purple-200 focus:ring-4 focus:ring-white/10"
            placeholder="Password"
          />
          <button
            onClick={onSignIn}
            className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#24112f] transition hover:bg-purple-50"
          >
            Sign In
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-purple-200">
          Proof-of-concept login experience. No real authentication yet.
        </p>
      </div>
    </main>
  );
}

function PulseLoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#17141c] via-[#1d1725] to-[#291536] px-5 text-white">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0f0617] via-[#32104b] to-[#ff3df2] shadow-2xl shadow-fuchsia-500/20">
          <Activity className="h-9 w-9 animate-pulse" />
        </div>

        <div className="mt-8 flex items-end justify-center gap-1">
          {[18, 32, 14, 44, 20, 30, 16].map((height, index) => (
            <div
              key={index}
              className="w-2 rounded-full bg-fuchsia-300/80"
              style={{
                height,
                animation: `pulse 900ms ${index * 90}ms infinite ease-in-out`,
              }}
            />
          ))}
        </div>

        <h1 className="mt-8 text-3xl font-semibold">{getGreeting()}, Danielle.</h1>
        <p className="mt-3 text-purple-100">Building your relationship intelligence workspace…</p>

        <style jsx>{`
          @keyframes pulse {
            0%,
            100% {
              transform: scaleY(0.6);
              opacity: 0.55;
            }
            50% {
              transform: scaleY(1.15);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </main>
  );
}

function SummaryButton({ label, value, onClick, showAlert = false }: any) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left transition hover:bg-white/20"
    >
      <span className="flex items-center gap-2 text-sm text-purple-100">
        {showAlert && <AlertTriangle className="h-4 w-4 text-pink-200" />}
        {label}
      </span>
      <span className="text-sm font-medium text-white">{value}</span>
    </button>
  );
}

function MetricCard({ icon: Icon, label, value, detail }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-5 text-white shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-purple-100">{label}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
          <p className="mt-1 text-sm text-purple-100">{detail}</p>
        </div>
        <div className="rounded-2xl bg-white/15 p-3 text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function AccountsPanel({ query, setQuery, filteredClients, selectedClient, setSelectedClient }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-5 text-white shadow-xl shadow-black/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">Accounts</h3>
          <p className="mt-1 text-sm text-purple-100">Relationship visibility and communication health.</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-200" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search accounts"
            className="w-full rounded-2xl border border-white/15 bg-white/10 py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-purple-200 focus:ring-4 focus:ring-white/10"
          />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {filteredClients.map((client: any) => (
          <button
            key={client.name}
            onClick={() => setSelectedClient(client)}
            className={`w-full rounded-3xl border p-4 text-left transition ${
              selectedClient?.name === client.name
                ? "border-white/40 bg-white/20"
                : "border-white/10 bg-white/10 hover:bg-white/15"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="inline-flex rounded-xl bg-white/15 px-3 py-1 font-medium text-white">
                    {client.name}
                  </p>
                  <RiskBadge risk={client.risk} />
                </div>
                <p className="mt-2 text-sm text-purple-100">
                  Owner: {client.owner} · Last touch: {client.lastTouch}
                </p>
                <p className="mt-2 text-sm text-purple-50">{client.insight}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-purple-100" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ClientDetail({ client }: any) {
  return (
    <Panel title={client.name} subtitle={`Owned by ${client.owner}`}>
      <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
        <p className="text-sm text-purple-100">Relationship status</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl font-semibold">{client.risk === "High" ? "Needs attention" : "Stable"}</p>
          <RiskBadge risk={client.risk} />
        </div>
        <p className="mt-3 text-sm leading-6 text-purple-50">{client.insight}</p>
      </div>
    </Panel>
  );
}

function EmptyClientState() {
  return (
    <Panel title="Select an account" subtitle="Client page with insights">
      <p className="leading-7 text-purple-100">
        Choose an account from the list to view relationship status, response trends, and communication insights.
      </p>
    </Panel>
  );
}

function ActivityPanel({
  selectedActivityAccount,
  setSelectedActivityAccount,
  activityView,
  setActivityView,
  setActivityDetail,
  setTractionOpen,
}: any) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Upcoming Activity" subtitle="Toggle between company and people views.">
          <div className="flex w-fit rounded-2xl border border-white/15 bg-white/10 p-1">
            {["Company", "People"].map((view) => (
              <button
                key={view}
                onClick={() => setActivityView(view)}
                className={`rounded-xl px-4 py-2 text-sm ${
                  activityView === view ? "bg-white text-[#24112f]" : "text-white"
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {activityAccounts.map((account) => (
              <button
                key={account.name}
                onClick={() => setSelectedActivityAccount(account)}
                className={`rounded-3xl border p-4 text-left transition ${
                  selectedActivityAccount.name === account.name
                    ? "border-white/40 bg-white/20"
                    : "border-white/10 bg-white/10 hover:bg-white/15"
                }`}
              >
                <p className="font-medium">{activityView === "Company" ? account.name : account.person}</p>
                <p className="mt-2 text-sm text-purple-100">{account.upcoming}</p>
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-purple-100">AI summary</p>
            <h4 className="mt-2 text-2xl font-semibold">{selectedActivityAccount.aiSummary}</h4>
          </div>
        </Panel>

        <button
          onClick={() => setTractionOpen(true)}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-5 text-left text-white shadow-xl shadow-black/20 transition hover:scale-[1.01]"
        >
          <p className="text-sm text-purple-100">Traction</p>
          <h3 className="mt-1 text-2xl font-semibold">Engagement performance</h3>

          <div className="mt-5 grid gap-3">
            <StatRow label="Email engagement" value="68%" />
            <StatRow label="Response efficiency" value="+22%" />
            <StatRow label="Meeting acceptance" value="81%" />
            <StatRow label="Follow-up completion" value="74%" />
          </div>

          <p className="mt-5 text-sm text-purple-100">
            Click to view activity efficiency, engagement quality, and recommended next actions.
          </p>
        </button>
      </div>

      <Panel title="Recent Activity" subtitle="Communication activity with contextual drill-down.">
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivityDetail(item)}
              className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-white/15"
            >
              <div>
                <p className="font-medium">{item.text}</p>
                <p className="mt-1 text-sm text-purple-100">{item.type}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-purple-100" />
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ActivityDetail({ item, onBack }: any) {
  const content: any = {
    "email-event": {
      eyebrow: "Email preview",
      title: "Invitation to Pulse Executive Event — New York City",
      body: "Chuck Folker invited Austyn Diller to a Pulse executive event in New York City focused on relationship intelligence, missed follow-ups, and client visibility.",
    },
    "reply-event": {
      eyebrow: "Reply preview",
      title: "Re: Renewal Planning Conversation",
      body: "Austyn Diller asked for the latest summary of unresolved requests and meeting participation before the renewal discussion.",
    },
    "meeting-event": {
      eyebrow: "Meeting activity",
      title: "Timeline Review Meeting Accepted",
      body: "Brogan Westra accepted the implementation timeline review meeting. Pulse recommends preparing blockers, open milestones, and a clear decision request.",
    },
  };

  const selected = content[item.id];

  return (
    <Panel title={selected.title} subtitle={selected.eyebrow}>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-purple-100 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to Activity
      </button>

      <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
        <p className="leading-7 text-purple-50">{selected.body}</p>
      </div>
    </Panel>
  );
}

function TractionDetail({ onBack }: any) {
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-purple-100 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to Activity
      </button>

      <Panel title="Activity engagement is improving, but renewal activity needs attention." subtitle="Traction insights">
        <div className="grid gap-4 md:grid-cols-4">
          <MetricMini label="Engagement rate" value="68%" detail="+9% this week" />
          <MetricMini label="Response speed" value="2h 14m" detail="22% faster" />
          <MetricMini label="Meeting conversion" value="41%" detail="7 accepted" />
          <MetricMini label="Open loops" value="5" detail="2 high priority" />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
          <h4 className="text-xl font-semibold">AI efficiency insight</h4>
          <p className="mt-3 leading-7 text-purple-50">
            Your recent communication is generating solid engagement, but renewal conversations are starting later than recommended.
            Pulse recommends prioritizing Northstar Logistics today because Austyn Diller has engaged with the last two emails.
          </p>
        </div>
      </Panel>
    </div>
  );
}

function AITaskManager() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_.8fr]">
      <Panel title="How can I help?" subtitle="AI Task Manager">
        <textarea
          placeholder="Ask Pulse to summarize open questions, draft a follow-up, identify risk accounts, or prepare your next client action..."
          className="min-h-44 w-full rounded-3xl border border-white/20 bg-[#e7e2ec] p-5 text-[#24112f] outline-none placeholder:text-purple-500 focus:ring-4 focus:ring-white/20"
        />
      </Panel>

      <Panel title="Suggested prompts" subtitle="Common ways teams use Pulse.">
        <SignalItem icon={Mail} title="Draft a follow-up" detail="Create a response to an unanswered client request." />
        <SignalItem icon={AlertTriangle} title="Find risk" detail="Show accounts with declining communication quality." />
        <SignalItem icon={Calendar} title="Prepare my day" detail="Summarize meetings, open items, and recommended actions." />
      </Panel>
    </div>
  );
}

function AdminPanel({ setAdminPage }: any) {
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button className="rounded-2xl border border-white/10 bg-white/10 p-3 text-white hover:bg-white/15">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Integrations" subtitle="Connected communication systems.">
          <div className="grid gap-4 md:grid-cols-2">
            <Integration name="Outlook" status="Connected" icon={Mail} />
            <Integration name="Zoom" status="Connected" icon={Video} />
            <Integration name="Teams" status="Pending" icon={MessageSquare} />
            <Integration name="CRM" status="Not connected" icon={Users} />
          </div>
        </Panel>

        <button
          onClick={() => setAdminPage("Preferences")}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-5 text-left text-white shadow-xl shadow-black/20 transition hover:scale-[1.01]"
        >
          <Palette className="h-7 w-7" />
          <h3 className="mt-4 text-2xl font-semibold">Preferences</h3>
          <p className="mt-2 text-purple-100">Customize theme, workspace behavior, and interface preferences.</p>
        </button>
      </div>
    </div>
  );
}

function PreferencesPanel({ setAdminPage }: any) {
  return (
    <div className="grid gap-5 xl:grid-cols-[.45fr_1fr]">
      <Panel title="Preferences" subtitle="Workspace settings">
        <button onClick={() => setAdminPage("Admin")} className="flex items-center gap-2 text-sm text-purple-100 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </button>

        <button className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left hover:bg-white/15">
          <span>Customize Theme</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </Panel>

      <Panel title="Customize Theme" subtitle="Theme controls will appear here.">
        <p className="text-purple-100">Future controls for palette, density, font, and workspace layout.</p>
      </Panel>
    </div>
  );
}

function IntelligencePanel() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <Panel title="Intelligence Center" subtitle="A softer view of account movement, emerging needs, and communication signals.">
        <SignalItem icon={TrendingUp} title="Northstar is gaining momentum" detail="Engagement improved after the last proposal follow-up." />
        <SignalItem icon={Lightbulb} title="Summit needs clarity" detail="Implementation timeline language suggests the client is waiting for a concise confirmation." />
        <SignalItem icon={MessageSquare} title="HarborTech needs a human touchpoint" detail="A direct response from the account owner would likely reduce relationship friction." />
        <SignalItem icon={Users} title="Coverage gap detected" detail="Two accounts rely on a single relationship owner for most communication." />
      </Panel>

      <Panel title="Suggested focus" subtitle="Pulse recommends the next best areas to review.">
        <SignalItem icon={Clock} title="Respond today" detail="Two open items are still within the ideal response window." />
        <SignalItem icon={Users} title="Relationship coverage" detail="One account appears overly dependent on a single contact." />
        <SignalItem icon={Calendar} title="Upcoming window" detail="Northstar renewal activity should begin this week." />
        <SignalItem icon={BarChart3} title="Watch engagement" detail="Activity volume is steady, but response quality varies by account." />
      </Panel>
    </div>
  );
}

function TasksPanel() {
  return (
    <Panel title="Tasks" subtitle="Follow-ups generated from emails, meetings, calls, and chats.">
      <div className="grid gap-4 md:grid-cols-3">
        {tasks.map((item) => (
          <div key={item.task} className="rounded-3xl border border-white/10 bg-white/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">{item.client}</p>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs text-purple-100">{item.priority}</span>
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

function ReportsPanel() {
  return (
    <div className="space-y-5">
      <Panel title="Describe the report you want to make." subtitle="Reports">
        <textarea
          placeholder="Example: Show unanswered client requests by account owner for the last 30 days..."
          className="min-h-28 w-full max-w-3xl rounded-3xl border border-white/20 bg-[#e7e2ec] p-5 text-[#24112f] outline-none placeholder:text-purple-500 focus:ring-4 focus:ring-white/20"
        />
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="Report analytics" subtitle="Clean performance snapshots without clutter.">
          <div className="grid gap-4 md:grid-cols-2">
            <MetricMini label="Unanswered requests" value="17" detail="-12% vs last week" />
            <MetricMini label="Avg resolution time" value="4h 28m" detail="Improved by 19%" />
            <MetricMini label="At-risk accounts" value="3" detail="1 high priority" />
            <MetricMini label="Follow-up completion" value="74%" detail="+8% this month" />
          </div>
        </Panel>

        <Panel title="Account trend table" subtitle="A simple technical view of where attention is needed.">
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="grid grid-cols-4 bg-white/15 px-4 py-3 text-sm font-medium text-purple-50">
              <div>Account</div>
              <div>Open Items</div>
              <div>Response</div>
              <div>Trend</div>
            </div>

            {[
              ["HarborTech", "5", "21h 05m", "Declining"],
              ["Summit", "3", "5h 44m", "Stable"],
              ["Northstar", "1", "1h 12m", "Improving"],
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

function Panel({ title, subtitle, children }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-5 text-white shadow-xl shadow-black/20">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-purple-100">{subtitle}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function SignalItem({ icon: Icon, title, detail }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
      <div className="flex gap-3">
        <div className="rounded-xl bg-white/15 p-2 text-white">
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
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
      <span className="text-sm text-purple-100">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function MetricMini({ label, value, detail }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
      <p className="text-sm text-purple-100">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-purple-100">{detail}</p>
    </div>
  );
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
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white">
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