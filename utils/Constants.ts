import { Dimensions } from 'react-native';

export const { width: SIZE, height: HEIGHT } = Dimensions.get('window');

export const reExt = new RegExp(/(?:\.([^.]+))?$/);
export const base64reg = /data:image\/[^;]+;base64,/;

export const fileIcons = {
  json: 'code-json',
  pdf: 'file-pdf-box',
  msword: 'file-word-outline',
  'vnd.openxmlformats-officedocument.wordprocessingml.document':
    'file-word-outline',
  'vnd.ms-excel': 'file-excel-outline',
  'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'file-excel-outline',
  'vnd.ms-powerpoint': 'file-powerpoint-outline',
  'vnd.openxmlformats-officedocument.presentationml.presentation':
    'file-powerpoint-outline',
  zip: 'folder-zip-outline',
  'vnd.rar': 'folder-zip-outline',
  'x-7z-compressed': 'folder-zip-outline',
  xml: 'xml',
  css: 'language-css3',
  csv: 'file-delimited-outline',
  html: 'language-html5',
  javascript: 'language-javascript',
  plain: 'text-box-outline',
};

export const videoFormats = ['mp4', 'mov'];
export const imageFormats = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'tiff',
  'tif',
  'heic',
  'bmp',
];

export const Poppins_400Regular = 'Poppins_400Regular';
export const Poppins_500Medium = 'Poppins_500Medium';
export const Poppins_600SemiBold = 'Poppins_600SemiBold';
export const Poppins_700Bold = 'Poppins_700Bold';
