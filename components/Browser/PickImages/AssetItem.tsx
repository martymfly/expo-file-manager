import React from 'react';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZE } from '../../../utils/Constants';
import { ExtendedAsset } from '../../../types';

const ITEM_SIZE = SIZE / 3;

type AssetProps = {
  item: ExtendedAsset;
  isSelecting: boolean;
  toggleSelect: (asset: ExtendedAsset) => void;
};

export const AssetItem = ({
  item: asset,
  isSelecting,
  toggleSelect,
}: AssetProps) => {
  return (
    <TouchableOpacity
      key={asset.id}
      style={styles.assetContainer}
      activeOpacity={0.8}
      onLongPress={() => toggleSelect(asset)}
      onPress={() => {
        if (isSelecting) toggleSelect(asset);
      }}
    >
      <Image style={styles.assetImage} source={{ uri: asset.uri }} />
      {isSelecting && (
        <View style={styles.checkCircleContainer}>
          <View style={styles.checkCircleBG}></View>
          {asset.selected && (
            <Ionicons name="checkmark-done" size={20} color="white" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  assetContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assetImage: {
    width: ITEM_SIZE * 0.95,
    height: ITEM_SIZE * 0.95,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  checkCircleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 5,
    right: 0,
    width: 24,
    height: 24,
  },
  checkCircleBG: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'gray',
    borderWidth: 1.5,
    borderColor: 'white',
    opacity: 0.9,
  },
});
