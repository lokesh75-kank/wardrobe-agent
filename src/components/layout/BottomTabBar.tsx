import { Link } from "@tanstack/react-router";
import { Calendar, MessageSquare, Shirt } from "lucide-react";

const tabs = [
  { to: "/", label: "Today", Icon: Calendar, exact: true },
  { to: "/agent", label: "Agent", Icon: MessageSquare, exact: false },
  { to: "/closet", label: "Closet", Icon: Shirt, exact: false },
] as const;

export function BottomTabBar() {
  return (
    <nav className="sticky bottom-0 z-20 border-t border-rose-200 bg-[#FFE3E3]/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-3">
        {tabs.map(({ to, label, Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              activeProps={{ className: "text-zinc-900" }}
              inactiveProps={{ className: "text-zinc-500" }}
              className="flex flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-zinc-800"
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
