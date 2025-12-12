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
    name: player.full_name || player.username || 'Anonymous',
    score: formatScore(player.points || player.total_points || 0),
    avatar: player.avatar_url || player.profile?.avatar_url || `https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/${index === 0 ? 'gXPhA1MN1F' : index === 1 ? 'ANh0XBr97G' : 'gTx4VSu8hQ'}.png`,
    podium: `https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/${index === 0 ? '6jmuEM8hR8' : index === 1 ? 'FndapZgwtV' : 'cBXyqu8i0g'}.png`,
    height: index === 0 ? '281px' : index === 1 ? '201px' : '164px',
    isFirst: index === 0,
    icon: `https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/${index === 0 ? '3AvDPy1UuS' : index === 1 ? 'jmzU0FQoDz' : 'ZzyrKYWLZ7'}.png`,
  }));

  const leaderboardRows = leaderboardArray.slice(3, 10).map((player, i) => ({
    rank: player.rank || i + 4,
    name: player.full_name || player.username || 'Anonymous',
    score: formatScore(player.points || player.total_points || 0),
    avatar: player.avatar_url || player.profile?.avatar_url || `https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/${['Wudj9many8', 'x6ZfH9f2Nj', 'ZQs7RcLO3K', '940kXzoBR6', 'OxyWktkWVi', '9A6uXoxkab', 'sqU8TPA3nB'][i]}.png`,
    icon: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/jEKfUptwRL.png'
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
        <div className="relative px-8 md:px-16 lg:px-20 pb-20">
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
            <div className="flex justify-center items-end gap-6 md:gap-12 lg:gap-2 mb-12 px-4">
              {topThree.length >= 3 ? (
                [topThree[1], topThree[0], topThree[2]].map((player) => (
                  <div key={player.rank} className="flex-1 max-w-[288px]">
                    <div className="relative flex flex-col items-center">
                      <div className={`relative -mb-10 w-20 h-20 bg-white/20 rounded-3xl overflow-hidden z-10 flex items-center justify-center ${player.isFirst ? 'shadow-[0_4px_0_0_#f4ee17]' : ''}`}>
                        <div className="w-12 h-12 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${player.avatar})`}}></div>
                      </div>
                      <div className="w-full rounded-t-[40px] bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${player.podium})`, height: player.height}}></div>
                      <div className="absolute top-[107px] left-1/2 -translate-x-1/2 text-center w-full">
                        <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">{player.name}</span>
                      </div>
                      <div className="absolute top-[135px] left-1/2 -translate-x-1/2 flex items-center gap-2">
                        <div className="w-6 h-6 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${player.icon})`}}></div>
                        <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">{player.score}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                topThree.map((player) => (
                  <div key={player.rank} className="flex-1 max-w-[288px]">
                    <div className="relative flex flex-col items-center">
                      <div className={`relative -mb-10 w-20 h-20 bg-white/20 rounded-3xl overflow-hidden z-10 flex items-center justify-center ${player.isFirst ? 'shadow-[0_4px_0_0_#f4ee17]' : ''}`}>
                        <div className="w-12 h-12 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${player.avatar})`}}></div>
                      </div>
                      <div className="w-full rounded-t-[40px] bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${player.podium})`, height: player.height}}></div>
                      <div className="absolute top-[107px] left-1/2 -translate-x-1/2 text-center w-full">
                        <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">{player.name}</span>
                      </div>
                      <div className="absolute top-[135px] left-1/2 -translate-x-1/2 flex items-center gap-2">
                        <div className="w-6 h-6 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${player.icon})`}}></div>
                        <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">{player.score}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {myRank && (
              <div className="flex justify-center mb-8">
                <div className="w-full max-w-md">
                  <div className="text-center mb-4">
                    <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">Your rank:</span>
                  </div>
                  <div className="flex justify-between items-center px-8 py-3 bg-[rgba(31,182,34,0.1)] rounded-2xl">
                    <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">
                      #{myRank.rank || '-'}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/7imvjDDAMh.png)'}}></div>
                      </div>
                      <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">
                        {user?.username || user?.profile?.full_name || 'Pengguna'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/jEKfUptwRL.png)'}}></div>
                      <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">
                        {formatScore(myRank.points || myRank.total_points || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full max-w-4xl mx-auto bg-[rgba(170,170,170,0.05)] rounded-[32px] p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  {['total', 'weekly', 'monthly'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-3xl transition-colors ${
                        type === t
                          ? 'bg-[#1fb622] text-white'
                          : 'hover:bg-white/5 text-[#eeeeee]'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="font-['ZT_Nature'] text-base font-medium capitalize">{t}</span>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={refresh}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-3xl hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">
                    {isLoading ? 'Loading...' : 'Show all'}
                  </span>
                </button>
              </div>
              <div className="flex items-center h-12 mb-2 px-4">
                <span className="w-20 font-['ZT_Nature'] text-base font-medium text-white/50">Ranking</span>
                <span className="flex-1 font-['ZT_Nature'] text-base font-medium text-white/50">Player</span>
                <span className="w-32 font-['ZT_Nature'] text-base font-medium text-white/50 text-right">Highest Emerald</span>
              </div>
              <div className="flex flex-col gap-2">
                {leaderboardRows.length === 0 ? (
                  <div className="text-center py-8 text-white/60 font-['ZT_Nature']">
                    No more players to display
                  </div>
                ) : (
                  leaderboardRows.map((row) => (
                    <div key={row.rank} className="flex items-center h-12 bg-[rgba(31,182,34,0.1)] rounded-2xl px-4">
                      <span className="w-20 font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">{row.rank}</span>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${row.avatar})`}}></div>
                        </div>
                        <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">{row.name}</span>
                      </div>
                      <div className="w-32 flex items-center justify-end gap-2">
                        <div className="w-6 h-6 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${row.icon})`}}></div>
                        <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">{row.score}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

          <div className="absolute -top-20 md:-top-15 right-4 md:right-21 lg:right-16 w-[480px] h-[480px] bg-cover bg-center bg-no-repeat hidden lg:block pointer-events-none" style={{backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/KaQcan1GZc.png)'}}></div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
