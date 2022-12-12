import React, { useEffect } from 'react';
import { LogBox, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Snackbar } from 'react-native-paper';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import { MainNavigator } from '../navigation/MainNavigator';

import useColorScheme from '../hooks/useColorScheme';
import useLock from '../hooks/useLock';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setLightTheme, setDarkTheme } from '../features/files/themeSlice';
import { hideSnack } from '../features/files/snackbarSlice';

import LockScreen from '../screens/LockScreen';

SplashScreen.preventAutoHideAsync();

LogBox.ignoreLogs([
  'VirtualizedLists should never',
  'supplied to `DialogInput`',
]);

export default function Main() {
  const { locked, setLocked } = useLock();
  const { theme } = useAppSelector((state) => state.theme);
  const {
    isVisible: isSnackVisible,
    message: snackMessage,
    label: snackLabel,
  } = useAppSelector((state) => state.snackbar);
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  const getPassCodeStatus = async () => {
    const hasPassCode = await SecureStore.getItemAsync('hasPassCode');
    if (JSON.parse(hasPassCode)) {
      setLocked(true);
      return true;
    } else {
      setLocked(false);
      return false;
    }
  };

  useEffect(() => {
    getPassCodeStatus();
  }, []);

  useEffect(() => {
    const setColorScheme = async () => {
      const storedScheme = await AsyncStorage.getItem('colorScheme');
      if (!storedScheme) {
        await AsyncStorage.setItem('colorScheme', colorScheme);
        dispatch(colorScheme === 'dark' ? setDarkTheme() : setLightTheme());
      } else {
        dispatch(storedScheme === 'dark' ? setDarkTheme() : setLightTheme());
      }
    };
    setColorScheme();
  }, []);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (locked && fontsLoaded) {
    return <LockScreen setLocked={setLocked} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Snackbar
        visible={isSnackVisible}
        style={{ backgroundColor: theme.colors.background3 }}
        theme={{
          colors: { surface: theme.colors.text },
        }}
        onDismiss={() => dispatch(hideSnack())}
        duration={2000}
        action={
          snackLabel
            ? {
                label: snackLabel,
                onPress: () => {},
              }
            : null
        }
      >
        {snackMessage}
      </Snackbar>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <NavigationContainer theme={theme.dark ? DarkTheme : DefaultTheme}>
        <MainNavigator />
      </NavigationContainer>
    </View>
  );
}
