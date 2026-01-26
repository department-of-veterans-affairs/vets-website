import { useSelector } from 'react-redux';
import { getFormData, getTypeOfCare } from '../redux/selectors';
import { selectFeatureUseVpg } from '../../redux/selectors';
import { OH_ENABLED_TYPES_OF_CARE } from '../../utils/constants';

export function useOHScheduling() {
  const featureUseVpg = useSelector(selectFeatureUseVpg);
  const data = useSelector(getFormData);
  const typeOfCare = getTypeOfCare(data);
  return featureUseVpg && OH_ENABLED_TYPES_OF_CARE.includes(typeOfCare?.idV2);
}
