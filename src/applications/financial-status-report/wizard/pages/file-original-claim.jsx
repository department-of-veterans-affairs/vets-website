import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';
import { isLoggedIn as isLoggedInSelector } from 'platform/user/selectors';
import { pageNames } from '../constants';

// Delete file once form526_original_claims feature flag is removed
function FileOriginalClaimPage() {
  const linkText = 'Go to eBenefits';

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
            {linkText}
          </EbenefitsLink>
        </>
      }
    />
  );
}

const mapStateToProps = state => ({
  isLoggedIn: isLoggedInSelector(state),
});

export default {
  name: pageNames.fileOriginalClaim,
  component: connect(mapStateToProps)(FileOriginalClaimPage),
};
