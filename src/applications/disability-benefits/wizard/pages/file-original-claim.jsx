import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';
import recordEvent from 'platform/monitoring/record-event';

const alertContent = (
  <>
    <p>
      To file your first disability claim, please go to our eBenefits website.
    </p>
    <a
      href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation"
      className="usa-button-primary va-button-primary"
      onClick={() =>
        recordEvent({
          event: 'ebenefits-navigation',
        })
      }
    >
      Go to eBenefits
    </a>
  </>
);

const FileOriginalClaimPage = () => (
  <AlertBox
    status="error"
    headline="You’ll need to file a claim on eBenefits"
    content={alertContent}
  />
);

export default {
  name: pageNames.fileOriginalClaim,
  component: FileOriginalClaimPage,
};
