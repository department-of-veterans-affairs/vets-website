import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormRouting } from '../../../hooks/useFormRouting';
import {
  receivedDemographicsData,
  receivedMultipleAppointmentDetails,
  triggerRefresh,
  updateFormAction,
} from '../../../actions/day-of';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import {
  makeSelectCurrentContext,
  makeSelectVeteranData,
} from '../../../selectors';
import { api } from '../../../api';

const LoadingPage = props => {
  const { isSessionLoading, router, isUpdatePageEnabled } = props;

  const { goToErrorPage, goToNextPage } = useFormRouting(router);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const { getCurrentToken } = useSessionStorage(false);
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const context = useSelector(selectCurrentContext);
  const dispatch = useDispatch();
  const [updatedData, setUpdatedData] = useState(false);
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
        dispatch(receivedDemographicsData(demo));
        dispatch(
          updateFormAction({
            patientDemographicsStatus,
            checkInExperienceUpdateInformationPageEnabled: isUpdatePageEnabled,
          }),
        );
        setUpdatedData(true);
      });
    },
    [dispatch, isUpdatePageEnabled, setUpdatedData],
  );

  useEffect(
    () => {
      const session = getCurrentToken(window);
      if (!context) {
        goToErrorPage();
      } else {
        // check if appointments is empty or if a refresh is staged
        const { token } = session;
        if (Object.keys(context).length === 0 || appointments.length === 0) {
          api.v2
            .getCheckInData(token)
            .then(json => {
              setSessionData(json.payload, token);
            })
            .catch(() => {
              goToErrorPage();
            });
        }
      }
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

  useEffect(
    () => {
      if (updatedData) {
        goToNextPage();
      }
    },
    [updatedData, goToNextPage],
  );

  return <va-loading-indicator message="Loading your appointments for today" />;
};

LoadingPage.propTypes = {
  isSessionLoading: PropTypes.bool,
  isUpdatePageEnabled: PropTypes.bool,
  router: PropTypes.object,
};

export default LoadingPage;
