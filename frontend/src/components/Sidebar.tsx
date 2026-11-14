import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  CloudSun, 
  Layers, 
  Sprout, 
  CheckCircle2, 
  RotateCcw, 
  SlidersHorizontal, 
  Bot, 
  FileText, 
  Database, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'farms', label: 'My Farms', icon: MapPin },
  { id: 'climate', label: 'Climate Intelligence', icon: CloudSun },
  { id: 'soil', label: 'Soil Intelligence', icon: Layers },
  { id: 'crops', label: 'Crop Explorer', icon: Sprout },
  { id: 'suitability', label: 'Crop Suitability', icon: CheckCircle2 },
  { id: 'rotation', label: 'Rotation Planner', icon: RotateCcw, highlight: true },
  { id: 'simulator', label: 'Scenario Simulator', icon: SlidersHorizontal },
  { id: 'assistant', label: 'AI Assistant', icon: Bot },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'datasources', label: 'Data Sources', icon: Database },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
}) => {
  return (
    <aside
      className={`relative z-20 flex flex-col glass-card border border-white/60 p-3 transition-all duration-300 shadow-xl m-4 ${
        collapsed ? 'w-20 items-center' : 'w-64'
      }`}
      style={{ height: 'calc(100vh - 2rem)' }}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-4 border-b border-neutral-200/50 w-full">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 shrink-0">
          <Sprout className="w-6 h-6 text-emerald-100" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg text-emerald-950 tracking-tight flex items-center gap-1.5">
              AGROVERSE
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full border border-emerald-300/60">
                NASA
              </span>
            </h1>
            <p className="text-[11px] text-neutral-500 font-medium truncate">Earth Observation Platform</p>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 space-y-1.5 overflow-y-auto w-full pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                isActive
                  ? 'bg-emerald-900 text-white shadow-md shadow-emerald-950/20'
                  : 'text-neutral-600 hover:text-emerald-950 hover:bg-white/60'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-emerald-300' : 'text-neutral-500 group-hover:text-emerald-800'
                }`}
              />
              {!collapsed && (
                <span className="truncate text-left flex-1">{item.label}</span>
              )}
              {item.highlight && !collapsed && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
              {isActive && (
                <div className="absolute right-1.5 w-1.5 h-6 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle */}
      <div className="pt-3 border-t border-neutral-200/50 w-full flex justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl bg-white/60 hover:bg-white text-neutral-600 hover:text-emerald-900 transition-colors shadow-sm"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
