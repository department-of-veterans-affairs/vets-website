import React from 'react';
import PropTypes from 'prop-types';
import { signInServiceName } from '@department-of-veterans-affairs/platform-user/authentication/selectors';
import {
  isLoggedIn,
  isLOA3,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
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
 * @property {bool} mhvAccountLoading,
 * @property {bool} profileLoading,
 */
export const MhvSimpleSigninCallToAction = ({
  linkText,
  linkUrl,
  headingLevel,
  mhvAccountLoading = false,
  profileLoading = false,
  serviceDescription,
  serviceName,
  userIsLoggedIn = false,
  userIsVerified = false,
}) => {
  const headerLevel = parseInt(headingLevel, 10) || 3;
  const loading = profileLoading || mhvAccountLoading;

  if (loading) {
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          data-testid="mhv-signin-widget-loading"
          message="Loading your information..."
        />
      </div>
    );
  }

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
  return <va-link-action href={linkUrl} text={linkText} />;
};

MhvSimpleSigninCallToAction.propTypes = {
  headingLevel: PropTypes.string,
  linkText: PropTypes.string,
  linkUrl: PropTypes.string,
  mhvAccountLoading: PropTypes.bool,
  profileLoading: PropTypes.bool,
  serviceDescription: PropTypes.string,
  serviceName: PropTypes.string,
  userIsLoggedIn: PropTypes.bool,
  userIsVerified: PropTypes.bool,
};

/**
 * Map state properties.
 * @param {Object} state the current state
 * @returns state properties
 */
export const mapStateToProps = state => {
  const { loading, mhvAccount } = selectProfile(state);
  return {
    serviceName: signInServiceName(state),
    userIsLoggedIn: isLoggedIn(state),
    userIsVerified: isLOA3(state),
    mhvAccountLoading: mhvAccount.loading,
    profileLoading: loading,
  };
};

export default MhvSimpleSigninCallToAction;
