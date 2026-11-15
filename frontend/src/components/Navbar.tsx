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
      <header className="sticky top-0 z-20 mx-3 my-2 px-4 sm:px-5 py-2.5 sm:py-3 glass-nav rounded-2xl flex flex-nowrap items-center justify-between gap-2 sm:gap-3 border border-white/80 shadow-md min-h-[58px]">
        {/* Left: Section Header & Satellite status */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300 whitespace-nowrap">
              {t.liveNasa}
            </span>
          </div>
          <span className="text-neutral-300 hidden sm:inline shrink-0">/</span>
          <h2 className="text-xs sm:text-sm md:text-base font-bold text-neutral-900 truncate">
            {activeTabTitle}
          </h2>
        </div>

        {/* Right Controls: Language Switch, Farm Selector, User Account Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switch Button (English / Malayalam) */}
          <div className="flex items-center bg-white/90 rounded-xl p-0.5 border border-neutral-300/80 shadow-sm shrink-0">
            <button
              onClick={() => onToggleLang('en')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === 'en'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-emerald-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onToggleLang('ml')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === 'ml'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-emerald-900'
              }`}
            >
              മലയാളം
            </button>
          </div>

          {/* Farm Selector Dropdown (Reduced size only when Malayalam is chosen to preserve navbar height) */}
          <div className="relative shrink-0">
            <div className={`flex items-center gap-1.5 rounded-xl bg-white/95 border border-neutral-200/90 shadow-sm text-neutral-800 hover:border-emerald-500 transition-all ${
              lang === 'ml'
                ? 'px-2 py-1 text-xs'
                : 'px-3 py-1.5 text-xs sm:text-sm'
            }`}>
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
              <select
                value={selectedFarm?.id || ''}
                onChange={(e) => {
                  const found = farms.find((f) => f.id === e.target.value);
                  if (found) onSelectFarm(found);
                }}
                className={`bg-transparent font-bold text-neutral-800 cursor-pointer outline-none truncate transition-all ${
                  lang === 'ml'
                    ? 'text-xs pr-1 w-[90px] sm:w-[115px]'
                    : 'text-xs sm:text-sm pr-3'
                }`}
              >
                {farms.map((farm) => {
                  // Only when Malayalam is chosen, reduce the size/text to "Wayanad..."
                  const farmDisplayName = lang === 'ml'
                    ? `${farm.name.split(' ')[0]}...`
                    : `${farm.name} (${farm.location.split(',')[0]})`;

                  return (
                    <option key={farm.id} value={farm.id} className="text-neutral-900 bg-white">
                      {farmDisplayName}
                    </option>
                  );
                })}
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
