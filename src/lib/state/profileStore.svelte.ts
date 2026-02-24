import { browser } from "$app/environment";

const PROFILE_KEY = "igra-profiles";

export interface SavedProfile {
  id: string;
  name: string;
  avatar?: string;
}

export const profileStore = $state<{ profiles: SavedProfile[] }>({
  profiles: [],
});

export function loadProfiles() {
  if (browser) {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) {
      try {
        profileStore.profiles = JSON.parse(stored);
      } catch (e) {
        console.error("Ошибка загрузки профилей", e);
      }
    }
  }
}

export function saveProfile(player: { name: string; avatar?: string }) {
  if (!browser || !player.name.trim()) return;

  const normalizedName = player.name.trim();

  // проверяем есть ли такой же
  const existingIndex = profileStore.profiles.findIndex(
    (p) => p.name.toLowerCase() === normalizedName.toLowerCase(),
  );

  if (existingIndex !== -1) {
    profileStore.profiles[existingIndex].avatar = player.avatar; // обновляем существ
  } else {
    // создаем новый
    profileStore.profiles.push({
      id: crypto.randomUUID(),
      name: normalizedName,
      avatar: player.avatar,
    });
  }

  persist();
}

export function deleteProfile(id: string) {
  profileStore.profiles = profileStore.profiles.filter((p) => p.id !== id);
  persist();
}

function persist() {
  if (browser) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileStore.profiles));
  }
}
