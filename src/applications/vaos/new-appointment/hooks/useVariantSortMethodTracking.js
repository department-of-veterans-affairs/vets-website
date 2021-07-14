import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from '../../utils/constants';
import { selectFeatureVariantTesting } from '../../redux/selectors';
import {
  selectFacilityPageSortMethod,
  selectSingleValidVALocation,
  selectNoValidVAFacilities,
} from '../redux/selectors';

/*
 * This tracks events for when the facility page variant is shown and 
 * what the default sort method is. This is used outside of the facility
 * page so we don't fire these events if a user visits the page more than once
 * within one form flow usage.
 */
export default function useVariantSortMethodTracking({ skip = false }) {
  const methodTrackedRef = useRef(false);
  const sortMethod = useSelector(selectFacilityPageSortMethod);
  const showVariant = useSelector(selectFeatureVariantTesting);
  const singleValidVALocation = useSelector(selectSingleValidVALocation);
  const noValidVAFacilities = useSelector(selectNoValidVAFacilities);

  useEffect(
    () => {
      if (
        sortMethod &&
        !methodTrackedRef.current &&
        showVariant &&
        !skip &&
        !singleValidVALocation &&
        !noValidVAFacilities
      ) {
        recordEvent({
          event: `${GA_PREFIX}-variant-shown`,
        });
        recordEvent({
          event: `${GA_PREFIX}-variant-default-${sortMethod}`,
        });
        methodTrackedRef.current = true;
      }
    },
    [sortMethod, showVariant, singleValidVALocation, noValidVAFacilities, skip],
  );
}
