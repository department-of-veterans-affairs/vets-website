import {
  getChosenClinicInfo,
  getChosenSlot,
  selectCovid19VaccineFormData,
} from '../selectors';
import { getClinicId } from '../../../services/healthcare-service';
import { isCernerLocation } from '../../../services/location';
import { selectRegisteredCernerFacilityIds } from '../../../redux/selectors';
import { APPOINTMENT_SYSTEM } from '../../../utils/constants';

export function transformFormToVAOSAppointment(state) {
  const data = selectCovid19VaccineFormData(state);
  const clinic = getChosenClinicInfo(state);
  const slot = getChosenSlot(state);
  const cernerSiteIds = selectRegisteredCernerFacilityIds(state);
  const isCerner = isCernerLocation(data.vaFacility, cernerSiteIds);
  const ehr = isCerner ? APPOINTMENT_SYSTEM.cerner : APPOINTMENT_SYSTEM.vista;

  return {
    kind: 'clinic',
    status: 'booked',
    clinic: getClinicId(clinic),
    slot: { id: slot.id },
    extension: {
      desiredDate: slot.start,
    },
    locationId: data.vaFacility,
    systemType: ehr,
  };
}
