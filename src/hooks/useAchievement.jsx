// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const achievementVariants = {
  hidden: {
    x: 400,
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.8,
    }
  },
  exit: {
    x: 400,
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
    }
  }
};

const progressBarVariants = {
  hidden: { width: 0 },
  visible: {
    width: '100%',
    transition: {
      duration: 0.5,
      delay: 0.3,
      ease: 'easeOut'
    }
  }
};

function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <motion.div
      variants={achievementVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed top-4 right-4 z-50 w-[380px] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-lg border-2 border-[#1fb622] shadow-[0_8px_32px_rgba(31,182,34,0.4)] overflow-hidden"
      style={{
        boxShadow: '0 8px 32px rgba(31, 182, 34, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="relative bg-gradient-to-r from-[#1fb622] to-[#168318] p-3 flex items-center gap-3">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"
        >
          <span className="text-2xl">🏆</span>
        </motion.div>
        <div className="flex-1">
          <h3 className="font-['ZT_Nature'] text-lg font-medium text-white">
            Achievement Unlocked!
          </h3>
          <p className="font-['ZT_Nature'] text-sm text-white/80">
            {achievement.name}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="p-4 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1fb622] to-[#168318] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">{achievement.icon || '⭐'}</span>
          </div>
          <div className="flex-1">
            <p className="font-['ZT_Nature'] text-sm text-white/90 leading-relaxed">
              {achievement.description}
            </p>
          </div>
        </div>

        <div className="relative h-1 bg-[#0a0a0a] rounded-full overflow-hidden">
          <motion.div
            variants={progressBarVariants}
            initial="hidden"
            animate="visible"
            className="h-full bg-gradient-to-r from-[#1fb622] to-[#168318] rounded-full"
            style={{
              boxShadow: '0 0 10px rgba(31, 182, 34, 0.6)',
            }}
          />
        </div>

        {achievement.points && (
          <div className="mt-3 flex items-center justify-end gap-2">
            <span className="font-['ZT_Nature'] text-xs text-white/60">Reward:</span>
            <span className="font-['ZT_Nature'] text-sm font-medium text-[#1fb622]">
              +{achievement.points} Points
            </span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#1fb622]/10 to-transparent animate-pulse"></div>
      </div>
    </motion.div>
  );
}

function AchievementContainer() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {   
    const handleAchievement = (event) => {
      const achievement = event.detail;
      const id = Date.now() + Math.random();
      setAchievements(prev => [...prev, { ...achievement, id }]);
    };

    window.addEventListener('showAchievement', handleAchievement);
    return () => window.removeEventListener('showAchievement', handleAchievement);
  }, []);

  const removeAchievement = (id) => {
    setAchievements(prev => prev.filter(ach => ach.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none flex flex-col gap-4">
      <AnimatePresence>
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="pointer-events-auto"
          >
            <AchievementToast
              achievement={achievement}
              onClose={() => removeAchievement(achievement.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function triggerAchievement(name, description, icon = '⭐', points = 0) {
  const event = new CustomEvent('showAchievement', {
    detail: {
      name,
      description,
      icon,
      points,
    }
  });
  window.dispatchEvent(event);
}

export default AchievementContainer;

