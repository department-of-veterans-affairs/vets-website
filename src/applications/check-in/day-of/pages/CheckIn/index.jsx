import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../../../api';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { receivedMultipleAppointmentDetails } from '../../../actions/day-of';

import DisplayMultipleAppointments from './DisplayMultipleAppointments';

import {
  makeSelectVeteranData,
  makeSelectCurrentContext,
} from '../../../selectors';

const CheckIn = props => {
  const { router } = props;
  const { goToErrorPage } = useFormRouting(router);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const context = useSelector(selectCurrentContext);

  const appointment = appointments ? appointments[0] : {};

  const { token } = context;
  const dispatch = useDispatch();

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

  if (!appointment) {
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
  isLoading: PropTypes.bool,
  router: PropTypes.object,
};

export default CheckIn;
