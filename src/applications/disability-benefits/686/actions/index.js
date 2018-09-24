import { fetchDisabilityRating } from '../helpers';

export const LOAD_DISABILITY_RATING_STARTED = 'LOAD_DISABILITY_RATING_STARTED';
export const LOAD_DISABILITY_RATING_SUCCEEDED = 'LOAD_DISABILITY_RATING_SUCCEEDED';
export const LOAD_DISABILITY_RATING_FAILED = 'LOAD_DISABILITY_RATING_FAILED';

export function verifyDisabilityRating() {
  return dispatch => {
    dispatch({
      type: LOAD_DISABILITY_RATING_STARTED
    });

    fetchDisabilityRating({
      onDone: payload  => {
        dispatch({
          type: LOAD_DISABILITY_RATING_SUCCEEDED,
          payload
        });
      },
      onError: error => {
        // TODO: get analytics event to fire on check failure
        // recordEvent({ event: `${trackingPrefix}school-not-found` });
        dispatch({
          type: LOAD_DISABILITY_RATING_FAILED,
          error,
        });
      }
    });
  };
}
