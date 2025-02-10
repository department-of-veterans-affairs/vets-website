import React from 'react';
import PropTypes from 'prop-types';

import { formatDateTime, getDaysLeft } from '../util/dates';

const AppointmentDetails = ({ appointment }) => {
  const [formattedDate] = formatDateTime(appointment.localStartTime);
  const daysLeft = getDaysLeft(appointment.localStartTime);

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

  return (
    <p>
      You have{' '}
      <strong>{`${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`}</strong> left
      to file for your appointment on{' '}
      <strong>
        {formattedDate} at {appointment.location.attributes.name}
      </strong>
      .
    </p>
  );
};

AppointmentDetails.propTypes = {
  appointment: PropTypes.object,
};

export default AppointmentDetails;
