import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProfileStore from '../stores/profileStore';
import useLearningStore from '../stores/learningStore';
import useProgressStore from '../stores/progressStore';

export function useMainJourney() {
  const navigate = useNavigate();
  const { profile, getProfile } = useProfileStore();
  const { getSubjectLevelsByClass, getLevelsBySubjectLevel, subjectLevels, levels, isLoading: learningLoading } = useLearningStore();
  const { getJourneyMap, journeyMap, getStats, stats, isLoading: progressLoading } = useProgressStore();
  const [selectedSubjectLevel, setSelectedSubjectLevel] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        let currentProfile = profile;
        if (!currentProfile) {
          const profileResult = await getProfile();
          if (!profileResult.success) {
            setError('Failed to load profile');
            return;
          }
          currentProfile = profileResult.data.profile;
        }

        const classId = currentProfile?.class_id;
        if (!classId) {
          setError('Profile incomplete. Please complete your profile first.');
          return;
        }

        const subjectLevelsResult = await getSubjectLevelsByClass(classId);
        if (!subjectLevelsResult.success) {
          setError(subjectLevelsResult.error || 'Failed to load subjects');
          return;
        }

        if (subjectLevelsResult.data.length === 0) {
          setError('No subjects available for your class');
          return;
        }

        const firstSubjectLevel = subjectLevelsResult.data[0];
        setSelectedSubjectLevel(firstSubjectLevel.id);
        setCurrentSubject(firstSubjectLevel.subjects || firstSubjectLevel.subject);
        
        const levelsResult = await getLevelsBySubjectLevel(firstSubjectLevel.id);
        if (!levelsResult.success) {
          const errorMsg = levelsResult.error || 'Failed to load levels';
          if (errorMsg.includes('404') || errorMsg.includes('tidak tersedia')) {
            setError('Endpoint tidak tersedia di backend. Silakan hubungi backend team untuk mengaktifkan endpoint /api/levels/subject-level/:subjectLevelId');
          } else {
            setError(errorMsg);
          }
          return;
        }

        if (!levelsResult.data || levelsResult.data.length === 0) {
          setError('Database kosong: Tidak ada levels tersedia untuk subject ini. Silakan hubungi admin untuk menambahkan data levels ke database.');
          return;
        }

        await getJourneyMap(firstSubjectLevel.id);
        await getStats();
      } catch (err) {
        setError(err.message || 'Failed to load data');
      }
    };

    loadData();
  }, []);

  const handleStartLevel = async (levelId) => {
    navigate(`/level/${levelId}`);
  };

  const handleSubjectChange = async (subjectLevelId) => {
    setSelectedSubjectLevel(subjectLevelId);
    const subjectLevel = subjectLevels.find(sl => sl.id === subjectLevelId);
    if (subjectLevel) {
      setCurrentSubject(subjectLevel.subjects || subjectLevel.subject);
      await getLevelsBySubjectLevel(subjectLevelId);
      await getJourneyMap(subjectLevelId);
    }
  };

  return {
    profile,
    subjectLevels,
    levels,
    journeyMap,
    stats,
    currentSubject,
    selectedSubjectLevel,
    error,
    isLoading: learningLoading || progressLoading,
    handleStartLevel,
    handleSubjectChange,
  };
}

