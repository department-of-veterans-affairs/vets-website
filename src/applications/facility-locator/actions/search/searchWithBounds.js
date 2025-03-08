import { SEARCH_STARTED, SEARCH_FAILED } from '../actionTypes';
import { reverseGeocodeBox } from '../../utils/mapHelpers';
import { LocationType } from '../../constants';
import { fetchLocations } from '../locations/fetchLocations';

/**
 * Find which locations exist within the given bounding box's area.
 *
 * Allows for filtering on location types and services provided.
 *
 * @param {{bounds: number[], facilityType: string, serviceType: string, page: number, apiVersion: number}}
 */
export const searchWithBounds = ({
  bounds,
  facilityType,
  serviceType,
  page = 1,
  center,
  radius,
}) => {
  const needsAddress = [
    LocationType.CC_PROVIDER,
    LocationType.ALL,
    LocationType.URGENT_CARE_PHARMACIES,
    LocationType.URGENT_CARE,
  ];
  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        currentPage: page,
        searchBoundsInProgress: true,
      },
    });

    if (needsAddress.includes(facilityType)) {
      reverseGeocodeBox(bounds).then(address => {
        if (!address) {
          dispatch({
            type: SEARCH_FAILED,
            error:
              'Reverse geocoding failed. See previous errors or network log.',
          });
          return;
        }
        fetchLocations(
          address,
          bounds,
          facilityType,
          serviceType,
          page,
          dispatch,
          center,
          radius,
        );
      });
    } else {
      fetchLocations(
        null,
        bounds,
        facilityType,
        serviceType,
        page,
        dispatch,
        center,
        radius,
      );
    }
  };
};
