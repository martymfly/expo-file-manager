import { ParamListBase } from '@react-navigation/routers';
import * as MediaLibrary from 'expo-media-library';

export type ThemeColors = {
  dark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
};

export type fileItem = {
  name: string;
  selected?: boolean;
  exists: true;
  uri: string;
  size: number;
  isDirectory: boolean;
  modificationTime: number;
  md5?: string;
};

export type ExtendedAsset = {
  id: string;
  filename: string;
  uri: string;
  mediaType: MediaLibrary.MediaTypeValue;
  mediaSubtypes?: string[] | undefined;
  width: number;
  height: number;
  creationTime: number;
  modificationTime: number;
  duration: number;
  albumId?: string | undefined;
  name?: string;
  selected?: boolean;
};

export type customAlbum = {
  id?: string;
  title?: string;
  assetCount?: number;
  type?: string | undefined;
  coverImage?: string;
};

export interface imageFile {
  id: string;
  albumId: string;
  filename: string;
  uri: string;
  duration: number;
  width: number;
  height: number;
  mediaType: string;
  selected: boolean;
  creationTime: number;
  modificationTime: number;
}

export type imageDimensions = {
  width: number;
  height: number;
};

export type fileRequestMessage = {
  device: string;
  path: string;
  basedir: string;
};

export type SubNavigator<T extends ParamListBase> = {
  [K in keyof T]: { screen: K; params?: T[K] };
}[keyof T];
