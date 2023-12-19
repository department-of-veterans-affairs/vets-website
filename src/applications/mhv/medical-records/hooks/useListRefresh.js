import { useEffect, useMemo } from 'react';
import {
  VALID_REFRESH_DURATION,
  refreshPhases,
  loadStates,
} from '../util/constants';

/**
 * Custom hook to fetch and load list data from the backend. This is designed to only refresh the
 * data if it is stale AND there is potentially more recent data on the server. This function will
 * ALWAYS fetch data if there is none locally. In that case, the function will fetch again once
 * the PHR refresh is complete, provided the PHR status endpoint is being polled.
 *
 * @param {*} listState one of PRE_FETCH, FETCHING, FETCHED
 * @param {Date} listCurrentAsOf last date the list was confirmed to be up-to-date
 * @param {*} refreshStatus the list of statuses from the PHR refresh status call response
 * @param {*} extractType the relevant extract type from the PHR refresh status call (e.g. ALLERGY)
 * @param {function} dispatchAction the action creator function that will fetch the list
 * @param {function} dispatch the React dispatch function
 */
function useListRefresh({
  listState,
  listCurrentAsOf,
  refreshStatus,
  extractType,
  dispatchAction,
  dispatch,
}) {
  const refreshIsCurrent = useMemo(
    () => {
      return (
        refreshStatus &&
        refreshStatus.some(
          extStatus =>
            extStatus.extract === extractType &&
            extStatus.phase === refreshPhases.CURRENT,
        )
      );
    },
    [refreshStatus, extractType],
  );

  const isDataStale = useMemo(
    () => {
      if (!listCurrentAsOf) return true;
      const now = new Date();
      const durationSinceLastRefresh = now - listCurrentAsOf;
      return durationSinceLastRefresh > VALID_REFRESH_DURATION;
    },
    [listCurrentAsOf],
  );

  useEffect(
    () => {
      const shouldFetch =
        listState === loadStates.PRE_FETCH ||
        (listState !== loadStates.FETCHING && refreshIsCurrent && isDataStale);

      if (shouldFetch) {
        dispatch(dispatchAction(refreshIsCurrent));
      }
    },
    [refreshIsCurrent, listState, isDataStale, dispatchAction, dispatch],
  );
}

export default useListRefresh;
