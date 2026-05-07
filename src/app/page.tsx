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
  Phone,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

const navigation = [
  "Overview",
  "Accounts",
  "Activity",
  "Intelligence",
  "Tasks",
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
  const [selectedClient, setSelectedClient] = useState(clients[2]);

  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        client.owner.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Activity className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-lg font-semibold">ClientPulse</h1>
              <p className="text-xs text-slate-500">
                Relationship intelligence
              </p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            {navigation.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
                  activeTab === item
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{item}</span>
                {activeTab === item && <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 px-5 py-5 lg:px-8">
          <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Good morning</p>
              <h2 className="text-2xl font-semibold">
                Here are the relationships that need attention.
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-2xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-50">
                <Bell className="h-5 w-5" />
              </button>

              <button className="rounded-2xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-50">
                <Settings className="h-5 w-5" />
              </button>

              <button
                onClick={() => setActiveTab("Admin")}
                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Connect integration
              </button>
            </div>
          </header>

          <div className="mt-5 flex gap-2 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden">
            {navigation.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`whitespace-nowrap rounded-2xl px-4 py-2 text-sm ${
                  activeTab === item
                    ? "bg-slate-950 text-white"
                    : "text-slate-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <div className="mt-6 space-y-6">
              <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
                <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-sm">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                    <Sparkles className="h-4 w-4" />
                    Calm intelligence, not dashboard noise
                  </div>

                  <h3 className="mt-5 max-w-3xl text-4xl font-semibold md:text-5xl">
                    Three accounts need action. Everything else is stable.
                  </h3>

                  <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                    ClientPulse filters fragmented communication across Outlook,
                    Zoom, Teams, calls, and CRM data into the few items
                    leadership should actually review.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab("Intelligence")}
                      className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-100"
                    >
                      Review attention items
                    </button>

                    <button
                      onClick={() => setActiveTab("Activity")}
                      className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
                    >
                      View account timeline
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Executive summary
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold">
                        Today’s focus
                      </h3>
                    </div>

                    <AlertTriangle className="h-6 w-6 text-amber-500" />
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
                <MetricCard
                  icon={Users}
                  label="Tracked clients"
                  value="128"
                  detail="Across 14 account owners"
                />
                <MetricCard
                  icon={Clock}
                  label="Avg response"
                  value="3h 18m"
                  detail="18% faster than last week"
                />
                <MetricCard
                  icon={CheckCircle2}
                  label="Closed follow-ups"
                  value="42"
                  detail="This week"
                />
                <MetricCard
                  icon={ShieldCheck}
                  label="Healthy accounts"
                  value="86%"
                  detail="Low-risk relationship score"
                />
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

              <ClientDetail client={selectedClient} />
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

function SummaryButton({
  label,
  value,
  onClick,
  valueClassName = "text-slate-950",
}: {
  label: string;
  value: string;
  onClick: () => void;
  valueClassName?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100"
    >
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-medium ${valueClassName}`}>{value}</span>
    </button>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: any;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{detail}</p>
        </div>

        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function AccountsPanel({
  query,
  setQuery,
  filteredClients,
  selectedClient,
  setSelectedClient,
}: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">Accounts</h3>
          <p className="mt-1 text-sm text-slate-500">
            Relationship visibility and communication health.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search accounts"
            className="w-full rounded-2xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-4 focus:ring-slate-200"
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {filteredClients.map((client: any) => (
          <button
            key={client.name}
            onClick={() => setSelectedClient(client)}
            className={`w-full rounded-3xl border p-4 text-left transition ${
              selectedClient.name === client.name
                ? "border-slate-950 bg-slate-50"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{client.name}</p>
                  <RiskBadge risk={client.risk} />
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Owner: {client.owner} · Last touch: {client.lastTouch}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  {client.insight}
                </p>
              </div>

              <ArrowUpRight className="h-5 w-5 text-slate-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ClientDetail({ client }: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">Client page with insights</p>

      <h3 className="mt-1 text-2xl font-semibold">{client.name}</h3>

      <p className="mt-1 text-sm text-slate-500">
        Owned by {client.owner}
      </p>

      <div className="mt-6 rounded-3xl bg-slate-50 p-5">
        <p className="text-sm text-slate-500">Relationship status</p>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl font-semibold">
            {client.risk === "High" ? "Needs attention" : "Stable"}
          </p>

          <RiskBadge risk={client.risk} />
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {client.insight}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <InsightRow label="Health score" value={`${client.health}`} />
        <InsightRow label="Average response" value={client.response} />
        <InsightRow label="Last communication" value={client.lastTouch} />
        <InsightRow
          label="Open follow-ups"
          value={client.risk === "High" ? "2" : "1"}
        />
      </div>
    </div>
  );
}

function ActivityPanel() {
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold">Activity Timeline</h3>

      <p className="mt-2 text-slate-500">
        Centralized communication activity across platforms.
      </p>

      <div className="mt-6 space-y-4">
        <ActivityItem
          icon={Mail}
          title="Pricing follow-up sent"
          client="Northstar Logistics"
          time="22 minutes ago"
        />

        <ActivityItem
          icon={Video}
          title="Quarterly review completed"
          client="BrightPath Consulting"
          time="1 hour ago"
        />

        <ActivityItem
          icon={Phone}
          title="Missed callback detected"
          client="HarborTech Services"
          time="Yesterday"
        />
      </div>
    </div>
  );
}

function ActivityItem({
  icon: Icon,
  title,
  client,
  time,
}: {
  icon: any;
  title: string;
  client: string;
  time: string;
}) {
  return (
    <div className="flex gap-4 rounded-3xl border border-slate-200 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
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

function IntelligencePanel() {
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold">Intelligence Center</h3>

      <p className="mt-2 text-slate-500">
        AI highlights the relationships and communications requiring attention.
      </p>

      <div className="mt-6 space-y-4">
        <RiskItem
          title="HarborTech relationship score dropped"
          detail="Overdue callback and declining meeting sentiment detected."
        />

        <RiskItem
          title="Summit has unanswered implementation questions"
          detail="No response detected in Teams communication."
        />

        <RiskItem
          title="Northstar is trending positive"
          detail="Meeting sentiment improved and proposal follow-up was completed ahead of deadline."
        />
      </div>
    </div>
  );
}

function TasksPanel() {
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold">Tasks</h3>

      <p className="mt-2 text-slate-500">
        Follow-ups generated from emails, meetings, calls, and chats.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {tasks.map((item) => (
          <div
            key={item.task}
            className="rounded-3xl border border-slate-200 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">{item.client}</p>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {item.priority}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.task}
            </p>

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
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold">Reports</h3>

      <p className="mt-2 text-slate-500">
        Executive-ready trends, exceptions, and performance visibility.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={Clock}
          label="SLA compliance"
          value="94%"
          detail="Responses within target"
        />

        <MetricCard
          icon={ShieldCheck}
          label="Risk trend"
          value="-8%"
          detail="Fewer high-risk accounts"
        />

        <MetricCard
          icon={Users}
          label="Coverage gaps"
          value="5"
          detail="Accounts with one contact owner"
        />
      </div>
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-semibold">Integrations</h3>

        <p className="mt-2 text-slate-500">
          Connect systems without overwhelming the main experience.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Integration name="Outlook" status="Connected" icon={Mail} />
          <Integration name="Zoom" status="Connected" icon={Video} />
          <Integration name="Teams" status="Pending" icon={MessageSquare} />
          <Integration name="CRM" status="Not connected" icon={Users} />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-semibold">Data controls</h3>

        <p className="mt-2 text-slate-500">
          Enterprise trust should be visible in the interface.
        </p>

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

function InsightRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-950">{value}</span>
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const styles: Record<string, string> = {
    Low: "bg-emerald-50 text-emerald-700",
    Medium: "bg-amber-50 text-amber-700",
    High: "bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[risk]}`}
    >
      {risk} risk
    </span>
  );
}

function RiskItem({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 p-4">
      <div className="flex gap-3">
        <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
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

function Integration({
  name,
  status,
  icon: Icon,
}: {
  name: string;
  status: string;
  icon: any;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
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