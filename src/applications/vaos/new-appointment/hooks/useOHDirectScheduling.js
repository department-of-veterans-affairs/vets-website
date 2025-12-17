import { shallowEqual, useSelector } from 'react-redux';
import { getTypeOfCare, getFormData } from '../redux/selectors';
import {
  selectFeatureOHDirectSchedule,
  selectFeatureRemoveFacilityConfigCheck,
} from '../../redux/selectors';
import { OH_ENABLED_TYPES_OF_CARE } from '../../utils/constants';

export function useOHDirectScheduling() {
  const featureOHDirectSchedule = useSelector(selectFeatureOHDirectSchedule);

  const data = useSelector(state => getFormData(state), shallowEqual);
  const typeOfCare = getTypeOfCare(data);
  const featureRemoveFacilityConfigCheck = useSelector(
    selectFeatureRemoveFacilityConfigCheck,
  );

  // NOTE: Add 'clinicalPharmacyPrimaryCare' to OH_ENABLED_TYPES_OF_CARE array when flag is removed.
  return featureOHDirectSchedule && featureRemoveFacilityConfigCheck
    ? [...OH_ENABLED_TYPES_OF_CARE, 'clinicalPharmacyPrimaryCare'].includes(
        typeOfCare.idV2,
      )
    : OH_ENABLED_TYPES_OF_CARE.includes(typeOfCare.idV2);
}
