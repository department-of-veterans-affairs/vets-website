import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui/focus';
import { scrollToTop } from 'platform/utilities/scroll';

import useSetPageTitle from '../../../hooks/useSetPageTitle';
import { HelpTextModalities } from '../../HelpText';
import { TRAVEL_PAY_INFO_LINK } from '../../../constants';
import { recordSmocPageview } from '../../../util/events-helpers';

const title = 'We couldn’t file your claim';

const SubmissionErrorPage = () => {
  useEffect(() => {
    recordSmocPageview('error');
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  useSetPageTitle(title);

  return (
    <div>
      <h1 tabIndex="-1">{title}</h1>
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
    </div>
  );
};

export default SubmissionErrorPage;
