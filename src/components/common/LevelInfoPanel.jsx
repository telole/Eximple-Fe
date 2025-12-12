function LevelInfoPanel({ level, status, onStart, onClose }) {
  if (!level) return null;

  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';

  const statusConfig = {
    completed: {
      bg: 'bg-[#1fb622]/20',
      text: 'text-[#1fb622]',
      label: 'Γ£ô Completed'
    },
    current: {
      bg: 'bg-[#ffb514]/20',
      text: 'text-[#ffb514]',
      label: 'ΓùÅ Current'
    },
    locked: {
      bg: 'bg-white/10',
      text: 'text-white/60',
      label: '≡ƒöÆ Locked'
    }
  };

  const config = statusConfig[status] || statusConfig.locked;
  const minReward = level.points_reward || 0;
  const maxReward = Math.floor(minReward * 2);
  const rewardText = maxReward > minReward ? `${minReward} - ${maxReward}` : `${minReward}`;

  return (
    <div className="w-full bg-[rgba(170,170,170,0.05)] rounded-[32px] border-2 border-[#aaaaaa] p-6 mt-4 min-h-[400px] flex flex-col relative z-0">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-['ZT_Nature'] text-4xl font-medium text-white mb-3">
            Level {level.level_index || level.id}
          </h2>
          <div className={`inline-block px-4 py-2 rounded-lg ${config.bg}`}>
            <span className={`font-['ZT_Nature'] text-lg font-medium ${config.text}`}>
              {config.label}
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
        >
          <span className="text-white text-2xl">├ù</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white/5 rounded-2xl border-2 border-white/10 p-6 flex-1">
          <h3 className="font-['ZT_Nature'] text-2xl font-medium text-white mb-4">
            {level.title || 'Level Information'}
          </h3>
          {level.description ? (
            <div className="space-y-3">
              <p className="text-white/80 font-['ZT_Nature'] text-lg leading-relaxed">
                {level.description}
              </p>
            </div>
          ) : (
            <p className="text-white/60 font-['ZT_Nature'] text-base italic">
              Tidak ada deskripsi tersedia untuk level ini.
            </p>
          )}
        </div>

        <div className="bg-white/5 rounded-2xl border-2 border-white/10 p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-['ZT_Nature'] text-lg text-white/80">Reward:</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/X2tuHmK19p.png)'}}></div>
                <span className="font-['ZT_Nature'] text-xl font-medium text-[#1fb622]">{rewardText}</span>
              </div>
            </div>
            {level.difficulty && (
              <div className="flex justify-between items-center">
                <span className="font-['ZT_Nature'] text-lg text-white/80">Difficulty:</span>
                <span className="font-['ZT_Nature'] text-xl font-medium text-white">{level.difficulty}</span>
              </div>
            )}
            {level.estimated_time && (
              <div className="flex justify-between items-center">
                <span className="font-['ZT_Nature'] text-lg text-white/80">Estimated Time:</span>
                <span className="font-['ZT_Nature'] text-xl font-medium text-white">{level.estimated_time}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-2">
          <button 
            onClick={() => {
              if (!isLocked && onStart) {
                onStart();
              }
            }}
            disabled={isLocked}
            className={`w-full h-14 rounded-3xl transition-opacity ${
              isLocked 
                ? 'bg-white/10 opacity-50 cursor-not-allowed' 
                : 'bg-gradient-to-b from-[#168318] to-[#1fb622] shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset] hover:opacity-90'
            }`}
          >
            <span className="font-['ZT_Nature'] text-xl font-medium text-[#eeeeee]">
              {isCompleted ? 'Restart Level' : isCurrent ? 'Continue Level' : 'Start Level'}
            </span>
          </button>
          <button 
            onClick={onClose}
            className="w-full h-14 border-4 border-[#1fb622] rounded-3xl hover:bg-[#1fb622]/10 transition-colors"
          >
            <span className="font-['ZT_Nature'] text-xl font-medium text-[#1fb622]">Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LevelInfoPanel;

