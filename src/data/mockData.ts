export type FocusState = "Focused" | "Distracted" | "Disregulated";

export const PATIENTS = [
  { id: "anak-001", name: "Anak 001", age: 9,  type: "Combined",     status: "Connected", lastSession: "2025-05-07", focus: 72, color: "#00D4FF" },
  { id: "anak-002", name: "Anak 002", age: 11, type: "Hyperactive",  status: "Connected", lastSession: "2025-05-07", focus: 58, color: "#A78BFA" },
  { id: "anak-003", name: "Anak 003", age: 8,  type: "Inattentive",  status: "Offline",   lastSession: "2025-05-05", focus: 81, color: "#10B981" },
  { id: "anak-004", name: "Anak 004", age: 10, type: "Combined",     status: "Connected", lastSession: "2025-05-06", focus: 64, color: "#F59E0B" },
];

export const EVENTS = [
  { time: "14:22", text: "FOCUS THRESHOLD BREACHED", icon: "alert", tone: "rose" as const },
  { time: "13:05", text: "MEDICATION INTAKE LOGGED", icon: "pill", tone: "blue" as const },
  { time: "12:15", text: "HAPTIC INTERVENTION TRIGGERED", icon: "vibrate", tone: "amber" as const },
  { time: "11:44", text: "MOVEMENT SPIKE DETECTED", icon: "zap", tone: "amber" as const },
  { time: "09:00", text: "SESSION INITIALIZATION", icon: "power", tone: "emerald" as const },
];

// 24h trend data (48 points)
export const TREND_24H = Array.from({ length: 48 }).map((_, i) => {
  const t = i / 2;
  const hour = `${String(Math.floor(t)).padStart(2, "0")}:${t % 1 ? "30" : "00"}`;
  const bpm = Math.round(75 + Math.sin(i / 3) * 10 + Math.random() * 8);
  const gsr = +(3.5 + Math.sin(i / 4) * 2 + Math.random() * 1.5).toFixed(2);
  const motion = Math.round(40 + Math.sin(i / 2) * 25 + Math.random() * 15);
  return { time: hour, bpm, gsr, motion };
});

export const INTERVENTIONS_WEEK = [
  { day: "Mon", count: 4 }, { day: "Tue", count: 6 }, { day: "Wed", count: 3 },
  { day: "Thu", count: 7 }, { day: "Fri", count: 5 }, { day: "Sat", count: 2 }, { day: "Sun", count: 3 },
];

export const SCATTER_GSR_FOCUS = Array.from({ length: 60 }).map(() => {
  const gsr = +(1.5 + Math.random() * 8).toFixed(2);
  const focus = Math.max(10, Math.min(100, 110 - gsr * 9 + (Math.random() - 0.5) * 18));
  return { gsr, focus: Math.round(focus) };
});

export const STATE_DISTRIBUTION = [
  { name: "Focused",      value: 62, color: "#00D4FF" },
  { name: "Distracted",   value: 24, color: "#F59E0B" },
  { name: "Disregulated", value: 14, color: "#F43F5E" },
];

// 7 days x 14 hours heatmap
export const HEATMAP = Array.from({ length: 7 }).map((_, d) =>
  Array.from({ length: 14 }).map((_, h) => Math.round(30 + Math.random() * 70))
);

// History rows
const STATES: FocusState[] = ["Focused", "Distracted", "Disregulated"];
export const HISTORY_ROWS = Array.from({ length: 36 }).map((_, i) => {
  const state = STATES[i % 3 === 0 ? 1 : i % 5 === 0 ? 2 : 0];
  return {
    id: i + 1,
    timestamp: `2025-05-0${(i % 7) + 1} ${String(8 + (i % 10)).padStart(2,"0")}:${String((i*7)%60).padStart(2,"0")}:${String((i*13)%60).padStart(2,"0")}`,
    bpm: 70 + (i * 3) % 30,
    gsr: +(2 + (i % 7) * 0.9 + Math.random()).toFixed(2),
    state,
    intervened: i % 4 === 0,
    duration: `${20 + (i % 25)}m`,
  };
});
