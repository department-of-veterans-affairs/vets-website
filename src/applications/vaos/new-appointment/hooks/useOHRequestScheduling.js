import { useSelector } from 'react-redux';
import { getFormData, getTypeOfCare } from '../redux/selectors';
import { selectFeatureOHRequest } from '../../redux/selectors';
import { OH_ENABLED_TYPES_OF_CARE } from '../../utils/constants';

export function useOHRequestScheduling() {
  const featureOHRequest = useSelector(selectFeatureOHRequest);
  const data = useSelector(getFormData);
  const typeOfCare = getTypeOfCare(data);
  return (
    featureOHRequest && OH_ENABLED_TYPES_OF_CARE.includes(typeOfCare?.idV2)
  );
}
