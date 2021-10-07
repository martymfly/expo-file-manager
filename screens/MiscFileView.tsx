import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Constants from 'expo-constants';

import { useAppSelector } from '../hooks/reduxHooks';
import { StackScreenProps } from '@react-navigation/stack';
import { PDFViewer } from '../components/MiscFileView/PDFViewer';

type MiscFileViewParamList = {
  MiscFileView: { prevDir: string; folderName: string };
};

type Props = StackScreenProps<MiscFileViewParamList, 'MiscFileView'>;

const MiscFileView = ({ route }: Props) => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  const { prevDir, folderName } = route.params;
  const fileExt = folderName.split('/').pop().split('.').pop().toLowerCase();

  if (fileExt === 'pdf')
    return <PDFViewer fileURI={prevDir + '/' + folderName} />;

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <Text style={{ color: colors.primary }}>
        This file format is not supported.
      </Text>
    </View>
  );
};

export default MiscFileView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
