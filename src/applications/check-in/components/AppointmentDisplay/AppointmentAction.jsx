import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { parseISO } from 'date-fns';
import recordEvent from 'platform/monitoring/record-event';
import { api } from '../../api';

import { useFormRouting } from '../../hooks/useFormRouting';
import { ELIGIBILITY, areEqual } from '../../utils/appointment/eligibility';

import { appointmentWasCheckedInto } from '../../actions/day-of';

import { CheckInButton } from './CheckInButton';

const AppointmentAction = props => {
  const { appointment, router, token } = props;
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const setSelectedAppointment = useCallback(
    appt => {
      dispatch(appointmentWasCheckedInto(appt));
    },
    [dispatch],
  );

  const defaultMessage = t(
    'online-check-in-isnt-available-for-this-appointment-check-in-with-a-staff-member',
  );
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
    // Disable check-in 10 seconds before the end of the eligibility window.
    // This helps prevent Veterans from getting an error if they click the
    // button and it takes too long to make the API call.
    if (
      (areEqual(appointment.eligibility, ELIGIBILITY.ELIGIBLE) &&
        parseISO(appointment.checkInWindowEnd).getTime() - Date.now() <
          10000) ||
      areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_TOO_LATE)
    ) {
      return (
        <p data-testid="too-late-message">
          {t(
            'your-appointment-started-more-than-15-minutes-ago-we-cant-check-you-in-online-ask-a-staff-member-for-help',
          )}
        </p>
      );
    }
    if (areEqual(appointment.eligibility, ELIGIBILITY.ELIGIBLE)) {
      return (
        <CheckInButton
          checkInWindowEnd={parseISO(appointment.checkInWindowEnd)}
          onClick={onClick}
          router={router}
        />
      );
    }
    if (areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_BAD_STATUS)) {
      return (
        <p data-testid="ineligible-bad-status-message">{defaultMessage}</p>
      );
    }
    if (areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_TOO_EARLY)) {
      if (appointment.checkInWindowStart) {
        const appointmentDateTime = new Date(appointment.checkInWindowStart);
        return (
          <p data-testid="too-early-message">
            {t('you-can-check-in-starting-at-this-time', {
              date: appointmentDateTime,
            })}
          </p>
        );
      }
      return (
        <p data-testid="no-time-too-early-reason-message">
          {t(
            'this-appointment-isnt-eligible-for-online-check-in-check-in-with-a-staff-member',
          )}
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
              {t('you-are-already-checked-in')}
            </p>
          );
        }
        return (
          <p data-testid="already-checked-in-message">
            {t('you-checked-in-at', { date: appointmentDateTime })}
          </p>
        );
      }
      return (
        <p data-testid="already-checked-in-no-time-message">
          {t('you-are-already-checked-in')}
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
