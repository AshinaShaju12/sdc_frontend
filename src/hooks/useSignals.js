import { useEffect, useState } from 'react';
import { fetchSignals } from '../services/signalService';

export default function useSignals() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    fetchSignals().then(setSignals).catch(() => setSignals([]));
  }, []);

  return { signals };
}
