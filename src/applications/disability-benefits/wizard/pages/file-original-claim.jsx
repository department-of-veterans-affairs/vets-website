import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

function FileOriginalClaimPage() {
  return (
    <AlertBox
      status="warning"
      headline="You’ll need to file a claim on eBenefits"
      content={
        <>
          <p>
            To file your first disability claim, please go to our eBenefits
            website.
          </p>
          <EbenefitsLink
            path="ebenefits/about/feature?feature=disability-compensation"
            className="usa-button-primary va-button-primary"
          >
            Go to eBenefits
          </EbenefitsLink>
        </>
      }
    />
  );
}

export default {
  name: pageNames.fileOriginalClaim,
  component: FileOriginalClaimPage,
};
