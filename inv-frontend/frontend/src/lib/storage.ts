type StorageKey = 'auth_token' | 'user_data' | 'app_settings' | 'cart_data'

class StorageManager {
  setItem(key: StorageKey, value: unknown): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error(`Error saving to localStorage:`, error)
    }
  }

  getItem<T>(key: StorageKey): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from localStorage:`, error)
      return null
    }
  }

  removeItem(key: StorageKey): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage:`, error)
    }
  }

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error(`Error clearing localStorage:`, error)
    }
  }

  exists(key: StorageKey): boolean {
    return localStorage.getItem(key) !== null
  }
}

export const storage = new StorageManager()

export const authTokenKey = 'auth_token'
export const userDataKey = 'user_data'
export const appSettingsKey = 'app_settings'
export const cartDataKey = 'cart_data'