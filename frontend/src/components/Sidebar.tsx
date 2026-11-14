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
  ChevronRight
} from 'lucide-react';
import { translations, Language } from '../translations';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  lang: Language;
}

export const getNavItems = (t: typeof translations.en) => [
  { id: 'overview', label: t.nav.overview, icon: LayoutDashboard },
  { id: 'farms', label: t.nav.farms, icon: MapPin },
  { id: 'climate', label: t.nav.climate, icon: CloudSun },
  { id: 'soil', label: t.nav.soil, icon: Layers },
  { id: 'crops', label: t.nav.crops, icon: Sprout },
  { id: 'suitability', label: t.nav.suitability, icon: CheckCircle2 },
  { id: 'rotation', label: t.nav.rotation, icon: RotateCcw, highlight: true },
  { id: 'simulator', label: t.nav.simulator, icon: SlidersHorizontal },
  { id: 'assistant', label: t.nav.assistant, icon: Bot },
  { id: 'reports', label: t.nav.reports, icon: FileText },
  { id: 'datasources', label: t.nav.datasources, icon: Database },
  { id: 'settings', label: t.nav.settings, icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  lang,
}) => {
  const t = translations[lang];
  const items = getNavItems(t);

  return (
    <aside
      className={`relative z-30 flex flex-col glass-card border border-white/70 p-3 transition-all duration-300 shadow-xl m-3 shrink-0 h-[calc(100vh-1.5rem)] ${
        collapsed ? 'w-20 items-center' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-3 border-b border-neutral-200/60 w-full shrink-0">
        <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-emerald-950/20 shrink-0 border border-emerald-500/20">
          <img src="/favicon.svg" alt="AGROVERSE" className="w-full h-full object-cover" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-lg text-emerald-950 tracking-tight flex items-center gap-1.5">
              {t.appName}
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full border border-emerald-300/70">
                NASA
              </span>
            </h1>
            <p className="text-[11px] text-neutral-500 font-medium truncate">{t.appSubtitle}</p>
          </div>
        )}
      </div>

      {/* Navigation Items (Scrollable internally if screen height is small) */}
      <div className="flex-1 space-y-1.5 overflow-y-auto w-full pr-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 group relative ${
                isActive
                  ? 'bg-emerald-900 text-white shadow-md shadow-emerald-950/20'
                  : 'text-neutral-700 hover:text-emerald-950 hover:bg-white/80'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-emerald-300' : 'text-neutral-500 group-hover:text-emerald-800'
                }`}
              />
              {!collapsed && (
                <span className="truncate text-left flex-1 font-semibold">{item.label}</span>
              )}
              {item.highlight && !collapsed && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
              {isActive && (
                <div className="absolute right-1.5 w-1.5 h-6 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle */}
      <div className="pt-2 border-t border-neutral-200/60 w-full flex justify-end shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl bg-white/80 hover:bg-white text-neutral-600 hover:text-emerald-900 transition-colors shadow-sm"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
