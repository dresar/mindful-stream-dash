import { createFileRoute } from "@tanstack/react-router";
import { Download, FileBarChart2 } from "lucide-react";
import { Panel } from "@/components/Panel";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — ADHD Monitor" }] }),
  component: Reports,
});

const REPORTS = [
  { id: "RPT-2025-019", patient: "Anak 001", range: "May 1 – May 7", focus: 72, interventions: 18 },
  { id: "RPT-2025-018", patient: "Anak 002", range: "May 1 – May 7", focus: 58, interventions: 26 },
  { id: "RPT-2025-017", patient: "Anak 003", range: "Apr 25 – May 1", focus: 81, interventions: 9 },
  { id: "RPT-2025-016", patient: "Anak 004", range: "Apr 25 – May 1", focus: 64, interventions: 14 },
];

function Reports() {
  return (
    <div className="space-y-5 max-w-[1300px] mx-auto">
      <Panel title="Generated Reports">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORTS.map((r) => (
            <div key={r.id} className="p-4 rounded-xl border border-border/60 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,212,255,0.12)", color: "#00D4FF" }}>
                  <FileBarChart2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold">{r.patient}</div>
                  <div className="mono text-[11px] text-muted-foreground">{r.id} · {r.range}</div>
                </div>
                <button className="btn btn-ghost-teal"><Download className="h-4 w-4" /> PDF</button>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Mini label="Focus Score" value={`${r.focus}%`} color="#00D4FF" />
                <Mini label="Interventions" value={r.interventions} color="#F59E0B" />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Mini({ label, value, color }: { label: string; value: any; color: string }) {
  return (
    <div className="rounded-lg p-3 border border-border/60">
      <div className="text-[10px] tracking-[0.16em] text-muted-foreground">{label.toUpperCase()}</div>
      <div className="mono text-2xl font-bold mt-1" style={{ color }}>{value}</div>
    </div>
  );
}
