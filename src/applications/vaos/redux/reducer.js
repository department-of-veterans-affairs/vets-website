import appointments from '../appointment-list/redux/reducer';
import newAppointmentReducer from '../new-appointment/redux/reducer';
import referralReducers from '../referral-appointments/redux/reducers';
import { vaosApi } from './api/vaosApi';

export default {
  // expressCare state slice lazy loaded (express-care/redux/reducer.js)
  appointments,
  newAppointment: newAppointmentReducer,
  referral: referralReducers,
  [vaosApi.reducerPath]: vaosApi.reducer,
};
