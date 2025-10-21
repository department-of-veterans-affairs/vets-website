import appointments from '../appointment-list/redux/reducer';
import newAppointmentReducer from '../new-appointment/redux/reducer';
import referralReducers from '../referral-appointments/redux/reducers';
import { vaosApi } from './api/vaosApi';
import slice from '../services/appointment/apiSlice';
// import healthCareSlice from '../services/healthcare-service/apiSlice';
import schedulingCofigurationSlice from '../services/scheduling-configuration/apiSlice';
import locationSlice from '../services/location/apiSlice';

export default {
  // expressCare state slice lazy loaded (express-care/redux/reducer.js)
  appointments,
  newAppointment: newAppointmentReducer,
  referral: referralReducers,
  [vaosApi.reducerPath]: vaosApi.reducer,
  [slice.reducerPath]: slice.reducer,
  // [healthCareSlice.reducerPath]: slice.reducer,
  [locationSlice.reducerPath]: locationSlice.reducer,
  [schedulingCofigurationSlice.reducerPath]:
    schedulingCofigurationSlice.reducer,
};
