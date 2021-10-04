import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { selectedAlbumType } from '.';
import { customAlbum } from '../../../types';
import { useAppSelector } from '../../../hooks/reduxHooks';

const { width: SIZE } = Dimensions.get('window');
const ITEM_SIZE = SIZE / 2;

type AlbumProps = {
  item: customAlbum;
  setSelectedAlbum: (album: selectedAlbumType) => void;
};

export const AlbumItem = ({ item: album, setSelectedAlbum }: AlbumProps) => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  return (
    <TouchableOpacity
      style={styles.albumContainer}
      activeOpacity={0.8}
      onPress={() => setSelectedAlbum({ id: album.id, title: album.title })}
    >
      <Image style={styles.albumCover} source={{ uri: album.coverImage }} />
      <View style={styles.albumDetailsContainer}>
        <Text
          style={{ ...styles.albumTitle, color: colors.primary }}
          numberOfLines={1}
        >
          {album.title}
        </Text>
        <Text style={{ ...styles.albumTitle, color: colors.primary }}>
          {album.assetCount}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  albumContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  albumCover: {
    width: ITEM_SIZE * 0.9,
    height: ITEM_SIZE * 0.9,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  albumTitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  albumDetailsContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    width: ITEM_SIZE,
    height: ITEM_SIZE * 0.3,
  },
});
