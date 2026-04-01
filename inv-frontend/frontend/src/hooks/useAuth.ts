import { useAuthStore } from '../state/authStore'

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, signUp, logout, checkAuth } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signUp,
    logout,
    checkAuth,
  }
}