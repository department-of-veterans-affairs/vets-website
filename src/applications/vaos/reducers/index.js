import { combineReducers } from 'redux';
import appointments from './appointments';
import newAppointment from './newAppointment';

export default {
  vaos: combineReducers({
    appointments,
    newAppointment,
  }),
};
