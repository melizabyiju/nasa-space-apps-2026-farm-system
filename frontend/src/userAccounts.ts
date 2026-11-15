export interface UserAccount {
  id: string;
  name: string;
  role: string;
  initials: string;
  email?: string;
  phone?: string;
  farmName?: string;
  isDefault?: boolean;
  createdAt: string;
}

export const DEFAULT_USER: UserAccount = {
  id: 'default-kristin',
  name: 'Kristin P.',
  role: 'Farmer / Agronomist',
  initials: 'KP',
  email: 'kristin.p@sky2soil.farm',
  farmName: 'Wayanad Highland Agrofarm',
  isDefault: true,
  createdAt: '2026-01-01T00:00:00.000Z'
};

const STORAGE_USERS_KEY = 'sky2soil_users_list_v1';
const STORAGE_CURRENT_USER_KEY = 'sky2soil_active_user_id_v1';

export function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify([DEFAULT_USER]));
      return [DEFAULT_USER];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify([DEFAULT_USER]));
      return [DEFAULT_USER];
    }
    // Always ensure DEFAULT_USER exists in list
    if (!parsed.some((u: UserAccount) => u.id === DEFAULT_USER.id)) {
      parsed.unshift(DEFAULT_USER);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return [DEFAULT_USER];
  }
}

export function getActiveUser(): UserAccount {
  try {
    const activeId = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    const users = getStoredUsers();
    if (activeId) {
      const found = users.find(u => u.id === activeId);
      if (found) return found;
    }
    return users[0] || DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

export function setActiveUser(userId: string): UserAccount {
  const users = getStoredUsers();
  const found = users.find(u => u.id === userId) || DEFAULT_USER;
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, found.id);
  return found;
}

export function createNewUser(data: {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  farmName?: string;
}): UserAccount {
  const trimmedName = data.name.trim();
  const words = trimmedName.split(/\s+/).filter(Boolean);
  const initials = words.length >= 2
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : trimmedName.slice(0, 2).toUpperCase() || 'U';

  const newUser: UserAccount = {
    id: 'user_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: trimmedName,
    role: data.role?.trim() || 'Farmer',
    initials,
    email: data.email?.trim() || undefined,
    phone: data.phone?.trim() || undefined,
    farmName: data.farmName?.trim() || undefined,
    isDefault: false,
    createdAt: new Date().toISOString()
  };

  const users = getStoredUsers();
  users.push(newUser);
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, newUser.id);

  // Optional background sync with backend if online
  try {
    fetch('http://127.0.0.1:8000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newUser.name,
        role: newUser.role,
        email: newUser.email,
        phone: newUser.phone,
        farm_name: newUser.farmName
      })
    }).catch(() => {});
  } catch {}

  return newUser;
}
