import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, X, User, Settings, HelpCircle, LogOut, ChevronDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Films', path: '/movies' },
  { name: 'Series', path: '/series' },
  { name: 'My Watchlist', path: '/my-list' },
];

const NOTIFICATIONS = [
  { id: 1, text: 'New Film: "The Last Kingdom: Seven Kings Must Die" is now available!', time: '2h ago' },
  { id: 2, text: 'Your subscription has been successfully renewed.', time: '1d ago' },
  { id: 3, text: 'Now Showing: "Sintel" is topping the charts this week.', time: '2d ago' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAuthenticated, isPremium, isLoading, signOut } = useAuth();
  
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, navigate to search results or filter
      console.log('Searching for:', searchQuery);
      setIsSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled ? 'bg-[#080810] border-b border-[#1E1E30] py-3 shadow-2xl' : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-[6px] w-[6px] rounded-full bg-accent-indigo" />
            <span className="text-[16px] font-900 tracking-[3px] text-white transition-opacity group-hover:opacity-80">
              GARDE
            </span>
          </Link>
          
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative text-[12px] font-500 transition-all duration-200 hover:text-white ${
                    isActive ? 'text-white' : 'text-[#8888A8]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Search */}
          <div ref={searchRef} className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="absolute right-0 flex items-center overflow-hidden rounded-full bg-background-card border border-border-primary"
                >
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search films..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent px-4 py-2 text-xs text-white outline-none placeholder:text-text-secondary"
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="pr-3 text-text-secondary hover:text-white">
                    <X size={14} />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
            {!isSearchOpen && (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-text-secondary transition-colors hover:text-white p-2 rounded-full hover:bg-white/5"
              >
                <Search size={18} />
              </button>
            )}
          </div>

          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative text-text-secondary transition-colors hover:text-white p-2 rounded-full hover:bg-white/5 ${showNotifications ? 'text-white bg-white/5' : ''}`}
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-indigo opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-indigo"></span>
              </span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-80 overflow-hidden rounded-2xl border border-border-primary bg-background-card shadow-2xl"
                >
                  <div className="border-b border-border-primary p-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {NOTIFICATIONS.map((n) => (
                      <div key={n.id} className="border-b border-border-primary p-4 last:border-0 hover:bg-white/5 transition-colors cursor-pointer">
                        <p className="text-sm leading-snug">{n.text}</p>
                        <span className="mt-1 block text-[10px] uppercase tracking-wider text-text-secondary">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            {isLoading ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                <Loader2 size={16} className="animate-spin" />
              </div>
            ) : isAuthenticated && user ? (
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-indigo text-xs font-bold text-white shadow-lg shadow-accent-indigo/20 transition-transform group-hover:scale-105">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <ChevronDown size={14} className={`text-text-secondary transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-accent-indigo px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105 hover:bg-accent-indigo-dark"
              >
                Sign In
              </Link>
            )}

            <AnimatePresence>
              {showProfile && isAuthenticated && user && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-56 overflow-hidden rounded-2xl border border-border-primary bg-background-card shadow-2xl"
                >
                  <div className="border-b border-border-primary p-4 bg-white/5">
                    <p className="font-bold truncate text-sm text-white">{user.email}</p>
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded mt-2 ${
                      isPremium 
                        ? 'bg-accent-gold/20 text-accent-gold'
                        : 'bg-accent-indigo/20 text-accent-indigo'
                    }`}>
                      {profile?.subscription_plan === 'premium' ? 'Premium' : profile?.subscription_plan === 'basic' ? 'Basic' : 'Free'}
                    </span>
                  </div>
                  <div className="p-2">
                    <Link href="/my-list" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-white">
                      <User size={16} />
                      My Watchlist
                    </Link>
                    <Link href="/submissions" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-white">
                      <Settings size={16} />
                      My Submissions
                    </Link>
                    <Link href="/profile" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-white">
                      <Settings size={16} />
                      Settings
                    </Link>
                    <div className="my-2 h-px bg-border-primary" />
                    <button 
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-accent-red transition-colors hover:bg-accent-red/10"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
