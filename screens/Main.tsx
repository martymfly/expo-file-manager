import React, { useEffect } from 'react';
import { LogBox, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
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
import AppLoading from 'expo-app-loading';

import { MainNavigator } from '../navigation/MainNavigator';

import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import useColorScheme from '../hooks/useColorScheme';
import useLock from '../hooks/useLock';
import { setLightTheme, setDarkTheme } from '../features/files/themeSlice';

import LockScreen from '../screens/LockScreen';

LogBox.ignoreLogs([
  'VirtualizedLists should never',
  'supplied to `DialogInput`',
]);

export default function Main() {
  const { locked, setLocked } = useLock();
  const { theme } = useAppSelector((state) => state.theme);
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

  if (!fontsLoaded) return <AppLoading />;

  if (locked) {
    return <LockScreen setLocked={setLocked} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <NavigationContainer theme={theme.dark ? DarkTheme : DefaultTheme}>
        <MainNavigator />
      </NavigationContainer>
    </View>
  );
}
