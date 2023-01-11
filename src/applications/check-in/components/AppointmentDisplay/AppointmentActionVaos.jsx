import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { parseISO } from 'date-fns';
import { api } from '../../api';

import { useFormRouting } from '../../hooks/useFormRouting';
import { ELIGIBILITY, areEqual } from '../../utils/appointment/eligibility';

import { appointmentWasCheckedInto } from '../../actions/day-of';

import { CheckInButton } from './CheckInButton';
import { useUpdateError } from '../../hooks/useUpdateError';

const AppointmentActionVaos = props => {
  const { appointment, router, token } = props;

  const dispatch = useDispatch();
  const setSelectedAppointment = useCallback(
    appt => {
      dispatch(appointmentWasCheckedInto(appt));
    },
    [dispatch],
  );
  const { updateError } = useUpdateError();

  const { jumpToPage } = useFormRouting(router);
  const onClick = useCallback(
    async () => {
      try {
        const json = await api.v2.postCheckInData({
          uuid: token,
          appointmentIen: appointment.appointmentIen,
          facilityId: appointment.facilityId,
        });
        const { status } = json;
        if (status === 200) {
          setSelectedAppointment(appointment);
          jumpToPage('complete');
        } else {
          updateError('check-in-post-error');
        }
      } catch (error) {
        updateError('error-completing-check-in');
      }
    },
    [appointment, updateError, jumpToPage, setSelectedAppointment, token],
  );
  if (
    appointment.eligibility &&
    areEqual(appointment.eligibility, ELIGIBILITY.ELIGIBLE)
  ) {
    return (
      <CheckInButton
        checkInWindowEnd={parseISO(appointment.checkInWindowEnd)}
        appointmentTime={
          appointment.startTime ? parseISO(appointment.startTime) : null
        }
        onClick={onClick}
        router={router}
      />
    );
  }
  return <></>;
};

AppointmentActionVaos.propTypes = {
  appointment: PropTypes.object,
  router: PropTypes.object,
  token: PropTypes.string,
};

export default AppointmentActionVaos;
