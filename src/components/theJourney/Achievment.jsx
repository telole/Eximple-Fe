import { useEffect, useMemo } from 'react';
import Navbar from '../common/Navbar';
import useAchievementsStore from '../../stores/achievementsStore';
import useProgressStore from '../../stores/progressStore';

export default function Achievement() {
  const { 
    getAllAchievements, 
    getMyAchievements, 
    allAchievements, 
    myAchievements, 
    isLoading, 
    error 
  } = useAchievementsStore();
  const { getStats, stats } = useProgressStore();

  useEffect(() => {
    getStats();
    // Load both all achievements and user's achievements
    getAllAchievements();
    getMyAchievements();
  }, [getStats, getAllAchievements, getMyAchievements]);

  // Combine all achievements with completion status
  const achievements = useMemo(() => {
    if (!allAchievements || allAchievements.length === 0) {
      return [];
    }

    // Get list of completed achievement IDs from myAchievements
    // Handle nested structure: myAchievements contains user_achievement objects with nested achievements
    const completedIds = new Set(
      (myAchievements || []).map(ua => {
        // Try different possible structures from API
        if (ua.achievement_id) return ua.achievement_id;
        if (ua.achievements?.id) return ua.achievements.id;
        if (ua.id && !ua.title) return ua.id; // user_achievement id, not achievement id
        return null;
      }).filter(id => id !== null)
    );

    // Map all achievements and mark which ones are completed
    return allAchievements.map(achievement => {
      const achievementId = achievement.id;
      const isCompleted = completedIds.has(achievementId);
      
      // Find the user_achievement record for this achievement
      const userAchievement = (myAchievements || []).find(ua => 
        ua.achievement_id === achievementId || 
        ua.achievements?.id === achievementId
      );
      
      return {
        ...achievement,
        completed: isCompleted,
        awarded_at: userAchievement?.awarded_at,
      };
    });
  }, [allAchievements, myAchievements]);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-x-hidden overflow-y-auto">
      <Navbar stats={stats} activePage="achievement" />
      
      <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-6 sm:py-8 md:py-10">
        <div className="max-w-7xl mx-auto relative">
          {/* Main Content Container */}
          <div className="relative z-10">
            {/* Mascot Character - Above Achievement Window */}
            <div className="hidden lg:block absolute top-[-120px] right-[-50px] w-[422px] h-[405px] bg-cover bg-center bg-no-repeat pointer-events-none z-20"
              style={{backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-14/WkDRANf6Bh.png)'}}
            />

            {/* Achievement Grid */}
            <div className="bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 relative z-10">
              {/* First Achievement - Large */}
              {achievements[0] && (
                <div className="mb-8">
                  <AchievementCard achievement={achievements[0]} isLarge />
                </div>
              )}

              {/* Other Achievements Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {achievements.slice(1).map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>

            {isLoading && (
              <div className="text-center text-white/60 font-['ZT_Nature']">
                Loading achievements...
              </div>
            )}

            {error && (
              <div className="text-center text-red-400 font-['ZT_Nature']">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementCard({ achievement, isLarge = false }) {
  if (!achievement) return null;

  const isCompleted = achievement.completed || false;
  const cardSize = isLarge 
    ? 'w-full h-[260px]' 
    : 'w-full h-[260px]';
  
  const iconSize = isLarge
    ? 'w-[210px] h-[131px]'
    : 'w-[210px] h-[131px]';

  // Get icon URL - handle nested structure from myAchievements
  const iconUrl = achievement.icon_url || 
                  achievement.icon || 
                  achievement.achievements?.icon_url ||
                  '/img/codia/leaderboard-avatar-1st.svg';

  // Get points reward
  const pointsReward = achievement.points_reward || 
                       achievement.points || 
                       achievement.achievements?.points_reward || 
                       0;

  return (
    <div className={`${cardSize} rounded-2xl border relative overflow-hidden flex flex-col items-center transition-all ${
      isCompleted 
        ? 'bg-[rgba(31,182,34,0.1)] border-[#1fb622] border-2' 
        : 'bg-[rgba(170,170,170,0.05)] border-[#aaaaaa]'
    }`}>
      {/* Completed Badge */}
      {isCompleted && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-[#1fb622] rounded-full flex items-center justify-center z-10">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Achievement Icon */}
      <div 
        className={`${iconSize} bg-cover bg-center bg-no-repeat mt-5 ${!isCompleted ? 'opacity-60' : ''}`}
        style={{backgroundImage: `url(${iconUrl})`}}
      />
      
      {/* Achievement Title */}
      <span className={`font-['ZT_Nature'] text-base font-medium text-center mt-4 px-2 ${
        isCompleted ? 'text-white' : 'text-white/70'
      }`}>
        {achievement.title || achievement.name || achievement.achievements?.title}
      </span>
      
      {/* Achievement Description */}
      <span className={`font-['ZT_Nature'] text-xs font-medium text-center mt-2 px-2 leading-tight ${
        isCompleted ? 'text-white' : 'text-white/60'
      }`}>
        {achievement.description || achievement.achievements?.description}
      </span>
      
      {/* Points Reward */}
      <div className="flex items-center gap-2 mt-3">
        <img 
          src="/img/codia/icon-leaf.svg" 
          alt="Points" 
          className="w-6 h-6" 
        />
        <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">
          {pointsReward}
        </span>
      </div>
    </div>
  );
}
