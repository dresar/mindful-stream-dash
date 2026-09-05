import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import {
  ArrowUp, AlertTriangle, Pill, Vibrate, Zap, Power, ChevronRight,
  Download, FilePlus, BellPlus,
} from "lucide-react";
import { Panel } from "@/components/Panel";
import { ChartTooltip } from "@/components/ChartTooltip";
import { TREND_24H, EVENTS, PATIENTS } from "@/data/mockData";
import { useSensorSimulation } from "@/hooks/useSensorSimulation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — ADHD Monitor V1.0" },
      { name: "description", content: "Real-time biofeedback dashboard for ADHD monitoring." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { latest } = useSensorSimulation(1200);
  const [sessionSec, setSessionSec] = useState(2 * 3600 + 14 * 60 + 37);
  const [range, setRange] = useState<"1H"|"6H"|"24H"|"7D">("24H");

  useEffect(() => {
    const id = setInterval(() => setSessionSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const sessionStr = useMemo(() => {
    const h = Math.floor(sessionSec / 3600);
    const m = Math.floor((sessionSec % 3600) / 60);
    const s = sessionSec % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }, [sessionSec]);

  const focusIndex = 72;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Status Banner */}
      <div
        className="h-[52px] rounded-xl px-5 flex items-center justify-between border"
        style={{
          background: "linear-gradient(90deg, rgba(0,212,255,0.18) 0%, rgba(0,212,255,0.05) 50%, rgba(167,139,250,0.10) 100%)",
          borderColor: "rgba(0,212,255,0.25)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="led" />
          <span className="text-sm font-bold tracking-wider">SYSTEM OPERATIONAL — LIVE SESSION ACTIVE</span>
        </div>
        <div className="mono text-sm text-foreground/80">
          SESSION: <span className="text-cyan-300">{sessionStr}</span>
        </div>
        <div className="flex gap-2">
          <span className="chip chip-emerald">MQTT: CONNECTED</span>
          <span className="chip chip-teal">LOG: LIVE</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricHeart bpm={Math.round(latest.bpm)} />
        <MetricGsr value={latest.gsr} />
        <MetricMotion ax={latest.ax} ay={latest.ay} az={latest.az} />
        <MetricInterventions count={3} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 space-y-5">
          <Panel
            title="Hyperactivity & Focus Trends — 24H Cycle"
            action={
              <div className="pill-toggle-group">
                {(["1H","6H","24H","7D"] as const).map((r) => (
                  <button key={r} className="pill-toggle" data-active={range === r} onClick={() => setRange(r)}>{r}</button>
                ))}
              </div>
            }
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={TREND_24H} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#243050" strokeDasharray="3 6" vertical={false} />
                  <XAxis dataKey="time" stroke="#5C6B8C" fontSize={11} fontFamily="Space Mono" interval={5} />
                  <YAxis stroke="#5C6B8C" fontSize={11} fontFamily="Space Mono" />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#00D4FF", strokeOpacity: 0.3 }} />
                  <ReferenceLine y={85} stroke="#F43F5E" strokeDasharray="4 4" label={{ value: "Stress Threshold", fill: "#F43F5E", fontSize: 10, position: "right" }} />
                  <ReferenceLine y={7}  stroke="#F59E0B" strokeDasharray="4 4" label={{ value: "Alert Zone", fill: "#F59E0B", fontSize: 10, position: "right" }} />
                  <Line type="monotone" dataKey="bpm"    stroke="#00D4FF" strokeWidth={2} dot={false} name="BPM" />
                  <Line type="monotone" dataKey="gsr"    stroke="#F59E0B" strokeWidth={2} dot={false} name="GSR" />
                  <Line type="monotone" dataKey="motion" stroke="#A78BFA" strokeWidth={2} dot={false} name="Motion" />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Live Events Log">
            <div className="divide-y divide-border/60">
              {EVENTS.map((e) => (
                <EventRow key={e.time} {...e} />
              ))}
            </div>
          </Panel>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-4 space-y-5">
          <Panel title="Focus State">
            <FocusGauge value={focusIndex} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] text-center">
              <Legend2 dot="#10B981" label="FOCUSED" />
              <Legend2 dot="#F59E0B" label="DISTRACTED" />
              <Legend2 dot="#F43F5E" label="DISREGULATED" />
            </div>
          </Panel>

          <Panel title="Active Patient">
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center font-bold"
                style={{ background: `linear-gradient(135deg, ${PATIENTS[0].color}, #A78BFA)`, color: "#0B0F1A" }}
              >
                A1
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{PATIENTS[0].name} <span className="text-muted-foreground text-xs">(Anon)</span></div>
                <div className="flex gap-1.5 mt-1">
                  <span className="chip chip-blue">9 YEARS</span>
                  <span className="chip chip-violet">COMBINED</span>
                </div>
              </div>
            </div>
            <div className="mt-3 chip chip-emerald w-full justify-center">
              <span className="led" style={{ width: 6, height: 6 }} /> DEVICE CONNECTED
            </div>
          </Panel>

          <Panel title="Quick Actions">
            <div className="space-y-2">
              <button className="btn btn-ghost-teal w-full"><Download className="h-4 w-4" /> Export Session</button>
              <button className="btn btn-ghost-teal w-full"><FilePlus className="h-4 w-4" /> Add Clinical Note</button>
              <button className="btn btn-ghost-teal w-full"><BellPlus className="h-4 w-4" /> Configure Alert</button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function MetricHeart({ bpm }: { bpm: number }) {
  return (
    <div className="glass-card p-5 h-[150px] flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <div className="panel-title">Heart Rate</div>
          <div className="text-[11px] text-muted-foreground/80 mt-0.5">PPG Sensor</div>
        </div>
        <span className="text-[10px] flex items-center gap-1 text-emerald-400 font-bold">
          <ArrowUp className="h-3 w-3" /> +3 baseline
        </span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <span className="mono text-4xl font-bold text-cyan-300">{bpm}</span>
          <span className="mono text-xs text-muted-foreground ml-1">BPM</span>
        </div>
        <svg width="120" height="40" viewBox="0 0 120 40" className="shrink-0">
          <polyline
            className="ecg-line"
            points="0,20 15,20 22,20 28,8 34,32 40,4 46,28 52,20 70,20 80,20 88,14 94,26 100,20 120,20"
            fill="none" stroke="#F43F5E" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

function MetricGsr({ value }: { value: number }) {
  const bars = Array.from({ length: 14 }).map((_, i) => 8 + Math.abs(Math.sin(i + value)) * 22);
  return (
    <div className="glass-card p-5 h-[150px] flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <div className="panel-title">GSR Level</div>
          <div className="text-[11px] text-muted-foreground/80 mt-0.5">Skin Conductance</div>
        </div>
        <span className="chip chip-emerald">NORMAL</span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <span className="mono text-4xl font-bold" style={{ color: "#F59E0B" }}>{value.toFixed(1)}</span>
          <span className="mono text-xs text-muted-foreground ml-1">μS</span>
        </div>
        <svg width="120" height="36" viewBox="0 0 120 36" className="shrink-0">
          {bars.map((h, i) => (
            <rect key={i} x={i * 8.5} y={36 - h} width={5} height={h} rx={1.5} fill="#F59E0B" opacity={0.4 + (i / bars.length) * 0.6} />
          ))}
        </svg>
      </div>
    </div>
  );
}

function MetricMotion({ ax, ay, az }: { ax: number; ay: number; az: number }) {
  const Bar = ({ label, v, color }: { label: string; v: number; color: string }) => (
    <div className="flex items-center gap-2">
      <span className="mono text-[10px] w-3 text-muted-foreground">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted/60 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${v}%`, background: color }} />
      </div>
      <span className="mono text-[10px] w-7 text-right text-muted-foreground">{v}</span>
    </div>
  );
  return (
    <div className="glass-card p-5 h-[150px] flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <div className="panel-title">Motion Index</div>
          <div className="text-[11px] text-muted-foreground/80 mt-0.5">IMU / MPU6050</div>
        </div>
        <span className="chip chip-emerald">CALM</span>
      </div>
      <div className="space-y-1.5 w-full">
        <Bar label="X" v={ax} color="#00D4FF" />
        <Bar label="Y" v={ay} color="#A78BFA" />
        <Bar label="Z" v={az} color="#10B981" />
      </div>
    </div>
  );
}

function MetricInterventions({ count }: { count: number }) {
  return (
    <div className="glass-card p-5 h-[150px] flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <div className="panel-title">Interventions</div>
          <div className="text-[11px] text-muted-foreground/80 mt-0.5">Haptic Nudges Today</div>
        </div>
        <span className="chip chip-amber">TODAY</span>
      </div>
      <div>
        <span className="mono text-4xl font-bold" style={{ color: "#F59E0B" }}>{count}</span>
        <div className="flex gap-1.5 mt-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{
                background: i < count ? "#F59E0B" : "#243050",
                boxShadow: i < count ? "0 0 6px rgba(245,158,11,0.6)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const ICONS: Record<string, any> = { alert: AlertTriangle, pill: Pill, vibrate: Vibrate, zap: Zap, power: Power };
const TONE: Record<string, string> = { rose: "#F43F5E", blue: "#60A5FA", amber: "#F59E0B", emerald: "#10B981" };

function EventRow({ time, text, icon, tone }: { time: string; text: string; icon: string; tone: string }) {
  const Icon = ICONS[icon];
  const color = TONE[tone];
  return (
    <div
      className="flex items-center gap-3 py-3 px-2 cursor-pointer group"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <Icon className="h-4 w-4 shrink-0" style={{ color }} />
      <span className="mono text-xs text-muted-foreground w-14">[{time}]</span>
      <span className="text-sm font-medium tracking-wide flex-1">{text}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

function FocusGauge({ value }: { value: number }) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c * 0.75; // 270deg arc
  return (
    <div className="relative flex justify-center py-2">
      <svg width="180" height="160" viewBox="0 0 180 160">
        <defs>
          <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
        <circle
          cx="90" cy="90" r={r}
          stroke="#243050" strokeWidth="12" fill="none"
          strokeDasharray={`${c * 0.75} ${c}`}
          strokeLinecap="round"
          transform="rotate(135 90 90)"
        />
        <circle
          cx="90" cy="90" r={r}
          stroke="url(#gauge-grad)" strokeWidth="12" fill="none"
          strokeDasharray={`${c * 0.75} ${c}`}
          strokeDashoffset={offset - c * 0.25}
          strokeLinecap="round"
          transform="rotate(135 90 90)"
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="mono text-5xl font-bold text-cyan-300">{value}<span className="text-lg text-muted-foreground">%</span></span>
        <span className="text-[10px] tracking-[0.18em] text-muted-foreground mt-1">FOCUS INDEX</span>
      </div>
    </div>
  );
}

function Legend2({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot, boxShadow: `0 0 6px ${dot}` }} />
      <span className="text-muted-foreground tracking-[0.12em]">{label}</span>
    </div>
  );
}
