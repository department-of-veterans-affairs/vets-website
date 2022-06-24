import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { api } from '../api';
import { makeSelectCurrentContext } from '../selectors';

import {
  receivedDemographicsData,
  receivedMultipleAppointmentDetails,
  triggerRefresh,
  updateFormAction,
} from '../actions/day-of';

const useGetCheckInData = (refreshNeeded, appointmentsOnly = false) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStale, setIsStale] = useState(refreshNeeded);
  const [checkInDataError, setCheckInDataError] = useState(false);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);
  const dispatch = useDispatch();

  const refreshCheckInData = () => {
    setIsStale(true);
  };

  const setSessionData = useCallback(
    payload => {
      batch(() => {
        const {
          appointments: appts,
          demographics: demo,
          patientDemographicsStatus,
        } = payload;
        dispatch(triggerRefresh(false));
        dispatch(receivedMultipleAppointmentDetails(appts, token));

        if (!appointmentsOnly) {
          dispatch(receivedDemographicsData(demo));
          dispatch(
            updateFormAction({
              patientDemographicsStatus,
            }),
          );
        }
      });
    },
    [appointmentsOnly, dispatch, token],
  );

  useEffect(
    () => {
      if (isStale) {
        setIsLoading(true);

        api.v2
          .getCheckInData(token)
          .then(json => {
            setSessionData(json.payload);
          })
          .catch(() => {
            setCheckInDataError(true);
          })
          .finally(() => {
            setIsLoading(false);
            setIsStale(false);
          });
      }
    },
    [isStale, setSessionData, token],
  );

  return { checkInDataError, isLoading, refreshCheckInData };
};

export { useGetCheckInData };
