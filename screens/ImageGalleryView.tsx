import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';

import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import Gallery, { RemoteImage } from 'react-native-image-gallery';

import { StackScreenProps } from '@react-navigation/stack';
import { useAppSelector } from '../hooks/reduxHooks';
import { useNavigation } from '@react-navigation/native';

type FileViewParamList = {
  ImageGalleryView: { prevDir: string; folderName: string };
};

type Props = StackScreenProps<FileViewParamList, 'ImageGalleryView'>;

const ImageGalleryView = ({ route }: Props) => {
  const navigation = useNavigation();
  const { colors } = useAppSelector((state) => state.theme.theme);
  const { prevDir, folderName } = route.params;
  const { images } = useAppSelector((state) => state.images);
  const galleryImageArray: RemoteImage[] = images.map((image) =>
    Object({
      source: {
        uri: image.uri,
      },
    })
  );

  const imageIndex = useCallback(
    () => images.findIndex((item) => item.uri === prevDir + folderName),
    []
  );

  return (
    <>
      <Gallery
        initialPage={imageIndex()}
        style={{ flex: 1, backgroundColor: colors.background }}
        images={galleryImageArray}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(237, 240, 238, 0.3)',
          borderRadius: 10,
          top: Constants.statusBarHeight,
          left: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        <Feather name="chevron-left" size={36} color="white" />
      </TouchableOpacity>
    </>
  );
};

export default ImageGalleryView;
