import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, AlertTriangle } from "lucide-react";
import { Panel } from "@/components/Panel";
import { ChartTooltip } from "@/components/ChartTooltip";
import { useSensorSimulation } from "@/hooks/useSensorSimulation";

export const Route = createFileRoute("/live")({
  head: () => ({ meta: [{ title: "Live Monitor — ADHD Monitor V1.0" }] }),
  component: LiveMonitor,
});

type Alert = { id: number; ts: string; msg: string };

function LiveMonitor() {
  const { series, latest } = useSensorSimulation(800);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (latest.gsr > 7.5) {
      setActive(true);
      const id = setTimeout(() => setActive(false), 3500);
      const ts = new Date().toLocaleTimeString("en-GB", { hour12: false });
      setAlerts((prev) => [{ id: Date.now(), ts, msg: `GSR ${latest.gsr.toFixed(2)} μS — Disregulation, Haptic Triggered` }, ...prev].slice(0, 6));
      return () => clearTimeout(id);
    }
  }, [latest.gsr]);

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* Connection bar */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="relative h-10 w-10 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full radar-ping" style={{ background: "rgba(0,212,255,0.4)" }} />
          <span className="absolute inset-0 rounded-full radar-ping" style={{ background: "rgba(0,212,255,0.4)", animationDelay: "1s" }} />
          <Activity className="h-5 w-5 relative" style={{ color: "#00D4FF" }} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm">DEVICE STREAMING — esp32-band-001</div>
          <div className="mono text-xs text-muted-foreground">MQTT topic: /adhd/anak-001/biofeed · 800ms interval</div>
        </div>
        <span className="chip chip-emerald">CHANNEL HEALTHY</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-9 space-y-5">
          <LiveChart title="Galvanic Skin Response (GSR)" data={series} dataKey="gsr" color="#00D4FF" unit="μS" current={latest.gsr.toFixed(2)} />
          <LiveChart title="Photoplethysmogram — Heart Rate (PPG)" data={series} dataKey="bpm" color="#F43F5E" unit="BPM" current={Math.round(latest.bpm)} />
          <LiveChart
            title="Inertial Measurement Unit — Motion (IMU)"
            data={series}
            color="#F59E0B"
            unit=""
            current={`X${latest.ax} Y${latest.ay} Z${latest.az}`}
            multi
          />
        </div>

        <div className="xl:col-span-3 space-y-5">
          <Panel title="Live Alerts">
            <div
              className={`rounded-lg p-4 border transition-all ${active ? "blink" : ""}`}
              style={{
                background: active ? "rgba(244,63,94,0.12)" : "rgba(255,255,255,0.02)",
                borderColor: active ? "#F43F5E" : "var(--border)",
              }}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" style={{ color: active ? "#F43F5E" : "#5C6B8C" }} />
                <span className="text-sm font-bold" style={{ color: active ? "#FB7185" : "var(--muted-foreground)" }}>
                  {active ? "DISREGULATION DETECTED" : "Monitoring..."}
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {active ? "Haptic Nudge Triggered" : "All sensors within range"}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-[10px] tracking-[0.18em] text-muted-foreground">RECENT ALERTS</div>
              {alerts.length === 0 && <div className="text-xs text-muted-foreground/70">No alerts yet.</div>}
              {alerts.map((a) => (
                <div key={a.id} className="text-xs p-2 rounded-md border border-border/60 bg-white/[0.02]">
                  <div className="mono text-[10px] text-muted-foreground">{a.ts}</div>
                  <div className="text-foreground/90">{a.msg}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Biofeedback Status">
            <div className="space-y-3">
              <Led label="GSR Sensor"   ok />
              <Led label="PPG Sensor"   ok />
              <Led label="IMU Sensor"   ok />
              <Led label="Haptic Motor" tone="amber" status="READY" />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function LiveChart({
  title, data, dataKey, color, unit, current, multi,
}: { title: string; data: any[]; dataKey?: string; color: string; unit: string; current: any; multi?: boolean }) {
  return (
    <Panel
      title={title}
      action={<span className="mono text-sm font-bold" style={{ color }}>{current} {unit}</span>}
    >
      <div style={{ height: 180 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#243050" strokeDasharray="3 6" vertical={false} />
            <XAxis dataKey="t" stroke="#5C6B8C" fontSize={10} fontFamily="Space Mono" />
            <YAxis stroke="#5C6B8C" fontSize={10} fontFamily="Space Mono" />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: color, strokeOpacity: 0.3 }} />
            {multi ? (
              <>
                <Line type="monotone" dataKey="ax" stroke="#00D4FF" strokeWidth={1.4} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="ay" stroke="#A78BFA" strokeWidth={1.4} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="az" stroke="#10B981" strokeWidth={1.4} dot={false} isAnimationActive={false} />
              </>
            ) : (
              <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function Led({ label, ok, tone = "emerald", status = "OK" }: { label: string; ok?: boolean; tone?: "emerald" | "amber"; status?: string }) {
  const c = ok ? "#10B981" : tone === "amber" ? "#F59E0B" : "#10B981";
  return (
    <div className="flex items-center gap-3">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: c, boxShadow: `0 0 10px ${c}` }}
      />
      <span className="text-sm flex-1">{label}</span>
      <span className="mono text-[10px] text-muted-foreground">{status}</span>
    </div>
  );
}
