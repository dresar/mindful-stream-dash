import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { Panel } from "@/components/Panel";
import { PATIENTS } from "@/data/mockData";

export const Route = createFileRoute("/patients")({
  head: () => ({ meta: [{ title: "Patient Profiles — ADHD Monitor" }] }),
  component: Patients,
});

function Patients() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<typeof PATIENTS[number] | null>(null);
  const filtered = PATIENTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search patients..."
            className="input-field pl-10"
          />
        </div>
        <button className="btn btn-primary"><Plus className="h-4 w-4" /> Add Patient</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="glass-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center font-bold text-lg"
                style={{ background: `linear-gradient(135deg, ${p.color}, #A78BFA)`, color: "#0B0F1A" }}
              >
                {p.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
              </div>
              <div className="flex-1">
                <div className="font-bold">{p.name}</div>
                <div className="text-xs text-muted-foreground mono">{p.age} years</div>
              </div>
              <span className={`chip ${p.status === "Connected" ? "chip-emerald" : "chip-rose"}`}>
                {p.status}
              </span>
            </div>

            <div className="flex gap-1.5 mt-4">
              <span className="chip chip-violet">{p.type.toUpperCase()}</span>
              <span className="chip chip-blue">Last: {p.lastSession}</span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-muted-foreground tracking-wider">FOCUS SCORE TODAY</span>
                <span className="mono text-sm font-bold text-cyan-300">{p.focus}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${p.focus}%`, background: "linear-gradient(90deg, #00D4FF, #A78BFA)" }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="btn" onClick={() => setOpen(p)}>View Profile</button>
              <button className="btn btn-primary">Start Session</button>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-200"
        style={{ pointerEvents: open ? "auto" : "none", opacity: open ? 1 : 0, background: "rgba(0,0,0,0.5)" }}
        onClick={() => setOpen(null)}
      />
      <aside
        className="fixed top-0 right-0 z-50 h-screen w-[420px] max-w-full transition-transform duration-300"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)", background: "#0E1424", borderLeft: "1px solid #243050" }}
      >
        {open && (
          <div className="h-full flex flex-col">
            <header className="h-16 flex items-center justify-between px-5 border-b border-border">
              <h3 className="font-bold">Patient Profile</h3>
              <button className="btn p-2" onClick={() => setOpen(null)}><X className="h-4 w-4" /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-full flex items-center justify-center font-bold text-xl"
                  style={{ background: `linear-gradient(135deg, ${open.color}, #A78BFA)`, color: "#0B0F1A" }}>
                  {open.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                </div>
                <div>
                  <div className="text-lg font-bold">{open.name}</div>
                  <div className="text-xs text-muted-foreground">{open.age} years · ADHD {open.type}</div>
                </div>
              </div>
              <Panel title="Demographics">
                <Row k="ID" v={open.id} />
                <Row k="Age" v={`${open.age} years`} />
                <Row k="Subtype" v={open.type} />
                <Row k="Device" v={open.status} />
              </Panel>
              <Panel title="Assigned Thresholds">
                <Row k="GSR" v="7.5 μS" />
                <Row k="BPM" v="100" />
                <Row k="Motion" v="75" />
              </Panel>
              <Panel title="Therapist Notes">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Patient responds well to short, vibration-based interventions. Best focus window is in the morning.
                  Recommend reviewing transition periods between activities for reduced disregulation events.
                </p>
              </Panel>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between py-1.5 text-sm border-b border-border/40 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="mono">{v}</span>
    </div>
  );
}
