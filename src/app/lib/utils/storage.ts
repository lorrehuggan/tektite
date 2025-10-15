import { browser } from "$app/environment";

type LayoutState = {
  leftSidebarCollapsed: boolean;
  rightSidebarCollapsed: boolean;
  statusBarHeight: number;
};

// Storage keys
const STORAGE_KEYS = {
  LAYOUT: "tektite-layout",
} as const;

// Generic storage interface
export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Browser localStorage adapter
class BrowserStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<string | null> {
    try {
      if (!browser) return null;
      return globalThis.localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get key "${key}" from localStorage:`, error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      if (!browser) {
        throw new Error("localStorage not available in server context");
      }
      globalThis.localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set key "${key}" in localStorage:`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      if (browser) {
        globalThis.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Failed to remove key "${key}" from localStorage:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (browser) {
        globalThis.localStorage.clear();
      }
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
    }
  }
}

// Storage manager
class StorageManager {
  private adapter: StorageAdapter;

  constructor() {
    // For now, only use browser localStorage
    // TODO: Add Tauri filesystem support when @tauri-apps/plugin-fs is set up
    this.adapter = new BrowserStorageAdapter();
  }

  async get(key: string): Promise<string | null> {
    return this.adapter.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    return this.adapter.set(key, value);
  }

  async remove(key: string): Promise<void> {
    return this.adapter.remove(key);
  }

  async clear(): Promise<void> {
    return this.adapter.clear();
  }

  // Generic JSON helpers
  async getJSON<T = unknown>(key: string): Promise<T | null> {
    try {
      const value = await this.get(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.warn(`Failed to parse JSON for key "${key}":`, error);
      return null;
    }
  }

  async setJSON<T = unknown>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value, null, 2);
      await this.set(key, serialized);
    } catch (error) {
      console.error(`Failed to serialize JSON for key "${key}":`, error);
      throw error;
    }
  }

  // Get the current adapter type for debugging
  getAdapterType(): string {
    return "browser";
  }
}

// Create singleton storage manager
export const storage = new StorageManager();

// Layout-specific storage functions
export const layoutStorage = {
  async save(layoutState: LayoutState): Promise<void> {
    try {
      await storage.setJSON(STORAGE_KEYS.LAYOUT, layoutState);
    } catch (error) {
      console.error("Failed to save layout state:", error);
      throw new Error("Unable to persist layout preferences");
    }
  },

  async load(): Promise<LayoutState | null> {
    try {
      const layoutState = await storage.getJSON<LayoutState>(
        STORAGE_KEYS.LAYOUT
      );
      return layoutState;
    } catch (error) {
      console.warn("Failed to load layout state:", error);
      return null;
    }
  },

  async clear(): Promise<void> {
    try {
      await storage.remove(STORAGE_KEYS.LAYOUT);
    } catch (error) {
      console.warn("Failed to clear layout state:", error);
    }
  },
};

// General app storage functions
export const appStorage = {
  async get(key: string): Promise<string | null> {
    return storage.get(key);
  },

  async set(key: string, value: string): Promise<void> {
    return storage.set(key, value);
  },

  async getJSON<T = unknown>(key: string): Promise<T | null> {
    return storage.getJSON<T>(key);
  },

  async setJSON<T = unknown>(key: string, value: T): Promise<void> {
    return storage.setJSON(key, value);
  },

  async remove(key: string): Promise<void> {
    return storage.remove(key);
  },

  async clear(): Promise<void> {
    return storage.clear();
  },
};

// Storage health check function
export async function checkStorageHealth(): Promise<{
  available: boolean;
  adapter: string;
  error?: string;
}> {
  try {
    const testKey = "tektite-storage-test";
    const testValue = "test-value";

    await storage.set(testKey, testValue);
    const retrieved = await storage.get(testKey);
    await storage.remove(testKey);

    const isHealthy = retrieved === testValue;
    const adapterType = storage.getAdapterType();

    return {
      available: isHealthy,
      adapter: adapterType,
    };
  } catch (error) {
    return {
      available: false,
      adapter: "unknown",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Initialize storage system
export async function initializeStorage(): Promise<void> {
  try {
    const health = await checkStorageHealth();
    console.warn(
      `Storage initialized: ${health.adapter} adapter`,
      health.available ? "✓" : "✗"
    );

    if (!health.available) {
      console.warn("Storage system not available:", health.error);
    }
  } catch (error) {
    console.error("Failed to initialize storage system:", error);
  }
}
