import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Constants from 'expo-constants';

import { useAppSelector } from '../hooks/reduxHooks';

const MiscFileView = () => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <Text style={{ color: colors.primary }}>File View</Text>
    </View>
  );
};

export default MiscFileView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
});
