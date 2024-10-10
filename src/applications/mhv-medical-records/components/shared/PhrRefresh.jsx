import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  fetchRefreshStatus,
  setStatusPollBeginDate,
} from '../../actions/refresh';
import { STATUS_POLL_INTERVAL, refreshPhases } from '../../util/constants';
import { Actions } from '../../util/actionTypes';

/**
 * State-management component to offload some of the work from App.jsx.
 *
 * @returns null
 */
const PhrRefresh = ({ statusPollBeginDate }) => {
  const dispatch = useDispatch();
  const refresh = useSelector(state => state.mr.refresh);

  /** How long to poll the status endpoint, in milliseconds */
  const POLL_DURATION = 120000;

  useEffect(
    /**
     * This hook hits the PHR status endpoint. It always does so once, then polls every two seconds
     * for as long as necessary.
     */
    () => {
      const getEndPollingDate = () => {
        const lastRefreshDate = parseInt(
          localStorage.getItem('lastPhrRefreshDate'),
          10,
        );
        const beginDate =
          (!Number.isNaN(lastRefreshDate) && lastRefreshDate) ||
          statusPollBeginDate ||
          Date.now();
        return beginDate + POLL_DURATION;
      };

      let timeoutId;
      if (!statusPollBeginDate) {
        // Note the time that we started polling the status endpoint.
        dispatch(setStatusPollBeginDate(Date.now()));
        // Run the status check if it has not yet been run since the app was loaded/refreshed. The
        // state update will re-trigger this useEffect and begin the polling cycle, if needed.
        dispatch(fetchRefreshStatus());
      } else {
        // Update the polling timeout from localStorage. Do this every time, because that date may
        // change when the action is dispatched.
        const endPollingDate = getEndPollingDate();
        const now = Date.now();
        if (
          refresh.status &&
          refresh.phase !== refreshPhases.CURRENT &&
          now <= endPollingDate
        ) {
          timeoutId = setTimeout(() => {
            dispatch(fetchRefreshStatus());
          }, STATUS_POLL_INTERVAL);
        }
        if (now > endPollingDate) {
          dispatch({ type: Actions.Refresh.TIMED_OUT });
        }
      }
      // Clear the timeout if the component unmounts.
      return () => timeoutId && clearTimeout(timeoutId);
    },
    [statusPollBeginDate, refresh.status, refresh.phase, dispatch],
  );

  return null;
};

export default PhrRefresh;

PhrRefresh.propTypes = {
  statusPollBeginDate: PropTypes.number,
};
