import { configureStore } from '@reduxjs/toolkit';
import imagesSlice from './features/files/imagesSlice';
import snackbarSlice from './features/files/snackbarSlice';
import tabbarStyleSlice from './features/files/tabbarStyleSlice';
import themeSlice from './features/files/themeSlice';

export const store = configureStore({
  reducer: {
    images: imagesSlice,
    theme: themeSlice,
    snackbar: snackbarSlice,
    tabbarStyle: tabbarStyleSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
