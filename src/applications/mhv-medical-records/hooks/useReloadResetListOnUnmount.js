import { useEffect, useRef } from 'react';
import { loadStates } from '../util/constants';

/**
 * Unified unmount cleanup responsibilities:
 * 1. Reload the domain’s records (if reloadRecordsAction is provided).
 * 2. If we unmount while still in FETCHING, reset to PRE_FETCH so navigating back in
 *    shows the normal initial state instead of a stale spinner.
 *
 * Implementation notes:
 * - listState is tracked via a ref so the cleanup sees the *final* state at unmount
 *   without re-registering the cleanup on each state change (eg. FETCHING -> FETCHED)
 */
const useReloadResetListOnUnmount = ({
  listState,
  dispatch,
  updateListActionType,
  reloadRecordsAction,
}) => {
  // Latest listState snapshot kept in a ref (write each render; read at unmount).
  const latestStateRef = useRef(listState);

  useEffect(
    () => {
      latestStateRef.current = listState;
    },
    [listState],
  );

  useEffect(
    () => {
      // Unmount cleanup
      return () => {
        if (reloadRecordsAction) {
          dispatch(reloadRecordsAction());
        }
        if (latestStateRef.current === loadStates.FETCHING) {
          dispatch({
            type: updateListActionType,
            payload: loadStates.PRE_FETCH,
          });
        }
      };
    },
    [dispatch, reloadRecordsAction, updateListActionType],
  );
};
export default useReloadResetListOnUnmount;
