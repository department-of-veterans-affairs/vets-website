import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { api } from '../api';
import { makeSelectCurrentContext } from '../selectors';

import { recievedUpcomingAppointments } from '../actions/universal';

const useGetUpcomingAppointmentsData = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [
    upcomingAppointmentsDataError,
    setUpcomingAppointmentsDataError,
  ] = useState(false);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  const dispatch = useDispatch();

  const setUpcomingAppointmentsData = useCallback(
    payload => {
      batch(() => {
        const { appointments } = payload;
        dispatch(recievedUpcomingAppointments(appointments, token));
      });
    },
    [dispatch, token],
  );

  useLayoutEffect(
    () => {
      if (token && !isComplete) {
        api.v2
          .getUpcomingAppointmentsData(token)
          .then(json => {
            setUpcomingAppointmentsData(json.payload);
          })
          .catch(() => {
            setUpcomingAppointmentsDataError(true);
          })
          .finally(() => {
            setIsComplete(true);
          });
      }
    },
    [token, isComplete, setUpcomingAppointmentsData],
  );

  return { upcomingAppointmentsDataError, isComplete };
};

export { useGetUpcomingAppointmentsData };
