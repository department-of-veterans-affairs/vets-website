import { shallowEqual, useSelector } from 'react-redux';
import { getFacilityPageV2Info } from '../redux/selectors';
import { selectFeatureOHRequest } from '../../redux/selectors';

const OH_REQUEST_SCHEDULE_ENABLED_TYPES_OF_CARE = ['foodAndNutrition'];

export function useOHRequestScheduling() {
  const featureOHRequest = useSelector(selectFeatureOHRequest);

  const { typeOfCare } = useSelector(
    state => getFacilityPageV2Info(state),
    shallowEqual,
  );

  return (
    featureOHRequest &&
    OH_REQUEST_SCHEDULE_ENABLED_TYPES_OF_CARE.includes(typeOfCare.idV2)
  );
}
