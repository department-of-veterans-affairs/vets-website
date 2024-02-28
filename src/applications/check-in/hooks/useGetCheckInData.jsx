import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { api } from '../api';
import { makeSelectCurrentContext } from '../selectors';
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
  additionalContext,
} from '../actions/day-of';

import { receivedTravelData } from '../actions/travel-claim';

import {
  preCheckinExpired,
  appointmentWasCanceled,
  allAppointmentsCanceled,
  preCheckinAlreadyCompleted,
  appointmentStartTimePast15,
} from '../utils/appointment';
import { useFormRouting } from './useFormRouting';
import { useStorage } from './useStorage';
import { URLS } from '../utils/navigation';

import { useUpdateError } from './useUpdateError';

const useGetCheckInData = ({
  refreshNeeded,
  appointmentsOnly = false,
  reload = false,
  router,
  app,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStale, setIsStale] = useState(refreshNeeded);
  const [isComplete, setIsComplete] = useState(false);
  const [checkInDataError, setCheckInDataError] = useState(false);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isTravelReimbursementEnabled, isTravelLogicEnabled } = useSelector(
    selectFeatureToggles,
  );
  const { jumpToPage } = useFormRouting(router);
  const { setPreCheckinComplete } = useStorage();
  const { getTravelPaySent } = useStorage(false, true);

  const dispatch = useDispatch();

  const { updateError } = useUpdateError();

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
          setECheckinStartedCalled,
        } = payload;
        dispatch(triggerRefresh(false));
        dispatch(receivedMultipleAppointmentDetails(appointments, token));
        dispatch(additionalContext({ setECheckinStartedCalled }));
        if (!appointmentsOnly) {
          const travelPaySent = getTravelPaySent(window);
          dispatch(receivedDemographicsData(demographics));
          dispatch(
            updateDayOfForm({
              patientDemographicsStatus,
              isTravelReimbursementEnabled,
              appointments,
              isTravelLogicEnabled,
              travelPaySent,
            }),
          );
        }

        if (reload) {
          dispatch(receivedDemographicsData(demographics));
        }
      });
    },
    [
      appointmentsOnly,
      dispatch,
      token,
      isTravelReimbursementEnabled,
      reload,
      getTravelPaySent,
      isTravelLogicEnabled,
    ],
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

  const setTravelData = useCallback(
    payload => {
      batch(() => {
        dispatch(receivedTravelData(payload));
      });
    },
    [dispatch],
  );
  const fetchPreCheckIn = useCallback(
    () => {
      api.v2
        .getPreCheckInData(token, reload)
        .then(json => {
          if (json.error) {
            updateError('error-getting-pre-check-in-data');
            return; // prevent a react no-op on an unmounted component
          }
          const { payload } = json;
          setPreCheckInData(payload);

          if (payload.appointments?.length > 0) {
            if (appointmentStartTimePast15(payload.appointments)) {
              updateError('pre-check-in-past-appointment');
              return;
            }
            if (preCheckinExpired(payload.appointments)) {
              updateError('pre-check-in-expired');
              return;
            }
          }

          if (appointmentWasCanceled(payload.appointments)) {
            updateError('possible-canceled-appointment');
            return;
          }

          if (allAppointmentsCanceled(payload.appointments)) {
            updateError('appointment-canceled');
            return;
          }

          if (preCheckinAlreadyCompleted(payload.appointments)) {
            setPreCheckinComplete(window, true);
            jumpToPage(URLS.COMPLETE);
          }
        })
        .catch(e => {
          if (e.errors && e?.errors[0]?.status === '404') {
            updateError('uuid-not-found');
          } else {
            setCheckInDataError(true);
          }
        })
        .finally(() => {
          setIsStale(false);
          setIsComplete(true);
          setIsLoading(false);
        });
    },
    [
      jumpToPage,
      reload,
      setPreCheckInData,
      setPreCheckinComplete,
      token,
      updateError,
    ],
  );

  const fetchDayOfOrTravel = useCallback(
    facilityType => {
      api.v2
        .getCheckInData(token, facilityType)
        .then(json => {
          if (app === 'travelClaim') {
            setTravelData(json.payload);
          } else {
            setDayOfData(json.payload);
          }
        })
        .catch(e => {
          if (e.errors && e.errors[0]?.status === '404') {
            updateError('uuid-not-found');
          } else {
            setCheckInDataError(true);
          }
        })
        .finally(() => {
          setIsStale(false);
          setIsComplete(true);
          setIsLoading(false);
        });
    },
    [app, setDayOfData, setTravelData, token, updateError],
  );

  useLayoutEffect(
    () => {
      if (isStale && token && !isLoading) {
        setIsLoading(true);
        switch (app) {
          case 'preCheckIn':
            fetchPreCheckIn();
            break;
          case 'dayOf':
            fetchDayOfOrTravel(null);
            break;
          case 'travelClaim':
            fetchDayOfOrTravel('oh');
            break;
          default:
            break;
        }
      }
    },
    [
      isStale,
      setDayOfData,
      token,
      isLoading,
      reload,
      updateError,
      jumpToPage,
      setPreCheckInData,
      setPreCheckinComplete,
      app,
      setTravelData,
      fetchPreCheckIn,
      fetchDayOfOrTravel,
    ],
  );

  return { checkInDataError, isLoading, refreshCheckInData, isComplete };
};

export { useGetCheckInData };
