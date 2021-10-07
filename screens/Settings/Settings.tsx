import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

import useLock from '../../hooks/useLock';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setDarkTheme, setLightTheme } from '../../features/files/themeSlice';

import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import useBiometrics from '../../hooks/useBiometrics';
import { setSnack } from '../../features/files/snackbarSlice';
import { SIZE } from '../../utils/Constants';

function Settings() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { theme } = useAppSelector((state) => state.theme);
  const { pinActive } = useLock();
  const { biometricsActive, hasHardware, isEnrolled, handleBiometricsStatus } =
    useBiometrics();
  const dispatch = useAppDispatch();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          PREFERENCES
        </Text>
        <View
          style={[
            styles.sectionItem,
            { backgroundColor: theme.colors.background2 },
          ]}
        >
          <View style={styles.sectionItemLeft}>
            <Feather
              name={theme.dark ? 'moon' : 'sun'}
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionItemCenter}>
            <Text
              style={[styles.sectionItemText, { color: theme.colors.primary }]}
            >
              Dark Mode
            </Text>
          </View>
          <View style={styles.sectionItemRight}>
            <Switch
              value={theme.dark}
              trackColor={{
                false: theme.colors.switchFalse,
                true: 'tomato',
              }}
              thumbColor={theme.colors.switchThumb}
              onChange={async () => {
                if (theme.dark) {
                  dispatch(setLightTheme());
                  await AsyncStorage.setItem('colorScheme', 'light');
                } else {
                  dispatch(setDarkTheme());
                  await AsyncStorage.setItem('colorScheme', 'dark');
                }
              }}
            />
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          SECURITY
        </Text>
        <View
          style={[
            styles.sectionItem,
            { backgroundColor: theme.colors.background2 },
          ]}
        >
          <View style={styles.sectionItemLeft}>
            <Feather
              name={pinActive ? 'lock' : 'unlock'}
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionItemCenter}>
            <Text
              style={[styles.sectionItemText, { color: theme.colors.primary }]}
            >
              PIN Code
            </Text>
          </View>
          <View style={styles.sectionItemRight}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SetPassCodeScreen');
              }}
            >
              <Feather
                name={'chevron-right'}
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            styles.sectionItem,
            { backgroundColor: theme.colors.background2 },
          ]}
        >
          <View style={styles.sectionItemLeft}>
            <FontAwesome5
              name="fingerprint"
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionItemCenter}>
            <Text
              style={[styles.sectionItemText, { color: theme.colors.primary }]}
            >
              Unlock with Biometrics
            </Text>
          </View>
          <View style={styles.sectionItemRight}>
            <Switch
              value={biometricsActive}
              onTouchStart={() => {
                if (!hasHardware) {
                  dispatch(
                    setSnack({ message: 'Device has no biometrics hardware' })
                  );
                }
              }}
              disabled={!hasHardware}
              trackColor={{
                false: theme.colors.switchFalse,
                true: 'tomato',
              }}
              thumbColor={theme.colors.switchThumb}
              onChange={() => {
                if (hasHardware && isEnrolled) {
                  handleBiometricsStatus();
                } else if (hasHardware && !isEnrolled) {
                  dispatch(setSnack({ message: 'No biometrics enrolled!' }));
                }
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
  },
  section: {
    width: SIZE,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  sectionItem: {
    display: 'flex',
    flexDirection: 'row',
    height: 45,
  },
  sectionItemText: {
    fontFamily: 'Poppins_500Medium',
  },
  sectionItemLeft: {
    width: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionItemCenter: {
    width: '60%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sectionItemRight: {
    width: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
