import React, { useEffect } from 'react';
import { focusElement, scrollToTop } from 'platform/utilities/ui';

import { HelpTextGeneral, HelpTextModalities } from '../../HelpText';
import { TRAVEL_PAY_INFO_LINK } from '../../../constants';

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
          Or you can still file for this appointment through the Beneficiary
          Travel Self Service System (BTSSS).
        </p>
        <va-link
          href={TRAVEL_PAY_INFO_LINK}
          text="Find out how to file for travel reimbursement"
        />
      </va-alert>
      <h2>What happens next?</h2>
      <HelpTextModalities />
      <p className="vads-u-font-weight--bold">
        How can I get help with my claim?
      </p>
      <HelpTextGeneral />
    </div>
  );
};

export default SubmissionErrorPage;
