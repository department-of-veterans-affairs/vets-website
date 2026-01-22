import { shallowEqual, useSelector } from 'react-redux';
import { getTypeOfCare, getFormData } from '../redux/selectors';
import { selectFeatureOHDirectSchedule } from '../../redux/selectors';
import { OH_ENABLED_TYPES_OF_CARE } from '../../utils/constants';

export function useOHDirectScheduling() {
  const featureOHDirectSchedule = useSelector(selectFeatureOHDirectSchedule);

  const data = useSelector(state => getFormData(state), shallowEqual);
  const typeOfCare = getTypeOfCare(data);

  return (
    featureOHDirectSchedule &&
    OH_ENABLED_TYPES_OF_CARE.includes(typeOfCare?.idV2)
  );
}
