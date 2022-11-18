import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { api } from '../api';
import { makeSelectCurrentContext, makeSelectApp } from '../selectors';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';
import {
  setVeteranData,
  updateFormAction as updatePreCheckInForm,
} from '../actions/pre-check-in';

import {
  receivedDemographicsData,
  receivedMultipleAppointmentDetails,
  triggerRefresh,
  updateFormAction as updateDayOfForm,
} from '../actions/day-of';

import {
  preCheckinExpired,
  appointmentWasCanceled,
  preCheckinAlreadyCompleted,
} from '../utils/appointment';
import { useFormRouting } from './useFormRouting';
import { useSessionStorage } from './useSessionStorage';
import { APP_NAMES } from '../utils/appConstants';
import { URLS } from '../utils/navigation';

const useGetCheckInData = ({
  refreshNeeded,
  appointmentsOnly = false,
  reload = false,
  router,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStale, setIsStale] = useState(refreshNeeded);
  const [isComplete, setIsComplete] = useState(false);
  const [checkInDataError, setCheckInDataError] = useState(false);

  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isTravelReimbursementEnabled } = useSelector(selectFeatureToggles);
  const { goToErrorPage, jumpToPage } = useFormRouting(router);
  const { setPreCheckinComplete } = useSessionStorage();

  const dispatch = useDispatch();

  const refreshCheckInData = () => {
    setIsStale(true);
  };

  const setDayOfData = useCallback(
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
            updateDayOfForm({
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
    [appointmentsOnly, dispatch, token, isTravelReimbursementEnabled, reload],
  );

  const setPreCheckInData = useCallback(
    payload => {
      batch(() => {
        dispatch(setVeteranData({ ...payload }));
        if (!reload) {
          dispatch(updatePreCheckInForm({ ...payload }));
        }
      });
    },
    [dispatch, reload],
  );
  useLayoutEffect(
    () => {
      if (isStale && token && !isLoading) {
        setIsLoading(true);
        if (app === APP_NAMES.PRE_CHECK_IN) {
          api.v2
            .getPreCheckInData(token)
            .then(json => {
              if (json.error) {
                // setCheckInDataError(true);
                goToErrorPage('?error=error-getting-pre-check-in-data');
                return; // prevent a react no-op on an unmounted component
              }
              const { payload } = json;
              setPreCheckInData(payload);
              if (
                payload.appointments &&
                payload.appointments.length > 0 &&
                preCheckinExpired(payload.appointments)
              ) {
                goToErrorPage('?error=pre-check-in-expired');
              }

              if (appointmentWasCanceled(payload.appointments)) {
                goToErrorPage('?error=appointment-canceled');
              }

              if (preCheckinAlreadyCompleted(payload.appointments)) {
                setPreCheckinComplete(window, true);
                jumpToPage(URLS.COMPLETE);
              }
            })
            .catch(() => {
              setCheckInDataError(true);
              // goToErrorPage('?error=error-fromlocation-precheckin-introduction');
            })
            .finally(() => {
              setIsStale(false);
              setIsComplete(true);
              setIsLoading(false);
            });
        } else {
          api.v2
            .getCheckInData(token, reload)
            .then(json => {
              setDayOfData(json.payload);
            })
            .catch(() => {
              setCheckInDataError(true);
            })
            .finally(() => {
              setIsStale(false);
              setIsComplete(true);
              setIsLoading(false);
            });
        }
      }
    },
    [
      isStale,
      setDayOfData,
      token,
      isLoading,
      reload,
      app,
      goToErrorPage,
      jumpToPage,
      setPreCheckInData,
      setPreCheckinComplete,
    ],
  );

  return { checkInDataError, isLoading, refreshCheckInData, isComplete };
};

export { useGetCheckInData };
