import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLearningStore from '../../stores/learningStore';
import useProfileCompletionStore from '../../stores/profileCompletionStore';
import useProfileStore from '../../stores/profileStore';

function ChooseSubject() {
  const navigate = useNavigate();
  const { getSubjects, subjects, isLoading: subjectsLoading, error: subjectsError } = useLearningStore();
  const { subject_ids, getProfileData, addSubjectId, removeSubjectId, clearAll } = useProfileCompletionStore();
  const { completeProfile, isLoading } = useProfileStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setError(null);
        const result = await getSubjects();
        if (!result.success) {
          setError(result.error || 'Failed to load subjects');
        } else if (result.data && result.data.length === 0) {
          setError('No subjects available');
        } else {
          setError(null);
        }
      } catch (err) {
        setError(err.message || 'Failed to load subjects');
      }
    };
    loadSubjects();
  }, [getSubjects]);

  const toggleSubject = (subjectId) => {
    if (subject_ids.includes(subjectId)) {
      removeSubjectId(subjectId);
    } else {
      addSubjectId(subjectId);
    }
    setError(null);
  };

  const handleContinue = async () => {
    if (subject_ids.length === 0) {
      setError('Please select at least one subject');
      return;
    }

    const profileData = getProfileData();
    if (!profileData.full_name || !profileData.gender || !profileData.grade_level_id || !profileData.class_id) {
      setError('Please complete all previous steps');
      return;
    }

    try {
      setError(null);
      const result = await completeProfile(profileData);
      if (result.success) {
        clearAll();
        navigate('/journey');
      } else {
        const errorMsg = result.error || 'Failed to complete profile';
        if (errorMsg.includes('class') || errorMsg.includes('grade') || errorMsg.includes('level')) {
          setError(`${errorMsg}. Please go back and ensure your grade matches your school level.`);
        } else {
          setError(errorMsg);
        }
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to complete profile';
      if (errorMsg.includes('class') || errorMsg.includes('grade') || errorMsg.includes('level')) {
        setError(`${errorMsg}. Please go back and ensure your grade matches your school level.`);
      } else {
        setError(errorMsg);
      }
    }
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
              style={{backgroundImage: 'url(/img/codia/logo-eximple.png)'}}
            ></div>
          </div>
          <span className="font-['Airlash_Raiders'] text-3xl font-normal bg-gradient-to-b from-[#1fb622] to-[#168318] bg-clip-text text-transparent">
            Eximple
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 md:px-8 pb-8 relative">
        <div className="absolute right-6 md:right-20 top-[5%] -translate-y-1/2 w-[300px] md:w-[400px] lg:w-[450px] aspect-square z-0 animate-[floatRealistic_5s_ease-in-out_infinite] hidden md:block pointer-events-none">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{backgroundImage: 'url(/img/getStartedImg/mascotModel1.png)'}}
          ></div>
        </div>

        <div className="flex flex-col items-center gap-6 z-10 relative">
          <h2 className="font-['Press_Start_2P'] text-sm md:text-base lg:text-lg text-white text-center leading-relaxed">
            What subject are you interested in?
          </h2>

          {(error || subjectsError) && (
            <div className="w-full max-w-md px-4 py-2 bg-red-500/20 border-2 border-red-500 rounded-lg mb-4">
              <p className="font-['ZT_Nature'] text-sm text-red-400 text-center">{error || subjectsError}</p>
            </div>
          )}

          {subjectsLoading ? (
            <div className="text-white font-['ZT_Nature']">Loading subjects...</div>
          ) : subjects.length === 0 ? (
            <div className="text-white/60 font-['ZT_Nature'] text-center max-w-md">
              {(error || subjectsError) ? (
                <div className="space-y-2">
                  <p className="text-red-400">Failed to load subjects</p>
                  <p className="text-sm">Please check your connection or try again later.</p>
                </div>
              ) : (
                'No subjects available. Please try again later.'
              )}
            </div>
          ) : (
            <div className="flex gap-4 md:gap-6 justify-center flex-wrap max-w-4xl px-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  onClick={() => toggleSubject(subject.id)}
                  className={`w-full sm:w-[200px] md:w-[240px] h-auto min-h-[288px] sm:h-[288px] rounded-[32px] border-2 flex flex-col items-center cursor-pointer transition-all ${
                    subject_ids.includes(subject.id)
                      ? 'border-[#1fb622] border-4 bg-[rgba(31,182,34,0.15)]'
                      : 'border-[#aaaaaa] bg-[rgba(170,170,170,0.05)] hover:border-[#1fb622] hover:bg-[rgba(31,182,34,0.1)]'
                  }`}
                >
                  <div className="w-full max-w-[241px] h-[132px] mt-[42px] bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/img/getStartedImg/mascotmodel3.png)'}}></div>
                  <span className="font-['ZT_Nature'] text-sm sm:text-base font-medium text-white text-center mt-[32px] px-4 pb-4">
                    {subject.title || subject.name || `Subject ${subject.id}`}
                  </span>
                </div>
              ))}
            </div>
          )}
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
          disabled={isLoading || subjectsLoading || subject_ids.length === 0}
          className="h-14 px-8 py-2 flex justify-center items-center bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-3xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-['ZT_Nature'] text-xl font-medium text-[#eeeeee] whitespace-nowrap">
            {isLoading ? 'Completing...' : 'Complete Profile'}
          </span>
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

export default ChooseSubject;

