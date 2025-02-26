import React from 'react';
import PropTypes from 'prop-types';
import UnauthenticatedAlert from '../mhv-signin-cta/components/messages/UnauthenticatedAlert';
import UnverifiedAlert from '../mhv-signin-cta/components/messages/UnverifiedAlert';

/**
 * MHV Signin CTA widget. This widget displays an alert if the user is not authenticated or verified.
 * Otherwise, it displays provided HTML content.
 * @property {string} linkText the CTA-link text
 * @property {string} linkUrl the CTA-link
 * @property {String} serviceName the signin service name, if available
 * @property {bool} userIsLoggedIn true if the user is logged in
 * @property {bool} userIsVerified true if the user is verified
 * @property {string} headingLevel the heading level
 * @property {string} serviceDescription the heading service description
 */
export const MhvSimpleSigninCallToAction = ({
  linkText,
  linkUrl,
  headingLevel,
  serviceDescription,
  serviceName,
  userIsLoggedIn = false,
  userIsVerified = false,
}) => {
  const headerLevel = parseInt(headingLevel, 10) || 3;

  if (!userIsLoggedIn) {
    return (
      <UnauthenticatedAlert
        headerLevel={headerLevel}
        serviceDescription={serviceDescription}
      />
    );
  }

  if (!userIsVerified) {
    return (
      <UnverifiedAlert
        headerLevel={headerLevel}
        signInService={serviceName}
        serviceDescription={serviceDescription}
      />
    );
  }

  // Display the application links
  return (
    <a className="vads-c-action-link--green" href={linkUrl}>
      {linkText}
    </a>
  );
};

MhvSimpleSigninCallToAction.propTypes = {
  headingLevel: PropTypes.string,
  linkText: PropTypes.string,
  linkUrl: PropTypes.string,
  serviceDescription: PropTypes.string,
  serviceName: PropTypes.string,
  userIsLoggedIn: PropTypes.bool,
  userIsVerified: PropTypes.bool,
};

export default MhvSimpleSigninCallToAction;
