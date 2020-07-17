import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import Verified from './Verified';

const MHVTermsAndConditionsStatus = ({ mhvAccount }) => {
  const termsAndConditionsUrl =
    '/health-care/medical-information-terms-conditions';

  if (mhvAccount.termsAndConditionsAccepted) {
    return (
      <>
        <Verified>
          You’ve accepted the terms and conditions for using VA.gov health
          tools.
        </Verified>
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
    );
  } else if (mhvAccount.accountState === 'needs_terms_acceptance') {
    return (
      <>
        <p className="vads-u-margin--0">
          Before using our health tools, you’ll need to read and agree to the
          terms and conditions for medical information. This will give us
          permission to share your VA medical information with you. Once you do
          this, you can use the tools to refill your VA prescriptions or
          download your VA health records.
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
            Go to the terms and conditions for medical information
          </a>
        </p>
      </>
    );
  }
  return null;
};

MHVTermsAndConditionsStatus.propTypes = {
  mhvAccount: PropTypes.shape({
    accountLevel: PropTypes.string,
    accountState: PropTypes.string,
    errors: PropTypes.array,
    loading: PropTypes.bool,
    termsAndConditionsAccepted: PropTypes.bool.isRequired,
  }),
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
