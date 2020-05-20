import React from 'react';

import recordEvent from 'platform/monitoring/record-event';

import Verified from './Verified';

const MHVTermsAndConditionsStatus = ({ mhvAccount }) => {
  const termsAndConditionsUrl =
    '/health-care/medical-information-terms-conditions';

  if (mhvAccount.termsAndConditionsAccepted) {
    return (
      <Verified>
        <>
          You’ve accepted the latest Terms and Conditions for Medical
          Information.
          <p className="vads-u-margin-bottom--0">
            <a
              href={termsAndConditionsUrl}
              onClick={() =>
                recordEvent({
                  event: 'account-navigation',
                  'account-action': 'view-link',
                  'account-section': 'terms',
                })
              }
            >
              View terms and conditions for medical information
            </a>
          </p>
        </>
      </Verified>
    );
  } else if (mhvAccount.accountState === 'needs_terms_acceptance') {
    return (
      <>
        <p className="vads-u-margin--0">
          To get started using our health tools, you’ll need to read and agree
          to the Terms and Conditions for Medical Information. This will give us
          your permission to show you your VA medical information on this site.
        </p>
        <p className="vads-u-margin-bottom--0">
          <a
            href={termsAndConditionsUrl}
            onClick={() =>
              recordEvent({
                event: 'account-navigation',
                'account-action': 'view-link',
                'account-section': 'terms',
              })
            }
          >
            Go to the Terms and Conditions for Health Tools
          </a>
        </p>
      </>
    );
  }
  return null;
};

/**
 * A static helper so that potential parent components will know if this
 * component will render content at all and potentially adjust their own
 * rendering logic to account for that. For example, if the parent component
 * will wrap this component in other markup and it wants to avoid making that
 * additional wrapper markup if this component will not render anything.
 */
MHVTermsAndConditionsStatus.willRenderContent = mhvAccount =>
  mhvAccount.termsAndConditionsAccepted ||
  mhvAccount.accountState === 'needs_terms_acceptance';

export default MHVTermsAndConditionsStatus;
