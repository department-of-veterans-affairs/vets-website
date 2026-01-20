import { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';

/**
 * Error codes for geolocation failures.
 * Maps to the Geolocation API's PositionError codes.
 */
export const GEOCODE_ERROR_CODES = {
  NONE: 0,
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
};

/**
 * Custom hook for tracking geolocation errors via analytics.
 *
 * Records analytics events when geocoding fails, distinguishing between
 * permission denied errors and other failures (position unavailable, timeout).
 *
 * @param {number} geocodeError - The geocode error code (0 = no error)
 */
const useGeolocationAnalytics = geocodeError => {
  useEffect(
    () => {
      if (geocodeError) {
        switch (geocodeError) {
          case GEOCODE_ERROR_CODES.NONE:
            break;
          case GEOCODE_ERROR_CODES.PERMISSION_DENIED:
            recordEvent({
              event: 'fl-get-geolocation-permission-error',
              'error-key': '1_PERMISSION_DENIED',
            });
            break;
          case GEOCODE_ERROR_CODES.POSITION_UNAVAILABLE:
            recordEvent({
              event: 'fl-get-geolocation-other-error',
              'error-key': '2_POSITION_UNAVAILABLE',
            });
            break;
          default:
            recordEvent({
              event: 'fl-get-geolocation-other-error',
              'error-key': '3_TIMEOUT',
            });
        }
      }
    },
    [geocodeError],
  );
};

export default useGeolocationAnalytics;
