import React from 'react';
import PropTypes from 'prop-types';

import {
  CSP_IDS,
  SERVICE_PROVIDERS,
} from '~/platform/user/authentication/constants';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from '~/platform/user/authentication/components/VerifyButton';
import CallToActionAlert from '../CallToActionAlert';

/**
 * Alert to show a user that is not verified.
 * @property {string} signInService user's signin service name
 * @property {string} headerLevel optional heading level
 * @property {string} serviceDescription optional description of the service that requires verification
 */
const Verify = ({ signInService, headerLevel, serviceDescription }) => {
  const headingPrefix = 'Verify your identity';
  const headline = serviceDescription
    ? `${headingPrefix} to ${serviceDescription}`
    : headingPrefix;
  const serviceProviderLabel = SERVICE_PROVIDERS[signInService].label;

  const singleVerifyButton =
    signInService === CSP_IDS.LOGIN_GOV ? (
      <VerifyLogingovButton />
    ) : (
      <VerifyIdmeButton />
    );

  const content = {
    heading: headline,
    headerLevel,
    alertText: (
      <>
        <p>
          We need you to verify your identity for your{' '}
          <strong>{serviceProviderLabel}</strong> account. This step helps us
          protect all Veterans’ information and prevent scammers from stealing
          your benefits.
        </p>
        <p>
          This one-time process often takes about 10 minutes. You’ll need to
          provide certain personal information and identification.
        </p>
        <p>{singleVerifyButton}</p>
        <p>
          <va-link
            href="/resources/verifying-your-identity-on-vagov/"
            text="Learn more about verifying your identity"
            disableAnalytics
          />
        </p>
      </>
    ),
    status: 'warning',
  };

  return <CallToActionAlert {...content} />;
};

Verify.defaultProps = {
  signInService: CSP_IDS.ID_ME,
};

Verify.propTypes = {
  headerLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  serviceDescription: PropTypes.string,
  signInService: PropTypes.oneOf([CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV]),
};

export default Verify;
