import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileInfo } from 'expo-file-system';
import { RootState } from '../../store';

interface imagesSliceState {
  images: FileInfo[];
}

const initialState: imagesSliceState = {
  images: [],
};

export const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<FileInfo[]>) => {
      state.images = action.payload;
    },
  },
});

export const { setImages } = imagesSlice.actions;

export const selectImages = (state: RootState) => state.images.images;

export default imagesSlice.reducer;
