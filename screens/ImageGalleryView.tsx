import React, { useCallback } from 'react';

import Gallery, { RemoteImage } from 'react-native-image-gallery';

import { StackScreenProps } from '@react-navigation/stack';
import { useAppSelector } from '../hooks/reduxHooks';

type FileViewParamList = {
  ImageGalleryView: { prevDir: string; folderName: string };
};

type Props = StackScreenProps<FileViewParamList, 'ImageGalleryView'>;

const ImageGalleryView = ({ route }: Props) => {
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
    () => images.findIndex((item) => item.uri === prevDir + '/' + folderName),
    []
  );

  return (
    <Gallery
      initialPage={imageIndex()}
      style={{ flex: 1, backgroundColor: colors.background }}
      images={galleryImageArray}
    />
  );
};

export default ImageGalleryView;
