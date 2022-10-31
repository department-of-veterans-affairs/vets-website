import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { api } from '../api';
import { makeSelectCurrentContext } from '../selectors';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

import {
  receivedDemographicsData,
  receivedMultipleAppointmentDetails,
  triggerRefresh,
  updateFormAction,
} from '../actions/day-of';

const useGetCheckInData = ({
  refreshNeeded,
  appointmentsOnly = false,
  reload = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStale, setIsStale] = useState(refreshNeeded);
  const [checkInDataError, setCheckInDataError] = useState(false);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isTravelReimbursementEnabled } = useSelector(selectFeatureToggles);
  const dispatch = useDispatch();

  const refreshCheckInData = () => {
    setIsStale(true);
  };

  const setSessionData = useCallback(
    payload => {
      batch(() => {
        const {
          appointments,
          demographics,
          patientDemographicsStatus,
        } = payload;
        dispatch(triggerRefresh(false));
        dispatch(receivedMultipleAppointmentDetails(appointments, token));

        if (!appointmentsOnly) {
          dispatch(receivedDemographicsData(demographics));
          dispatch(
            updateFormAction({
              patientDemographicsStatus,
              isTravelReimbursementEnabled,
              appointments,
            }),
          );
        }

        if (reload) {
          dispatch(receivedDemographicsData(demographics));
        }
      });
    },
    [appointmentsOnly, dispatch, token, isTravelReimbursementEnabled],
  );

  useLayoutEffect(
    () => {
      if (isStale && token && !isLoading) {
        setIsLoading(true);
        api.v2
          .getCheckInData(token, reload)
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
