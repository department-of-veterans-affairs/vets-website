import React from 'react';
import { pageNames } from './pageList';

const FileOriginalClaimPage = () => (
  <div>
    <h4>You’ll need to file a claim on eBenefits</h4>
    <p>
      To file your first disability claim, please go to our eBenefits website.
    </p>
    <a
      href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation"
      className="usa-button-primary"
    >
      Go to eBenefits
    </a>
  </div>
);

export default {
  name: pageNames.fileOriginalClaim,
  component: FileOriginalClaimPage,
};
