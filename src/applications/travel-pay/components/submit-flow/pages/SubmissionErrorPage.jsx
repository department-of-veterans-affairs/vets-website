import React, { useEffect } from 'react';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import { Element } from 'platform/utilities/scroll';

import { HelpTextGeneral, HelpTextModalities } from '../../HelpText';

const SubmissionErrorPage = () => {
  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  return (
    <Element>
      <div className="vads-u-margin-bottom--3">
        <h1>We couldn’t file your claim</h1>
        <va-alert
          close-btn-aria-label="Close notification"
          status="error"
          visible
        >
          <h2 slot="headline">Something went wrong on our end</h2>
          <p className="vads-u-margin-y--0">
            We’re sorry. We couldn’t file your travel reimbursement claim in
            this tool right now. Please try again later.
          </p>
          <p>
            Or you can still file within 30 days of the appointment through the
            Beneficiary Travel Self Service System (BTSSS).
          </p>
          <p>Find out how to file for travel reimbursement</p>
        </va-alert>
        <h2>What happens next?</h2>
        <HelpTextModalities />
        <h3>How can I get help with my claim?</h3>
        <HelpTextGeneral />
      </div>
    </Element>
  );
};

export default SubmissionErrorPage;
