import { useEffect, useState } from 'react';
import { fetchCoachingTips } from '../services/coachingService';

export default function useCoaching() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    fetchCoachingTips().then(setTips).catch(() => setTips([]));
  }, []);

  return { tips };
}
