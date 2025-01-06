import React, { useEffect } from 'react';
import { focusElement, scrollToTop } from 'platform/utilities/ui';

import { HelpTextGeneral, HelpTextModalities } from '../../HelpText';

const SubmissionErrorPage = () => {
  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  return (
    <div>
      <h1 tabIndex="-1">We couldn’t file your claim</h1>
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h2 slot="headline">Something went wrong on our end</h2>
        <p className="vads-u-margin-y--0">
          We’re sorry. We couldn’t file your travel reimbursement claim in this
          tool right now. Please try again later.
        </p>
        <p>
          Or you can still file within 30 days of the appointment through the
          Beneficiary Travel Self Service System (BTSSS).
        </p>
        <va-link
          href="https://www.va.gov/health-care/get-reimbursed-for-travel-pay/"
          text="Find out how to file for travel reimbursement"
        />
      </va-alert>
      <h2>What happens next?</h2>
      <HelpTextModalities />
      <h3>How can I get help with my claim?</h3>
      <HelpTextGeneral />
    </div>
  );
};

export default SubmissionErrorPage;
