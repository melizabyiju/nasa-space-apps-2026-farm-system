import React from 'react';
import { Farm } from '../types';
import { 
  Satellite, 
  MapPin, 
  Bell, 
  RefreshCw, 
  ChevronDown, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  farms: Farm[];
  selectedFarm: Farm | null;
  onSelectFarm: (farm: Farm) => void;
  onRefreshNASA: () => void;
  isRefreshing: boolean;
  activeTabTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  farms,
  selectedFarm,
  onSelectFarm,
  onRefreshNASA,
  isRefreshing,
  activeTabTitle,
}) => {
  return (
    <header className="glass-nav rounded-2xl mx-4 mt-4 mb-2 px-5 py-3 flex flex-wrap items-center justify-between gap-4 z-10 border border-white/80 shadow-md">
      {/* Left: Active Section & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300/60">
            Live NASA Feed
          </span>
        </div>
        <span className="text-neutral-300">/</span>
        <h2 className="text-base font-bold text-neutral-800">{activeTabTitle}</h2>
      </div>

      {/* Middle & Right: Farm Selector & Actions */}
      <div className="flex items-center gap-3">
        {/* Farm Selector Dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 border border-neutral-200/80 shadow-sm text-sm text-neutral-700 hover:border-emerald-500 transition-colors cursor-pointer">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <select
              value={selectedFarm?.id || ''}
              onChange={(e) => {
                const found = farms.find((f) => f.id === e.target.value);
                if (found) onSelectFarm(found);
              }}
              className="bg-transparent font-medium text-neutral-800 cursor-pointer outline-none pr-4 text-sm"
            >
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id} className="text-neutral-900 bg-white">
                  {farm.name} ({farm.location.split(',')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sync with NASA */}
        <button
          onClick={onRefreshNASA}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-emerald-50 border border-neutral-200/80 text-xs font-semibold text-emerald-900 shadow-sm transition-all disabled:opacity-50"
          title="Query NASA POWER & SMAP APIs for fresh satellite observation passes"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync NASA Data</span>
        </button>

        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/60 border border-neutral-200/50 text-xs text-neutral-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
          <span>Season 2026</span>
        </div>

        {/* User Pill (matching FarmFlow style) */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-neutral-200/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            KP
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-neutral-800 leading-tight">Kristin P.</div>
            <div className="text-[10px] text-neutral-500 leading-tight">Lead Agronomist</div>
          </div>
        </div>
      </div>
    </header>
  );
};
