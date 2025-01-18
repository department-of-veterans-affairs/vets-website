import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaAlert,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
      <VaAlert closeBtnAriaLabel="Close notification" status="success" visible>
        <h2 slot="headline">Claim submitted</h2>
        <p className="vads-u-margin-y--0">
          This claim is for your appointment at{' '}
          {appointment.vaos.apiData.location.attributes.name} on {formattedDate}{' '}
          {formattedTime}
        </p>
      </VaAlert>
      <h2>What happens next</h2>
      <p className="vads-u-margin-y--2">
        You can check the status of your claim by going to the travel
        reimbursement status page.
      </p>
      <VaLink
        href="/my-health/travel-pay/claims/"
        text="Check your travel reimbursement claim status"
      />
      <p className="vads-u-margin-y--2">
        If you’re eligible for reimbursement, we’ll deposit your reimburesement
        in your bank account.
      </p>
      <VaLink
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
