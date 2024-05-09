export const GEOLOCATE_USER = 'GEOLOCATE_USER';
export const GEOCODE_FAILED = 'GEOCODE_FAILED';
export const GEOCODE_COMPLETE = 'GEOCODE_COMPLETE';

export const geoLocateUser = () => async dispatch => {
  const GEOLOCATION_TIMEOUT = 10000;
  if (navigator?.geolocation?.getCurrentPosition) {
    dispatch({ type: GEOLOCATE_USER });
    navigator.geolocation.getCurrentPosition(
      async currentPosition => {
        dispatch({
          type: GEOCODE_COMPLETE,
          payload: [
            currentPosition.coords.longitude,
            currentPosition.coords.latitude,
          ],
        });
      },
      () => dispatch({ type: GEOCODE_FAILED }),
      { timeout: GEOLOCATION_TIMEOUT },
    );
  } else {
    dispatch({ type: GEOCODE_FAILED });
  }
};
