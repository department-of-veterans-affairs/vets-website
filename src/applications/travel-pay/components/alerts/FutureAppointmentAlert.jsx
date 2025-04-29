import React from 'react';
import { TRAVEL_PAY_INFO_LINK } from '../../constants';

const FutureAppointmentAlert = () => {
  return (
    <va-alert closeable="false" status="warning" role="status" visible>
      <h2 slot="headline">We need to wait to file your claim</h2>
      <p className="vads-u-margin-y--2">
        We need to wait until after your appointment is complete to file your
        travel reimbursement claim.
        <br />
        <va-link
          text="Find out how to file for travel reimbursement"
          href={TRAVEL_PAY_INFO_LINK}
        />
      </p>
    </va-alert>
  );
};

export default FutureAppointmentAlert;
