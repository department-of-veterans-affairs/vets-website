import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';
import ebenefitsLink from 'platform/site-wide/ebenefits/containers/ebenefitsLink';

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
          <ebenefitsLink
            path="ebenefits/about/feature?feature=disability-compensation"
            className="usa-button-primary va-button-primary"
          >
            Go to eBenefits
          </ebenefitsLink>
        </>
      }
    />
  );
}

export default {
  name: pageNames.fileOriginalClaim,
  component: FileOriginalClaimPage,
};
