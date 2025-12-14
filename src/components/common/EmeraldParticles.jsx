import { useEffect, useState } from 'react';

export default function EmeraldParticles({ trigger, targetElement }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const particleCount = 25;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const velocity = 2 + Math.random() * 3;
      const delay = Math.random() * 200;

      newParticles.push({
        id: i,
        angle,
        velocity,
        delay,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 2000);

    return () => clearTimeout(timer);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => {
        const targetX = targetElement?.getBoundingClientRect().right || window.innerWidth - 150;
        const targetY = targetElement?.getBoundingClientRect().top + (targetElement?.getBoundingClientRect().height / 2) || 50;
        
        const distanceX = targetX - particle.x;
        const distanceY = targetY - particle.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const duration = Math.max(800, distance / particle.velocity);

        return (
          <div
            key={particle.id}
            className="absolute w-4 h-4"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              animationDelay: `${particle.delay}ms`,
              animation: `emeraldFly${particle.id} ${duration}ms ease-out forwards`,
            }}
          >
            <img 
              src="/img/codia/icon-leaf.svg" 
              alt="Emerald" 
              className="w-full h-full filter brightness-150"
              style={{
                filter: 'brightness(1.5) drop-shadow(0 0 4px #1fb622)',
              }}
            />
            <style>{`
              @keyframes emeraldFly${particle.id} {
                0% {
                  transform: translate(0, 0) scale(1) rotate(0deg);
                  opacity: 1;
                }
                50% {
                  transform: translate(${distanceX * 0.5}px, ${distanceY * 0.5}px) scale(1.2) rotate(180deg);
                  opacity: 0.8;
                }
                100% {
                  transform: translate(${distanceX}px, ${distanceY}px) scale(0.3) rotate(360deg);
                  opacity: 0;
                }
              }
            `}</style>
          </div>
        );
      })}
    </div>
  );
}

