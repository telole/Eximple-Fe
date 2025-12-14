import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProfileStore from '../../stores/profileStore';
import useProgressStore from '../../stores/progressStore';

function Navbar({ stats: statsProp, activePage = 'learn' }) {
  const navigate = useNavigate();
  const { points: profilePoints, streak: profileStreak } = useProfileStore();
  const { stats: progressStats, getStats } = useProgressStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load stats when component mounts
  useEffect(() => {
    getStats();
  }, [getStats]);

  // Close mobile menu when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [activePage]);

  // Use stats from prop, progressStore, or fallback to profileStore
  const stats = statsProp || progressStats;

  const isActive = (page) => activePage === page;

  // Calculate points (emerald) - prioritize stats from progressStore
  const emeraldPoints = stats?.points?.total || 
                        stats?.total_points || 
                        (typeof profilePoints === 'object' ? (profilePoints?.total || 0) : (profilePoints || 0));

  // Calculate streak - prioritize stats from progressStore
  const currentStreak = stats?.streak?.current || 
                        stats?.current_streak ||
                        (typeof profileStreak === 'object' ? (profileStreak?.current || profileStreak?.current_streak || 0) : (profileStreak || 0));

  const navItems = [
    { path: '/journey', label: 'Learn', page: 'learn' },
    { path: '/leaderboard', label: 'Leaderboard', page: 'leaderboard' },
    { path: '/ai-agent', label: 'AI Agent', page: 'ai-agent' },
    { path: '/achievement', label: 'Achievement', page: 'achievement' },
    { path: '/teams', label: 'Our Team', page: 'teams' },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-4 sm:py-6 md:py-8 lg:py-10 relative z-50">
        {/* Logo */}
        <div className="flex items-center gap-2 z-50">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 relative">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{backgroundImage: 'url(/img/codia/logo-eximple.png)'}}
            ></div>
          </div>
          <span className="font-['Airlash_Raiders'] text-lg sm:text-xl md:text-2xl font-normal bg-gradient-to-b from-[#1fb622] to-[#168318] bg-clip-text text-transparent">
            Eximple
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-2 xl:gap-4">
            {navItems.map((item) => (
              <button 
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`px-3 xl:px-4 py-2 rounded-lg transition-all ${
                  isActive(item.page)
                    ? 'bg-gradient-to-b from-[#168318] to-[#1fb622] shadow-[0_-2px_4px_0_#00ff05_inset] hover:opacity-90'
                    : 'hover:bg-white/5'
                }`}
              >
                <span className="font-['ZT_Nature'] text-sm xl:text-base font-medium text-[#eeeeee] whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Stats & Profile */}
        <div className="flex items-center gap-1 sm:gap-2 z-50">
          {/* Streak */}
          <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-gradient-to-b from-[#f47b20] to-[#f99621] rounded-xl sm:rounded-2xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset]">
            <img src="/img/codia/icon-fire.svg" alt="Fire icon" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="font-['ZT_Nature'] text-xs sm:text-sm md:text-base font-medium text-[#eeeeee]">
              {currentStreak}
            </span>
          </div>
          
          {/* Emerald Points */}
          <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-xl sm:rounded-2xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset]">
            <img src="/img/codia/icon-leaf.svg" alt="Leaf icon" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="font-['ZT_Nature'] text-xs sm:text-sm md:text-base font-medium text-[#eeeeee]">
              {emeraldPoints}
            </span>
          </div>
          
          {/* Profile Button */}
          <button 
            onClick={() => handleNavClick('/profile')}
            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 p-2 sm:p-3 md:p-4 rounded-full transition-colors ${
              isActive('profile')
                ? 'bg-gradient-to-b from-[#168318] to-[#1fb622]'
                : 'bg-white/10 hover:bg-white/15'
            }`}
          >
            <img src="/img/codia/icon-user.svg" alt="User icon" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/15 transition-colors ml-2"
            aria-label="Toggle menu"
          >
            <svg 
              className={`w-6 h-6 text-white transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-[#020c02] to-[#041d05] border-l border-white/10 z-50 lg:hidden shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full pt-20 px-4">
              {/* Mobile Navigation Items */}
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all ${
                      isActive(item.page)
                        ? 'bg-gradient-to-b from-[#168318] to-[#1fb622] shadow-[0_-2px_4px_0_#00ff05_inset]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
