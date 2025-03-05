const isBrowser = typeof window !== 'undefined';

interface LocalStorageManagerInterface {
    get<T>(key: string): T | null;
    set<T>(key: string, value: T): void;
    remove(key: string): void;
    clear(): void;
}

const localStorageManager: LocalStorageManagerInterface = {
    // Retrieves the value from localStorage for the given key.
    get<T>(key: string): T | null {
        if (!isBrowser) return null;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) as T : null;
        } catch (error) {
            console.error(`Error getting key "${key}":`, error);
            return null;
        }
    },

    // Stores the value in localStorage under the given key.
    set<T>(key: string, value: T): void {
        if (!isBrowser) return;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting key "${key}":`, error);
        }
    },

    // Removes the value from localStorage for the given key.
    remove(key: string): void {
        if (!isBrowser) return;
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing key "${key}":`, error);
        }
    },

    // Clears all keys and values from localStorage.
    clear(): void {
        if (!isBrowser) return;
        try {
            window.localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    },
};

export default localStorageManager;
