import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip } from "recharts";
import { Save, RotateCcw } from "lucide-react";
import { Panel } from "@/components/Panel";
import { ChartTooltip } from "@/components/ChartTooltip";
import { useToast } from "@/context/ToastContext";
import { TREND_24H } from "@/data/mockData";

export const Route = createFileRoute("/thresholds")({
  head: () => ({ meta: [{ title: "Threshold Configuration — ADHD Monitor" }] }),
  component: Thresholds,
});

const DEFAULTS = {
  gsr: 7.5, bpm: 100, motion: 75,
  haptic: "Medium" as "Low"|"Medium"|"High",
  duration: 500, cooldown: 30,
};

function Thresholds() {
  const { push } = useToast();
  const [cfg, setCfg] = useState(DEFAULTS);

  const set = <K extends keyof typeof cfg>(k: K, v: typeof cfg[K]) => setCfg((c) => ({ ...c, [k]: v }));

  const risk = useMemo(() => {
    const score = (cfg.gsr / 15) * 0.4 + (cfg.bpm / 150) * 0.3 + (cfg.motion / 100) * 0.3;
    if (score < 0.4) return { label: "HIGH SENSITIVITY — More Interventions Expected", tone: "#F59E0B" };
    if (score < 0.65) return { label: "BALANCED SENSITIVITY — Recommended Setting", tone: "#10B981" };
    return { label: "LOW SENSITIVITY — Fewer Interventions", tone: "#60A5FA" };
  }, [cfg]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 max-w-[1500px] mx-auto">
      <Panel title="Threshold Settings">
        <div className="space-y-5">
          <Slider label="GSR Alert Threshold" unit="μS"
            min={1} max={15} step={0.1} value={cfg.gsr}
            onChange={(v) => set("gsr", v)} />
          <Slider label="BPM High Threshold" unit="BPM"
            min={60} max={150} step={1} value={cfg.bpm}
            onChange={(v) => set("bpm", v)} />
          <Slider label="Motion Score Threshold" unit=""
            min={0} max={100} step={1} value={cfg.motion}
            onChange={(v) => set("motion", v)} />

          <div>
            <Label>Haptic Vibration Intensity</Label>
            <div className="pill-toggle-group mt-1.5">
              {(["Low","Medium","High"] as const).map((v) => (
                <button key={v} className="pill-toggle" data-active={cfg.haptic === v} onClick={() => set("haptic", v)}>{v}</button>
              ))}
            </div>
          </div>

          <Slider label="Haptic Duration" unit="ms"
            min={200} max={2000} step={50} value={cfg.duration}
            onChange={(v) => set("duration", v)} />
          <Slider label="Cooldown Period" unit="s"
            min={10} max={120} step={1} value={cfg.cooldown}
            onChange={(v) => set("cooldown", v)} />

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              className="btn btn-primary"
              onClick={() => push({ tone: "success", title: "Configuration Saved", description: "Threshold values have been applied to active devices." })}
            >
              <Save className="h-4 w-4" /> Save Configuration
            </button>
            <button className="btn" onClick={() => setCfg(DEFAULTS)}>
              <RotateCcw className="h-4 w-4" /> Reset to Defaults
            </button>
          </div>
        </div>
      </Panel>

      <div className="space-y-5">
        <Panel title="Configuration Preview">
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={TREND_24H} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#243050" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="time" stroke="#5C6B8C" fontSize={10} fontFamily="Space Mono" interval={5} />
                <YAxis stroke="#5C6B8C" fontSize={10} fontFamily="Space Mono" />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={cfg.gsr} stroke="#F59E0B" strokeDasharray="4 4"
                  label={{ value: `GSR ${cfg.gsr.toFixed(1)}`, fill: "#F59E0B", fontSize: 10, position: "right" }} />
                <Line type="monotone" dataKey="gsr" stroke="#00D4FF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            The amber dashed line shows where alerts will fire on the GSR signal. Adjust the GSR slider to see the threshold move.
          </p>
        </Panel>

        <div
          className="glass-card p-5 border"
          style={{ borderColor: `${risk.tone}55`, background: `${risk.tone}10` }}
        >
          <div className="text-[10px] tracking-[0.18em] text-muted-foreground">RISK LEVEL</div>
          <div className="font-bold mt-1" style={{ color: risk.tone }}>{risk.label}</div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold tracking-wider text-muted-foreground">{children}</div>;
}

function Slider({
  label, unit, min, max, step, value, onChange,
}: { label: string; unit: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <Label>{label}</Label>
        <span className="mono text-sm font-bold text-cyan-300">{value}{unit && ` ${unit}`}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider"
        style={{ ["--val" as any]: `${pct}%` }}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1 mono">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}
