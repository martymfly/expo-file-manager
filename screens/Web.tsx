import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Constants from 'expo-constants';

const Web: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Web</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
  },
});

export default Web;
