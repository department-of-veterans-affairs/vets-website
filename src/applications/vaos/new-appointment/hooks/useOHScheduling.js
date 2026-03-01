import { useSelector } from 'react-redux';
import { getFormData, getTypeOfCare } from '../redux/selectors';
import { selectFeatureUseVpg } from '../../redux/selectors';
import { OH_ENABLED_TYPES_OF_CARE } from '../../utils/constants';

export function useOHScheduling() {
  const featureUseVpg = useSelector(selectFeatureUseVpg);
  const data = useSelector(getFormData);
  const typeOfCare = getTypeOfCare(data);

  // Enable all types of care in all environments other than production, in
  // production utilize the constants that are defined in src/applications/vaos/utils/constants.js
  const enableAllTypesOfCare =
    process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'test';

  if (!featureUseVpg) {
    // OH only works when VPG is used
    return false;
  }

  if (enableAllTypesOfCare) {
    // env is not production or test
    return true;
  }

  // Otherwise check constant for enabled types of care
  return OH_ENABLED_TYPES_OF_CARE.includes(typeOfCare?.idV2);
}
