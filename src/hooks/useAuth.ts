import { useState, useEffect, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('useAuth: Starting, supabase configured:', isSupabaseConfigured())

    if (!isSupabaseConfigured()) {
      console.log('useAuth: Supabase not configured, setting loading false')
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useAuth: Got session:', session ? 'yes' : 'no')
      setUser(session?.user ?? null)
      if (session?.user) {
        console.log('useAuth: Fetching profile for user:', session.user.id)
        fetchProfile(session.user.id)
      } else {
        console.log('useAuth: No user, setting loading false')
        setLoading(false)
      }
    }).catch(err => {
      console.error('useAuth: getSession error:', err)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    console.log('fetchProfile: Starting for user:', userId)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('fetchProfile: Result:', { data, error: error?.message })

      if (error) {
        console.error('Error fetching profile:', error.message)
      } else if (data) {
        setProfile(data)
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    } finally {
      console.log('fetchProfile: Done, setting loading false')
      setLoading(false)
    }
  }

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          username,
          display_name: username,
        },
      },
    })
    return { data, error }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setProfile(null)
    }
    return { error }
  }, [])

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not logged in') }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }
    return { data, error }
  }, [user])

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }
}
