import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import PropTypes from 'prop-types';
import { URLS } from '../../../utils/navigation/day-of';
import { useFormRouting } from '../../../hooks/useFormRouting';
import {
  receivedEmergencyContact,
  receivedDemographicsData,
  receivedNextOfKinData,
  receivedMultipleAppointmentDetails,
  triggerRefresh,
  updateFormAction,
} from '../../../actions/day-of';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { makeSelectCheckInData } from '../../hooks/selectors';
import { api } from '../../../api';

const LoadingPage = props => {
  const {
    isSessionLoading,
    router,
    isEmergencyContactEnabled,
    checkInExperienceUpdateInformationPageEnabled,
  } = props;
  const { goToErrorPage, goToNextPage } = useFormRouting(router, URLS);
  const selectCheckInData = useMemo(makeSelectCheckInData, []);
  const checkInData = useSelector(selectCheckInData);
  const { getCurrentToken } = useSessionStorage(false);
  const { context, appointments } = checkInData;
  const dispatch = useDispatch();
  const setSessionData = useCallback(
    (payload, token) => {
      batch(() => {
        const {
          appointments: appts,
          demographics: demo,
          patientDemographicsStatus,
        } = payload;
        dispatch(triggerRefresh(false));
        dispatch(receivedMultipleAppointmentDetails(appts, token));
        dispatch(
          updateFormAction({
            patientDemographicsStatus,
            isEmergencyContactEnabled,
            checkInExperienceUpdateInformationPageEnabled,
          }),
        );
        if (typeof demo !== 'undefined') {
          dispatch(receivedDemographicsData(demo));
          if ('nextOfKin1' in demo) {
            dispatch(receivedNextOfKinData(demo.nextOfKin1));
          }
          if ('emergencyContact' in demo) {
            dispatch(receivedEmergencyContact(demo.emergencyContact));
          }
        }
      });
    },
    [
      dispatch,
      isEmergencyContactEnabled,
      checkInExperienceUpdateInformationPageEnabled,
    ],
  );

  useEffect(
    () => {
      let isCancelled = false;
      const session = getCurrentToken(window);
      if (!context || !session) {
        goToErrorPage();
      } else {
        // check if appointments is empty or if a refresh is staged
        const { token } = session;

        if (
          Object.keys(context).length === 0 ||
          context.shouldRefresh ||
          appointments.length === 0
        ) {
          api.v2
            .getCheckInData(token)
            .then(json => {
              if (!isCancelled) {
                setSessionData(json.payload, token);
                goToNextPage();
              }
            })
            .catch(() => {
              goToErrorPage();
            });
        }
      }
      return () => {
        isCancelled = true;
      };
    },
    [
      appointments,
      router,
      context,
      setSessionData,
      isSessionLoading,
      getCurrentToken,
      goToErrorPage,
      goToNextPage,
    ],
  );

  return <va-loading-indicator message="Loading your appointments for today" />;
};

LoadingPage.propTypes = {
  isSessionLoading: PropTypes.bool,
  router: PropTypes.object,
  isEmergencyContactEnabled: PropTypes.bool,
  checkInExperienceUpdateInformationPageEnabled: PropTypes.bool,
};

export default LoadingPage;
