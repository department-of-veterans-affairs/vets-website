import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';
import { isLoggedIn as isLoggedInSelector } from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';

import { pageNames } from './pageList';

// Delete file once form526_original_claims feature flag is removed
function FileOriginalClaimPage({ isLoggedIn }) {
  const linkText = 'Go to eBenefits';

  recordEvent({
    event: 'howToWizard-alert-displayed',
    'reason-for-alert': 'Unable to file for original claims on va.gov',
  });
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
            onClick={() => {
              if (isLoggedIn) {
                recordEvent({ event: 'nav-ebenefits-click' });
              }
              recordEvent({
                event: 'howToWizard-alert-link-click',
                'howToWizard-alert-link-click-label': linkText,
              });
            }}
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
