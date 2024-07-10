import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { parseISO } from 'date-fns';

import { ELIGIBILITY, areEqual } from '../../utils/appointment/eligibility';
import { useFormRouting } from '../../hooks/useFormRouting';

const AppointmentMessage = props => {
  const { appointment, router } = props;
  const { t } = useTranslation();

  const { getCurrentPageFromRouter } = useFormRouting(router);
  const page = getCurrentPageFromRouter();

  const defaultMessage = t(
    'online-check-in-isnt-available-check-in-with-a-staff-member',
  );

  let alertMessage = '';
  let alertError = false;
  const alertIcon = {};
  let alertTestId = 'default-message';

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
      alertMessage = t(
        'your-appointment-started-more-than-15-minutes-ago-ask-for-help',
      );
      alertTestId = 'too-late-message';
      alertError = true;
    }

    if (areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_BAD_STATUS)) {
      alertMessage = defaultMessage;
      alertTestId = 'ineligible-bad-status-message';
      alertError = true;
    }
    if (areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_TOO_EARLY)) {
      if (appointment.checkInWindowStart) {
        const appointmentDateTime = parseISO(appointment.checkInWindowStart);
        alertMessage = t('you-can-check-in-starting-at-this-time', {
          date: appointmentDateTime,
        });
        alertTestId = 'too-early-message';
        alertIcon.icon = 'schedule';
        alertIcon.size = 3;
        alertIcon.class = 'vads-u-margin-right--0p5';
      } else {
        alertMessage = (
          <span data-testid="no-time-too-early-reason-message">
            {t('this-appointment-isnt-eligible-check-in-with-a-staff-member')}
          </span>
        );
        alertError = true;
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
      alertError = true;
    }
    if (
      areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_UNKNOWN_REASON)
    ) {
      alertMessage = (
        <span data-testid="unknown-reason-message">{defaultMessage}</span>
      );
      alertError = true;
    }
    if (
      areEqual(
        appointment.eligibility,
        ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN,
      )
    ) {
      alertIcon.icon = 'check';
      alertIcon.size = 3;
      alertIcon.class = 'vads-u-color--green vads-u-margin-right--0p5';
      if (appointment.checkedInTime) {
        const appointmentDateTime = new Date(appointment.checkedInTime);
        if (Number.isNaN(appointmentDateTime.getTime())) {
          alertMessage = t('youre-checked-in');
          alertTestId = 'already-checked-in-no-time-message';
        } else {
          alertMessage = t('you-checked-in-at', { date: appointmentDateTime });
          alertTestId = 'already-checked-in-message';
        }
      } else {
        alertMessage = t('youre-checked-in');
        alertTestId = 'already-checked-in-no-time-message';
      }
    }
    if (
      !alertMessage &&
      !areEqual(appointment.eligibility, ELIGIBILITY.ELIGIBLE)
    ) {
      alertMessage = defaultMessage;
      alertTestId = 'no-status-given-message';
      alertError = true;
    }
  }
  let body = (
    <va-alert
      show-icon
      class="vads-u-margin-bottom--2"
      data-testid="appointment-action-message"
      uswds
      slim
    >
      <span data-testid={alertTestId}>{alertMessage}</span>
    </va-alert>
  );
  if (page === 'appointments') {
    body = (
      <p>
        <va-icon
          icon={alertIcon.icon}
          size={alertIcon.size}
          class={alertIcon.class}
        />
        <span data-testid={alertTestId}>{alertMessage}</span>
      </p>
    );
  }
  return (
    <>
      {alertMessage && (!alertError || page === 'details') ? (
        <div data-testid="appointment-message">{body}</div>
      ) : (
        <></>
      )}
    </>
  );
};

AppointmentMessage.propTypes = {
  appointment: PropTypes.object,
  router: PropTypes.object,
};

export default AppointmentMessage;
