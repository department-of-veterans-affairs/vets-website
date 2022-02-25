import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../../../api';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { receivedMultipleAppointmentDetails } from '../../../actions/day-of';

import DisplayMultipleAppointments from './DisplayMultipleAppointments';
import { URLS } from '../../../utils/navigation';

import {
  makeSelectVeteranData,
  makeSelectCurrentContext,
  makeSelectForm,
} from '../../../selectors';

const CheckIn = props => {
  const { isDayOfDemographicsFlagsEnabled } = props;
  const { router } = props;
  const { goToErrorPage, jumpToPage } = useFormRouting(router);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const context = useSelector(selectCurrentContext);

  const appointment = appointments ? appointments[0] : {};

  const { token } = context;
  const dispatch = useDispatch();

  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  // These will be undefined if pages are skipped in day-of. Default to 'yes'
  const {
    demographicsUpToDate = 'yes',
    emergencyContactUpToDate = 'yes',
    nextOfKinUpToDate = 'yes',
  } = data;

  const [demographicsFlagsSent, setDemographicsFlagsSent] = useState(false);

  useEffect(
    () => {
      if (!isDayOfDemographicsFlagsEnabled) return;
      const demographicsData = {
        uuid: token,
        demographicsUpToDate: demographicsUpToDate === 'yes',
        emergencyContactUpToDate: emergencyContactUpToDate === 'yes',
        nextOfKinUpToDate: nextOfKinUpToDate === 'yes',
      };
      try {
        api.v2.patchDayOfDemographicsData(demographicsData).then(resp => {
          if (resp.data.error || resp.data.errors) {
            goToErrorPage();
          } else if (Object.values(demographicsData).includes(false)) {
            jumpToPage(URLS.SEE_STAFF);
          } else {
            setDemographicsFlagsSent(true);
          }
        });
      } catch (error) {
        goToErrorPage();
      }
    },
    [
      demographicsUpToDate,
      emergencyContactUpToDate,
      goToErrorPage,
      isDayOfDemographicsFlagsEnabled,
      jumpToPage,
      nextOfKinUpToDate,
      token,
    ],
  );

  const getMultipleAppointments = useCallback(
    () => {
      if (!context) {
        goToErrorPage();
      } else {
        api.v2
          .getCheckInData(token)
          .then(json => {
            dispatch(
              receivedMultipleAppointmentDetails(
                json.payload.appointments,
                token,
              ),
            );
          })
          .catch(() => {
            goToErrorPage();
          });
      }
    },
    [dispatch, context, goToErrorPage, token],
  );

  if (isDayOfDemographicsFlagsEnabled) {
    if (!appointment || !demographicsFlagsSent) {
      return (
        <va-loading-indicator message="Loading your appointments for today" />
      );
    }
  } else if (!appointment) {
    return (
      <va-loading-indicator message="Loading your appointments for today" />
    );
  }
  return (
    <DisplayMultipleAppointments
      router={router}
      token={token}
      appointments={appointments}
      getMultipleAppointments={getMultipleAppointments}
    />
  );
};

CheckIn.propTypes = {
  appointments: PropTypes.array,
  isDayOfDemographicsFlagsEnabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  router: PropTypes.object,
};

export default CheckIn;
