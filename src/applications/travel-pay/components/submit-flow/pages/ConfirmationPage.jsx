import React, { useEffect } from 'react';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { Element } from 'platform/utilities/scroll';

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
    <Element name="topScrollElement">
      <div className="vads-u-margin-bottom--3">
        <h1 tabIndex="-1">We’re processing your travel reimbursement claim</h1>
        <va-alert
          close-btn-aria-label="Close notification"
          status="success"
          visible
        >
          <h2 slot="headline">Claim submitted</h2>
          <p className="vads-u-margin-y--0">
            This claim is for your appointment at{' '}
            {appointment.vaos.apiData.location.attributes.name} on{' '}
            {formattedDate} {formattedTime}
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
          If you’re eligible for reimbursement, we’ll deposit your
          reimburesement in your bank account.
        </p>
        <va-link
          href="idk"
          text="Learn how to set up direct deposit for travel pay reimbursement"
        />
      </div>
    </Element>
  );
};

export default ConfirmationPage;
