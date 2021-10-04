import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAppState } from './useAppState';

export default function useLock() {
  const [locked, setLocked] = useState<boolean>(false);
  const [pinActive, setPinActive] = useState<boolean | null>(null);
  const appStateVisible = useAppState();

  const getPassCodeStatus = async () => {
    const hasPassCode = await SecureStore.getItemAsync('hasPassCode');
    if (JSON.parse(hasPassCode)) {
      setPinActive(true);
      return true;
    } else {
      setPinActive(false);
      return false;
    }
  };

  useEffect(() => {
    getPassCodeStatus();
    if (!appStateVisible && pinActive) {
      setLocked(true);
    } else if (pinActive) {
      setLocked(true);
    } else if (!pinActive) {
      setLocked(false);
    }
  }, [appStateVisible]);

  return { locked, setLocked, pinActive };
}
