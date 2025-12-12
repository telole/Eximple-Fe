import { useEffect, useState } from 'react';
import useAchievementsStore from '../../stores/achievementsStore';
import useProgressStore from '../../stores/progressStore';
import Navbar from '../common/Navbar';

function Achievement() {
  const { allAchievements, myAchievements, isLoading, error, getAchievements, getMyAchievements } = useAchievementsStore();
  const { stats, getStats } = useProgressStore();
  const [displayAchievements, setDisplayAchievements] = useState([]);

  useEffect(() => {
    getStats();
    getAchievements();
    getMyAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Gabungkan allAchievements dengan status dari myAchievements
    if (allAchievements && Array.isArray(allAchievements) && allAchievements.length > 0) {
      const myAchievementIds = new Set(
        (myAchievements || [])
          .filter(ach => ach.unlocked || ach.status === 'unlocked' || ach.achieved)
          .map(ach => ach.id || ach.achievement_id)
      );

      const achievementsWithStatus = allAchievements.map(ach => ({
        ...ach,
        unlocked: myAchievementIds.has(ach.id)
      }));

      setDisplayAchievements(achievementsWithStatus);
    } else if (myAchievements && Array.isArray(myAchievements) && myAchievements.length > 0) {
      // Fallback: gunakan myAchievements jika allAchievements tidak tersedia
      setDisplayAchievements(myAchievements);
    }
  }, [allAchievements, myAchievements]);

  const formatPoints = (points) => {
    return new Intl.NumberFormat('id-ID').format(points || 0);
  };

  // Default achievement cards jika belum ada data
  const defaultAchievements = [
    {
      id: 1,
      title: 'Down in Flames I',
      description: '10 streak',
      points_reward: 2000,
      icon_url: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-12/yUat9BFUjJ.png',
      unlocked: false
    },
    {
      id: 2,
      title: 'Eternal Fire I',
      description: '50 Total Streak',
      points_reward: 5000,
      icon_url: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-12/6WTY4Nm686.png',
      unlocked: false
    }
  ];

  // Gunakan data dari API jika ada, jika tidak gunakan default
  const achievementsToShow = displayAchievements.length > 0 ? displayAchievements : defaultAchievements;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-x-hidden overflow-y-auto">
      <Navbar stats={stats} activePage="achievement" />
      
      <div className="w-full">
        <div className="relative px-8 md:px-16 lg:px-20 pb-20">
          {error && (
            <div className="mb-4 px-4 py-2 bg-red-500/20 border-2 border-red-500 rounded-lg">
              <p className="font-['ZT_Nature'] text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          <div className="flex justify-center mb-8">
            <span className="font-['ZT_Nature'] text-2xl md:text-3xl font-medium bg-gradient-to-r from-[rgba(170,170,170,0.8)] to-[#eeeeee] bg-clip-text text-transparent text-center max-w-2xl">
              Your achievements showcase your dedication and progress.
            </span>
          </div>

          {isLoading && displayAchievements.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-white font-['ZT_Nature'] text-2xl">Loading achievements...</div>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto">
              <div className="w-full bg-[rgba(170,170,170,0.05)] rounded-[16px] border border-[rgba(170,170,170,0.05)] p-8 relative overflow-hidden">
                <div className="flex flex-wrap gap-6 justify-center">
                  {achievementsToShow.map((achievement, index) => {
                    const isUnlocked = achievement.unlocked || achievement.status === 'unlocked' || achievement.achieved;
                    const achievementTitle = achievement.title || achievement.name || 'Achievement';
                    const achievementDesc = achievement.description || achievement.requirement || '';
                    const achievementPoints = achievement.points_reward || achievement.points || 0;
                    const achievementIcon = achievement.icon_url || achievement.icon || 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-12/yUat9BFUjJ.png';
                    
                    return (
                      <div
                        key={achievement.id || index}
                        className={`w-[200px] h-[260px] bg-[rgba(170,170,170,0.05)] rounded-[16px] border border-[#aaaaaa] relative overflow-hidden ${
                          !isUnlocked ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex w-[75px] gap-[8px] justify-center items-center absolute bottom-[44px] left-1/2 -translate-x-1/2">
                          <div className="w-[24px] h-[24px] bg-cover bg-center bg-no-repeat" style={{
                            backgroundImage: `url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-12/${achievementPoints >= 5000 ? 'Zh1UZy9iLS' : 'RHOXSnyM8O'}.png)`
                          }}></div>
                          <span className="font-['ZT_Nature'] text-[16px] font-medium leading-[19px] text-[#eeeeee]">
                            {formatPoints(achievementPoints)}
                          </span>
                        </div>
                        <div 
                          className="w-[374px] h-[233px] bg-cover bg-center bg-no-repeat absolute top-[-17px] left-1/2 -translate-x-1/2"
                          style={{ backgroundImage: `url(${achievementIcon})` }}
                        ></div>
                        <span className="absolute top-[162px] left-[37px] font-['ZT_Nature'] text-[16px] font-medium leading-[19px] text-[#fff] text-left whitespace-nowrap">
                          {achievementTitle}
                        </span>
                        <span className="absolute top-[191px] left-[73px] font-['ZT_Nature'] text-[12px] font-medium leading-[14px] text-[#fff] text-left whitespace-nowrap">
                          {achievementDesc}
                        </span>
                        {!isUnlocked && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="font-['ZT_Nature'] text-sm text-white/60">Locked</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="absolute -top-20 md:-top-15 right-4 md:right-21 lg:right-16 w-[480px] h-[480px] bg-cover bg-center bg-no-repeat hidden lg:block pointer-events-none" style={{
            backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-12/29v7JBL3ZU.png)'
          }}></div>
        </div>
      </div>
    </div>
  );
}

export default Achievement;
