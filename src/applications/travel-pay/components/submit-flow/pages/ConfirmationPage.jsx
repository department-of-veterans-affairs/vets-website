import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement, scrollToTop } from 'platform/utilities/ui';

import { formatDateTime } from '../../../util/dates';

const ConfirmationPage = ({ appointment }) => {
  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  const [formattedDate, formattedTime] = formatDateTime(
    appointment.vaos.apiData.start,
  );

  return (
    <div>
      <h1 tabIndex="-1">We’re processing your travel reimbursement claim</h1>
      <va-alert status="success" visible>
        <h2 slot="headline">Claim submitted</h2>
        <p className="vads-u-margin-y--0">
          This claim is for your appointment at{' '}
          {appointment.vaos.apiData.location.attributes.name}{' '}
          {appointment.vaos.apiData?.practitioners
            ? `with ${appointment.vaos.apiData.practitioners[0].name.given.join(
                ' ',
              )} ${appointment.vaos.apiData.practitioners[0].name.family}`
            : ''}{' '}
          on {formattedDate}, {formattedTime}.
        </p>
      </va-alert>
      <h2>What happens next</h2>
      <p className="vads-u-margin-y--2">
        You can check the status of your claim by going to the travel
        reimbursement status page.
      </p>
      <va-link
        href="/my-health/travel-pay/claims/"
        text="Check your travel reimbursement claim status"
      />
      <p className="vads-u-margin-y--2">
        If you’re eligible for reimbursement, we’ll deposit your reimbursement
        in your bank account.
      </p>
      <va-link
        href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"
        text="Learn how to set up direct deposit for travel pay reimbursement"
      />
    </div>
  );
};

ConfirmationPage.propTypes = {
  appointment: PropTypes.object,
};

export default ConfirmationPage;
