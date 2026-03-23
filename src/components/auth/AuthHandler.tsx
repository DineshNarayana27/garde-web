"use client";

import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';

export function AuthHandler() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatar_url: session.user.user_metadata?.avatar_url || `https://picsum.photos/seed/${session.user.id}/200`,
          subscription_plan: 'free',
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatar_url: session.user.user_metadata?.avatar_url || `https://picsum.photos/seed/${session.user.id}/200`,
          subscription_plan: 'free',
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return null;
}
