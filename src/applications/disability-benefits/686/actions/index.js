import { fetchDisabilityRating } from '../helpers';
import conditionalStorage from '../../../../platform/utilities/storage/conditionalStorage';

export const LOAD_30_PERCENT_DISABILITY_RATING_STARTED =
  'LOAD_30_PERCENT_DISABILITY_RATING_STARTED';
export const LOAD_30_PERCENT_DISABILITY_RATING_SUCCEEDED =
  'LOAD_30_PERCENT_DISABILITY_RATING_SUCCEEDED';
export const LOAD_30_PERCENT_DISABILITY_RATING_FAILED =
  'LOAD_30_PERCENT_DISABILITY_RATING_FAILED';

export function verifyDisabilityRating() {
  return (dispatch, getState) => {
    const hasAuth = !!conditionalStorage().getItem('userToken');
    let isVerified = false;
    if (hasAuth) isVerified = getState().user.profile.verified;
    if (!isVerified) {
      return Promise.resolve();
    }
    dispatch({
      type: LOAD_30_PERCENT_DISABILITY_RATING_STARTED,
    });

    return fetchDisabilityRating({
      onDone: payload => {
        dispatch({
          type: LOAD_30_PERCENT_DISABILITY_RATING_SUCCEEDED,
          payload,
        });
      },
      onError: error => {
        // TODO: get analytics event to fire on check failure
        // recordEvent({ event: `${trackingPrefix}school-not-found` });
        dispatch({
          type: LOAD_30_PERCENT_DISABILITY_RATING_FAILED,
          error,
        });
      },
    });
  };
}
