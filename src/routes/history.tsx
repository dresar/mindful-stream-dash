import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, CircleDot, Circle } from "lucide-react";
import { Panel } from "@/components/Panel";
import { HISTORY_ROWS, type FocusState } from "@/data/mockData";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History Log — ADHD Monitor" }] }),
  component: HistoryLog,
});

const stateChip: Record<FocusState, string> = {
  Focused: "chip-emerald",
  Distracted: "chip-amber",
  Disregulated: "chip-rose",
};

function HistoryLog() {
  const [filter, setFilter] = useState<"All" | FocusState>("All");
  const [sort, setSort] = useState<{ key: "timestamp" | "bpm" | "gsr"; dir: "asc" | "desc" }>({ key: "timestamp", dir: "desc" });
  const [page, setPage] = useState(1);
  const PAGE = 8;

  const rows = useMemo(() => {
    const f = filter === "All" ? HISTORY_ROWS : HISTORY_ROWS.filter((r) => r.state === filter);
    const sorted = [...f].sort((a: any, b: any) => {
      const av = a[sort.key]; const bv = b[sort.key];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [filter, sort]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE));
  const slice = rows.slice((page - 1) * PAGE, page * PAGE);

  const stats = useMemo(() => {
    const intervened = rows.filter((r) => r.intervened).length;
    const avgBpm = Math.round(rows.reduce((s, r) => s + r.bpm, 0) / rows.length);
    const avgGsr = (rows.reduce((s, r) => s + r.gsr, 0) / rows.length).toFixed(2);
    return { total: rows.length, intervened, avgBpm, avgGsr };
  }, [rows]);

  const setSortKey = (key: typeof sort.key) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      <div className="flex flex-wrap gap-3">
        <Stat label="Total Sessions" value={stats.total} />
        <Stat label="Interventions" value={stats.intervened} tone="#F59E0B" />
        <Stat label="Avg BPM" value={stats.avgBpm} tone="#F43F5E" />
        <Stat label="Avg GSR" value={`${stats.avgGsr} μS`} tone="#00D4FF" />
      </div>

      <Panel
        title="Session Records"
        action={
          <div className="flex gap-2">
            <select
              className="input-field py-1.5 text-xs"
              value={filter}
              onChange={(e) => { setFilter(e.target.value as any); setPage(1); }}
            >
              <option>All</option><option>Focused</option><option>Distracted</option><option>Disregulated</option>
            </select>
            <input type="date" className="input-field py-1.5 text-xs" />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] tracking-[0.16em] text-muted-foreground border-b border-border">
                <Th onClick={() => setSortKey("timestamp")} active={sort.key === "timestamp"} dir={sort.dir}>Timestamp</Th>
                <Th onClick={() => setSortKey("bpm")} active={sort.key === "bpm"} dir={sort.dir}>BPM</Th>
                <Th onClick={() => setSortKey("gsr")} active={sort.key === "gsr"} dir={sort.dir}>GSR (μS)</Th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Intervention</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((r) => (
                <tr key={r.id} className="table-row border-b border-border/40">
                  <td className="py-3 px-3 mono text-xs text-muted-foreground">{r.timestamp}</td>
                  <td className="py-3 px-3 mono">{r.bpm}</td>
                  <td className="py-3 px-3 mono">{r.gsr}</td>
                  <td className="py-3 px-3"><span className={`chip ${stateChip[r.state]}`}>{r.state}</span></td>
                  <td className="py-3 px-3 text-center">
                    {r.intervened
                      ? <CircleDot className="inline h-4 w-4" style={{ color: "#F59E0B" }} />
                      : <Circle className="inline h-4 w-4 text-muted-foreground/40" />}
                  </td>
                  <td className="py-3 px-3 mono text-xs">{r.duration}</td>
                  <td className="py-3 px-3 text-right">
                    <button className="btn py-1 px-2.5 text-xs">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-muted-foreground">
            Showing {(page - 1) * PAGE + 1}–{Math.min(page * PAGE, rows.length)} of {rows.length}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn p-2" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="mono text-xs">Page {page} of {totalPages}</span>
            <button className="btn p-2" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Th({ children, onClick, active, dir }: { children: React.ReactNode; onClick: () => void; active: boolean; dir: "asc"|"desc" }) {
  return (
    <th className="py-3 px-3 cursor-pointer select-none" onClick={onClick}>
      <span className={`inline-flex items-center gap-1 ${active ? "text-cyan-300" : ""}`}>
        {children}
        {active && (dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
      </span>
    </th>
  );
}

function Stat({ label, value, tone = "#E6ECF8" }: { label: string; value: any; tone?: string }) {
  return (
    <div className="glass-card px-4 py-2.5 flex items-center gap-3">
      <span className="text-[10px] tracking-[0.16em] text-muted-foreground">{label.toUpperCase()}</span>
      <span className="mono font-bold text-lg" style={{ color: tone }}>{value}</span>
    </div>
  );
}
