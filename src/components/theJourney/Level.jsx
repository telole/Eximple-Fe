import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLearningStore from '../../stores/learningStore';
import useProgressStore from '../../stores/progressStore';
import useProfileStore from '../../stores/profileStore';
import useLevelProgressStore from '../../stores/levelProgressStore';
import Navbar from '../common/Navbar';
import HelpPrompt from '../common/HelpPrompt';
import { sanitizeText, sanitizeHTML } from '../../utils/textFilter';

function Level() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { getLevel, currentLevel, currentLevelMaterials, isLoading } = useLearningStore();
  const { startLevel, completeLevel, getJourneyMap, getStats, stats } = useProgressStore();
  const { getProfile } = useProfileStore();
  const { 
    currentBodyIndex, 
    canContinue, 
    timeRemaining,
    getBodies,
    resetLevel,
    nextBody,
  } = useLevelProgressStore();

  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [showHelpPrompt, setShowHelpPrompt] = useState(false);
  const helpPromptShownRef = useRef(false);

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

        resetLevel();
        helpPromptShownRef.current = false;

        try {
          await startLevel(parseInt(levelId));
        } catch {
          // Silent fail - level can still be displayed
        }
      } catch (err) {
        setError(err.message || 'Failed to load level');
      }
    };

    loadLevel();

    return () => {
      resetLevel();
      helpPromptShownRef.current = false;
    };
  }, [levelId, getLevel, startLevel, resetLevel]);

  // Show help prompt 10 seconds after entering the level
  useEffect(() => {
    if (!currentLevel || helpPromptShownRef.current) return;

    // Show help prompt after 10 seconds
    const timer = setTimeout(() => {
      if (!helpPromptShownRef.current) {
        setShowHelpPrompt(true);
        helpPromptShownRef.current = true;
      }
    }, 10000); // 10 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [currentLevel]);

  const handleGoBack = () => {
    navigate('/journey');
  };

  const handleContinue = () => {
    if (!canContinue) return;
    
    const bodies = getBodies(currentLevel, currentLevelMaterials);
    if (currentBodyIndex < bodies.length - 1) {
      nextBody();
    }
  };

  const handleCompleteLevel = async () => {
    if (!levelId) return;

    const bodies = getBodies(currentLevel, currentLevelMaterials);
    if (currentBodyIndex < bodies.length - 1) {
      return;
    }

    setCompleting(true);
    setError(null);

    try {
      const result = await completeLevel(parseInt(levelId));
      
      if (result.success) {
        const subjectLevelId = currentLevel?.subject_level_id;
        if (subjectLevelId) {
          try {
            await getJourneyMap(subjectLevelId);
          } catch {
            // Silent fail
          }
        }
        try {
          await getStats();
        } catch {
          // Silent fail
        }
        // Update profile to refresh points in navbar
        try {
          await getProfile();
        } catch {
          // Silent fail
        }
        
        setTimeout(() => {
          navigate('/journey');
        }, 100);
      } else {
        // Handle different error cases with more specific messages
        const errorMsg = result.error || '';
        if (errorMsg.toLowerCase().includes('already completed') || 
            errorMsg.toLowerCase().includes('sudah diselesaikan') ||
            errorMsg.toLowerCase().includes('level already completed')) {
          setError('Level sudah pernah diselesaikan sebelumnya.');
        } else if (errorMsg.toLowerCase().includes('not started') || 
                   errorMsg.toLowerCase().includes('belum dimulai')) {
          setError('Level belum dimulai. Silakan refresh halaman dan coba lagi.');
        } else if (errorMsg.toLowerCase().includes('unauthorized') || 
                   errorMsg.toLowerCase().includes('forbidden')) {
          setError('Anda tidak memiliki izin untuk menyelesaikan level ini.');
        } else if (errorMsg.toLowerCase().includes('cors') || 
                   errorMsg.toLowerCase().includes('cross-origin')) {
          setError('Masalah CORS terdeteksi. Silakan restart development server atau hubungi administrator backend.');
        } else if (errorMsg.toLowerCase().includes('server error') || 
                   errorMsg.toLowerCase().includes('500') ||
                   errorMsg.toLowerCase().includes('internal server') ||
                   errorMsg.toLowerCase().includes('http 500')) {
          setError('Server error (500). Masalah terjadi di backend saat menyelesaikan level. Silakan coba lagi dalam beberapa saat atau hubungi administrator jika masalah berlanjut.');
        } else if (errorMsg.toLowerCase().includes('network') || 
                   errorMsg.toLowerCase().includes('fetch')) {
          setError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
        } else if (errorMsg.toLowerCase().includes('404') || 
                   errorMsg.toLowerCase().includes('not found')) {
          setError('Level tidak ditemukan. Silakan kembali ke halaman journey.');
        } else if (errorMsg) {
          setError(errorMsg);
        } else {
          setError('Gagal menyelesaikan level. Silakan coba lagi.');
        }
      }
    } catch (err) {
      const errorMsg = err.message || '';
      if (errorMsg.toLowerCase().includes('cors') || 
          errorMsg.toLowerCase().includes('cross-origin')) {
        setError('Masalah CORS terdeteksi. Silakan restart development server (npm run dev) atau hubungi administrator backend untuk mengaktifkan CORS.');
      } else if (errorMsg.toLowerCase().includes('server error') || 
                 errorMsg.toLowerCase().includes('500') ||
                 errorMsg.toLowerCase().includes('internal server') ||
                 errorMsg.toLowerCase().includes('http 500')) {
        setError('Server error (500). Masalah terjadi di backend saat menyelesaikan level. Silakan coba lagi dalam beberapa saat atau hubungi administrator jika masalah berlanjut.');
      } else if (errorMsg.toLowerCase().includes('network') || 
                 errorMsg.toLowerCase().includes('fetch') ||
                 errorMsg.toLowerCase().includes('failed to fetch')) {
        setError('Gagal terhubung ke server. Periksa koneksi internet Anda atau restart development server.');
      } else if (errorMsg) {
        setError(errorMsg);
      } else {
        setError('Gagal menyelesaikan level. Silakan coba lagi.');
      }
    } finally {
      setCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] flex items-center justify-center">
        <div className="text-white font-['ZT_Nature'] text-2xl">Loading level...</div>
      </div>
    );
  }

  if (error && !currentLevel) {
    return (
      <div className="w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 font-['ZT_Nature'] text-2xl mb-4">{error}</div>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-lg text-white font-['ZT_Nature']"
          >
            ← Back to Journey
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
            ← Back to Journey
          </button>
        </div>
      </div>
    );
  }

    const bodies = getBodies(currentLevel, currentLevelMaterials);
    const currentBody = bodies[currentBodyIndex];
    const isLastBody = currentBodyIndex === bodies.length - 1;
  const showContinueButton = !isLastBody;
  const showCompleteButton = isLastBody && canContinue;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-x-hidden overflow-y-auto">
      <Navbar stats={stats} activePage="learn" />
      
      <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-6 sm:py-8 md:py-10">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="font-['ZT_Nature'] text-lg sm:text-xl md:text-2xl font-medium text-white break-words">
              Lesson {currentLevel.level_index || currentLevel.id} {currentLevel.title}
            </h1>
          </div>

          {/* Main Content */}
          <div className="min-h-[300px] sm:min-h-[400px] flex flex-col justify-center">
            <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <style>{`
                .lesson-content h1,
                .lesson-content h2,
                .lesson-content h3 {
                  font-family: 'ZT_Nature', sans-serif;
                  font-weight: 500;
                  color: rgba(255, 255, 255, 0.95);
                  margin-top: 1.5rem;
                  margin-bottom: 0.75rem;
                  line-height: 1.4;
                }
                .lesson-content h1:first-child,
                .lesson-content h2:first-child,
                .lesson-content h3:first-child {
                  margin-top: 0;
                }
                .lesson-content h1 {
                  font-size: 1.875rem;
                }
                .lesson-content h2 {
                  font-size: 1.5rem;
                }
                .lesson-content h3 {
                  font-size: 1.25rem;
                }
                .lesson-content p {
                  font-family: 'ZT_Nature', sans-serif;
                  font-size: 1.125rem;
                  line-height: 1.75;
                  color: rgba(255, 255, 255, 0.9);
                  margin-bottom: 1rem;
                }
                .lesson-content p:last-child {
                  margin-bottom: 0;
                }
                .lesson-content strong,
                .lesson-content b {
                  font-weight: 500;
                  color: rgba(255, 255, 255, 0.95);
                }
                .lesson-content ul,
                .lesson-content ol {
                  margin-left: 1.5rem;
                  margin-bottom: 1rem;
                  color: rgba(255, 255, 255, 0.9);
                }
                .lesson-content li {
                  margin-bottom: 0.5rem;
                  font-family: 'ZT_Nature', sans-serif;
                  font-size: 1.125rem;
                  line-height: 1.75;
                }
                .lesson-content li:last-child {
                  margin-bottom: 0;
                }
                .lesson-content img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 0.5rem;
                  margin: 1rem 0;
                }
                .lesson-content code {
                  background-color: rgba(0, 0, 0, 0.3);
                  padding: 0.125rem 0.375rem;
                  border-radius: 0.25rem;
                  font-family: monospace;
                  font-size: 0.9em;
                }
                .lesson-content blockquote {
                  border-left: 3px solid rgba(31, 182, 34, 0.5);
                  padding-left: 1rem;
                  margin-left: 0;
                  margin-bottom: 1rem;
                  color: rgba(255, 255, 255, 0.8);
                }
              `}</style>
              
              {currentBody?.type === 'introduction' && currentBody.content && (
                <div className="lesson-content text-white font-['ZT_Nature'] text-lg leading-relaxed whitespace-pre-line">
                  {sanitizeText(typeof currentBody.content === 'string' ? currentBody.content : '')}
                </div>
              )}
              
              {currentBody?.type === 'material' && (
                <div className="lesson-content">
                  {currentBody.content_type === 'html' && currentBody.content && (
                    <div 
                      className="text-white"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(typeof currentBody.content === 'string' ? currentBody.content : '') }}
                    />
                  )}
                  {currentBody.content_type === 'text' && currentBody.content && (
                    <div className="text-white font-['ZT_Nature'] text-lg leading-relaxed whitespace-pre-line">
                      {sanitizeText(typeof currentBody.content === 'string' ? currentBody.content : '')}
                    </div>
                  )}
                  {currentBody.content_type === 'video' && (currentBody.resource_url || currentBody.content) && (
                    <div className="mb-4">
                      <video 
                        src={sanitizeText(typeof (currentBody.resource_url || currentBody.content) === 'string' ? (currentBody.resource_url || currentBody.content) : '')} 
                        controls 
                        className="w-full rounded-lg"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                  {!currentBody.content_type && currentBody.content && (
                    <div className="text-white font-['ZT_Nature'] text-lg leading-relaxed whitespace-pre-line">
                      {sanitizeText(typeof currentBody.content === 'string' ? currentBody.content : '')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mb-6">
            <p className="font-['ZT_Nature'] text-sm text-white/60">
              {currentLevel.title}
            </p>
            <p className="font-['ZT_Nature'] text-sm text-white/60">
              High School 3rd Grade
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={handleGoBack}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-white/20 bg-transparent hover:bg-white/5 transition-colors"
            >
              <span className="font-['ZT_Nature'] text-base sm:text-lg md:text-xl font-medium text-white">Go back</span>
            </button>

            {showContinueButton && (
              <button
                onClick={handleContinue}
                disabled={!canContinue || completing}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-2xl sm:rounded-3xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-['ZT_Nature'] text-base sm:text-lg md:text-xl font-medium text-white">
                  {!canContinue ? `Wait ${timeRemaining}s` : 'Continue'}
                </span>
              </button>
            )}

            {showCompleteButton && (
              <button
                onClick={handleCompleteLevel}
                disabled={completing || !canContinue}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-2xl sm:rounded-3xl shadow-[0_-2px_4px_0_rgba(255,255,255,0.5)_inset] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-['ZT_Nature'] text-base sm:text-lg md:text-xl font-medium text-white">
                  {completing ? 'Completing...' : 'START'}
                </span>
              </button>
            )}

            {isLastBody && !canContinue && (
              <button
                disabled
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-2xl sm:rounded-3xl opacity-50 cursor-not-allowed"
              >
                <span className="font-['ZT_Nature'] text-base sm:text-lg md:text-xl font-medium text-white">
                  Wait {timeRemaining}s
                </span>
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <div className="text-red-400 font-['ZT_Nature'] text-sm text-center mb-2">{error}</div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => {
                    setError(null);
                    handleCompleteLevel();
                  }}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 font-['ZT_Nature'] text-xs transition-colors"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-['ZT_Nature'] text-xs transition-colors"
                >
                  Refresh Halaman
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Prompt Modal */}
      <HelpPrompt 
        isVisible={showHelpPrompt} 
        onClose={() => setShowHelpPrompt(false)} 
      />
    </div>
  );
}

export default Level;
