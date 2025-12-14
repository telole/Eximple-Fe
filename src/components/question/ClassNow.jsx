import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProfileCompletionStore from '../../stores/profileCompletionStore';

function ClassNow() {
  const navigate = useNavigate();
  const { class_id, setClassId } = useProfileCompletionStore();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [error, setError] = useState(null);

  const levelToClassId = {
    'elementary': 1,
    'middle': 2,
    'high': 3
  };

  const levels = [
    { id: 'elementary', name: 'Elementary School', image: '/img/getStartedImg/mascotmodel3.png', classId: levelToClassId.elementary },
    { id: 'middle', name: 'Middle School', image: '/img/getStartedImg/mascotmodel4.png', classId: levelToClassId.middle },
    { id: 'high', name: 'High School', image: '/img/getStartedImg/middlescroll.png', classId: levelToClassId.high }
  ];

  const selectLevel = (level) => {
    const levelData = levels.find(l => l.id === level);
    if (levelData) {
      setSelectedLevel(level);
      setClassId(levelData.classId);
      setError(null);
    }
  };


  const handleContinue = () => {
    if (!class_id) {
      setError('Please select your school level');
      return;
    }
    
    navigate('/class-grade');
  };

  const handleGoBack = () => {
    navigate('/otp');
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-hidden flex flex-col">
      
      <div className="flex justify-center pt-10 pb-6 z-10">
        <div className="flex items-center gap-2 px-4">
          <div className="w-12 h-12 relative">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{backgroundImage: 'url(/img/getStartedImg/bags.png)'}}
            ></div>
          </div>
          <span className="font-['Airlash_Raiders'] text-3xl font-normal bg-gradient-to-b from-[#1fb622] to-[#168318] bg-clip-text text-transparent">
            Eximple
          </span>
        </div>
      </div>

      
      <div className="flex-1 flex items-center justify-center px-4 md:px-8 pb-20 md:pb-8 relative overflow-y-auto">
        
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] md:w-[400px] lg:w-[450px] aspect-square z-0 animate-[floatRealistic_5s_ease-in-out_infinite] hidden sm:block pointer-events-none -mt-8 md:-mt-12 lg:-mt-16 opacity-50 sm:opacity-100">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{backgroundImage: 'url(/img/getStartedImg/highscholl.png)'}}
          ></div>
        </div>

        
        <div className="flex flex-col items-center gap-4 sm:gap-6 z-10 relative w-full max-w-4xl">
          <h2 className="font-['Press_Start_2P'] text-xs sm:text-sm md:text-base lg:text-lg text-white text-center leading-relaxed px-4">
            What level are you at now?
          </h2>

          
          {error && (
            <div className="w-full max-w-md px-4 py-2 bg-red-500/20 border-2 border-red-500 rounded-lg">
              <p className="font-['ZT_Nature'] text-xs sm:text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          
          <div className="flex gap-3 sm:gap-4 md:gap-6 justify-center flex-wrap px-4 w-full">
            {levels.map((level) => (
              <div
                key={level.id}
                onClick={() => selectLevel(level.id)}
                className={`w-full max-w-[280px] sm:w-[200px] md:w-[240px] h-auto min-h-[240px] sm:min-h-[288px] sm:h-[288px] rounded-[24px] sm:rounded-[32px] border-2 flex flex-col items-center cursor-pointer transition-all ${
                  selectedLevel === level.id
                    ? 'border-[#1fb622] border-4 bg-[rgba(31,182,34,0.15)]'
                    : 'border-[#aaaaaa] bg-[rgba(170,170,170,0.05)] hover:border-[#1fb622] hover:bg-[rgba(31,182,34,0.1)]'
                }`}
              >
                <div 
                  className={`${level.id === 'elementary' ? 'w-full max-w-[200px] sm:max-w-[241px] h-[100px] sm:h-[132px] mt-[32px] sm:mt-[42px]' : level.id === 'middle' ? 'w-full max-w-[200px] sm:max-w-[232px] h-[90px] sm:h-[121px] mt-[40px] sm:mt-[52px]' : 'w-full max-w-[220px] sm:max-w-[264px] h-[100px] sm:h-[136px] mt-[32px] sm:mt-[41px]'} bg-cover bg-center bg-no-repeat`}
                  style={{backgroundImage: `url(${level.image})`}}
                ></div>
                <span className="font-['ZT_Nature'] text-xs sm:text-sm md:text-base font-medium text-white text-center mt-[16px] sm:mt-[22px] px-4 pb-4">
                  {level.name.split(' ').map((word, i) => (
                    <span key={i}>
                      {word}
                      {i < level.name.split(' ').length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

                
      <div className="flex justify-between items-center px-4 sm:px-8 md:px-16 lg:px-24 pb-4 sm:pb-8 md:pb-12 gap-3 sm:gap-4 fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#020c02] to-[#041d05] pt-4">
        <button 
          onClick={handleGoBack}
          className="h-12 sm:h-14 px-4 sm:px-6 md:px-8 py-2 flex justify-center items-center rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#1fb622] bg-transparent hover:bg-[#1fb622]/10 transition-colors cursor-pointer flex-1 sm:flex-initial"
        >
          <span className="font-['ZT_Nature'] text-base sm:text-lg md:text-xl font-medium text-[#1fb622] whitespace-nowrap">Go back</span>
        </button>
        <button 
          onClick={handleContinue}
          disabled={!class_id}
          className="h-12 sm:h-14 px-4 sm:px-6 md:px-8 py-2 flex justify-center items-center bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-2xl sm:rounded-3xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-initial"
        >
          <span className="font-['ZT_Nature'] text-base sm:text-lg md:text-xl font-medium text-[#eeeeee] whitespace-nowrap">Continue</span>
        </button>
      </div>

      <style>{`
        @keyframes floatRealistic {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: drop-shadow(0 0 15px rgba(31, 182, 34, 0.5)); }
          20% { transform: translateY(-12px) translateX(3px) rotate(1.5deg) scale(1.03); filter: drop-shadow(0 0 18px rgba(31, 182, 34, 0.6)); }
          40% { transform: translateY(-20px) translateX(0px) rotate(0deg) scale(1.06); filter: drop-shadow(0 0 25px rgba(31, 182, 34, 0.8)) drop-shadow(0 0 35px rgba(31, 182, 34, 0.4)); }
          60% { transform: translateY(-18px) translateX(-3px) rotate(-1.5deg) scale(1.04); filter: drop-shadow(0 0 20px rgba(31, 182, 34, 0.7)); }
          80% { transform: translateY(-8px) translateX(2px) rotate(0.5deg) scale(1.02); filter: drop-shadow(0 0 16px rgba(31, 182, 34, 0.55)); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); filter: drop-shadow(0 0 15px rgba(31, 182, 34, 0.5)); }
        }
      `}</style>
    </div>
  );
}

export default ClassNow;

