import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { parseISO } from 'date-fns';

import { ELIGIBILITY, areEqual } from '../../utils/appointment/eligibility';

const AppointmentMessage = props => {
  const { appointment } = props;
  const { t } = useTranslation();

  const defaultMessage = t(
    'online-check-in-isnt-available-check-in-with-a-staff-member',
  );

  let alertMessage = '';
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
      alertMessage = (
        <span data-testid="too-late-message">
          {t('your-appointment-started-more-than-15-minutes-ago-ask-for-help')}
        </span>
      );
    }

    if (areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_BAD_STATUS)) {
      alertMessage = (
        <span data-testid="ineligible-bad-status-message">
          {defaultMessage}
        </span>
      );
    }
    if (areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_TOO_EARLY)) {
      if (appointment.checkInWindowStart) {
        const appointmentDateTime = parseISO(appointment.checkInWindowStart);
        alertMessage = (
          <span data-testid="too-early-message">
            {t('you-can-check-in-starting-at-this-time', {
              date: appointmentDateTime,
            })}
          </span>
        );
      } else {
        alertMessage = (
          <span data-testid="no-time-too-early-reason-message">
            {t('this-appointment-isnt-eligible-check-in-with-a-staff-member')}
          </span>
        );
      }
    }
    if (
      areEqual(
        appointment.eligibility,
        ELIGIBILITY.INELIGIBLE_UNSUPPORTED_LOCATION,
      )
    ) {
      alertMessage = (
        <span data-testid="unsupported-location-message">{defaultMessage}</span>
      );
    }
    if (
      areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_UNKNOWN_REASON)
    ) {
      alertMessage = (
        <span data-testid="unknown-reason-message">{defaultMessage}</span>
      );
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
          alertMessage = (
            <span data-testid="already-checked-in-no-time-message">
              {t('youre-checked-in')}
            </span>
          );
        } else {
          alertMessage = (
            <span data-testid="already-checked-in-message">
              {t('you-checked-in-at', { date: appointmentDateTime })}
            </span>
          );
        }
      } else {
        alertMessage = (
          <span data-testid="already-checked-in-no-time-message">
            {t('youre-checked-in')}
          </span>
        );
      }
    }
    if (
      !alertMessage &&
      !areEqual(appointment.eligibility, ELIGIBILITY.ELIGIBLE)
    ) {
      alertMessage = (
        <span data-testid="no-status-given-message">{defaultMessage}</span>
      );
    }
  }
  return (
    <>
      {alertMessage ? (
        <div data-testid="appointment-message">
          <va-alert
            show-icon
            class="vads-u-margin-bottom--2"
            data-testid="appointment-action-message"
            uswds
            slim
          >
            {alertMessage}
          </va-alert>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

AppointmentMessage.propTypes = {
  appointment: PropTypes.object,
};

export default AppointmentMessage;
