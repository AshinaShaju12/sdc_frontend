import { useEffect, useState } from 'react';
import { fetchOpportunities } from '../services/opportunityService';

export default function useOpportunities() {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    fetchOpportunities().then(setOpportunities).catch(() => setOpportunities([]));
  }, []);

  return { opportunities };
}
