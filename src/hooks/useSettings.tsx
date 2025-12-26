import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type ColorTheme = "violet" | "ocean" | "forest" | "sunset" | "rose";

export interface Settings {
  theme: "light" | "dark" | "system";
  colorTheme: ColorTheme;
  compactMode: boolean;

  defaultPriority: "low" | "medium" | "high";
  defaultStatus: "todo" | "doing";
  defaultSortBy: "dueDate" | "priority" | "createdAt";

  weekStartsOn: "monday" | "sunday";
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY";

  displayName: string;
}

const defaultSettings: Settings = {
  theme: "system",
  colorTheme: "violet",
  compactMode: false,
  defaultPriority: "medium",
  defaultStatus: "todo",
  defaultSortBy: "dueDate",
  weekStartsOn: "monday",
  dateFormat: "MM/DD/YYYY",
  displayName: "",
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

const STORAGE_KEY = "study-planner-settings";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
    return defaultSettings;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (settings.theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }
  }, [settings.theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(
      "theme-violet",
      "theme-ocean",
      "theme-forest",
      "theme-sunset",
      "theme-rose"
    );
    root.classList.add(`theme-${settings.colorTheme}`);
  }, [settings.colorTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.compactMode) {
      root.classList.add("compact");
    } else {
      root.classList.remove("compact");
    }
  }, [settings.compactMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
