import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export type snackActionPayload = {
  message: string;
  label?: string | null;
};

interface snackbarSliceState {
  isVisible: boolean;
  message: string;
  label?: string | null;
}

const initialState: snackbarSliceState = {
  isVisible: false,
  message: '',
  label: null,
};

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    setSnack: (state, action: PayloadAction<snackActionPayload>) => {
      state.isVisible = true;
      state.message = action.payload.message;
      state.label = action.payload.label;
    },
    hideSnack: (state) => {
      state.isVisible = false;
      state.message = '';
      state.label = null;
    },
  },
});

export const { setSnack, hideSnack } = snackbarSlice.actions;

export const getSnackbar = (state: RootState) => state.snackbar;

export default snackbarSlice.reducer;
