import { useEffect, useState } from 'react';
import { fetchAccounts } from '../services/accountService';

export default function useAccounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts().then(setAccounts).catch(() => setAccounts([]));
  }, []);

  return { accounts };
}








































































