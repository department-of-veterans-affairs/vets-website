import {
  getChosenClinicInfo,
  getChosenSlot,
  selectCovid19VaccineFormData,
} from '../selectors';
import { getClinicId } from '../../../services/healthcare-service';

export function transformFormToVAOSAppointment(state) {
  const data = selectCovid19VaccineFormData(state);
  const clinic = getChosenClinicInfo(state);
  const slot = getChosenSlot(state);

  return {
    kind: 'clinic',
    status: 'booked',
    clinic: getClinicId(clinic),
    slot,
    extension: {
      desiredDate: slot.start,
    },
    locationId: data.vaFacility,
    comment: '',
    contact: {
      telecom: [
        {
          type: 'phone',
          value: data.phoneNumber,
        },
        {
          type: 'email',
          value: data.email,
        },
      ],
    },
  };
}
