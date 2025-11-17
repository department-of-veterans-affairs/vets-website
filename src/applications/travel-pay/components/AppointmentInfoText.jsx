import React from 'react';
import PropTypes from 'prop-types';

import { TRAVEL_PAY_INFO_LINK } from '../constants';
import FutureAppointmentAlert from './alerts/FutureAppointmentAlert';
import OutOfBoundsAppointmentAlert from './alerts/OutOfBoundsAppointmentAlert';

const AppointmentInfoText = ({ appointment }) => {
  const { isOutOfBounds, isPast } = appointment;

  if (appointment.travelPayClaim?.claim) {
    return (
      <>
        <p>
          You’ve already filed a travel reimbursement claim for this
          appointment.
        </p>
        <va-link-action
          text="View your claim details"
          href={`/my-health/travel-pay/claims/${
            appointment.travelPayClaim.claim.id
          }`}
        />
      </>
    );
  }

  if (!isPast) {
    return <FutureAppointmentAlert />;
  }

  return (
    <>
      {!isOutOfBounds && !appointment.travelPayClaim?.claim ? (
        <>
          <p>We encourage you to file your claim within 30 days.</p>
          <p>
            If it’s been more than 30 days since your appointment, we still
            encourage you to file now. But we may not be able to approve your
            claim.
          </p>
          <va-link
            external
            text="Learn how to file your travel reimbursement claim online"
            href={TRAVEL_PAY_INFO_LINK}
          />
        </>
      ) : (
        <OutOfBoundsAppointmentAlert />
      )}
    </>
  );
};

AppointmentInfoText.propTypes = {
  appointment: PropTypes.object,
};

export default AppointmentInfoText;
