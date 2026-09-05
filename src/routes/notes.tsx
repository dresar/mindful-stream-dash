import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { Panel } from "@/components/Panel";

export const Route = createFileRoute("/notes")({
  head: () => ({ meta: [{ title: "Clinical Notes — ADHD Monitor" }] }),
  component: Notes,
});

const NOTES = [
  { date: "2025-05-07", title: "Morning session — Anak 001", body: "Focus index improved by 14% after introducing 5-min calm breathing routine prior to study session. Recommend continuing for 2 more weeks before reassessment." },
  { date: "2025-05-06", title: "Threshold tuning — Anak 002", body: "Reduced GSR threshold from 8.0 to 7.2 μS. Patient appears to respond better to earlier intervention timing during transitions." },
  { date: "2025-05-05", title: "Family debrief — Anak 003", body: "Parents reported improved bedtime routine. Hyperactivity events decreased by 22% week-over-week per IMU baseline." },
];

function Notes() {
  return (
    <div className="space-y-5 max-w-[1100px] mx-auto">
      <Panel title="Recent Clinical Notes">
        <div className="space-y-3">
          {NOTES.map((n) => (
            <div key={n.date} className="p-4 rounded-xl border border-border/60 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-4 w-4" style={{ color: "#00D4FF" }} />
                <span className="font-bold">{n.title}</span>
                <span className="mono text-xs text-muted-foreground ml-auto">{n.date}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{n.body}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
