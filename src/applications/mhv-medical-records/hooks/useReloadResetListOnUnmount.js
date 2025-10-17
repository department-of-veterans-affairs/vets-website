import { useEffect, useRef } from 'react';
import { loadStates } from '../util/constants';

/**
 * Unified unmount cleanup responsibilities:
 * 1. Reload the domain’s records (if reloadRecordsAction is provided).
 * 2. If we unmount while still in FETCHING, reset to PRE_FETCH so navigating back in
 *    shows the normal initial state instead of a stale spinner.
 *
 * Implementation notes:
 * - listState is tracked via a ref so the cleanup sees the *final* state at real unmount
 *   without re-registering the cleanup on each state change.
 * - Effect dependencies exclude listState to avoid premature cleanup firing during
 *   FETCHING -> FETCHED transitions (which would cause refetch loops).
 */
const useReloadResetListOnUnmount = ({
  listState,
  dispatch,
  updateListStateAction,
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
      // Single unmount cleanup (not re-run on state transitions).
      return () => {
        if (reloadRecordsAction) {
          dispatch(reloadRecordsAction());
        }
        if (latestStateRef.current === loadStates.FETCHING) {
          dispatch(updateListStateAction(loadStates.PRE_FETCH));
        }
      };
    },
    [dispatch, reloadRecordsAction, updateListStateAction],
  );
};
export default useReloadResetListOnUnmount;
