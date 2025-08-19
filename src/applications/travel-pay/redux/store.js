import { configureStore } from '@reduxjs/toolkit';
import filesReducer from './filesReducer';

const store = configureStore({
  reducer: {
    files: filesReducer, // now state.files exists
  },
});

export default store;
