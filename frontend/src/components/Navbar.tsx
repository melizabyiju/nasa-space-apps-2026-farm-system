import React, { useState } from 'react';
import { Farm } from '../types';
import { 
  MapPin, 
  ChevronDown,
  User,
  Sparkles
} from 'lucide-react';
import { translations, Language } from '../translations';
import { UserAccount } from '../userAccounts';
import { AccountModal } from './AccountModal';

interface NavbarProps {
  farms: Farm[];
  selectedFarm: Farm | null;
  onSelectFarm: (farm: Farm) => void;
  activeTabTitle: string;
  lang: Language;
  onToggleLang: (lang: Language) => void;
  currentUser: UserAccount;
  onUserChanged: (user: UserAccount) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  farms,
  selectedFarm,
  onSelectFarm,
  activeTabTitle,
  lang,
  onToggleLang,
  currentUser,
  onUserChanged,
}) => {
  const t = translations[lang];
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 mx-3 my-2 px-5 py-3 glass-nav rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-white/80 shadow-md">
        {/* Left: Section Header & Satellite status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300">
              {t.liveNasa}
            </span>
          </div>
          <span className="text-neutral-300 hidden sm:inline">/</span>
          <h2 className="text-base font-bold text-neutral-900 truncate max-w-[200px] sm:max-w-none">
            {activeTabTitle}
          </h2>
        </div>

        {/* Right Controls: Language Switch, Farm Selector, User Account Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switch Button (English / Malayalam) */}
          <div className="flex items-center bg-white/90 rounded-xl p-0.5 border border-neutral-300/80 shadow-sm">
            <button
              onClick={() => onToggleLang('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === 'en'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-emerald-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onToggleLang('ml')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === 'ml'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-emerald-900'
              }`}
            >
              മലയാളം
            </button>
          </div>

          {/* Farm Selector Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 border border-neutral-200/90 shadow-sm text-xs sm:text-sm text-neutral-800 hover:border-emerald-500 transition-colors">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <select
                value={selectedFarm?.id || ''}
                onChange={(e) => {
                  const found = farms.find((f) => f.id === e.target.value);
                  if (found) onSelectFarm(found);
                }}
                className="bg-transparent font-bold text-neutral-800 cursor-pointer outline-none pr-3 text-xs sm:text-sm"
              >
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id} className="text-neutral-900 bg-white">
                    {farm.name} ({farm.location.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User Account Profile Button (Clickable to switch or create account) */}
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="flex items-center gap-2 pl-2.5 pr-2 py-1 rounded-xl bg-white/70 hover:bg-white border border-neutral-200/80 hover:border-emerald-300 shadow-xs transition-all cursor-pointer group text-left"
            title={lang === 'ml' ? 'അക്കൗണ്ട് മാറ്റുക അല്ലെങ്കിൽ പുതിയതുണ്ടാക്കുക' : 'Click to manage accounts or switch user'}
          >
            <div className={`w-8 h-8 rounded-full ${
              currentUser.isDefault ? 'bg-gradient-to-tr from-amber-600 to-amber-500' : 'bg-gradient-to-tr from-emerald-700 to-emerald-600'
            } text-white font-extrabold text-xs flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
              {currentUser.initials}
            </div>
            <div className="hidden lg:block">
              <div className="text-xs font-bold text-neutral-900 leading-tight flex items-center gap-1">
                {currentUser.name}
                {currentUser.isDefault && (
                  <span className="text-[9px] font-bold text-amber-900 bg-amber-100 px-1 py-0.2 rounded">
                    Default
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-emerald-700 transition" />
              </div>
              <div className="text-[10px] text-neutral-500 leading-tight truncate max-w-[120px]">{currentUser.role}</div>
            </div>
          </button>
        </div>
      </header>

      {/* Account Management & Creation Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        currentUser={currentUser}
        onUserChanged={onUserChanged}
        lang={lang}
      />
    </>
  );
};
