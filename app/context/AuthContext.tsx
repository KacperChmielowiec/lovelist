'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/app/auth/client'
import { User, SupabaseClient } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  supabase: SupabaseClient
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicjalizujemy klienta raz (Singleton pattern wewnątrz providera)
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 1. Pobierz sesję na starcie
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // 2. Słuchaj zmian stanu (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoading(true)
      console.log('Auth state changed:', session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <AuthContext.Provider value={{ user, supabase, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook do łatwego dostępu do kontekstu
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}