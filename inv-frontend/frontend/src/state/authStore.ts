import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import { api } from '../lib/api'
import type { UserProfile } from '../types'

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: { name: string; shopName: string; shopAddress: string; shopPhone: string; gstNumber?: string; panNumber?: string }) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        const userProfile = await api.getCurrentUser()
        if (userProfile) {
          set({ user: userProfile, isAuthenticated: true, isLoading: false })
        } else {
          throw new Error('User profile not found')
        }
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  signUp: async (email: string, password: string, userData) => {
    set({ isLoading: true })

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        const { data: ownerData, error: ownerError } = await supabase
          .rpc('fn_create_owner', {
            owner_email: email,
            owner_name: userData.name,
            shop_name: userData.shopName,
            shop_address: userData.shopAddress,
            shop_phone: userData.shopPhone,
            gst_number: userData.gstNumber || null,
            pan_number: userData.panNumber || null
          })

        if (ownerError) throw ownerError

        const userProfile = await api.getCurrentUser()
        if (userProfile) {
          set({ user: userProfile, isAuthenticated: true, isLoading: false })
        }
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      set({ user: null, isAuthenticated: false })
    } catch (error) {
      console.error('Logout error:', error)
      set({ user: null, isAuthenticated: false })
    }
  },

  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        const userProfile = await api.getCurrentUser()
        if (userProfile) {
          set({ user: userProfile, isAuthenticated: true })
        } else {
          set({ user: null, isAuthenticated: false })
        }
      } else {
        set({ user: null, isAuthenticated: false })
      }
    } catch (error) {
      console.error('Auth check error:', error)
      set({ user: null, isAuthenticated: false })
    }
  },
}))

supabase.auth.onAuthStateChange(async (event, session) => {
  const { checkAuth } = useAuthStore.getState()

  if (event === 'SIGNED_IN' && session?.user) {
    await checkAuth()
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, isAuthenticated: false })
  }
})