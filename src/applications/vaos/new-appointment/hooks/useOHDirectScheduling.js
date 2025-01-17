import { shallowEqual, useSelector } from 'react-redux';
import { getFacilityPageV2Info } from '../redux/selectors';
import { selectFeatureOHDirectSchedule } from '../../redux/selectors';
import { OH_ENABLED_TYPES_OF_CARE } from '../../utils/constants';

export function useOHDirectScheduling() {
  const featureOHDirectSchedule = useSelector(selectFeatureOHDirectSchedule);

  const { typeOfCare } = useSelector(
    state => getFacilityPageV2Info(state),
    shallowEqual,
  );

  return (
    featureOHDirectSchedule &&
    OH_ENABLED_TYPES_OF_CARE.includes(typeOfCare.idV2)
  );
}
