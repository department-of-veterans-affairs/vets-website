import React from 'react';
import PropTypes from 'prop-types';
import InfoAlert from './InfoAlert';
import { selectAppointmentTravelClaim } from '../appointment-list/redux/selectors';

const ErrorAlert = ({ appointment }) => {
  const avsLink = appointment.avsPath;
  const avsError = avsLink?.includes('Error');
  const claimData = selectAppointmentTravelClaim(appointment);
  if (!claimData) return null;

  const btsssMessage = (
    <>
      <p>
        You can also file for travel reimbursement through the Beneficiary
        Travel Self Service System (BTSSS).
      </p>
      <p>
        <va-link
          href="https://www.va.gov/health-care/get-reimbursed-for-travel-pay/"
          external
          text="Learn how to file a travel claim through BTSSS"
        />
      </p>
    </>
  );

  if (!claimData.metadata.success && avsError) {
    return (
      <InfoAlert
        status="error"
        headline="Some appointment tasks aren’t available right now"
      >
        <p data-testid="avs-claim-error-content">
          We’re sorry. There’s a problem with our system. You can’t complete
          these tasks for this appointment right now:
        </p>
        <ul>
          <li>File a claim for travel reimbursement</li>
          <li>Get your after-visit summary</li>
        </ul>
        <p>Try refreshing this page. Or check back later.</p>
        {btsssMessage}
      </InfoAlert>
    );
  }

  if (!claimData.metadata.success) {
    return (
      <InfoAlert
        status="error"
        headline="Some appointment features aren’t available right now"
      >
        <p data-testid="claim-error-content">
          We’re sorry. There’s a problem with our system. We can’t access travel
          reimbursement for this appointment right now.
        </p>
        <p>Try refreshing this page. Or check back later.</p>
        {btsssMessage}
      </InfoAlert>
    );
  }

  if (avsError) {
    return (
      <InfoAlert
        status="error"
        headline="Some appointment features aren’t available right now"
      >
        <p data-testid="avs-error-content">
          We’re sorry. There’s a problem with our system. We can’t access
          after-visit summary for this appointment right now.
        </p>
        <p>Try refreshing this page. Or check back later.</p>
      </InfoAlert>
    );
  }

  return null;
};

ErrorAlert.propTypes = {
  appointment: PropTypes.object,
};

export default ErrorAlert;
