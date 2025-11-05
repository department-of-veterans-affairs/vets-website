import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppointmentHeading from '../../../components/AppointmentHeading';

export default function EpsAppointmentHeading({
  isPastAppointment,
  cancellingAppointment,
  cancelSuccess,
  onAbortCancellation,
  referralId,
}) {
  const backLink = isPastAppointment
    ? '/my-health/appointments/past'
    : '/my-health/appointments';

  const backLinkText = isPastAppointment
    ? 'Back to past appointments'
    : 'Back to appointments';

  const history = useHistory();

  if (cancellingAppointment && !cancelSuccess) {
    return (
      <AppointmentHeading
        backlink={{
          text: 'Back to community care details',
          href: history.location.pathname,
          onClick: e => {
            e.preventDefault();
            onAbortCancellation();
          },
        }}
        heading="Would you like to cancel this appointment?"
        infoText="If you want to reschedule, you’ll need to call us or schedule a new appointment online."
      />
    );
  }
  if (cancelSuccess && cancellingAppointment) {
    return (
      <>
        <AppointmentHeading
          backlink={{
            text: backLinkText,
            href: backLink,
            onClick: e => {
              e.preventDefault();
              history.push(isPastAppointment ? '/past' : '/');
            },
          }}
          heading="You have canceled your appointment"
          infoText="If you still need an appointment, call us or go to your referral to schedule a new appointment online."
        />
        <va-link
          active
          onClick={e => {
            e.preventDefault();
            history.push(`/schedule-referral?id=${referralId}`);
          }}
          text="Go to your referral to schedule"
          data-testid="go-to-referral-link"
          href={`/my-health/appointments/schedule-referral?id=${referralId}`}
        />
      </>
    );
  }
  return (
    <AppointmentHeading
      backlink={{
        text: backLinkText,
        href: backLink,
        onClick: e => {
          e.preventDefault();
          history.push(isPastAppointment ? '/past' : '/');
        },
      }}
    />
  );
}

EpsAppointmentHeading.propTypes = {
  cancelSuccess: PropTypes.bool.isRequired,
  cancellingAppointment: PropTypes.bool.isRequired,
  isPastAppointment: PropTypes.bool.isRequired,
  referralId: PropTypes.string.isRequired,
  onAbortCancellation: PropTypes.func.isRequired,
};
