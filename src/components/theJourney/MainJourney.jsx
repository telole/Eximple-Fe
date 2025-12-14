import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMainJourney } from '../../hooks/useMainJourney';
import Navbar from '../common/Navbar';
import LevelInfoPanel from '../common/LevelInfoPanel';
import Footer from '../common/Footer';

function MainJourney() {
  const location = useLocation();
  const {
    profile,
    levels,
    journeyMap,
    currentSubject,
    handleStartLevel,
    stats,
    isLoading,
    error,
    refreshJourneyMap,
    selectedSubjectLevel,
  } = useMainJourney();

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Create stable primitive values for dependencies
  const hasProfile = !!profile;
  const levelsLength = levels?.length || 0;
  const hasJourneyMap = !!journeyMap;
  const hasStats = !!stats;
  const hasError = !!error;

  // Refresh journey map when returning from level page
  useEffect(() => {
    if (location.pathname === '/journey' && refreshJourneyMap && selectedSubjectLevel) {
      // Small delay to ensure we're back on the journey page
      const timer = setTimeout(() => {
        refreshJourneyMap();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, refreshJourneyMap, selectedSubjectLevel]);

  useEffect(() => {
    const hasAllData = !isLoading && hasProfile && levelsLength > 0 && hasJourneyMap && hasStats;
    
    if (hasAllData) {
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else if (hasError && !isLoading) {
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
    // Add timeout fallback to prevent infinite loading
    const fallbackTimer = setTimeout(() => {
      if (isInitialLoading) {
        setIsInitialLoading(false);
      }
    }, 10000); // 10 second timeout
    return () => clearTimeout(fallbackTimer);
  }, [isLoading, hasProfile, levelsLength, hasJourneyMap, hasStats, hasError, isInitialLoading]);

  const getLevelStatus = (levelId, index) => {
    // Normalize journey map structure - support both array and object with levels property
    const journeyLevels = Array.isArray(journeyMap) 
      ? journeyMap 
      : (journeyMap?.levels || []);

    // If no journey map data, only first level is unlocked
    if (!journeyLevels || journeyLevels.length === 0) {
      return index === 0 ? 'current' : 'locked';
    }
    
    // Find this level's progress in journey map
    // Support both 'id' and 'level_id' fields from backend
    const levelProgress = journeyLevels.find(l => 
      (l.id === levelId || l.level_id === levelId)
    );
    
    // If backend provides is_unlocked field, use it (new backend implementation)
    if (levelProgress && Object.prototype.hasOwnProperty.call(levelProgress, 'is_unlocked')) {
      if (!levelProgress.is_unlocked) {
        return 'locked';
      }
      // If unlocked, check status
      if (levelProgress.status === 'completed') return 'completed';
      if (levelProgress.status === 'in_progress') return 'current';
      if (levelProgress.journey_status === 'current') return 'current';
      return 'current'; // Default to current if unlocked
    }
    
    if (levelProgress) {
      if (levelProgress.status === 'completed') {
        return 'completed';
      }
      if (levelProgress.status === 'in_progress') {
        return 'current';
      }
      if (levelProgress.journey_status === 'completed') return 'completed';
      if (levelProgress.journey_status === 'in_progress') return 'current';
      if (levelProgress.journey_status === 'current') return 'current';
    }
    
    const completedLevels = journeyLevels.filter(l => 
      l.status === 'completed' || l.journey_status === 'completed'
    );
    const inProgressLevel = journeyLevels.find(l => 
      l.status === 'in_progress' || l.journey_status === 'in_progress'
    );
    const completedCount = completedLevels.length;
    
    if (inProgressLevel) {
      const inProgressLevelId = inProgressLevel.id || inProgressLevel.level_id;
      const inProgressLevelData = levels.find(l => l.id === inProgressLevelId);
      const inProgressArrayIndex = inProgressLevelData ? levels.findIndex(l => l.id === inProgressLevelData.id) : -1;
      
      if (inProgressArrayIndex >= 0) {
        if (index < inProgressArrayIndex) return 'completed';
        // The in_progress level itself is current
        if (index === inProgressArrayIndex) return 'current';
        if (index === inProgressArrayIndex + 1) return 'current';
      }
      return 'locked';
    }
    
    // If there are completed levels but no in_progress, unlock next level
    if (completedCount > 0) {
      let maxCompletedIndex = -1;
      completedLevels.forEach(completedLevel => {
        const completedLevelId = completedLevel.id || completedLevel.level_id;
        const completedLevelData = levels.find(l => l.id === completedLevelId);
        if (completedLevelData) {
          const completedIndex = levels.findIndex(l => l.id === completedLevelData.id);
          if (completedIndex > maxCompletedIndex) {
            maxCompletedIndex = completedIndex;
          }
        }
      });
      
      if (maxCompletedIndex >= 0) {
        if (index <= maxCompletedIndex) return 'completed';
        if (index === maxCompletedIndex + 1) {
          return 'current';
        }
      }
    }
    if (completedCount === 0 && !inProgressLevel) {
      return index === 0 ? 'current' : 'locked';
    }
    
    return 'locked';
  };

  const journeyLevels = Array.isArray(journeyMap) 
    ? journeyMap 
    : (journeyMap?.levels || []);
  const completedCount = journeyLevels.filter(l => l.status === 'completed').length || 0;
  const totalCount = levels.length || 10;

  const getPathStatus = (fromIndex, toIndex) => {
    if (fromIndex < 0 || toIndex >= levels.length) return false;
    
    const fromStatus = getLevelStatus(levels[fromIndex].id, fromIndex);
    const toStatus = getLevelStatus(levels[toIndex].id, toIndex);
    
    // Path is green only if:
    // 1. From level is completed or current (accessible)
    // 2. AND To level is NOT locked (must be current or completed)
    // This ensures we don't show green path to locked levels
    const fromIsAccessible = fromStatus === 'completed' || fromStatus === 'current';
    const toIsUnlocked = toStatus === 'current' || toStatus === 'completed';
    
    return fromIsAccessible && toIsUnlocked;
  };
  const getLongPathStatus = () => {
    // Check if path 3 (connecting level 3+) should be green
    // Path is green only if level 3 is unlocked (not locked)
    if (levels.length < 3) return false;
    
    const level3Status = getLevelStatus(levels[2]?.id, 2);
    const level2Status = getLevelStatus(levels[1]?.id, 1);
    
    // Path 3 is green if:
    // 1. Level 2 is completed or current (accessible)
    // 2. AND Level 3 is NOT locked (must be current or completed)
    const level2IsAccessible = level2Status === 'completed' || level2Status === 'current';
    const level3IsUnlocked = level3Status === 'current' || level3Status === 'completed';
    
    return level2IsAccessible && level3IsUnlocked;
  };
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  const level10Index = 9;
  const level10 = levels[level10Index];
  const level10Progress = level10 ? journeyLevels.find(l => (l.id === level10.id || l.level_id === level10.id)) : null;
  const isLevel10Reached = level10Progress && (level10Progress.status === 'completed' || level10Progress.status === 'in_progress');
  
  const isAllLevelsCompleted = completedCount >= 10;
  
  const shouldDisableScroll = isLevel10Reached || isAllLevelsCompleted;

  useEffect(() => {
    if (shouldDisableScroll) {
      const scrollY = window.scrollY;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      
      const preventScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      const options = { passive: false, capture: true };
      window.addEventListener('wheel', preventScroll, options);
      window.addEventListener('touchmove', preventScroll, options);
      window.addEventListener('scroll', preventScroll, options);
      window.addEventListener('mousewheel', preventScroll, options);
      document.addEventListener('wheel', preventScroll, options);
      document.addEventListener('touchmove', preventScroll, options);
      document.addEventListener('scroll', preventScroll, options);
      document.addEventListener('mousewheel', preventScroll, options);
      
      const mainContainer = document.querySelector('.overflow-y-auto, [class*="overflow-y-auto"]');
      if (mainContainer) {
        mainContainer.style.overflow = 'hidden';
      }

      return () => {
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        
        window.removeEventListener('wheel', preventScroll, options);
        window.removeEventListener('touchmove', preventScroll, options);
        window.removeEventListener('scroll', preventScroll, options);
        window.removeEventListener('mousewheel', preventScroll, options);
        document.removeEventListener('wheel', preventScroll, options);
        document.removeEventListener('touchmove', preventScroll, options);
        document.removeEventListener('scroll', preventScroll, options);
        document.removeEventListener('mousewheel', preventScroll, options);
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    }
  }, [shouldDisableScroll]);

  const nodePositions = [
    { top: '0', left: '50%' },
    { top: '99px', left: '268.596px' },
    { top: '202px', left: '50%' },
    { top: '297.974px', left: '0' },
    { top: '404.573px', left: '50%' },
    { top: '485.432px', left: '268.596px' },
    { top: '580.84px', left: '50%' },
    { top: '667.294px', left: '0' },
    { top: '767px', left: '138.588px' },
    { top: '853px', left: '268px' }
  ];

  return (
    <div 
      className={`w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-x-hidden ${shouldDisableScroll ? 'overflow-y-hidden' : 'overflow-y-auto'}`}
      style={shouldDisableScroll ? { overflow: 'hidden', height: '100vh', position: 'fixed', width: '100%' } : {}}
      onWheel={(e) => {
        if (shouldDisableScroll) {
          // Allow scrolling within journey map container
          const journeyMapContainer = e.target.closest('.journey-map-container');
          if (journeyMapContainer) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }}
      onTouchMove={(e) => {
        if (shouldDisableScroll) {
          // Allow scrolling within journey map container
          const journeyMapContainer = e.target.closest('.journey-map-container');
          if (journeyMapContainer) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }}
      onScroll={(e) => {
        if (shouldDisableScroll) {
          // Allow scrolling within journey map container
          const journeyMapContainer = e.target.closest('.journey-map-container');
          if (journeyMapContainer) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }}
    >
      {/* Initial Loading Overlay */}
      {isInitialLoading && (
        <div className="fixed inset-0 z-50 bg-gradient-to-r from-[#020c02] to-[#041d05] flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            {/* Animated Logo/Icon */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-[#1fb622] rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-2 bg-[#1fb622] rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1fb622] to-[#168318] rounded-full flex items-center justify-center">
                  <span className="font-['ZT_Nature'] text-3xl font-medium text-white">E</span>
                </div>
              </div>
            </div>
            
            {/* Loading Text */}
            <div className="flex flex-col items-center gap-2">
              <p className="font-['ZT_Nature'] text-xl font-medium text-[#1fb622]">
                Loading Your Journey...
              </p>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-[#1fb622] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-[#1fb622] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-[#1fb622] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-64 h-1 bg-[rgba(170,170,170,0.1)] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#168318] to-[#1fb622] rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Animation Styles */}
      <style>{`
        @keyframes loading {
          0% {
            width: 0%;
            transform: translateX(0);
          }
          50% {
            width: 70%;
            transform: translateX(0);
          }
          100% {
            width: 100%;
            transform: translateX(0);
          }
        }
        /* Hide scrollbar for journey map container */
        .journey-map-container::-webkit-scrollbar {
          display: none;
        }
        .journey-map-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <Navbar stats={stats} activePage="learn" />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 px-8 md:px-16 lg:px-20 pb-0 mb-0">
        <div className="w-full lg:w-[444px] flex-shrink-0 relative z-0">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-['ZT_Nature'] text-2xl md:text-3xl font-medium text-white">
              {(() => {
                const className = profile?.classes?.name || profile?.profile?.classes?.name || 'Class';
                const gradeName = profile?.grade_levels?.name || profile?.profile?.grade_levels?.name || '';
                return gradeName ? `${className} - Grade ${gradeName}` : className;
              })()}
            </h3>
            <button className="w-10 h-10 p-2 bg-white/10 rounded-2xl hover:bg-white/15 transition-colors">
              <img src="/img/codia/icon-settings.svg" alt="Settings icon" className="w-4 h-4" />
            </button>
          </div>
          <h2 className="font-['ZT_Nature'] text-4xl font-medium text-[#ee2724] mb-4">
            {currentSubject?.title || currentSubject?.name || 'Subject'}
          </h2>
          
          {selectedLevel && selectedLevelIndex !== null && (
            <LevelInfoPanel
              level={selectedLevel}
              status={getLevelStatus(selectedLevel.id, selectedLevelIndex)}
              onStart={() => {
                if (selectedLevel) {
                  handleStartLevel(selectedLevel.id);
                  setSelectedLevel(null);
                  setSelectedLevelIndex(null);
                }
              }}
              onClose={() => {
                setSelectedLevel(null);
                setSelectedLevelIndex(null);
              }}
            />
          )}

          {!selectedLevel && (() => {
            const currentLevel = journeyLevels.find(l => l.status === 'in_progress' || l.journey_status === 'in_progress');
            const currentLevelData = currentLevel ? levels.find(l => l.id === currentLevel.id) : null;
            
            if (!currentLevel || !currentLevelData) return null;

            const minReward = currentLevelData.points_reward || 0;
            const maxReward = Math.floor(minReward * 2);
            const rewardText = maxReward > minReward ? `${minReward} - ${maxReward}` : `${minReward}`;

            return (
              <div className="relative w-full h-[247px] bg-[rgba(170,170,170,0.05)] rounded-[32px] border-2 border-[#aaaaaa] p-6">
                <div className="flex flex-col gap-2 mb-4">
                  <p className="font-['ZT_Nature'] text-xl font-medium text-[#eeeeee]">
                    Lesson {currentLevelData.level_index || currentLevel.id} ��� {currentLevelData.title || 'Current Lesson'}<br />
                    Reward: {rewardText}<br />
                    Status: <span className="bg-gradient-to-b from-[#ffb514] to-[#f4ee17] bg-clip-text text-transparent">Ongoing</span>
                  </p>
                </div>
                <img src="/img/codia/icon-ongoing.svg" alt="Ongoing icon" className="absolute top-[52px] left-[190px] w-6 h-6" />
                <button 
                  onClick={() => handleStartLevel(currentLevel.id)}
                  className="absolute bottom-6 left-6 right-6 h-14 bg-gradient-to-b from-[#ee2724] to-[#f15a45] rounded-3xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset] hover:opacity-90 transition-opacity"
                >
                  <span className="font-['ZT_Nature'] text-2xl font-medium text-[#eeeeee]">Continue Lesson</span>
                </button>
              </div>
            );
          })()}
        </div>

        <div className="flex-1 flex flex-col gap-4 mb-0">
          <div className="w-full">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-['ZT_Nature'] text-2xl md:text-3xl font-medium text-white">Your journey</h3>
              <span className="font-['ZT_Nature'] text-2xl font-medium text-[#aaaaaa]">
                {completedCount} / {totalCount}
              </span>
            </div>
            <div className="relative w-full h-2 bg-[rgba(170,170,170,0.5)] rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-[#1fb622] rounded-full shadow-[0_0_24px_0_rgba(31,182,34,0.5)]" 
                style={{width: `${progressPercent}%`}}
              ></div>
            </div>
          </div>

          <div 
            className="journey-map-container relative w-full max-w-[350px] mx-auto overflow-x-hidden overflow-y-auto scroll-smooth z-10 mt-8" 
            style={{
              height: 'auto',
              minHeight: '925px',
              maxHeight: '925px',
              paddingTop: '20px',
              paddingBottom: '0',
              marginBottom: '0',
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              pointerEvents: 'auto',
              position: 'relative'
            }}
            onWheel={(e) => {
              // Allow scrolling within this container, but prevent it from bubbling to parent
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              // Allow scrolling within this container, but prevent it from bubbling to parent
              e.stopPropagation();
            }}
            onScroll={(e) => {
              // Allow scrolling within this container, but prevent it from bubbling to parent
              e.stopPropagation();
            }}
          >
            {/* Path Images - Change to green when levels are unlocked */}
            {/* Path 1: Level 1 to Level 2 */}
            <div className="absolute top-[2.86px] left-[146.111px] w-[191.251px] h-[270.431px] z-0">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500" 
                style={{
                  backgroundImage: 'url(/img/codia/path-level1-to-level2.svg)',
                  filter: getPathStatus(0, 1) 
                    ? 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)' // Green filter
                    : 'brightness(0)',
                  opacity: getPathStatus(0, 1) ? 0.7 : 0.3
                }}
              ></div>
            </div>
            {/* Path 2: Level 2 to Level 3 */}
            <div className="absolute top-[207.045px] left-[2.633px] w-[191.955px] h-[157.955px] z-0">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500" 
                style={{
                  backgroundImage: 'url(/img/codia/path-level2-to-level3.svg)',
                  filter: getPathStatus(1, 2) 
                    ? 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)' // Green filter
                    : 'brightness(0)',
                  opacity: getPathStatus(1, 2) ? 0.7 : 0.3
                }}
              ></div>
            </div>
            {/* Path 3: Level 3 to Level 4+ (long path) */}
            <div className="absolute top-[339.5px] left-[26.86px] w-[286.503px] h-[551.625px] z-0">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500" 
                style={{
                  backgroundImage: 'url(/img/codia/path-level3-plus.svg)',
                  filter: getLongPathStatus() 
                    ? 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)' // Green filter
                    : 'brightness(0)',
                  opacity: getLongPathStatus() ? 0.7 : 0.3
                }}
              ></div>
            </div>

            {levels?.map((level, index) => {
              const status = getLevelStatus(level.id, index);
              const isCompleted = status === 'completed';
              const isCurrent = status === 'current';
              const isLocked = status === 'locked';
              
              const gradientClass = isCompleted 
                ? 'bg-gradient-to-b from-[#1fb622] to-[#00ef05]' 
                : isCurrent 
                ? 'bg-gradient-to-b from-[#ffb514] to-[#f4ee17]' 
                : 'bg-gradient-to-b from-[#eeeeee] to-[#aaaaaa]';
              
              const position = nodePositions[index] || nodePositions[0];
              
              return (
                <div
                  key={level.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isLocked) {
                      setSelectedLevel(level);
                      setSelectedLevelIndex(index);
                    }
                  }}
                  className={`absolute w-[71.626px] h-[71.626px] rounded-[55.958px] flex flex-col justify-center items-center bg-gradient-to-br from-[#444444] to-[#060606] z-20 ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} transition-transform hover:scale-110 ${
                    isCurrent ? 'border-2 border-[#aaaaaa] shadow-[2.238px_2.238px_2.238px_0_rgba(255,255,255,0.25)_inset]' :
                    isLocked ? 'border-2 border-[#aaaaaa] shadow-[2.238px_2.238px_2.238px_0_rgba(0,0,0,0.25)_inset]' :
                    'shadow-[2px_2px_4px_0_rgba(255,255,255,0.5)_inset]'
                  }`}
                  style={{
                    top: position.top, 
                    left: position.left === '50%' ? '50%' : position.left, 
                    transform: position.left === '50%' ? 'translateX(-50%)' : 'none'
                  }}
                >
                  <span className={`font-['ZT_Nature'] text-[53.72px] font-medium ${gradientClass} bg-clip-text text-transparent`} style={{
                    textShadow: isCompleted 
                      ? '2px 2px 4px rgba(255, 255, 255, 0.5)' 
                      : isCurrent 
                      ? '2.238px 2.238px 2.238px rgba(255, 255, 255, 0.25)' 
                      : '2.238px 2.238px 2.238px rgba(0, 0, 0, 0.25)'
                  }}>
                    {level.level_index || index + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}

export default MainJourney;
