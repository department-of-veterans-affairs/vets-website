import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import format from 'date-fns/format';
import { api } from '../../api';

import { useFormRouting } from '../../hooks/useFormRouting';
import { ELIGIBILITY, areEqual } from '../../utils/appointment/eligibility';

import { appointmentWasCheckedInto } from '../../actions/day-of';

import { CheckInButton } from './CheckInButton';

const AppointmentAction = props => {
  const { appointment, router, token } = props;

  const dispatch = useDispatch();
  const setSelectedAppointment = useCallback(
    appt => {
      dispatch(appointmentWasCheckedInto(appt));
    },
    [dispatch],
  );

  const defaultMessage =
    'Online check-in isn’t available for this appointment. Check in with a staff member.';
  const { goToNextPage, goToErrorPage } = useFormRouting(router);
  const onClick = useCallback(
    async () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'check in now',
      });
      try {
        const json = await api.v2.postCheckInData({
          uuid: token,
          appointmentIen: appointment.appointmentIen,
          facilityId: appointment.facilityId,
        });
        const { status } = json;
        if (status === 200) {
          setSelectedAppointment(appointment);
          goToNextPage();
        } else {
          goToErrorPage();
        }
      } catch (error) {
        goToErrorPage();
      }
    },
    [appointment, goToErrorPage, goToNextPage, setSelectedAppointment, token],
  );

  if (appointment.eligibility) {
    if (areEqual(appointment.eligibility, ELIGIBILITY.ELIGIBLE)) {
      return <CheckInButton onClick={onClick} />;
    }
    if (areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_BAD_STATUS)) {
      return (
        <p data-testid="ineligible-bad-status-message">{defaultMessage}</p>
      );
    }
    if (areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_TOO_EARLY)) {
      if (appointment.checkInWindowStart) {
        const appointmentDateTime = new Date(appointment.checkInWindowStart);
        const appointmentTime = format(appointmentDateTime, 'h:mm aaaa');
        return (
          <p data-testid="too-early-message">
            You can check in starting at this time: {appointmentTime}
          </p>
        );
      }
      return (
        <p data-testid="no-time-too-early-reason-message">
          This appointment isn’t eligible for online check-in. Check-in with a
          staff member.
        </p>
      );
    }
    if (areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_TOO_LATE)) {
      return (
        <p data-testid="too-late-message">
          Your appointment started more than 15 minutes ago. We can’t check you
          in online. Ask a staff member for help.
        </p>
      );
    }
    if (
      areEqual(
        appointment.eligibility,
        ELIGIBILITY.INELIGIBLE_UNSUPPORTED_LOCATION,
      )
    ) {
      return <p data-testid="unsupported-location-message">{defaultMessage}</p>;
    }
    if (
      areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_UNKNOWN_REASON)
    ) {
      return <p data-testid="unknown-reason-message">{defaultMessage}</p>;
    }
    if (
      areEqual(
        appointment.eligibility,
        ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN,
      )
    ) {
      if (appointment.checkedInTime) {
        const appointmentDateTime = new Date(appointment.checkedInTime);
        if (Number.isNaN(appointmentDateTime.getTime())) {
          return (
            <p data-testid="already-checked-in-no-time-message">
              You are already checked in.
            </p>
          );
        }
        const appointmentTime = format(appointmentDateTime, 'h:mm aaaa');
        return (
          <p data-testid="already-checked-in-message">
            You checked in at {appointmentTime}
          </p>
        );
      }
      return (
        <p data-testid="already-checked-in-no-time-message">
          You are already checked in.
        </p>
      );
    }
  }
  return <p data-testid="no-status-given-message">{defaultMessage}</p>;
};

AppointmentAction.propTypes = {
  appointment: PropTypes.object,
  router: PropTypes.object,
  token: PropTypes.string,
};

export default AppointmentAction;
