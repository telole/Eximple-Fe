import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProfileCompletionStore from '../../stores/profileCompletionStore';

function ClassGrade() {
  const navigate = useNavigate();
  const { grade_level_id, full_name, gender, class_id, setGradeLevelId, setFullName, setGender } = useProfileCompletionStore();
  const [error, setError] = useState(null);

  // Redirect to class-now if no class_id is selected
  useEffect(() => {
    if (!class_id) {
      navigate('/class-now');
    }
  }, [class_id, navigate]);

  if (!class_id) {
    return null;
  }

  // Get grades based on class_id
  const getGrades = () => {
    if (class_id === 1) { // SD (Elementary)
      return [1, 2, 3, 4, 5, 6];
    } else if (class_id === 2) { // SMP (Middle)
      return [1, 2, 3];
    } else if (class_id === 3) { // SMA (High)
      return [1, 2, 3];
    }
    return [];
  };

  // Get class label
  const getClassLabel = () => {
    if (class_id === 1) return 'SD';
    if (class_id === 2) return 'SMP';
    if (class_id === 3) return 'SMA';
    return '';
  };

  const grades = getGrades();
  const classLabel = getClassLabel();

  const selectGrade = (grade) => {
    setGradeLevelId(grade);
    setError(null);
  };

  const handleContinue = () => {
    if (!full_name || full_name.trim().length < 2) {
      setError('Please enter your full name (minimum 2 characters)');
      return;
    }
    if (!gender) {
      setError('Please select your gender');
      return;
    }
    if (!grade_level_id) {
      setError('Please select your grade');
      return;
    }
    navigate('/choose-subject');
  };

  const handleGoBack = () => {
    navigate('/class-now');
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
        <div className="absolute left-0 top-[10%] -translate-y-1/2 w-[300px] md:w-[400px] lg:w-[450px] aspect-square z-0 animate-[floatRealistic_5s_ease-in-out_infinite] hidden md:block pointer-events-none">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{backgroundImage: 'url(/img/getStartedImg/mascotmodel2.png)'}}
          ></div>
        </div>

        <div className="flex flex-col items-center gap-6 z-10 relative w-full max-w-2xl">
          <h2 className="font-['Press_Start_2P'] text-sm md:text-base lg:text-lg text-white text-center leading-relaxed">
            Complete your profile
          </h2>

          {error && (
            <div className="w-full max-w-md px-4 py-2 bg-red-500/20 border-2 border-red-500 rounded-lg">
              <p className="font-['ZT_Nature'] text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          <div className="w-full max-w-md flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter your full name"
              value={full_name}
              onChange={(e) => {
                setFullName(e.target.value);
                setError(null);
              }}
              className="w-full h-14 px-6 py-3 font-['ZT_Nature'] text-xl font-medium rounded-2xl border-4 border-[#aaaaaa] bg-transparent text-white placeholder:text-[rgba(170,170,170,0.5)] focus:border-[#1fb622] focus:outline-none transition-colors backdrop-blur-sm bg-black/20"
              required
            />

            <div className="flex gap-4 justify-center">
              {['male', 'female', 'other'].map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setGender(g);
                    setError(null);
                  }}
                  className={`px-6 py-3 rounded-2xl border-2 font-['ZT_Nature'] text-lg font-medium transition-all ${
                    gender === g
                      ? 'border-[#1fb622] border-4 bg-[rgba(31,182,34,0.15)] text-white'
                      : 'border-[#aaaaaa] bg-[rgba(170,170,170,0.05)] text-[#aaaaaa] hover:border-[#1fb622] hover:text-white'
                  }`}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <h3 className="font-['Press_Start_2P'] text-xs md:text-sm text-white text-center">
              What grade are you in now?
            </h3>
            <div className="flex gap-4 justify-center flex-wrap">
              {grades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => selectGrade(grade)}
                  className={`w-24 h-20 rounded-[32px] border-2 flex flex-col justify-center items-center transition-all ${
                    grade_level_id === grade
                      ? 'border-[#1fb622] border-4 bg-[rgba(31,182,34,0.15)]'
                      : 'border-[#aaaaaa] bg-[rgba(170,170,170,0.05)] hover:border-[#1fb622] hover:bg-[rgba(31,182,34,0.1)]'
                  }`}
                >
                  <span className="font-['ZT_Nature'] text-2xl font-medium text-[#eeeeee]">{grade}</span>
                  <span className="font-['ZT_Nature'] text-sm font-medium text-[#aaaaaa]">{classLabel}</span>
                </button>
              ))}
            </div>
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
          disabled={!full_name || !gender || !grade_level_id}
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

export default ClassGrade;

