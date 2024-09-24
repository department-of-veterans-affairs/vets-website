import { useEffect, useState, useCallback } from 'react';
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
  const [endPollingDate, setEndPollingDate] = useState(null);

  /** How long to poll the status endpoint, in milliseconds */
  const POLL_DURATION = 120000;

  const PHR_REFRESH_DURATION = 3600000;

  /**
   * Read the PHR status polling timeout localStorage. Then use that value to update
   * endPollingDate in the state to keep things in sync. If there is no value in localStorage,
   * use the current time as the baseline for adding the POLL_DURATION.
   */
  const updateEndPollingDate = useCallback(
    () => {
      let lastPhrRefreshDate = +localStorage.getItem('lastPhrRefreshDate');
      if (!lastPhrRefreshDate) {
        lastPhrRefreshDate = new Date().getTime();
      }
      const updatedEndPollingDate = lastPhrRefreshDate + POLL_DURATION;
      if (updatedEndPollingDate !== endPollingDate?.getTime()) {
        setEndPollingDate(new Date(updatedEndPollingDate));
      }
      return updatedEndPollingDate;
    },
    [endPollingDate],
  );

  useEffect(
    /**
     * Fetch the refresh status from the backend when the app loads. Store the time that this
     * happens, and do not refresh the status again until the app is reloaded, or until it's
     * possible that the PHR refresh was re-run (1 hour).
     */
    () => {
      if (
        statusPollBeginDate === null ||
        new Date().getTime() >
          statusPollBeginDate.getTime() + PHR_REFRESH_DURATION
      ) {
        dispatch(fetchRefreshStatus())
          .then(() => {
            updateEndPollingDate();
            if (!statusPollBeginDate) {
              // Note the time that we started polling the status endpoint.
              dispatch(setStatusPollBeginDate(new Date()));
            }
          })
          .catch(() => {
            // If needed in the future, we can set a timer on failure to try again later.
          });
      }
    },
    // Adding updateEndPollingDate here causes the useEffect to run several extra times.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [statusPollBeginDate, dispatch],
  );

  useEffect(
    /**
     * If the status has been fetched and the refresh phase is anything other than current, continue
     * polling the status endpoint until the refresh is current or until the endPollingDate is reached.
     */
    () => {
      let timeoutId;
      // Update the polling timeout from localStorage. Do this every time, because that date may
      // change when the action is run.
      const updatedEndPollingDate = updateEndPollingDate();
      if (
        updatedEndPollingDate &&
        refresh.status &&
        refresh.phase !== refreshPhases.CURRENT
      ) {
        if (new Date() <= updatedEndPollingDate) {
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
    [refresh.status, refresh.phase, dispatch, updateEndPollingDate],
  );

  return null;
};

export default PhrRefresh;

PhrRefresh.propTypes = {
  statusPollBeginDate: PropTypes.instanceOf(Date),
};
