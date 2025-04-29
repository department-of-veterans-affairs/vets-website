import { useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../api';
import { makeSelectCurrentContext } from '../selectors';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

import { recievedUpcomingAppointments } from '../actions/universal';

const useGetUpcomingAppointmentsData = ({ refreshNeeded }) => {
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isUpcomingAppointmentsEnabled } = useSelector(selectFeatureToggles);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStale, setIsStale] = useState(refreshNeeded);
  const [
    upcomingAppointmentsDataError,
    setUpcomingAppointmentsDataError,
  ] = useState(false);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  const refreshUpcomingData = () => {
    setIsStale(true);
    setIsComplete(false);
  };

  const dispatch = useDispatch();
  useLayoutEffect(
    () => {
      if (isUpcomingAppointmentsEnabled && token && !isComplete && isStale) {
        setIsLoading(true);
        api.v2
          .getUpcomingAppointmentsData(token)
          .then(json => {
            const appointments = json.data;
            dispatch(recievedUpcomingAppointments(appointments));
          })
          .catch(() => {
            setUpcomingAppointmentsDataError(true);
          })
          .finally(() => {
            setIsComplete(true);
            setIsLoading(false);
          });
      }
    },
    [token, isComplete, isStale, dispatch, isUpcomingAppointmentsEnabled],
  );

  return {
    upcomingAppointmentsDataError,
    isComplete,
    isLoading,
    refreshUpcomingData,
  };
};

export { useGetUpcomingAppointmentsData };
