import { useSelector } from 'react-redux';
import environment from 'platform/utilities/environment';
import { getFormData, getTypeOfCare } from '../redux/selectors';
import { selectFeatureUseVpg } from '../../redux/selectors';
import { OH_ENABLED_TYPES_OF_CARE } from '../../utils/constants';

// There is additional logic in src/applications/vaos/new-appointment/newAppointmentFlow.js
// When the hook is updated, this should be updated too. It's temporary, so speed was chosen
// over elegance
export function useOHScheduling() {
  const featureUseVpg = useSelector(selectFeatureUseVpg);
  const data = useSelector(getFormData);
  const typeOfCare = getTypeOfCare(data);

  if (!featureUseVpg) {
    // OH only works when VPG is used
    return false;
  }

  if (environment.isStaging()) {
    // env is staging, let's enable all types of care
    return true;
  }

  // Otherwise check constant for enabled types of care
  return OH_ENABLED_TYPES_OF_CARE.includes(typeOfCare?.idV2);
}
