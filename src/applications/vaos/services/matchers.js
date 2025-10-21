import { isAnyOf } from '@reduxjs/toolkit';
import appointmentSlice from './appointment/apiSlice';

export const isMatch = isAnyOf(
  appointmentSlice.slice.endpoints.getAppointments.matchFulfilled,
);
