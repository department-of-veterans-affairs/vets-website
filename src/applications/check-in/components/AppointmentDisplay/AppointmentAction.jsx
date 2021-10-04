import React, { useState } from 'react';
import { connect } from 'react-redux';
import { api } from '../../api';

import { goToNextPage, URLS } from '../../utils/navigation';
import { STATUSES, areEqual } from '../../utils/appointment/status';
import recordEvent from 'platform/monitoring/record-event';
import format from 'date-fns/format';

import { appointmentWAsCheckedInto } from '../../actions';

const AppointmentAction = props => {
  const {
    appointment,
    isLowAuthEnabled,
    isMultipleAppointmentsEnabled,
    token,
    router,
    setSelectedAppointment,
  } = props;

  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const defaultMessage =
    'Online check-in isn’t available for this appointment. Check in with a staff member.';

  const onClick = async () => {
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'check in now',
    });
    setIsCheckingIn(true);
    try {
      let checkIn = api.v0.checkInUser;
      if (isLowAuthEnabled && !isMultipleAppointmentsEnabled) {
        checkIn = api.v1.postCheckInData;
      } else if (isMultipleAppointmentsEnabled) {
        checkIn = api.v2.postCheckInData;
      }

      const json = await checkIn({
        uuid: token,
        appointmentIEN: appointment.appointmentIEN,
        facilityId: appointment.facilityId,
      });
      const { status } = json;
      if (status === 200) {
        setSelectedAppointment(appointment);
        goToNextPage(router, URLS.COMPLETE);
      } else {
        goToNextPage(router, URLS.ERROR);
      }
    } catch (error) {
      goToNextPage(router, URLS.ERROR);
    }
  };

  if (appointment.status) {
    if (areEqual(appointment.status, STATUSES.ELIGIBLE)) {
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
    } else if (areEqual(appointment.status, STATUSES.INELIGIBLE_BAD_STATUS)) {
      return (
        <p data-testid="ineligible-bad-status-message">{defaultMessage}</p>
      );
    } else if (areEqual(appointment.status, STATUSES.INELIGIBLE_TOO_EARLY)) {
      if (appointment.appointmentCheckInStart) {
        const appointmentDateTime = new Date(
          appointment.appointmentCheckInStart,
        );
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
    } else if (areEqual(appointment.status, STATUSES.INELIGIBLE_TOO_LATE)) {
      return (
        <p data-testid="too-late-message">
          Your appointment started more than 10 minutes ago. We can’t check you
          in online. Ask a staff member for help.
        </p>
      );
    } else if (
      areEqual(appointment.status, STATUSES.INELIGIBLE_UNSUPPORTED_LOCATION)
    ) {
      return <p data-testid="unsupported-location-message">{defaultMessage}</p>;
    } else if (
      areEqual(appointment.status, STATUSES.INELIGIBLE_UNKNOWN_REASON)
    ) {
      return <p data-testid="unknown-reason-message">{defaultMessage}</p>;
    }
  }
  return <p data-testid="no-status-given-message">{defaultMessage}</p>;
};

const mapDispatchToProps = dispatch => {
  return {
    setSelectedAppointment: appointment => {
      dispatch(appointmentWAsCheckedInto(appointment));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(AppointmentAction);
