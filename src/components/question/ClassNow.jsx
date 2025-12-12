import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProfileCompletionStore from '../../stores/profileCompletionStore';

function ClassNow() {
  const navigate = useNavigate();
  const { class_id, grade_level_id, setClassId } = useProfileCompletionStore();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [error, setError] = useState(null);

  const levelToClassId = {
    'elementary': 1,
    'middle': 2,
    'high': 3
  };

  const levels = [
    { id: 'elementary', name: 'Elementary School', image: '/img/getStartedImg/bags.png', classId: levelToClassId.elementary },
    { id: 'middle', name: 'Middle School', image: '/img/getStartedImg/middlescroll.png', classId: levelToClassId.middle },
    { id: 'high', name: 'High School', image: '/img/getStartedImg/highscholl.png', classId: levelToClassId.high }
  ];

  const selectLevel = (level) => {
    const levelData = levels.find(l => l.id === level);
    if (levelData) {
      setSelectedLevel(level);
      setClassId(levelData.classId);
      setError(null);
    }
  };

  const validateClassAndGrade = () => {
    if (!grade_level_id || !class_id) return true;
    
    const grade = grade_level_id;
    const classId = class_id;
    
    if (classId === 1) {
      return grade >= 1 && grade <= 6;
    } else if (classId === 2) {
      return grade >= 1 && grade <= 3;
    } else if (classId === 3) {
      return grade >= 1 && grade <= 3;
    }
    return true;
  };

  const handleContinue = () => {
    if (!class_id) {
      setError('Please select your school level');
      return;
    }
    
    if (!validateClassAndGrade()) {
      setError('Selected grade does not match the school level. Please go back and select the correct grade.');
      return;
    }
    
    navigate('/choose-subject');
  };

  const handleGoBack = () => {
    navigate('/class-grade');
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-hidden flex flex-col">
      
      <div className="flex justify-center pt-10 pb-6 z-10">
        <div className="flex items-center gap-2 px-4">
          <div className="w-12 h-12 relative">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{backgroundImage: 'url(/img/getStartedImg/icon.png)'}}
            ></div>
          </div>
          <span className="font-['Airlash_Raiders'] text-3xl font-normal bg-gradient-to-b from-[#1fb622] to-[#168318] bg-clip-text text-transparent">
            Eximple
          </span>
        </div>
      </div>

      
      <div className="flex-1 flex items-center justify-center px-4 md:px-8 pb-8 relative">
        
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] md:w-[400px] lg:w-[450px] aspect-square z-0 animate-[floatRealistic_5s_ease-in-out_infinite] hidden md:block pointer-events-none -mt-8 md:-mt-12 lg:-mt-16">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{backgroundImage: 'url(/img/getStartedImg/mascotmodel4.png)'}}
          ></div>
        </div>

        
        <div className="flex flex-col items-center gap-6 z-10 relative">
          <h2 className="font-['Press_Start_2P'] text-sm md:text-base lg:text-lg text-white text-center leading-relaxed">
            What level are you at now?
          </h2>

          
          {error && (
            <div className="w-full max-w-md px-4 py-2 bg-red-500/20 border-2 border-red-500 rounded-lg">
              <p className="font-['ZT_Nature'] text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          
          <div className="flex gap-4 md:gap-6 justify-center flex-wrap">
            {levels.map((level) => (
              <div
                key={level.id}
                onClick={() => selectLevel(level.id)}
                className={`w-[240px] h-[288px] rounded-[32px] border-2 flex flex-col items-center cursor-pointer transition-all ${
                  selectedLevel === level.id
                    ? 'border-[#1fb622] border-4 bg-[rgba(31,182,34,0.15)]'
                    : 'border-[#aaaaaa] bg-[rgba(170,170,170,0.05)] hover:border-[#1fb622] hover:bg-[rgba(31,182,34,0.1)]'
                }`}
              >
                <div 
                  className={`${level.id === 'elementary' ? 'w-[241px] h-[132px] mt-[42px]' : level.id === 'middle' ? 'w-[232px] h-[121px] mt-[52px]' : 'w-[264px] h-[136px] mt-[41px] -ml-3'} bg-cover bg-center bg-no-repeat`}
                  style={{backgroundImage: `url(${level.image})`}}
                ></div>
                <span className="font-['ZT_Nature'] text-base font-medium text-white text-center mt-[22px]">
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

                
      <div className="flex justify-between items-end px-8 md:px-16 lg:px-24 pb-8 md:pb-12 gap-4">
        <button 
          onClick={handleGoBack}
          className="h-14 px-8 py-2 flex justify-center items-center rounded-3xl border-4 border-[#1fb622] bg-transparent hover:bg-[#1fb622]/10 transition-colors cursor-pointer"
        >
          <span className="font-['ZT_Nature'] text-xl font-medium text-[#1fb622] whitespace-nowrap">Go back</span>
        </button>
        <button 
          onClick={handleContinue}
          disabled={!class_id}
          className="h-14 px-8 py-2 flex justify-center items-center bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-3xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-['ZT_Nature'] text-xl font-medium text-[#eeeeee] whitespace-nowrap">Continue</span>
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

