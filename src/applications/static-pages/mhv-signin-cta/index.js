import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DOMPurify from 'dompurify';
import { signInServiceName } from '@department-of-veterans-affairs/platform-user/authentication/selectors';
import {
  isLoggedIn,
  isLOA3,
} from '@department-of-veterans-affairs/platform-user/selectors';
import UnauthenticatedAlert from './components/messages/UnauthenticatedAlert';
import UnverifiedAlert from './components/messages/UnverifiedAlert';

/**
 * MHV Signin CTA widget. This widget displays an alert if the user is not authenticated or verified.
 * Otherwise, it displays provided HTML content.
 * @property {HTMLElement} noAlertContent optional content to display if no alerts are shown
 * @property {String} signInServiceName the signin service name is available
 * @property {bool} userIsLoggedIn true if the user is logged in
 * @property {bool} userIsVerified true if the user is verified
 * @property {string} headingLevel the heading level
 * @property {string} serviceDescription the heading service description
 */
export const MhvSigninCallToAction = ({
  noAlertContent,
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

  // Display the provided content. Note these are HTMLElements and not React.
  return (
    <div
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(noAlertContent.innerHTML),
      }}
    />
  );
};

MhvSigninCallToAction.propTypes = {
  headingLevel: PropTypes.string,
  noAlertContent: PropTypes.instanceOf(HTMLElement),
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
  return {
    serviceName: signInServiceName(state),
    userIsLoggedIn: isLoggedIn(state),
    userIsVerified: isLOA3(state),
  };
};

export default connect(mapStateToProps)(MhvSigninCallToAction);
