import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { api } from '../../api';

import { useFormRouting } from '../../hooks/useFormRouting';
import { ELIGIBILITY, areEqual } from '../../utils/appointment/eligibility';
import recordEvent from 'platform/monitoring/record-event';
import format from 'date-fns/format';

import { appointmentWasCheckedInto } from '../../actions/day-of';

const AppointmentAction = props => {
  const { appointment, router, token } = props;

  const [isCheckingIn, setIsCheckingIn] = useState(false);
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
  const onClick = async () => {
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'check in now',
    });
    setIsCheckingIn(true);
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
  };

  if (appointment.eligibility) {
    if (areEqual(appointment.eligibility, ELIGIBILITY.ELIGIBLE)) {
      return (
        <button
          type="button"
          className="usa-button usa-button-big vads-u-font-size--md"
          onClick={onClick}
          data-testid="check-in-button"
          disabled={isCheckingIn}
          aria-label="Check in now for your appointment"
        >
          {isCheckingIn ? <>Loading...</> : <>Check in now</>}
        </button>
      );
    } else if (
      areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_BAD_STATUS)
    ) {
      return (
        <p data-testid="ineligible-bad-status-message">{defaultMessage}</p>
      );
    } else if (
      areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_TOO_EARLY)
    ) {
      if (appointment.checkInWindowStart) {
        const appointmentDateTime = new Date(appointment.checkInWindowStart);
        const appointmentTime = format(appointmentDateTime, 'h:mm aaaa');
        return (
          <p data-testid="too-early-message">
            You can check in starting at this time: {appointmentTime}
          </p>
        );
      } else {
        return (
          <p data-testid="no-time-too-early-reason-message">
            This appointment isn’t eligible for online check-in. Check-in with a
            staff member.
          </p>
        );
      }
    } else if (
      areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_TOO_LATE)
    ) {
      return (
        <p data-testid="too-late-message">
          Your appointment started more than 5 minutes ago. We can’t check you
          in online. Ask a staff member for help.
        </p>
      );
    } else if (
      areEqual(
        appointment.eligibility,
        ELIGIBILITY.INELIGIBLE_UNSUPPORTED_LOCATION,
      )
    ) {
      return <p data-testid="unsupported-location-message">{defaultMessage}</p>;
    } else if (
      areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_UNKNOWN_REASON)
    ) {
      return <p data-testid="unknown-reason-message">{defaultMessage}</p>;
    } else if (
      areEqual(
        appointment.eligibility,
        ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN,
      )
    ) {
      if (appointment.checkedInTime) {
        const appointmentDateTime = new Date(appointment.checkedInTime);
        if (isNaN(appointmentDateTime.getTime())) {
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
      } else {
        return (
          <p data-testid="already-checked-in-no-time-message">
            You are already checked in.
          </p>
        );
      }
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
