import {
  captureError,
  createApiEvent,
  ERROR_SOURCES,
} from '@@vap-svc/util/analytics';
import recordEvent from '~/platform/monitoring/record-event';
import { getData } from '../util';

export { fetchProfileContacts } from './contacts';

export const FETCH_HERO = 'FETCH_HERO';
export const FETCH_HERO_SUCCESS = 'FETCH_HERO_SUCCESS';
export const FETCH_HERO_FAILED = 'FETCH_HERO_FAILED';

export const FETCH_MILITARY_INFORMATION = 'FETCH_MILITARY_INFORMATION';
export const FETCH_MILITARY_INFORMATION_SUCCESS =
  'FETCH_MILITARY_INFORMATION_SUCCESS';
export const FETCH_MILITARY_INFORMATION_FAILED =
  'FETCH_MILITARY_INFORMATION_FAILED';

export const FETCH_ADDRESS_CONSTANTS_SUCCESS =
  'FETCH_ADDRESS_CONSTANTS_SUCCESS';

const captureMilitaryInfoErrorResponse = ({ error, apiEventName }) => {
  const [firstError = {}] = error.errors ?? [];
  const {
    code = 'code-unknown',
    title = 'title-unknown',
    detail = 'detail-unknown',
    status = 'status-unknown',
  } = firstError;

  captureError(error, {
    eventName: apiEventName,
    code,
    title,
    detail,
    status,
  });
};

export function fetchHero() {
  return async dispatch => {
    dispatch({ type: FETCH_HERO });
    const response = await getData('/profile/full_name');

    if (response.errors || response.error) {
      dispatch({ type: FETCH_HERO_FAILED, hero: { errors: response } });
      return;
    }

    dispatch({ type: FETCH_HERO_SUCCESS, hero: { userFullName: response } });
  };
}

export function fetchMilitaryInformation(recordAnalyticsEvent = recordEvent) {
  return async dispatch => {
    dispatch({ type: FETCH_MILITARY_INFORMATION });

    const baseUrl = '/profile/service_history';

    const apiEventName = `GET ${baseUrl}`;

    try {
      recordAnalyticsEvent(
        createApiEvent({
          name: apiEventName,
          status: 'started',
        }),
      );

      const response = await getData(baseUrl);

      if (response.errors || response.error) {
        const error = response.error || response.errors;
        let errorName = 'unknown';
        if (error) {
          if (error.length > 0) {
            errorName = error[0].title;
          } else {
            errorName = error?.title || 'unknown-title';
          }
        }

        recordAnalyticsEvent(
          createApiEvent({
            name: apiEventName,
            status: 'failed',
            errorKey: `${errorName}-get-error-api-response`,
          }),
        );

        captureMilitaryInfoErrorResponse({
          error: { ...error, source: ERROR_SOURCES.API },
          apiEventName: 'profile-get-military-information-failed',
        });

        dispatch({
          type: FETCH_MILITARY_INFORMATION_FAILED,
          militaryInformation: {
            serviceHistory: {
              error,
            },
          },
        });
        return;
      }

      recordAnalyticsEvent(
        createApiEvent({
          name: apiEventName,
          status: 'successful',
        }),
      );

      dispatch({
        type: FETCH_MILITARY_INFORMATION_SUCCESS,
        militaryInformation: {
          serviceHistory: response,
        },
      });
    } catch (error) {
      captureMilitaryInfoErrorResponse({
        error,
        apiEventName: 'profile-get-military-information-failed',
      });
      dispatch({
        type: FETCH_MILITARY_INFORMATION_FAILED,
        militaryInformation: {
          serviceHistory: {
            error,
          },
        },
      });
    }
  };
}
