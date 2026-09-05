import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Activity, Users, TrendingUp, History, FileText,
  Sliders, BarChart3, Settings,
} from "lucide-react";

const groups = [
  {
    label: "Main",
    items: [
      { to: "/",         label: "Dashboard",        Icon: LayoutDashboard },
      { to: "/live",     label: "Live Monitor",     Icon: Activity },
      { to: "/patients", label: "Patient Profiles", Icon: Users },
    ],
  },
  {
    label: "Analytics",
    items: [
      { to: "/metrics", label: "Focus Metrics", Icon: TrendingUp },
      { to: "/history", label: "History Log",   Icon: History },
      { to: "/notes",   label: "Clinical Notes",Icon: FileText },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/thresholds", label: "Threshold Config", Icon: Sliders },
      { to: "/reports",    label: "Reports",          Icon: BarChart3 },
      { to: "/settings",   label: "Settings",         Icon: Settings },
    ],
  },
];

export function Sidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside
      className="group/sidebar fixed top-0 left-0 z-40 h-screen border-r border-border flex flex-col"
      style={{
        width: 72,
        background: "linear-gradient(180deg, #0E1424 0%, #0B0F1A 100%)",
        transition: "width 300ms cubic-bezier(0.4,0,0.2,1)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.width = "260px")}
      onMouseLeave={(e) => (e.currentTarget.style.width = "72px")}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-border">
        <BrainWaveIcon />
        <span className="font-bold text-base tracking-tight opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          ADHD <span style={{ color: "#00D4FF" }}>Monitor</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="px-3 mb-2 text-[0.65rem] font-bold tracking-[0.18em] text-muted-foreground/70 uppercase opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
              {g.label}
            </div>
            <div className="space-y-1">
              {g.items.map(({ to, label, Icon }) => {
                const active = to === "/" ? path === "/" : path.startsWith(to);
                return (
                  <Link key={to} to={to} className="block">
                    <div className="nav-item" data-status={active ? "active" : ""}>
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity">{label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Status chip */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-2.5">
          <span className="led" />
          <span className="text-xs font-mono text-muted-foreground opacity-0 group-hover/sidebar:opacity-100 transition-opacity whitespace-nowrap">
            MQTT Connected
          </span>
        </div>
      </div>
    </aside>
  );
}

function BrainWaveIcon() {
  return (
    <div className="relative shrink-0">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="#00D4FF" strokeWidth="1.5" opacity="0.6" />
        <path
          d="M4 16 L9 16 L11 10 L14 22 L17 8 L20 24 L22 14 L25 18 L28 16"
          stroke="#00D4FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
        />
      </svg>
      <span
        className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full"
        style={{ background: "#10B981", boxShadow: "0 0 8px #10B981" }}
      />
    </div>
  );
}
