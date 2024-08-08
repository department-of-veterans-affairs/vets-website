import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRefreshStatus } from '../../actions/refresh';
import { STATUS_POLL_INTERVAL, refreshPhases } from '../../util/constants';
import { Actions } from '../../util/actionTypes';

/**
 * State-management component to offload some of the work from App.jsx.
 *
 * @returns null
 */
const PhrRefresh = () => {
  const dispatch = useDispatch();
  const refresh = useSelector(state => state.mr.refresh);
  const [endPollingDate, setEndPollingDate] = useState(null);

  /** How long to poll the status endpoint, in milliseconds */
  const POLL_DURATION = 120000;

  useEffect(
    /**
     * Fetch the refresh status from the backend when the app loads.
     */
    () => {
      dispatch(fetchRefreshStatus())
        .then(() => {
          setEndPollingDate(new Date(new Date().getTime() + POLL_DURATION));
        })
        .catch(() => {
          // If needed in the future, we can set a timer on failure to try again later.
        });
    },
    [dispatch],
  );

  useEffect(
    /**
     * If the status has been fetched and the refresh phase is anything other than current, continue
     * polling the status endpoint until the refresh is current or until the endPollingDate is reached.
     */
    () => {
      let timeoutId;
      if (
        endPollingDate &&
        refresh.status &&
        refresh.phase !== refreshPhases.CURRENT
      ) {
        if (new Date() <= endPollingDate) {
          timeoutId = setTimeout(() => {
            dispatch(fetchRefreshStatus());
          }, STATUS_POLL_INTERVAL);
        } else {
          dispatch({ type: Actions.Refresh.TIMED_OUT });
        }
      }
      return () => {
        // Clear the timeout if the component unmounts.
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    },
    [refresh.status, refresh.phase, endPollingDate, dispatch],
  );

  return null;
};

export default PhrRefresh;
