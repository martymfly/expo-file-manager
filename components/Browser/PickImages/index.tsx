import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Linking,
  AlertButton,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import useMultiImageSelection from '../../../hooks/useMultiImageSelection';
import { customAlbum, ExtendedAsset } from '../../../types';
import { AlbumList } from './AlbumList';
import { AssetList } from './AssetList';
import { SIZE } from '../../../utils/Constants';
import { useAppSelector } from '../../../hooks/reduxHooks';

type PickImagesProps = {
  onMultiSelectSubmit: (data: ExtendedAsset[]) => void;
  onClose: () => void;
};

export type selectedAlbumType = {
  id: string;
  title: string;
};

export default function PickImages({
  onMultiSelectSubmit,
  onClose,
}: PickImagesProps) {
  const { colors } = useAppSelector((state) => state.theme.theme);
  const [isMediaGranted, setIsMediaGranted] = useState<boolean | null>(null);
  const [albums, setAlbums] = useState<customAlbum[]>([]);
  const [albumsFetched, setAlbumsFetched] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<selectedAlbumType | null>(
    null
  );
  const [assets, setAssets] = useState<ExtendedAsset[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean | null>(null);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<ExtendedAsset[]>([]);
  const isSelecting = useMultiImageSelection(assets);

  async function getAlbums() {
    const albums = await MediaLibrary.getAlbumsAsync();
    const albumsPromiseArray = albums.map(
      async (album) =>
        await MediaLibrary.getAssetsAsync({
          album: album,
          first: 10,
          sortBy: MediaLibrary.SortBy.default,
        })
    );
    Promise.all(albumsPromiseArray).then((values) => {
      const nonEmptyAlbums = values
        .filter((item) => item.totalCount > 0)
        .map((item) => {
          const album = albums.find((a) => a.id === item.assets[0].albumId);
          const albumObject: customAlbum = {
            id: album?.id,
            title: album?.title,
            assetCount: album?.assetCount,
            type: album?.type,
            coverImage: item.assets[0].uri,
          };
          return albumObject;
        });
      setAlbums(nonEmptyAlbums);
      setAlbumsFetched(true);
    });
  }

  async function getAlbumAssets(albumId: string, after?: string | undefined) {
    const options = {
      album: albumId,
      first: 25,
      sortBy: MediaLibrary.SortBy.creationTime,
    };
    if (after) options['after'] = after;
    const albumAssets = await MediaLibrary.getAssetsAsync(options);
    setAssets((prev) => [...prev, ...albumAssets.assets]);
    setHasNextPage(albumAssets.hasNextPage);
    setEndCursor(albumAssets.endCursor);
  }

  const toggleSelect = (item: ExtendedAsset) => {
    const isSelected =
      selectedAssets.findIndex((asset) => asset.id === item.id) !== -1;
    if (!isSelected) setSelectedAssets((prev) => [...prev, item]);
    else
      setSelectedAssets((prev) => [
        ...prev.filter((asset) => asset.id != item.id),
      ]);
    setAssets(
      assets.map((i) => {
        if (item.id === i.id) {
          i.selected = !i.selected;
        }
        return i;
      })
    );
  };

  const handleImport = () => {
    onClose();
    onMultiSelectSubmit(selectedAssets);
    return selectedAssets;
  };

  // const unSelectAll = () => {
  //   setAssets(
  //     assets.map((i) => {
  //       i.selected = false;
  //       return i;
  //     })
  //   );
  // };

  useEffect(() => {
    const requestMediaPermission = async () => {
      MediaLibrary.requestPermissionsAsync()
        .then((result) => {
          setIsMediaGranted(result.granted);
          if (!result.granted) {
            const alertOptions: AlertButton[] = [
              {
                text: 'Go to App Settings',
                onPress: () => {
                  Linking.openSettings();
                },
              },
              {
                text: 'Nevermind',
                onPress: () => {},
                style: 'cancel',
              },
            ];
            if (result.canAskAgain)
              alertOptions.push({
                text: 'Request again',
                onPress: () => requestMediaPermission(),
              });
            Alert.alert(
              'Denied Media Access',
              'App needs access to media library',
              [...alertOptions]
            );
          }
          if (result.granted) getAlbums();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    requestMediaPermission();
  }, []);

  useEffect(() => {
    if (selectedAlbum) getAlbumAssets(selectedAlbum.id);
  }, [selectedAlbum]);

  if (!isMediaGranted && isMediaGranted !== null)
    return (
      <View
        style={{
          ...styles.noAccessContainer,
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ ...styles.noAccessText, color: colors.primary }}>
          {'Media Access Denied'}
        </Text>
        <Button title="Go to Settings" onPress={() => Linking.openSettings()} />
      </View>
    );

  if (!albumsFetched)
    return (
      <View
        style={{ ...styles.container, backgroundColor: colors.background2 }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background2 }}>
      <View style={styles.header}>
        <View style={styles.confirmButton}>
          {isSelecting && (
            <TouchableOpacity
              style={styles.handleImport}
              onPress={handleImport}
            >
              <MaterialCommunityIcons
                name="file-import-outline"
                size={30}
                color={colors.primary}
              />
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  fontSize: 18,
                  color: colors.primary,
                }}
              >
                {selectedAssets.length}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={{ ...styles.title, color: colors.primary }}>
          {selectedAlbum?.title || 'Albums'}
        </Text>
        <View style={styles.backButtonContainer}>
          {selectedAlbum && (
            <TouchableOpacity
              onPress={() => {
                setSelectedAlbum(null);
                setAssets([]);
                setSelectedAssets([]);
              }}
            >
              <Feather name="chevron-left" size={32} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.listContainer}>
        {albumsFetched && !selectedAlbum && (
          <AlbumList albums={albums} setSelectedAlbum={setSelectedAlbum} />
        )}
        {selectedAlbum && (
          <AssetList
            assets={assets}
            albumId={selectedAlbum.id}
            getAlbumAssets={getAlbumAssets}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
            toggleSelect={toggleSelect}
            isSelecting={isSelecting}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE,
    marginBottom: 15,
  },
  backButtonContainer: {
    position: 'absolute',
    right: 10,
  },
  confirmButton: {
    position: 'absolute',
    left: 10,
  },
  listContainer: {
    width: SIZE,
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAccessContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
  },
  noAccessText: {
    marginBottom: 20,
    fontFamily: 'Poppins_500Medium',
  },
  handleImport: {
    display: 'flex',
    flexDirection: 'row',
    width: 60,
    height: 30,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});
