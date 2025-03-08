import {
  GEOLOCATE_USER,
  GEOCODE_FAILED,
  GEOCODE_COMPLETE,
} from '../actionTypes';
import { searchCriteraFromCoords } from '../../utils/mapHelpers';
import { updateSearchQuery } from '../search/updateSearchQuery';

export const geolocateUser = () => async dispatch => {
  const GEOLOCATION_TIMEOUT = 10000;
  if (navigator?.geolocation?.getCurrentPosition) {
    dispatch({ type: GEOLOCATE_USER });
    navigator.geolocation.getCurrentPosition(
      async currentPosition => {
        const query = await searchCriteraFromCoords(
          currentPosition.coords.longitude,
          currentPosition.coords.latitude,
        );
        dispatch({ type: GEOCODE_COMPLETE });
        dispatch(updateSearchQuery(query));
      },
      e => {
        dispatch({ type: GEOCODE_FAILED, code: e.code });
      },
      { timeout: GEOLOCATION_TIMEOUT },
    );
  } else {
    dispatch({ type: GEOCODE_FAILED, code: -1 });
  }
};
