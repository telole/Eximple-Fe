import { useState, useEffect, useCallback } from 'react';
import useLeaderboardStore from '../stores/leaderboardStore';

export function useLeaderboard() {
  const { getLeaderboard, getMyRank, leaderboard, myRank, isLoading, error } = useLeaderboardStore();
  const [type, setType] = useState('total');

  useEffect(() => {
    const loadData = async () => {
      await getLeaderboard(type, 100);
      await getMyRank(type);
    };
    loadData();
  }, [type]);

  const refresh = useCallback(async () => {
    await getLeaderboard(type, 100);
    await getMyRank(type);
  }, [type, getLeaderboard, getMyRank]);

  return {
    leaderboard: leaderboard || [],
    myRank,
    type,
    isLoading,
    error,
    setType,
    refresh,
  };
}

