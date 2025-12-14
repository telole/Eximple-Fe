import { useEffect } from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import useAuthStore from '../../stores/authStore';
import useProgressStore from '../../stores/progressStore';
import Navbar from '../common/Navbar';

function Leaderboard() {
  const { user } = useAuthStore();
  const { leaderboard, myRank, type, isLoading, setType, refresh, error } = useLeaderboard();
  const { stats, getStats } = useProgressStore();

  useEffect(() => {
    getStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatScore = (score) => {
    return new Intl.NumberFormat('id-ID').format(score || 0);
  };

  // Ensure leaderboard is always an array
  const leaderboardArray = Array.isArray(leaderboard) ? leaderboard : [];

  const topThree = leaderboardArray.slice(0, 3).map((player, index) => ({
    rank: player.rank || index + 1,
    name:  player.username || 'Anonymous',
    score: formatScore(player.points || player.total_points || 0),
    avatar: player.avatar_url || player.profile?.avatar_url || `/img/fullassets/${index === 0 ? 'leaderboard-avatar-1st' : index === 1 ? 'leaderboard-avatar-2nd' : 'leaderboard-avatar-3rd'}.svg`,
    podium: `/img/fullassets/${index === 0 ? 'leaderboard-podium-1st' : index === 1 ? 'leaderboard-podium-2nd' : 'leaderboard-podium-3rd'}.svg`,
    height: index === 0 ? '281px' : index === 1 ? '201px' : '164px',
    isFirst: index === 0,
    icon: `/img/fullassets/${index === 0 ? 'leaderboard-icon-1st' : index === 1 ? 'leaderboard-icon-2nd' : 'leaderboard-icon-3rd'}.svg`,
  }));

  const leaderboardRows = leaderboardArray.slice(3, 10).map((player, i) => ({
    rank: player.rank || i + 4,
    name: player.full_name || player.username || 'Anonymous',
    score: formatScore(player.points || player.total_points || 0),
    avatar: player.avatar_url || player.profile?.avatar_url || `/img/fullassets/leaderboard-avatar-${i + 4}.svg`,
    icon: '/img/fullassets/leaderboard-icon-default.svg'
  }));

  // Early return for initial loading state
  if (isLoading && leaderboardArray.length === 0) {
    return (
      <div className="w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-x-hidden overflow-y-auto">
        <Navbar stats={stats} activePage="leaderboard" />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-white font-['ZT_Nature'] text-2xl">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-x-hidden overflow-y-auto">
      <Navbar stats={stats} activePage="leaderboard" />
      
      <div className="w-full">
        <div className="relative px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 pb-20">
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-500/20 border-2 border-red-500 rounded-lg">
            <p className="font-['ZT_Nature'] text-sm text-red-400 text-center">{error}</p>
          </div>
        )}

        <div className="flex justify-center mb-8">
          <span className="font-['ZT_Nature'] text-2xl md:text-3xl font-medium bg-gradient-to-r from-[rgba(170,170,170,0.8)] to-[#eeeeee] bg-clip-text text-transparent text-center max-w-2xl">
            This isn't to extinguish your enthusiasm, use it as a spark to make it burn.
          </span>
        </div>

        {isLoading && leaderboardArray.length === 0 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-white font-['ZT_Nature'] text-2xl">Loading leaderboard...</div>
          </div>
        ) : leaderboardArray.length === 0 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-white/60 font-['ZT_Nature'] text-xl text-center">
              No leaderboard data available
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center items-end gap-2 sm:gap-4 md:gap-6 lg:gap-12 xl:gap-2 mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
              {topThree.length >= 3 ? (
                [topThree[1], topThree[0], topThree[2]].map((player) => (
                  <div key={player.rank} className="flex-1 max-w-[120px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[288px]">
                    <div className="relative flex flex-col items-center">
                      <div className={`relative -mb-4 sm:-mb-6 md:-mb-8 lg:-mb-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/20 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden z-10 flex items-center justify-center ${player.isFirst ? 'shadow-[0_2px_0_0_#f4ee17] sm:shadow-[0_3px_0_0_#f4ee17] md:shadow-[0_4px_0_0_#f4ee17]' : ''}`}>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${player.avatar})`}}></div>
                      </div>
                      <div className={`w-full rounded-t-[20px] sm:rounded-t-[30px] md:rounded-t-[40px] bg-cover bg-center bg-no-repeat ${player.isFirst ? 'h-[140px] sm:h-[180px] md:h-[220px] lg:h-[281px]' : player.rank === 2 ? 'h-[100px] sm:h-[140px] md:h-[180px] lg:h-[201px]' : 'h-[90px] sm:h-[120px] md:h-[150px] lg:h-[164px]'}`} style={{backgroundImage: `url(${player.podium})`}}></div>
                      <div className={`absolute ${player.isFirst ? 'top-[90px] sm:top-[120px] md:top-[150px] lg:top-[107px]' : player.rank === 2 ? 'top-[70px] sm:top-[95px] md:top-[120px] lg:top-[107px]' : 'top-[65px] sm:top-[85px] md:top-[105px] lg:top-[107px]'} left-1/2 -translate-x-1/2 text-center w-full px-1`}>
                        <span className="font-['ZT_Nature'] text-xs sm:text-sm md:text-base font-medium text-[#eeeeee] truncate block">{player.name}</span>
                      </div>
                      <div className={`absolute ${player.isFirst ? 'top-[110px] sm:top-[145px] md:top-[175px] lg:top-[135px]' : player.rank === 2 ? 'top-[85px] sm:top-[115px] md:top-[145px] lg:top-[135px]' : 'top-[78px] sm:top-[103px] md:top-[128px] lg:top-[135px]'} left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2`}>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${player.icon})`}}></div>
                        <span className="font-['ZT_Nature'] text-xs sm:text-sm md:text-base font-medium text-[#eeeeee]">{player.score}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                topThree.map((player) => (
                  <div key={player.rank} className="flex-1 max-w-[120px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[288px]">
                    <div className="relative flex flex-col items-center">
                      <div className={`relative -mb-4 sm:-mb-6 md:-mb-8 lg:-mb-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/20 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden z-10 flex items-center justify-center ${player.isFirst ? 'shadow-[0_2px_0_0_#f4ee17] sm:shadow-[0_3px_0_0_#f4ee17] md:shadow-[0_4px_0_0_#f4ee17]' : ''}`}>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${player.avatar})`}}></div>
                      </div>
                      <div className={`w-full rounded-t-[20px] sm:rounded-t-[30px] md:rounded-t-[40px] bg-cover bg-center bg-no-repeat ${player.isFirst ? 'h-[140px] sm:h-[180px] md:h-[220px] lg:h-[281px]' : player.rank === 2 ? 'h-[100px] sm:h-[140px] md:h-[180px] lg:h-[201px]' : 'h-[90px] sm:h-[120px] md:h-[150px] lg:h-[164px]'}`} style={{backgroundImage: `url(${player.podium})`}}></div>
                      <div className={`absolute ${player.isFirst ? 'top-[90px] sm:top-[120px] md:top-[150px] lg:top-[107px]' : player.rank === 2 ? 'top-[70px] sm:top-[95px] md:top-[120px] lg:top-[107px]' : 'top-[65px] sm:top-[85px] md:top-[105px] lg:top-[107px]'} left-1/2 -translate-x-1/2 text-center w-full px-1`}>
                        <span className="font-['ZT_Nature'] text-xs sm:text-sm md:text-base font-medium text-[#eeeeee] truncate block">{player.name}</span>
                      </div>
                      <div className={`absolute ${player.isFirst ? 'top-[110px] sm:top-[145px] md:top-[175px] lg:top-[135px]' : player.rank === 2 ? 'top-[85px] sm:top-[115px] md:top-[145px] lg:top-[135px]' : 'top-[78px] sm:top-[103px] md:top-[128px] lg:top-[135px]'} left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2`}>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${player.icon})`}}></div>
                        <span className="font-['ZT_Nature'] text-xs sm:text-sm md:text-base font-medium text-[#eeeeee]">{player.score}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {myRank && (
              <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 mb-6 sm:mb-8 px-4">
                <div className="w-full max-w-md">
                  <div className="text-center mb-3 sm:mb-4">
                    <span className="font-['ZT_Nature'] text-sm sm:text-base font-medium text-[#eeeeee]">Your rank:</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 px-4 sm:px-6 md:px-8 py-3 bg-[rgba(31,182,34,0.1)] rounded-xl sm:rounded-2xl">
                    <span className="font-['ZT_Nature'] text-sm sm:text-base font-medium text-[#eeeeee]">
                      #{myRank.rank || '-'}
                    </span>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <img src="/img/fullassets/leaderboard-icon-rank.svg" alt="Rank" className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <span className="font-['ZT_Nature'] text-sm sm:text-base font-medium text-[#eeeeee] truncate max-w-[120px] sm:max-w-none">
                        {user?.username || user?.profile?.full_name || 'Pengguna'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src="/img/fullassets/leaderboard-icon-default.svg" alt="Points" className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="font-['ZT_Nature'] text-sm sm:text-base font-medium text-[#eeeeee]">
                        {formatScore(myRank.points || myRank.total_points || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full max-w-xl mx-auto bg-[rgba(170,170,170,0.05)] rounded-2xl sm:rounded-3xl md:rounded-[32px] p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-3 sm:mb-4 md:mb-6">
                <div className="flex gap-2">
                  {['total', 'weekly', 'monthly'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      disabled={isLoading}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl transition-colors ${
                        type === t
                          ? 'bg-[#1fb622] text-white'
                          : 'hover:bg-white/5 text-[#eeeeee]'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="font-['ZT_Nature'] text-xs sm:text-sm font-medium capitalize">{t}</span>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={refresh}
                  disabled={isLoading}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-['ZT_Nature'] text-xs sm:text-sm font-medium text-[#eeeeee]">
                    {isLoading ? 'Loading...' : 'Show all'}
                  </span>
                </button>
              </div>
              <div className="hidden sm:flex items-center h-10 mb-2 px-2">
                <span className="w-16 font-['ZT_Nature'] text-xs sm:text-sm font-medium text-white/50">Ranking</span>
                <span className="flex-1 font-['ZT_Nature'] text-xs sm:text-sm font-medium text-white/50 px-2">Player</span>
                <span className="w-24 font-['ZT_Nature'] text-xs sm:text-sm font-medium text-white/50 text-right">Highest Emerald</span>
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                {leaderboardRows.length === 0 ? (
                  <div className="text-center py-6 text-white/60 font-['ZT_Nature'] text-sm">
                    No more players to display
                  </div>
                ) : (
                  leaderboardRows.map((row) => (
                    <div key={row.rank} className="flex flex-row items-center gap-2 sm:gap-0 h-12 bg-[rgba(31,182,34,0.1)] rounded-lg sm:rounded-xl px-3 sm:px-4">
                      <div className="w-12 sm:w-16 flex items-center justify-start">
                        <span className="font-['ZT_Nature'] text-xs sm:text-sm font-medium text-[#eeeeee]">#{row.rank}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${row.avatar})`}}></div>
                        </div>
                        <span className="font-['ZT_Nature'] text-xs sm:text-sm font-medium text-[#eeeeee] truncate min-w-0">{row.name}</span>
                      </div>
                      <div className="w-20 sm:w-24 flex items-center justify-end gap-1.5 sm:gap-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-cover bg-center bg-no-repeat flex-shrink-0" style={{backgroundImage: `url(${row.icon})`}}></div>
                        <span className="font-['ZT_Nature'] text-xs sm:text-sm font-medium text-[#eeeeee]">{row.score}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

          <div className="absolute -top-20 md:-top-15 right-4 md:right-21 lg:right-16 w-[480px] h-[480px] bg-cover bg-center bg-no-repeat hidden lg:block pointer-events-none" style={{backgroundImage: 'url(/img/fullassets/leaderboard-background.png)'}}></div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
