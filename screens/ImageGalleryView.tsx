import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import ImageView from 'react-native-image-viewing';

import { StackScreenProps } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { useNavigation } from '@react-navigation/native';
import { setTabbarVisible } from '../features/files/tabbarStyleSlice';

type FileViewParamList = {
  ImageGalleryView: { prevDir: string; folderName: string };
};

type Props = StackScreenProps<FileViewParamList, 'ImageGalleryView'>;

const ImageGalleryView = ({ route }: Props) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { colors } = useAppSelector((state) => state.theme.theme);
  const { prevDir, folderName } = route.params;
  const { images } = useAppSelector((state) => state.images);

  const initialImageIndex = useCallback(
    () => images.findIndex((item) => item.uri === prevDir + folderName),
    []
  );

  useEffect(() => {
    dispatch(setTabbarVisible(false));

    return () => {
      dispatch(setTabbarVisible(true));
    };
  }, []);

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <ImageView
        images={images}
        imageIndex={initialImageIndex()}
        visible={true}
        onRequestClose={() => navigation.goBack()}
        keyExtractor={(_, index) => index.toString()}
        doubleTapToZoomEnabled
        swipeToCloseEnabled
      />
    </View>
  );
};

export default ImageGalleryView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
