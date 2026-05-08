"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function PulseDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [query, setQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedActivityAccount, setSelectedActivityAccount] = useState(activityAccounts[0]);
  const [activityView, setActivityView] = useState("Company");
  const [emailOpen, setEmailOpen] = useState(false);
  const [tractionOpen, setTractionOpen] = useState(false);
  const [adminPage, setAdminPage] = useState("Admin");

  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        client.owner.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  function goHome() {
    setActiveTab("Overview");
    setEmailOpen(false);
    setTractionOpen(false);
    setAdminPage("Admin");
  }

  function goToTab(tab: string) {
    setActiveTab(tab);
    setEmailOpen(false);
    setTractionOpen(false);
    if (tab !== "Admin") setAdminPage("Admin");
  }

  return (
    <main className="min-h-screen bg-[#17141c] text-white" style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>
      <div className="flex min-h-screen">
        <aside className="fixed left-0 top-0 hidden h-screen w-72 bg-[#21142c] px-5 py-6 text-purple-100 lg:block">
          <button onClick={goHome} className="flex w-full items-center gap-4 rounded-3xl p-2 text-left transition hover:bg-white/5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f0617] via-[#32104b] to-[#ff3df2] text-white shadow-lg shadow-fuchsia-500/20">
              <Activity className="h-7 w-7" />
            </div>

            <div className="leading-none">
              <h1 className="text-2xl font-semibold tracking-[0.08em] text-white">pulse</h1>
              <p className="mt-2 text-xs font-medium tracking-wide text-purple-200">Intelligence</p>
            </div>
          </button>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => (
              <button
                key={item}
                onClick={() => goToTab(item)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
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

        <section className="flex-1 px-5 py-5 lg:ml-72 lg:px-8">
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-medium text-purple-100">
                {getGreeting()}, Danielle.
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                Here&apos;s what we have:
              </h2>
            </div>

            {activeTab === "Overview" && (
              <button className="rounded-2xl border border-white/15 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-3 text-white shadow-lg shadow-black/20 transition hover:scale-[1.03] hover:bg-white/10">
                <Bell className="h-5 w-5" />
              </button>
            )}
          </header>

          {activeTab === "Overview" && (
            <div className="space-y-6">
              <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
                <div className="rounded-3xl bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-8 text-white shadow-xl shadow-black/20">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                    <Activity className="h-4 w-4" />
                    Calm intelligence, not dashboard noise
                  </div>

                  <h3 className="mt-5 max-w-3xl text-4xl font-semibold md:text-5xl">
                    Three accounts need action. Everything else is stable.
                  </h3>

                  <p className="mt-5 max-w-2xl text-base leading-7 text-purple-100">
                    Pulse filters fragmented communication across Outlook, Zoom, Teams, calls,
                    and CRM data into the few items leadership should actually review.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
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

                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-white shadow-xl shadow-black/20">
                  <div>
                    <p className="text-sm text-purple-100">Executive summary</p>
                    <h3 className="mt-1 text-2xl font-semibold">Today’s focus</h3>
                  </div>

                  <div className="mt-6 space-y-3">
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
            <div className="grid gap-6 xl:grid-cols-[1fr_.75fr]">
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
            (emailOpen ? (
              <EmailDetail onBack={() => setEmailOpen(false)} />
            ) : tractionOpen ? (
              <TractionDetail onBack={() => setTractionOpen(false)} />
            ) : (
              <ActivityPanel
                selectedActivityAccount={selectedActivityAccount}
                setSelectedActivityAccount={setSelectedActivityAccount}
                activityView={activityView}
                setActivityView={setActivityView}
                setEmailOpen={setEmailOpen}
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
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-white shadow-xl shadow-black/20">
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

      <div className="mt-6 space-y-3">
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
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-white shadow-xl shadow-black/20">
      <p className="text-sm text-purple-100">Client page with insights</p>
      <h3 className="mt-1 text-2xl font-semibold">{client.name}</h3>
      <p className="mt-1 text-sm text-purple-100">Owned by {client.owner}</p>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5">
        <p className="text-sm text-purple-100">Relationship status</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl font-semibold">{client.risk === "High" ? "Needs attention" : "Stable"}</p>
          <RiskBadge risk={client.risk} />
        </div>
        <p className="mt-3 text-sm leading-6 text-purple-50">{client.insight}</p>
      </div>
    </div>
  );
}

function EmptyClientState() {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-white shadow-xl shadow-black/20">
      <p className="text-sm text-purple-100">Client page with insights</p>
      <h3 className="mt-1 text-2xl font-semibold">Select an account</h3>
      <p className="mt-3 text-sm leading-6 text-purple-100">
        Choose an account from the list to view relationship status, response trends, and communication insights.
      </p>
    </div>
  );
}

function ActivityPanel({
  selectedActivityAccount,
  setSelectedActivityAccount,
  activityView,
  setActivityView,
  setEmailOpen,
  setTractionOpen,
}: any) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-white shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Upcoming Activity</h3>
              <p className="mt-2 text-purple-100">Toggle between company and person views.</p>
            </div>

            <div className="flex rounded-2xl border border-white/15 bg-white/10 p-1">
              {["Company", "Person"].map((view) => (
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
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
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

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-purple-100">AI summary</p>
            <h4 className="mt-2 text-2xl font-semibold">{selectedActivityAccount.aiSummary}</h4>
          </div>
        </div>

        <button
          onClick={() => setTractionOpen(true)}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-left text-white shadow-xl shadow-black/20 transition hover:scale-[1.01]"
        >
          <p className="text-sm text-purple-100">Traction</p>
          <h3 className="mt-1 text-2xl font-semibold">Engagement performance</h3>

          <div className="mt-6 grid gap-3">
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

      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-white shadow-xl shadow-black/20">
        <h3 className="text-2xl font-semibold">Recent Activity</h3>
        <div className="mt-6 space-y-3">
          {recentActivity.map((item) => (
            <button
              key={item.id}
              onClick={() => item.id === "email-event" && setEmailOpen(true)}
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
      </div>
    </div>
  );
}

function TractionDetail({ onBack }: any) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-purple-100 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to Activity
      </button>

      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-white shadow-xl shadow-black/20">
        <p className="text-sm text-purple-100">Traction insights</p>
        <h3 className="mt-1 text-3xl font-semibold">Activity engagement is improving, but renewal activity needs attention.</h3>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <MetricMini label="Engagement rate" value="68%" detail="+9% this week" />
          <MetricMini label="Response speed" value="2h 14m" detail="22% faster" />
          <MetricMini label="Meeting conversion" value="41%" detail="7 accepted" />
          <MetricMini label="Open loops" value="5" detail="2 high priority" />
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5">
          <h4 className="text-xl font-semibold">AI efficiency insight</h4>
          <p className="mt-3 leading-7 text-purple-50">
            Your recent communication is generating solid engagement, but renewal conversations are starting later than recommended.
            Pulse recommends prioritizing Northstar Logistics today because Austyn Diller has engaged with the last two emails and has an open renewal window.
          </p>
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

function EmailDetail({ onBack }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-white shadow-xl shadow-black/20">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm text-purple-100 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to Activity
      </button>

      <p className="text-sm text-purple-100">Email preview</p>
      <h3 className="mt-1 text-2xl font-semibold">Invitation to Pulse Executive Event — New York City</h3>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5">
        <p className="text-sm text-purple-100">From: Chuck Folker &lt;chuck.folker@pulse.com&gt;</p>
        <p className="text-sm text-purple-100">To: Austyn Diller &lt;austyn.diller@northstarlogistics.com&gt;</p>
        <p className="mt-6 leading-7 text-purple-50">
          Hi Austyn,
          <br /><br />
          I wanted to personally invite you to the upcoming Pulse Executive Relationship Intelligence event in New York City.
          We’ll be discussing how leading teams are improving client visibility, reducing missed follow-ups, and identifying relationship risk earlier.
          <br /><br />
          I think this would be especially relevant based on the renewal conversations coming up with your team.
          <br /><br />
          Best,
          <br />
          Chuck Folker
        </p>
      </div>
    </div>
  );
}

function AITaskManager() {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-8 text-white shadow-xl shadow-black/20">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/15 p-3">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-purple-100">AI Task Manager</p>
          <h3 className="text-3xl font-semibold">How can I help?</h3>
        </div>
      </div>

      <textarea
        placeholder="Ask Pulse to summarize open questions, draft a follow-up, identify risk accounts, or prepare your next client action..."
        className="mt-8 min-h-44 w-full rounded-3xl border border-white/20 bg-white/90 p-5 text-[#24112f] outline-none placeholder:text-purple-400 focus:ring-4 focus:ring-white/20"
      />
    </div>
  );
}

function AdminPanel({ setAdminPage }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="rounded-2xl border border-white/10 bg-white/10 p-3 text-white hover:bg-white/15">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-white shadow-xl shadow-black/20">
          <h3 className="text-2xl font-semibold">Integrations</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Integration name="Outlook" status="Connected" icon={Mail} />
            <Integration name="Zoom" status="Connected" icon={Video} />
            <Integration name="Teams" status="Pending" icon={MessageSquare} />
            <Integration name="CRM" status="Not connected" icon={Users} />
          </div>
        </div>

        <button
          onClick={() => setAdminPage("Preferences")}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-left text-white shadow-xl shadow-black/20 transition hover:scale-[1.01]"
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
    <div className="grid gap-6 xl:grid-cols-[.45fr_1fr]">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-white shadow-xl shadow-black/20">
        <button onClick={() => setAdminPage("Admin")} className="mb-6 flex items-center gap-2 text-sm text-purple-100 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </button>

        <h3 className="text-2xl font-semibold">Preferences</h3>

        <button className="mt-6 flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left hover:bg-white/15">
          <span>Customize Theme</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-white">
        <h3 className="text-2xl font-semibold">Customize Theme</h3>
        <p className="mt-2 text-purple-100">Theme customization controls will appear here.</p>
      </div>
    </div>
  );
}

function IntelligencePanel() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
      <Panel title="Intelligence Center" subtitle="A softer view of account movement, emerging needs, and communication signals.">
        <SignalItem icon={TrendingUp} title="Northstar is gaining momentum" detail="Engagement improved after the last proposal follow-up." />
        <SignalItem icon={Lightbulb} title="Summit needs clarity" detail="Implementation timeline language suggests the client is waiting for a concise confirmation." />
        <SignalItem icon={MessageSquare} title="HarborTech needs a human touchpoint" detail="A direct response from the account owner would likely reduce relationship friction." />
      </Panel>

      <Panel title="Suggested focus" subtitle="Pulse recommends the next best areas to review.">
        <SignalItem icon={Clock} title="Respond today" detail="Two open items are still within the ideal response window." />
        <SignalItem icon={Users} title="Relationship coverage" detail="One account appears overly dependent on a single contact." />
        <SignalItem icon={Calendar} title="Upcoming window" detail="Northstar renewal activity should begin this week." />
      </Panel>
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
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-8 text-white shadow-xl shadow-black/20">
      <p className="text-sm text-purple-100">Reports</p>
      <h3 className="text-3xl font-semibold">Describe your report.</h3>

      <textarea
        placeholder="Example: Create a report showing unanswered client requests by account owner for the last 30 days..."
        className="mt-8 min-h-44 w-full rounded-3xl border border-white/20 bg-white/90 p-5 text-[#24112f] outline-none placeholder:text-purple-400 focus:ring-4 focus:ring-white/20"
      />
    </div>
  );
}

function Panel({ title, subtitle, children }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#d946ef] p-6 text-white shadow-xl shadow-black/20">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-purple-100">{subtitle}</p>
      <div className="mt-6 space-y-4">{children}</div>
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