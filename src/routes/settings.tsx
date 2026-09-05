import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/Panel";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — ADHD Monitor" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-5 max-w-[1100px] mx-auto">
      <Panel title="Account">
        <Row k="Therapist" v="Dr. Reza" />
        <Row k="Clinic" v="Pediatric Neurodevelopment Center" />
        <Row k="Email" v="reza@adhd-monitor.id" />
      </Panel>
      <Panel title="Device">
        <Row k="MQTT Broker" v="mqtt://broker.adhd-monitor.id:1883" />
        <Row k="Sample Rate" v="1.25 Hz (800 ms)" />
        <Row k="Firmware" v="v1.4.2 (esp32-band)" />
      </Panel>
      <Panel title="Preferences">
        <Row k="Theme" v="Dark (Clinical)" />
        <Row k="Units" v="μS · BPM · Metric" />
        <Row k="Language" v="English / Bahasa Indonesia" />
      </Panel>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border/40 last:border-0">
      <span className="text-sm text-muted-foreground">{k}</span>
      <span className="mono text-sm">{v}</span>
    </div>
  );
}
