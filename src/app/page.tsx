"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mail,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

const navigation = ["Overview", "Accounts", "Activity", "Intelligence", "Tasks", "Reports", "Admin"];

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
    owner: "Mia Foster",
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

export default function ClientPulseDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [query, setQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        client.owner.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-[#f5eef7] text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 bg-[#24112f] px-5 py-6 text-purple-100 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b43cc7] text-white">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">ClientPulse</h1>
              <p className="text-xs text-purple-200">Relationship intelligence</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            {navigation.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
                  activeTab === item
                    ? "bg-[#b43cc7] text-white"
                    : "text-purple-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item}</span>
                {activeTab === item && <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <ShieldCheck className="h-4 w-4" />
              Privacy controls
            </div>
            <p className="mt-2 text-sm leading-6 text-purple-200">
              Tracking limited to approved client domains. Internal-only communication is excluded.
            </p>
          </div>
        </aside>

        <section className="flex-1 px-5 py-5 lg:px-8">
          <header className="flex flex-col gap-4 rounded-3xl border border-purple-200 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Good morning</p>
              <h2 className="text-2xl font-semibold">
                Here are the relationships that need attention.
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-2xl border border-purple-200 bg-[#faf5fb] p-3 text-purple-700 hover:bg-[#f3e6f6]">
                <Bell className="h-5 w-5" />
              </button>
              <button className="rounded-2xl border border-purple-200 bg-[#faf5fb] p-3 text-purple-700 hover:bg-[#f3e6f6]">
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveTab("Admin")}
                className="rounded-2xl bg-[#b43cc7] px-4 py-3 text-sm font-medium text-white hover:bg-[#9d2fb0]"
              >
                Connect integration
              </button>
            </div>
          </header>

          {activeTab === "Overview" && (
            <div className="mt-6 space-y-6">
              <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
                <div className="rounded-3xl bg-gradient-to-br from-[#24112f] via-[#4c1d5e] to-[#b43cc7] p-8 text-white shadow-sm">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                    <Sparkles className="h-4 w-4" />
                    Calm intelligence, not dashboard noise
                  </div>

                  <h3 className="mt-5 max-w-3xl text-4xl font-semibold md:text-5xl">
                    Three accounts need action. Everything else is stable.
                  </h3>

                  <p className="mt-5 max-w-2xl text-base leading-7 text-purple-100">
                    ClientPulse filters fragmented communication across Outlook, Zoom, Teams,
                    calls, and CRM data into the few items leadership should actually review.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab("Intelligence")}
                      className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-[#24112f] hover:bg-purple-50"
                    >
                      Review attention items
                    </button>

                    <button
                      onClick={() => setActiveTab("Activity")}
                      className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
                    >
                      View account timeline
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Executive summary</p>
                      <h3 className="mt-1 text-2xl font-semibold">Today’s focus</h3>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-pink-500" />
                  </div>

                  <div className="mt-6 space-y-3">
                    <SummaryButton
                      label="High-risk account"
                      value="HarborTech Services"
                      onClick={() => {
                        setSelectedClient(clients[2]);
                        setActiveTab("Accounts");
                      }}
                    />
                    <SummaryButton
                      label="Unanswered request"
                      value="Summit Insurance Group"
                      onClick={() => {
                        setSelectedClient(clients[1]);
                        setActiveTab("Accounts");
                      }}
                    />
                    <SummaryButton
                      label="Overdue follow-up"
                      value="1 item"
                      onClick={() => setActiveTab("Tasks")}
                    />
                    <SummaryButton
                      label="Healthy accounts"
                      value="86%"
                      valueClassName="text-emerald-600"
                      onClick={() => {
                        setSelectedClient(clients[0]);
                        setActiveTab("Accounts");
                      }}
                    />
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard icon={Users} label="Tracked clients" value="128" detail="Across 14 account owners" />
                <MetricCard icon={Clock} label="Avg response" value="3h 18m" detail="18% faster than last week" />
                <MetricCard icon={CheckCircle2} label="Closed follow-ups" value="42" detail="This week" />
                <MetricCard icon={ShieldCheck} label="Healthy accounts" value="86%" detail="Low-risk relationship score" />
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
            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_.75fr]">
              <AccountsPanel
                query={query}
                setQuery={setQuery}
                filteredClients={filteredClients}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
              />

              {selectedClient ? (
                <ClientDetail client={selectedClient} />
              ) : (
                <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-slate-500">Client page with insights</p>
                  <h3 className="mt-1 text-2xl font-semibold">Select an account</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Choose an account from the list to view relationship status, open follow-ups,
                    response trends, and communication insights.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "Activity" && <ActivityPanel />}
          {activeTab === "Intelligence" && <IntelligencePanel />}
          {activeTab === "Tasks" && <TasksPanel />}
          {activeTab === "Reports" && <ReportsPanel />}
          {activeTab === "Admin" && <AdminPanel />}
        </section>
      </div>
    </main>
  );
}

function SummaryButton({ label, value, onClick, valueClassName = "text-slate-950" }: any) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-purple-100 bg-[#faf5fb] px-4 py-3 text-left transition hover:bg-[#f3e6f6]"
    >
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-medium ${valueClassName}`}>{value}</span>
    </button>
  );
}

function MetricCard({ icon: Icon, label, value, detail }: any) {
  return (
    <div className="rounded-3xl border border-purple-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{detail}</p>
        </div>
        <div className="rounded-2xl bg-[#faf5fb] p-3 text-[#b43cc7]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function AccountsPanel({ query, setQuery, filteredClients, selectedClient, setSelectedClient }: any) {
  return (
    <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">Accounts</h3>
          <p className="mt-1 text-sm text-slate-500">
            Relationship visibility and communication health.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search accounts"
            className="w-full rounded-2xl border border-purple-200 bg-[#faf5fb] py-2 pl-9 pr-3 text-sm outline-none focus:ring-4 focus:ring-purple-100"
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
                ? "border-[#b43cc7] bg-[#f3e6f6]"
                : "border-purple-200 bg-[#faf5fb] hover:bg-[#f3e6f6]"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="inline-flex rounded-xl bg-[#f3e6f6] px-3 py-1 font-medium text-[#8e2aa0]">
                    {client.name}
                  </p>
                  <RiskBadge risk={client.risk} />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Owner: {client.owner} · Last touch: {client.lastTouch}
                </p>
                <p className="mt-2 text-sm text-slate-600">{client.insight}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-purple-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ClientDetail({ client }: any) {
  return (
    <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">Client page with insights</p>
      <h3 className="mt-1 text-2xl font-semibold">{client.name}</h3>
      <p className="mt-1 text-sm text-slate-500">Owned by {client.owner}</p>

      <div className="mt-6 rounded-3xl bg-[#faf5fb] p-5">
        <p className="text-sm text-slate-500">Relationship status</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl font-semibold">
            {client.risk === "High" ? "Needs attention" : "Stable"}
          </p>
          <RiskBadge risk={client.risk} />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{client.insight}</p>
      </div>
    </div>
  );
}

function ActivityPanel() {
  return (
    <div className="mt-6 rounded-3xl border border-purple-200 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold">Activity Timeline</h3>
      <p className="mt-2 text-slate-500">Centralized communication activity across platforms.</p>

      <div className="mt-6 space-y-4">
        <ActivityItem icon={Mail} title="Pricing follow-up sent" client="Northstar Logistics" time="22 minutes ago" />
        <ActivityItem icon={Video} title="Quarterly review completed" client="BrightPath Consulting" time="1 hour ago" />
        <ActivityItem icon={MessageSquare} title="Client asked for timeline update" client="Summit Insurance Group" time="3 hours ago" />
      </div>
    </div>
  );
}

function IntelligencePanel() {
  return (
    <div className="mt-6 rounded-3xl border border-purple-200 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold">Intelligence Center</h3>
      <p className="mt-2 text-slate-500">
        AI highlights the relationships and communications requiring attention.
      </p>

      <div className="mt-6 space-y-4">
        <RiskItem title="HarborTech relationship score dropped" detail="Overdue callback and declining meeting sentiment detected." />
        <RiskItem title="Summit has unanswered implementation questions" detail="No response detected in Teams communication." />
        <RiskItem title="Northstar is trending positive" detail="Meeting sentiment improved and proposal follow-up was completed ahead of deadline." />
      </div>
    </div>
  );
}

function TasksPanel() {
  return (
    <div className="mt-6 rounded-3xl border border-purple-200 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold">Tasks</h3>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {tasks.map((item) => (
          <div key={item.task} className="rounded-3xl border border-purple-200 bg-[#faf5fb] p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">{item.client}</p>
              <span className="rounded-full bg-white px-3 py-1 text-xs text-purple-700">
                {item.priority}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.task}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              Due: {item.due}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsPanel() {
  return (
    <div className="mt-6 rounded-3xl border border-purple-200 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold">Reports</h3>
      <p className="mt-2 text-slate-500">Executive-ready trends, exceptions, and performance visibility.</p>
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-semibold">Integrations</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Integration name="Outlook" status="Connected" icon={Mail} />
          <Integration name="Zoom" status="Connected" icon={Video} />
          <Integration name="Teams" status="Pending" icon={MessageSquare} />
          <Integration name="CRM" status="Not connected" icon={Users} />
        </div>
      </div>

      <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-semibold">Data controls</h3>
        <div className="mt-6 space-y-3">
          <InsightRow label="Approved domains only" value="Enabled" />
          <InsightRow label="Internal email exclusion" value="Enabled" />
          <InsightRow label="Role-based visibility" value="Enabled" />
          <InsightRow label="Token encryption" value="Enabled" />
        </div>
      </div>
    </div>
  );
}

function InsightRow({ label, value }: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-purple-100 bg-[#faf5fb] px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-950">{value}</span>
    </div>
  );
}

function ActivityItem({ icon: Icon, title, client, time }: any) {
  return (
    <div className="flex gap-4 rounded-3xl border border-purple-200 bg-[#faf5fb] p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#b43cc7]">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-slate-500">
          {client} · {time}
        </p>
      </div>
    </div>
  );
}

function RiskBadge({ risk }: any) {
  const styles: any = {
    Low: "bg-emerald-50 text-emerald-700",
    Medium: "bg-amber-50 text-amber-700",
    High: "bg-pink-50 text-pink-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[risk]}`}>
      {risk} risk
    </span>
  );
}

function RiskItem({ title, detail }: any) {
  return (
    <div className="rounded-3xl border border-purple-200 bg-[#faf5fb] p-4">
      <div className="flex gap-3">
        <div className="rounded-xl bg-pink-50 p-2 text-pink-600">
          <AlertTriangle className="h-4 w-4" />
        </div>

        <div>
          <p className="font-medium">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function Integration({ name, status, icon: Icon }: any) {
  return (
    <div className="rounded-3xl border border-purple-200 bg-[#faf5fb] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#b43cc7]">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-slate-500">{status}</p>
        </div>
      </div>
    </div>
  );
}