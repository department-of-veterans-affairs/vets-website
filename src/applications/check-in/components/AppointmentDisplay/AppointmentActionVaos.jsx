import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { parseISO } from 'date-fns';
import { api } from '../../api';

import { useFormRouting } from '../../hooks/useFormRouting';
import { ELIGIBILITY, areEqual } from '../../utils/appointment/eligibility';

import { appointmentWasCheckedInto } from '../../actions/day-of';

import { CheckInButton } from './CheckInButton';
import { useUpdateError } from '../../hooks/useUpdateError';

const AppointmentActionVaos = props => {
  const { appointment, router, token } = props;
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const setSelectedAppointment = useCallback(
    appt => {
      dispatch(appointmentWasCheckedInto(appt));
    },
    [dispatch],
  );
  const { updateError } = useUpdateError();

  const defaultMessage = t(
    'online-check-in-isnt-available-check-in-with-a-staff-member',
  );
  const { goToNextPage } = useFormRouting(router);
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
          goToNextPage();
        } else {
          updateError('check-in-post-error');
        }
      } catch (error) {
        updateError('error-completing-check-in');
      }
    },
    [appointment, updateError, goToNextPage, setSelectedAppointment, token],
  );
  let alertMessage = '';
  if (appointment.eligibility) {
    if (areEqual(appointment.eligibility, ELIGIBILITY.ELIGIBLE)) {
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
        <p data-testid="too-late-message">
          {t('your-appointment-started-more-than-15-minutes-ago-ask-for-help')}
        </p>
      );
    }

    if (areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_BAD_STATUS)) {
      alertMessage = (
        <p data-testid="ineligible-bad-status-message">{defaultMessage}</p>
      );
    }
    if (areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_TOO_EARLY)) {
      if (appointment.checkInWindowStart) {
        const appointmentDateTime = parseISO(appointment.checkInWindowStart);
        alertMessage = (
          <p data-testid="too-early-message">
            {t('you-can-check-in-starting-at-this-time', {
              date: appointmentDateTime,
            })}
          </p>
        );
      }
      alertMessage = (
        <p data-testid="no-time-too-early-reason-message">
          {t('this-appointment-isnt-eligible-check-in-with-a-staff-member')}
        </p>
      );
    }
    if (
      areEqual(
        appointment.eligibility,
        ELIGIBILITY.INELIGIBLE_UNSUPPORTED_LOCATION,
      )
    ) {
      alertMessage = (
        <p data-testid="unsupported-location-message">{defaultMessage}</p>
      );
    }
    if (
      areEqual(appointment.eligibility, ELIGIBILITY.INELIGIBLE_UNKNOWN_REASON)
    ) {
      alertMessage = (
        <p data-testid="unknown-reason-message">{defaultMessage}</p>
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
            <p data-testid="already-checked-in-no-time-message">
              {t('you-are-already-checked-in')}
            </p>
          );
        }
        alertMessage = (
          <p data-testid="already-checked-in-message">
            {t('you-checked-in-at', { date: appointmentDateTime })}
          </p>
        );
      }
      alertMessage(
        <p data-testid="already-checked-in-no-time-message">
          {t('you-are-already-checked-in')}
        </p>,
      );
    }
    if (!alertMessage) {
      alertMessage = (
        <p data-testid="no-status-given-message">{defaultMessage}</p>
      );
    }
  }
  return (
    <va-alert
      background-only
      show-icon
      data-testid="appointment-action-message"
      class="vads-u-margin-bottom--2"
    >
      {alertMessage}
    </va-alert>
  );
};

AppointmentActionVaos.propTypes = {
  appointment: PropTypes.object,
  router: PropTypes.object,
  token: PropTypes.string,
};

export default AppointmentActionVaos;
