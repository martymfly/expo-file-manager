import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';

import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

import useBiometrics from '../hooks/useBiometrics';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';

import { SIZE } from '../utils/Constants';
import { setSnack } from '../features/files/snackbarSlice';

const DIGIT_SIZE = SIZE / 6;

type ILockScreenProps = {
  setLocked: (value: boolean) => void;
};

const LockScreen = ({ setLocked }: ILockScreenProps) => {
  const dispatch = useAppDispatch();
  const { colors } = useAppSelector((state) => state.theme.theme);
  const { biometricsActive } = useBiometrics();
  const [secret, setSecret] = useState('');
  const [checkPin, setCheckPin] = useState('');
  const [dotsArray, setDotsArray] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const getSecret = async () => {
    SecureStore.getItemAsync('secret').then((res) => setSecret(res));
  };

  const authWithBiometrics = () => {
    LocalAuthentication.authenticateAsync().then((result) => {
      if (result.success) {
        setLocked(false);
      }
    });
  };

  useEffect(() => {
    getSecret();
  }, []);

  useEffect(() => {
    if (checkPin.length === 4) {
      if (secret === checkPin) {
        setTimeout(() => {
          setLocked(false);
        }, 10);
      } else {
        dispatch(setSnack({ message: 'Wrong PIN!' }));
        setCheckPin('');
      }
    }
  }, [checkPin]);

  const DigitItem = ({ digit }: { digit: number }) => {
    return (
      <TouchableOpacity
        key={digit}
        style={styles.digitItem}
        onPress={() => onDigitPress(digit)}
      >
        <Text style={[styles.digitNumber, { color: colors.primary }]}>
          {digit}
        </Text>
      </TouchableOpacity>
    );
  };

  const DigitsRow = ({ digits }: { digits: number[] }) => {
    return (
      <View style={styles.digitRow}>
        {digits.map((digit) => (
          <DigitItem key={digit} digit={digit} />
        ))}
      </View>
    );
  };

  const handleRemove = () => {
    if (checkPin.length > 0) {
      setCheckPin((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const onDigitPress = (digit: number) => {
    if (checkPin.length < 4) {
      setCheckPin((prev) => prev + digit);
    }
  };

  const PinDot = ({ filled, index }: { filled: boolean; index: number }) => {
    return (
      <View
        key={`${index}-dot`}
        style={[
          styles.pinDot,
          { backgroundColor: filled ? '#0089CD' : colors.primary },
        ]}
      ></View>
    );
  };

  const PinDots = () => {
    return (
      <View style={styles.pinDotsContainer}>
        {dotsArray.map((dot, index) => (
          <PinDot key={`${index}-D`} filled={dot} index={index} />
        ))}
      </View>
    );
  };

  useEffect(() => {
    let dotsRef = checkPin;
    switch (dotsRef.length) {
      case 0:
        setDotsArray((_) => [false, false, false, false]);
        break;
      case 1:
        setDotsArray((_) => [true, false, false, false]);
        break;
      case 2:
        setDotsArray((_) => [true, true, false, false]);
        break;
      case 3:
        setDotsArray((_) => [true, true, true, false]);
        break;
      case 4:
        setDotsArray((_) => [true, true, true, true]);
        break;
      default:
        break;
    }
  }, [checkPin]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.setupContainer, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.title, { color: colors.primary, fontSize: 18 }]}>
          Enter Your PIN
        </Text>
        <View style={{ width: '100%', height: 50, marginTop: 20 }}>
          <PinDots />
        </View>
        <View style={[styles.digitsContainer]}>
          <DigitsRow digits={[1, 2, 3]} />
          <DigitsRow digits={[4, 5, 6]} />
          <DigitsRow digits={[7, 8, 9]} />
          <View style={styles.digitRow}>
            <TouchableOpacity
              style={styles.digitItem}
              onPress={() => {
                if (biometricsActive) {
                  authWithBiometrics();
                }
              }}
            >
              <FontAwesome5
                name="fingerprint"
                size={DIGIT_SIZE * 0.5}
                color={colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              key={0}
              style={styles.digitItem}
              onPress={() => onDigitPress(0)}
            >
              <Text style={[styles.digitNumber, { color: colors.primary }]}>
                0
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              key={'remove'}
              style={styles.digitItem}
              onPress={handleRemove}
            >
              <Text style={[styles.digitNumber, { color: colors.primary }]}>
                {'<'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
  },
  setupContainer: {
    width: SIZE,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitsContainer: {
    width: '100%',
    height: '70%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  digitRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  digitItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: DIGIT_SIZE,
    height: DIGIT_SIZE,
  },
  digitNumber: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: DIGIT_SIZE * 0.5,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  pinDotsContainer: {
    width: SIZE,
    height: 25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
