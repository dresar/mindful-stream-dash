import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis,
  PieChart, Pie, Cell,
} from "recharts";
import { Sun, Repeat, Timer } from "lucide-react";
import { Panel } from "@/components/Panel";
import { ChartTooltip } from "@/components/ChartTooltip";
import { INTERVENTIONS_WEEK, SCATTER_GSR_FOCUS, STATE_DISTRIBUTION, HEATMAP } from "@/data/mockData";

export const Route = createFileRoute("/metrics")({
  head: () => ({ meta: [{ title: "Focus Metrics — ADHD Monitor" }] }),
  component: Metrics,
});

function Metrics() {
  const [range, setRange] = useState("This Week");
  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="pill-toggle-group">
          {["Today", "This Week", "This Month", "Custom"].map((r) => (
            <button key={r} className="pill-toggle" data-active={range === r} onClick={() => setRange(r)}>{r}</button>
          ))}
        </div>
        <span className="mono text-xs text-muted-foreground">Last updated: just now</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Panel title="Daily Interventions — Past 7 Days">
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={INTERVENTIONS_WEEK} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#243050" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="day" stroke="#5C6B8C" fontSize={11} fontFamily="Space Mono" />
                <YAxis stroke="#5C6B8C" fontSize={11} fontFamily="Space Mono" />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(245,158,11,0.08)" }} />
                <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="GSR vs Focus Score Correlation (r = 0.855)">
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#243050" strokeDasharray="3 6" />
                <XAxis dataKey="gsr" name="GSR" stroke="#5C6B8C" fontSize={11} fontFamily="Space Mono" unit=" μS" />
                <YAxis dataKey="focus" name="Focus" stroke="#5C6B8C" fontSize={11} fontFamily="Space Mono" unit="%" />
                <ZAxis range={[60, 60]} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#00D4FF", strokeOpacity: 0.2 }} />
                <Scatter data={SCATTER_GSR_FOCUS} fill="#00D4FF" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="State Distribution">
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={STATE_DISTRIBUTION} dataKey="value" innerRadius={60} outerRadius={95} paddingAngle={3} stroke="none">
                  {STATE_DISTRIBUTION.map((s) => <Cell key={s.name} fill={s.color} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {STATE_DISTRIBUTION.map((s) => (
              <div key={s.name} className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[11px] text-muted-foreground">{s.name}</span>
                </div>
                <span className="mono text-lg font-bold" style={{ color: s.color }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Focus Intensity Heatmap — 7 days × 14h">
          <div className="space-y-1.5">
            {HEATMAP.map((row, d) => (
              <div key={d} className="flex items-center gap-1.5">
                <span className="w-8 mono text-[10px] text-muted-foreground">D{d+1}</span>
                <div className="flex-1 grid grid-cols-14 gap-1" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
                  {row.map((v, h) => (
                    <div
                      key={h}
                      className="h-6 rounded"
                      style={{
                        background: `rgba(0,212,255,${0.1 + (v / 100) * 0.85})`,
                        boxShadow: v > 80 ? "0 0 8px rgba(0,212,255,0.5)" : "none",
                      }}
                      title={`Hour ${h+8}: ${v}`}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 justify-end mt-2 text-[10px] text-muted-foreground">
              <span>Low</span>
              <div className="h-2 w-32 rounded" style={{ background: "linear-gradient(90deg, rgba(0,212,255,0.1), rgba(0,212,255,0.95))" }} />
              <span>High</span>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Insight icon={<Sun className="h-5 w-5" />}    title="Best Focus Window" value="09:00 – 11:00 WIB" tone="#00D4FF" />
        <Insight icon={<Repeat className="h-5 w-5" />} title="Most Frequent Trigger" value="Transition Period" tone="#F59E0B" />
        <Insight icon={<Timer className="h-5 w-5" />}  title="Avg Recovery Time" value="4.2 min after nudge" tone="#10B981" />
      </div>
    </div>
  );
}

function Insight({ icon, title, value, tone }: { icon: React.ReactNode; title: string; value: string; tone: string }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div
        className="h-11 w-11 rounded-xl flex items-center justify-center"
        style={{ background: `${tone}22`, color: tone, boxShadow: `inset 0 0 0 1px ${tone}55` }}
      >
        {icon}
      </div>
      <div>
        <div className="text-[11px] tracking-[0.18em] text-muted-foreground">{title.toUpperCase()}</div>
        <div className="font-bold mt-0.5">{value}</div>
      </div>
    </div>
  );
}
