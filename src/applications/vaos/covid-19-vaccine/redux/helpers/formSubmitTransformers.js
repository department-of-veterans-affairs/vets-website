import moment from 'moment';
import {
  getChosenClinicInfo,
  getChosenSlot,
  selectCovid19VaccineFormData,
} from '../selectors';
import { getClinicId, getSiteCode } from '../../../services/healthcare-service';

export function transformFormToAppointment(state) {
  const clinic = getChosenClinicInfo(state);
  const data = selectCovid19VaccineFormData(state);

  const slot = getChosenSlot(state);
  const appointmentLength = moment(slot.end).diff(slot.start, 'minutes');
  return {
    appointmentType: 'Vaccine',
    clinic: {
      siteCode: getSiteCode(clinic),
      clinicId: getClinicId(clinic),
      clinicName: clinic.serviceName,
      clinicFriendlyLocationName: clinic.serviceName,
      institutionName: clinic.stationName,
      institutionCode: clinic.stationId,
    },

    // These times are a lie, they're actually in local time, but the upstream
    // service expects the 0 offset.
    desiredDate: `${moment(slot.start).format('YYYY-MM-DD')}T00:00:00+00:00`,
    dateTime: `${slot.start}+00:00`,
    duration: appointmentLength,
    bookingNotes: '',
    preferredEmail: data.email,
    // defaulted values
    apptType: 'P',
    purpose: '9',
    lvl: '1',
    ekg: '',
    lab: '',
    xRay: '',
    schedulingRequestType: 'NEXT_AVAILABLE_APPT',
    type: 'REGULAR',
    appointmentKind: 'TRADITIONAL',
    schedulingMethod: 'direct',
  };
}
