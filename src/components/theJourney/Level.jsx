import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLearningStore from '../../stores/learningStore';
import useProgressStore from '../../stores/progressStore';

function Level() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { getLevel, currentLevel, isLoading } = useLearningStore();
  const { startLevel } = useProgressStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLevel = async () => {
      if (!levelId) {
        setError('Level ID is missing');
        return;
      }

      try {
        const result = await getLevel(parseInt(levelId));
        if (!result.success) {
          setError(result.error || 'Failed to load level');
          return;
        }

        await startLevel(parseInt(levelId));
      } catch (err) {
        setError(err.message || 'Failed to load level');
      }
    };

    loadLevel();
  }, [levelId, getLevel, startLevel]);

  const handleGoBack = () => {
    navigate('/journey');
  };

  if (isLoading) {
    return (
      <div className="w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] flex items-center justify-center">
        <div className="text-white font-['ZT_Nature'] text-2xl">Loading level...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 font-['ZT_Nature'] text-2xl mb-4">{error}</div>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-lg text-white font-['ZT_Nature']"
          >
            Back to Journey
          </button>
        </div>
      </div>
    );
  }

  if (!currentLevel) {
    return (
      <div className="w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] flex items-center justify-center">
        <div className="text-center">
          <div className="text-white font-['ZT_Nature'] text-2xl mb-4">Level not found</div>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-lg text-white font-['ZT_Nature']"
          >
            Back to Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-x-hidden overflow-y-auto">
      <div className="px-8 md:px-16 lg:px-20 py-10">
        <button
          onClick={handleGoBack}
          className="mb-6 px-4 py-2 bg-white/10 rounded-lg text-white font-['ZT_Nature'] hover:bg-white/20 transition-colors"
        >
          ��� Back to Journey
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="font-['ZT_Nature'] text-4xl font-medium text-white mb-4">
            Lesson {currentLevel.level_index || currentLevel.id} ��� {currentLevel.title}
          </h1>

          {currentLevel.description && (
            <div className="bg-white/5 rounded-2xl border-2 border-white/10 p-6 mb-6">
              <p className="text-white/80 font-['ZT_Nature'] text-lg">{currentLevel.description}</p>
            </div>
          )}

          <div className="bg-white/5 rounded-2xl border-2 border-white/10 p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-['ZT_Nature'] text-lg text-white/80">Reward:</span>
                <span className="font-['ZT_Nature'] text-xl font-medium text-[#1fb622] ml-2">
                  {currentLevel.points_reward || 0} points
                </span>
              </div>
              <div>
                <span className="font-['ZT_Nature'] text-lg text-white/80">Estimated Time:</span>
                <span className="font-['ZT_Nature'] text-xl font-medium text-white ml-2">
                  {currentLevel.estimated_minutes ? `${currentLevel.estimated_minutes} min` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-white/60 font-['ZT_Nature']">
            Level content will be displayed here
          </div>
        </div>
      </div>
    </div>
  );
}

export default Level;

