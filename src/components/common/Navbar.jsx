import { useNavigate } from 'react-router-dom';
import useProfileStore from '../../stores/profileStore';

function Navbar({ stats, activePage = 'learn' }) {
  const navigate = useNavigate();
  const { points: profilePoints, streak: profileStreak } = useProfileStore();

  const isActive = (page) => activePage === page;

  return (
    <div className="flex justify-between items-center px-8 md:px-16 lg:px-20 py-10">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 relative">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/527xmx2x1v.png)'}}
            ></div>
          </div>
          <span className="font-['Airlash_Raiders'] text-2xl font-normal bg-gradient-to-b from-[#1fb622] to-[#168318] bg-clip-text text-transparent">Eximple</span>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/journey')}
            className={`px-4 py-2 rounded-lg transition-all ${
              isActive('learn')
                ? 'bg-gradient-to-b from-[#168318] to-[#1fb622] shadow-[0_-2px_4px_0_#00ff05_inset] hover:opacity-90'
                : 'hover:bg-white/5'
            }`}
          >
            <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">Learn</span>
          </button>
          <button 
            onClick={() => navigate('/leaderboard')}
            className={`px-4 py-2 rounded-lg transition-all ${
              isActive('leaderboard')
                ? 'bg-gradient-to-b from-[#168318] to-[#1fb622] shadow-[0_-2px_4px_0_#00ff05_inset] hover:opacity-90'
                : 'hover:bg-white/5'
            }`}
          >
            <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">Leaderboard</span>
          </button>
          <button 
            onClick={() => navigate('/ai-agent')}
            className={`px-4 py-2 rounded-lg transition-all ${
              isActive('ai-agent')
                ? 'bg-gradient-to-b from-[#168318] to-[#1fb622] shadow-[0_-2px_4px_0_#00ff05_inset] hover:opacity-90'
                : 'hover:bg-white/5'
            }`}
          >
            <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">AI Agent</span>
          </button>
          <button 
            onClick={() => navigate('/achievement')}
            className={`px-4 py-2 rounded-lg transition-all ${
              isActive('achievement')
                ? 'bg-gradient-to-b from-[#168318] to-[#1fb622] shadow-[0_-2px_4px_0_#00ff05_inset] hover:opacity-90'
                : 'hover:bg-white/5'
            }`}
          >
            <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">Achievement</span>
          </button>
          <button 
            onClick={() => navigate('/teams')}
            className={`px-4 py-2 rounded-lg transition-all ${
              isActive('teams')
                ? 'bg-gradient-to-b from-[#168318] to-[#1fb622] shadow-[0_-2px_4px_0_#00ff05_inset] hover:opacity-90'
                : 'hover:bg-white/5'
            }`}
          >
            <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">Our Team</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-6 py-4 bg-gradient-to-b from-[#f47b20] to-[#f99621] rounded-2xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset]">
          <div className="w-6 h-6 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/o5MNk0rnUL.png)'}}></div>
          <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">
            {typeof profilePoints === 'object' ? (profilePoints?.total || 0) : (profilePoints || stats?.points?.total || stats?.points || stats?.total_points || 0)}
          </span>
        </div>
        {(() => {
          const streakValue = typeof profileStreak === 'object' ? (profileStreak?.current || profileStreak?.current_streak) : profileStreak;
          const displayStreak = streakValue || 0;
          return displayStreak > 0 ? (
          <div className="flex items-center gap-2 px-6 py-4 bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-2xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset]">
            <span className="text-xl">a"���</span>
            <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">
              {displayStreak}
            </span>
          </div>
          ) : null;
        })()}
        <div className="flex items-center gap-2 px-6 py-4 bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-2xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset]">
          <div className="w-6 h-6 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/X2tuHmK19p.png)'}}></div>
          <span className="font-['ZT_Nature'] text-base font-medium text-[#eeeeee]">
            {typeof profilePoints === 'object' ? (profilePoints?.total || 0) : (profilePoints || stats?.points?.total || stats?.points || stats?.total_points || 0)}
          </span>
        </div>
        <button 
          onClick={() => navigate('/profile')}
          className={`w-14 h-14 p-4 rounded-full transition-colors ${
            isActive('profile')
              ? 'bg-gradient-to-b from-[#168318] to-[#1fb622]'
              : 'bg-white/10 hover:bg-white/15'
          }`}
        >
          <div className="w-6 h-6 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/SShC1LrhhQ.png)'}}></div>
        </button>
      </div>
    </div>
  );
}

export default Navbar;

