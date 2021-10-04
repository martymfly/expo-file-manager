import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export const useAppState = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState<boolean>(true);

  const handleStateChange = (nextAppState) => {
    appState.current = nextAppState;
    if (nextAppState !== 'active') {
      setAppStateVisible(false);
    } else {
      setAppStateVisible(true);
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', handleStateChange);

    return () => {
      AppState.removeEventListener('change', handleStateChange);
    };
  }, []);

  return appStateVisible;
};
