import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DOMPurify from 'dompurify';
import { isLoggedIn, selectProfile, isLOA3 } from '~/platform/user/selectors';
import UnauthenticatedAlert from './components/messages/UnauthenticatedAlert';
import UnverifiedAlert from './components/messages/UnverifiedAlert';

/**
 * MHV Signin CTA widget. This widget displays an alert if the user is not authenticated or verified.
 * Otherwise, it displays provided HTML content.
 * @property {HTMLCollection} noAlertContent the content to display if no alerts
 * @property {String} signInServiceName the signin service name is available
 * @property {bool} userIsLoggedIn true if the user is logged in
 * @property {bool} userIsVerified true if the user is verified
 */
export const MhvSigninCallToAction = ({
  noAlertContent,
  serviceDescription,
  signInServiceName,
  userIsLoggedIn = false,
  userIsVerified = false,
}) => {
  if (!userIsLoggedIn) {
    return <UnauthenticatedAlert serviceDescription={serviceDescription} />;
  }

  if (!userIsVerified) {
    return (
      <UnverifiedAlert
        signInService={signInServiceName}
        serviceDescription={serviceDescription}
      />
    );
  }

  const widgetContent = Array.from(noAlertContent).map((child, index) => (
    <div
      key={index}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(child.innerHTML),
      }}
    />
  ));

  return <div>{widgetContent}</div>;
};

MhvSigninCallToAction.propTypes = {
  noAlertContent: PropTypes.instanceOf(HTMLCollection),
  serviceDescription: PropTypes.string,
  signInServiceName: PropTypes.string,
  userIsLoggedIn: PropTypes.bool,
  userIsVerified: PropTypes.bool,
};

/**
 * Map state properties.
 * @param {Object} state the current state
 * @returns state properties
 */
const mapStateToProps = state => {
  return {
    signInServiceName: selectProfile(state)?.serviceName,
    userIsLoggedIn: isLoggedIn(state),
    userIsVerified: isLOA3(state),
  };
};

export default connect(mapStateToProps)(MhvSigninCallToAction);
