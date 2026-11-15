import React, { useState } from 'react';
import { 
  UserAccount, 
  getStoredUsers, 
  getActiveUser, 
  setActiveUser, 
  createNewUser, 
  DEFAULT_USER 
} from '../userAccounts';
import { Language, translations } from '../translations';
import { 
  User, 
  UserPlus, 
  Check, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Sprout, 
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUserChanged: (user: UserAccount) => void;
  lang: Language;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
  lang,
}) => {
  const t = translations[lang];
  const [users, setUsers] = useState<UserAccount[]>(getStoredUsers());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Farmer');
  const [farmName, setFarmName] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectUser = (user: UserAccount) => {
    const updated = setActiveUser(user.id);
    onUserChanged(updated);
    setSuccessMsg(
      lang === 'ml'
        ? `${updated.name}-ലേക്ക് വിജയകരമായി മാറി.`
        : `Switched to ${updated.name}`
    );
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 900);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      setError(
        lang === 'ml' 
          ? 'ദയവായി കുറഞ്ഞത് 2 അക്ഷരങ്ങളുള്ള സാധുവായ പേര് നൽകുക.' 
          : 'Please enter a valid name (at least 2 characters).'
      );
      return;
    }

    try {
      const newUser = createNewUser({
        name: trimmed,
        role: role.trim() || 'Farmer',
        farmName: farmName.trim() || undefined,
        email: contact.includes('@') ? contact.trim() : undefined,
        phone: !contact.includes('@') && contact.trim() ? contact.trim() : undefined,
      });

      const updatedList = getStoredUsers();
      setUsers(updatedList);
      onUserChanged(newUser);
      setName('');
      setFarmName('');
      setContact('');
      setShowCreateForm(false);
      setSuccessMsg(
        lang === 'ml'
          ? `പുതിയ അക്കൗണ്ട് "${newUser.name}" സൃഷ്ടിച്ച് സജീവമാക്കി!`
          : `Account "${newUser.name}" created and activated!`
      );
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch {
      setError('Could not create account. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="glass-card bg-white/95 border border-white/90 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200/80 flex items-center justify-between bg-gradient-to-r from-emerald-900 to-emerald-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              <User className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                {lang === 'ml' ? 'ഉപയോക്തൃ അക്കൗണ്ടുകൾ' : 'User Accounts'}
              </h3>
              <p className="text-[11px] text-emerald-200">
                {lang === 'ml' ? 'സ്ഥിരസ്ഥിതി & പുതിയ അക്കൗണ്ടുകൾ' : 'Default user & quick account switching'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {successMsg && (
          <div className="m-4 p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Current Active Account Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-amber-50/60 border border-emerald-200/90 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-black text-sm flex items-center justify-center shadow-md">
                {currentUser.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-neutral-900">{currentUser.name}</h4>
                  {currentUser.isDefault && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {lang === 'ml' ? 'സ്ഥിരസ്ഥിതി' : 'Default'}
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {lang === 'ml' ? 'സജീവം' : 'Active'}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 font-medium mt-0.5">{currentUser.role}</p>
                {currentUser.farmName && (
                  <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                    <Sprout className="w-3 h-3 text-emerald-600" />
                    {currentUser.farmName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Toggle Create / Switch view */}
          {!showCreateForm ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  {lang === 'ml' ? 'അക്കൗണ്ടുകൾ മാറ്റുക' : 'Switch Account'}
                </span>

                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{lang === 'ml' ? '+ പുതിയ അക്കൗണ്ട്' : '+ Create Account'}</span>
                </button>
              </div>

              {/* List of Accounts */}
              <div className="space-y-2">
                {users.map((u) => {
                  const isActive = u.id === currentUser.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => !isActive && handleSelectUser(u)}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-neutral-200 bg-white/70 hover:bg-white hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl font-extrabold text-xs flex items-center justify-center text-white ${
                          u.isDefault ? 'bg-amber-500' : 'bg-emerald-700'
                        }`}>
                          {u.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-neutral-900">{u.name}</span>
                            {u.isDefault && (
                              <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                                {lang === 'ml' ? 'സ്ഥിരസ്ഥിതി' : 'Default User'}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-500">{u.role}</span>
                        </div>
                      </div>

                      {isActive ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'ml' ? 'നിലവിലുള്ളത്' : 'Current'}</span>
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectUser(u);
                          }}
                          className="text-xs font-bold text-neutral-600 hover:text-emerald-900 px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-emerald-100 transition"
                        >
                          {lang === 'ml' ? 'മാറുക' : 'Select'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Create Account Simple Form */
            <form onSubmit={handleCreateAccount} className="space-y-3 pt-1">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-200">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
                  {lang === 'ml' ? 'ലളിതമായ അക്കൗണ്ട് നിർമ്മാണം' : 'Simple Account Creation'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-800 underline"
                >
                  {lang === 'ml' ? 'റദ്ദാക്കുക' : 'Back to List'}
                </button>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {lang === 'ml' ? 'മുഴുവൻ പേര് *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ml' ? 'ഉദാ: രമേഷ് കുമാർ' : 'e.g. Ramesh Kumar'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs sm:text-sm text-neutral-800 focus:outline-none focus:border-emerald-600 shadow-xs"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {lang === 'ml' ? 'തൊഴിൽ / പദവി' : 'Role / Occupation'}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs sm:text-sm text-neutral-800 focus:outline-none focus:border-emerald-600 shadow-xs"
                >
                  <option value="Farmer">{lang === 'ml' ? 'കർഷകൻ (Farmer)' : 'Farmer'}</option>
                  <option value="Agronomist">{lang === 'ml' ? 'കാർഷിക ശാസ്ത്രജ്ഞൻ (Agronomist)' : 'Agronomist'}</option>
                  <option value="Agricultural Officer">{lang === 'ml' ? 'കൃഷി ഓഫീസർ (Agricultural Officer)' : 'Agricultural Officer'}</option>
                  <option value="Landowner">{lang === 'ml' ? 'ഭൂവുടമ (Landowner)' : 'Landowner'}</option>
                  <option value="Student / Researcher">{lang === 'ml' ? 'വിദ്യാർത്ഥി / ഗവേഷകൻ (Student)' : 'Student / Researcher'}</option>
                </select>
              </div>

              {/* Farm Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {lang === 'ml' ? 'കൃഷിയിടത്തിന്റെ പേര് / സ്ഥലം (ഓപ്ഷണൽ)' : 'Farm / Location Name (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'ml' ? 'ഉദാ: പാലക്കാട് ഗ്രീൻ ഫാം' : 'e.g. Palakkad Valley Farm'}
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs sm:text-sm text-neutral-800 focus:outline-none focus:border-emerald-600 shadow-xs"
                />
              </div>

              {/* Email or Phone */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {lang === 'ml' ? 'ഫോൺ നമ്പർ അല്ലെങ്കിൽ ഇമെയിൽ (ഓപ്ഷണൽ)' : 'Phone or Email (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'ml' ? '9876543210 അല്ലെങ്കിൽ name@example.com' : '9876543210 or name@example.com'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs sm:text-sm text-neutral-800 focus:outline-none focus:border-emerald-600 shadow-xs"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{lang === 'ml' ? 'അക്കൗണ്ട് ഉണ്ടാക്കുക' : 'Create & Switch Account'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="py-2.5 px-3 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-100 transition"
                >
                  {lang === 'ml' ? 'റദ്ദാക്കുക' : 'Cancel'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
