import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Bell, Wifi } from "lucide-react";

const titleMap: Record<string, string> = {
  "/":           "Dashboard",
  "/live":       "Live Monitor",
  "/patients":   "Patient Profiles",
  "/metrics":    "Focus Metrics",
  "/history":    "History Log",
  "/notes":      "Clinical Notes",
  "/thresholds": "Threshold Configuration",
  "/reports":    "Reports",
  "/settings":   "Settings",
};

export function Header() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const title = titleMap[path] ?? "ADHD Monitor";

  const time = now.toLocaleTimeString("en-GB", { hour12: false });

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b"
      style={{
        background: "rgba(11,15,26,0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "#243050",
      }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        <span className="chip chip-teal">v1.0</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden sm:flex items-center gap-2 mono text-sm text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 blink" />
          {time}
        </div>
        <Wifi className="h-4 w-4" style={{ color: "#00D4FF" }} />
        <button className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          <span
            className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ background: "#F43F5E", color: "#fff" }}
          >
            3
          </span>
        </button>
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, #00D4FF, #A78BFA)",
            color: "#0B0F1A",
            boxShadow: "0 0 0 2px rgba(0,212,255,0.25)",
          }}
        >
          DR
        </div>
      </div>
    </header>
  );
}
