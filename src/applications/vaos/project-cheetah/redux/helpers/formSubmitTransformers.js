import moment from 'moment';
import { getTimezoneBySystemId } from '../../../utils/timezone';
import {
  getChosenClinicInfo,
  getSiteIdForChosenFacility,
  getChosenSlot,
  selectProjectCheetahFormData,
} from '../selectors';
import {
  findCharacteristic,
  getClinicId,
  getSiteCode,
} from '../../../services/healthcare-service/transformers';

export function transformFormToAppointment(state) {
  const clinic = getChosenClinicInfo(state);
  const siteId = getSiteIdForChosenFacility(state);
  const data = selectProjectCheetahFormData(state);
  const { timezone = null } = siteId ? getTimezoneBySystemId(siteId) : {};

  const slot = getChosenSlot(state);
  const appointmentLength = moment(slot.end).diff(slot.start, 'minutes');
  return {
    appointmentType: 'Vaccine',
    clinic: {
      siteCode: getSiteCode(clinic),
      clinicId: getClinicId(clinic),
      clinicName: clinic.serviceName,
      clinicFriendlyLocationName: findCharacteristic(
        clinic,
        'clinicFriendlyLocationName',
      ),
      institutionName: findCharacteristic(clinic, 'institutionName'),
      institutionCode: findCharacteristic(clinic, 'institutionCode'),
    },

    // These times are a lie, they're actually in local time, but the upstream
    // service expects the 0 offset.
    desiredDate: `${moment(slot.start).format('YYYY-MM-DD')}T00:00:00+00:00`,
    dateTime: `${slot.start}+00:00`,
    duration: appointmentLength,
    bookingNotes: '',
    preferredEmail: data.email,
    timeZone: timezone,
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
