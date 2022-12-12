import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../store';

interface initialStateType {
  visible: boolean;
}

const initialState: initialStateType = {
  visible: true,
};

export const tabbarStyleSlice = createSlice({
  name: 'tabbarStyle',
  initialState,
  reducers: {
    setTabbarVisible: (state, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
  },
});

export const { setTabbarVisible } = tabbarStyleSlice.actions;

export const tabbarStyle = (state: RootState) => state.tabbarStyle;

export default tabbarStyleSlice.reducer;
