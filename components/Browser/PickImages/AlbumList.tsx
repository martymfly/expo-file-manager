import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { AlbumItem } from './AlbumItem';
import { SIZE } from '../../../utils/Constants';
import { customAlbum } from '../../../types';
import { selectedAlbumType } from '.';
import { useAppSelector } from '../../../hooks/reduxHooks';

type AlbumListProps = {
  albums: customAlbum[];
  setSelectedAlbum: (album: selectedAlbumType) => void;
};

export const AlbumList = ({ albums, setSelectedAlbum }: AlbumListProps) => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  return (
    <FlatList
      style={{ ...styles.albumList, backgroundColor: colors.background2 }}
      contentContainerStyle={styles.contentContainer}
      numColumns={2}
      data={albums}
      renderItem={({ item }) => (
        <AlbumItem item={item} setSelectedAlbum={setSelectedAlbum} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  albumList: {
    width: SIZE,
  },
  contentContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
