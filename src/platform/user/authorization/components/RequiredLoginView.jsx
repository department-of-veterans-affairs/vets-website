import appendQuery from 'append-query';
import PropTypes from 'prop-types';
import React from 'react';
import { intersection } from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import SystemDownView from '@department-of-veterans-affairs/formation/SystemDownView';

import conditionalStorage from '../../../utilities/storage/conditionalStorage';
import backendServices from '../../profile/constants/backendServices';

const nextQuery = { next: window.location.pathname };
const signInUrl = appendQuery('/', nextQuery);
const verifyUrl = appendQuery('/verify', nextQuery);

class RequiredLoginView extends React.Component {
  componentDidMount() {
    this.redirectIfNeeded();
  }

  componentDidUpdate() {
    this.redirectIfNeeded();
  }

  shouldSignIn = () => !this.props.user.login.currentlyLoggedIn;

  shouldVerify = () => {
    const { user, verify } = this.props;

    // Certain sign-in methods can grant access to the service,
    // bypassing the identity proofing requirement.
    // In particular, MHV sign-in users that are Advanced are not LOA3 but
    // should have access to Rx, which would normally require verification.
    return !this.isAccessible() && verify && !user.profile.verified;
  };

  redirectIfNeeded = () => {
    if (!this.props.user.profile.loading) {
      if (this.shouldSignIn()) window.location.replace(signInUrl);
      else if (this.shouldVerify()) window.location.replace(verifyUrl);
    }
  };

  // Checks that (1) session has a valid authentication token and
  // (2) the user is authorized to use services required by this application
  isAccessible = () => {
    const { serviceRequired, user } = this.props;
    const userServices = user.profile.services;
    const hasRequiredServices =
      userServices &&
      (Array.isArray(serviceRequired)
        ? intersection(userServices, serviceRequired).length > 0
        : userServices.includes(serviceRequired));

    return conditionalStorage().getItem('userToken') && hasRequiredServices;
  };

  renderVerifiedContent = () => {
    if (this.shouldVerify()) {
      return <LoadingIndicator setFocus message="Redirecting to verify..." />;
    }

    const { serviceRequired, user } = this.props;

    // TODO: Delete the logic around attemptingAppealsAccess once we
    // resolve the MVI/Appeals Users issues.
    // if app we are trying to access includes appeals,
    // bypass the checks for user profile status
    const attemptingAppealsAccess = Array.isArray(serviceRequired)
      ? serviceRequired.includes(backendServices.APPEALS_STATUS)
      : serviceRequired === backendServices.APPEALS_STATUS;

    // TODO: If unable to fetch MVI data or unable to determine veteran status,
    // perhaps that should be reflected in how the API determines whether
    // the services is accessible.
    if (user.profile.status === 'SERVER_ERROR' && !attemptingAppealsAccess) {
      // If va_profile is null, show a system down message.
      return (
        <SystemDownView messageLine1="Sorry, our system is temporarily down while we fix a few things. Please try again later." />
      );
    } else if (
      user.profile.status === 'NOT_FOUND' &&
      !attemptingAppealsAccess
    ) {
      // If va_profile is "not found", show message that we cannot find the user in our system.
      return (
        <SystemDownView
          messageLine1="We couldn’t find your records with that information."
          messageLine2="Please call the Vets.gov Help Desk at 1-855-574-7286, TTY: 1-800-877-8339. We're open Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)."
        />
      );
    }

    // If va_profile has any other value, continue on to check if this user can
    // use this specific service.
    // If they have the required service, show the application view.
    if (this.isAccessible()) {
      return this.props.children;
    }

    // If the required service is not available, the component will still be rendered,
    // but we pass an `isDataAvailable` prop to child components indicating there is
    // no data. (Only add this prop to React components (functions), and not ordinary
    // DOM elements.)
    return React.Children.map(this.props.children, child => {
      const props =
        typeof child.type === 'function' ? { isDataAvailable: false } : null;
      return React.cloneElement(child, props);
    });
  };

  renderWrappedContent = () => {
    const { user, verify } = this.props;

    if (user.profile.loading) {
      return (
        <LoadingIndicator setFocus message="Loading your information..." />
      );
    }

    if (this.shouldSignIn()) {
      return <LoadingIndicator setFocus message="Redirecting to login..." />;
    }

    if (verify) {
      return this.renderVerifiedContent();
    }

    return this.props.children;
  };

  render() {
    return <div>{this.renderWrappedContent()}</div>;
  }
}

const validService = PropTypes.oneOf(Object.values(backendServices));

RequiredLoginView.propTypes = {
  serviceRequired: PropTypes.oneOfType([
    validService,
    PropTypes.arrayOf(validService),
  ]).isRequired,
  user: PropTypes.object.isRequired,
  verify: PropTypes.bool,
};

export default RequiredLoginView;
