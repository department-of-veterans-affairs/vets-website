import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DOMPurify from 'dompurify';
import { isLoggedIn, isLOA3 } from '~/platform/user/selectors';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import UnauthenticatedAlert from './components/messages/UnauthenticatedAlert';
import UnverifiedAlert from './components/messages/UnverifiedAlert';

/**
 * MHV Signin CTA widget. This widget displays an alert if the user is not authenticated or verified.
 * Otherwise, it displays provided HTML content.
 * @property {HTMLCollection} noAlertContent optional content to display if no alerts are shown
 * @property {String} signInServiceName the signin service name is available
 * @property {bool} userIsLoggedIn true if the user is logged in
 * @property {bool} userIsVerified true if the user is verified
 */
export const MhvSigninCallToAction = ({
  noAlertContent,
  serviceDescription,
  serviceName,
  userIsLoggedIn = false,
  userIsVerified = false,
}) => {
  if (!userIsLoggedIn) {
    return <UnauthenticatedAlert serviceDescription={serviceDescription} />;
  }

  if (!userIsVerified) {
    return (
      <UnverifiedAlert
        signInService={serviceName}
        serviceDescription={serviceDescription}
      />
    );
  }

  // Display the provided children. Note these are HTMLElements and not React.
  const content = Array.from(noAlertContent).map((child, index) => (
    <div
      key={index}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(child.innerHTML),
      }}
    />
  ));

  return <div>{content}</div>;
};

MhvSigninCallToAction.propTypes = {
  noAlertContent: PropTypes.instanceOf(HTMLCollection),
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
    serviceName: isLoggedIn(state) ? signInServiceName(state) : undefined,
    userIsLoggedIn: isLoggedIn(state),
    userIsVerified: isLoggedIn(state) ? isLOA3(state) : undefined,
  };
};

export default connect(mapStateToProps)(MhvSigninCallToAction);
