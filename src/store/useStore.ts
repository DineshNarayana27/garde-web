import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { Content, User } from '../types';

interface StoreState {
  user: User | null;
  myList: Content[];
  setUser: (user: User | null) => void;
  addToList: (content: Content) => void;
  removeFromList: (contentId: string) => void;
  isInList: (contentId: string) => boolean;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      myList: [],
      setUser: (user) => set({ user }),
      addToList: (content) => set((state) => ({
        myList: [...state.myList, content]
      })),
      removeFromList: (contentId) => set((state) => ({
        myList: state.myList.filter((item) => item.id !== contentId)
      })),
      isInList: (contentId) => get().myList.some((item) => item.id === contentId),
    }),
    {
      name: 'garde-storage',
      version: 1,
    }
  )
);
