import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { api } from '../api';
import { makeSelectCurrentContext, makeSelectVeteranData } from '../selectors';

import {
  receivedDemographicsData,
  receivedMultipleAppointmentDetails,
  triggerRefresh,
  updateFormAction,
} from '../actions/day-of';

const useGetCheckInData = (
  isUpdatePageEnabled = false,
  appointmentsOnly = false,
) => {
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);
  const dispatch = useDispatch();

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
              checkInExperienceUpdateInformationPageEnabled: isUpdatePageEnabled,
            }),
          );
        }
      });
    },
    [appointmentsOnly, dispatch, isUpdatePageEnabled, token],
  );

  useEffect(
    () => {
      // check if appointments is empty or if a refresh is staged
      if (appointments.length === 0) {
        api.v2
          .getCheckInData(token)
          .then(json => {
            setSessionData(json.payload);
          })
          .catch(() => {
            throw new Error('Could not retrieve appointment data.');
          });
      }
    },
    [appointments, setSessionData, token],
  );
};

export { useGetCheckInData };
