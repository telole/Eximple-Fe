import { useEffect, useState, useRef } from 'react';

export default function FireAnimation({ isFirstStreakToday, isStreakActive }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const prevStreakRef = useRef(0);

  useEffect(() => {
    if (isFirstStreakToday && isStreakActive && !hasAnimated) {
      setIsAnimating(true);
      setHasAnimated(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);

      return () => clearTimeout(timer);
    }

    // Reset animation state if streak is not active
    if (!isStreakActive) {
      setHasAnimated(false);
      setIsAnimating(false);
    }
  }, [isFirstStreakToday, isStreakActive, hasAnimated]);

  return (
    <div className="relative">
      {/* Fire Icon */}
      <div className="relative">
        <img 
          src="/img/codia/icon-fire.svg" 
          alt="Fire icon" 
          className={`w-6 h-6 transition-all duration-500 ${
            isStreakActive && !isAnimating 
              ? 'brightness-150 filter drop-shadow(0 0 8px #f47b20)' 
              : 'brightness-75 grayscale'
          }`}
          style={{
            filter: isStreakActive && !isAnimating 
              ? 'brightness(1.5) drop-shadow(0 0 8px #f47b20)' 
              : 'brightness(0.75) grayscale(1)',
          }}
        />
        
        {/* Rotating Animation Overlay */}
        {isAnimating && (
          <div 
            className="absolute inset-0 animate-spin"
            style={{
              animation: 'fireRotate 2s ease-in-out',
            }}
          >
            <img 
              src="/img/codia/icon-fire.svg" 
              alt="Fire rotating" 
              className="w-6 h-6 brightness-150"
              style={{
                filter: 'brightness(1.5) drop-shadow(0 0 12px #f47b20)',
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fireRotate {
          0% {
            transform: rotate(0deg) scale(0.8);
            opacity: 0.5;
          }
          25% {
            transform: rotate(90deg) scale(1.2);
            opacity: 1;
          }
          50% {
            transform: rotate(180deg) scale(1.3);
            opacity: 1;
          }
          75% {
            transform: rotate(270deg) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

