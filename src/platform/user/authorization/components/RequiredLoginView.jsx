import React, { useEffect, useCallback } from 'react';
import appendQuery from 'append-query';
import PropTypes from 'prop-types';
import { intersection } from 'lodash';

import SubmitSignInForm from '../../../static-data/SubmitSignInForm';

import backendServices from '../../profile/constants/backendServices';
import { hasSession } from '../../profile/utilities';
// import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const signInQuery = {
  next: window.location.pathname,
  oauth: true,
};
const nextQuery = { next: window.location.pathname };
const signInUrl = appendQuery('/', signInQuery);
const verifyUrl = appendQuery('/verify', nextQuery);

const RequiredLoginLoader = () => {
  return (
    <div className="vads-u-margin-y--5" data-testid="req-loader">
      <va-loading-indicator set-focus message="Loading your information..." />
    </div>
  );
};

const ProfileErrorMessage = () => {
  return (
    <div className="vads-u-text-align--center">
      <h2>We’re sorry. Something went wrong on our end.</h2>
      <p>Please refresh this page or try again later.</p>
    </div>
  );
};

export const RequiredLoginView = props => {
  const { user, verify, showProfileErrorMessage = false } = props;

  const shouldSignIn = useCallback(() => !user.login.currentlyLoggedIn, [
    user.login.currentlyLoggedIn,
  ]);

  // Checks that (1) session has a valid authentication token and
  // (2) the user is authorized to use services required by this application
  const isAccessible = useCallback(
    () => {
      const { serviceRequired } = props;
      const userServices = user.profile.services;
      const hasRequiredServices =
        userServices &&
        (Array.isArray(serviceRequired)
          ? intersection(userServices, serviceRequired).length > 0
          : userServices.includes(serviceRequired));

      return hasSession() && hasRequiredServices;
    },
    [props, user.profile.services],
  );
  const shouldVerify = useCallback(
    () => {
      // Certain sign-in methods can grant access to the service,
      // bypassing the identity proofing requirement.
      // In particular, MHV sign-in users that are Advanced are not LOA3 but
      // should have access to Rx, which would normally require verification.
      return !isAccessible() && verify && !user.profile.verified;
    },
    [isAccessible, user.profile.verified, verify],
  );

  useEffect(
    () => {
      const redirectIfNeeded = () => {
        if (!user.profile.loading) {
          if (shouldSignIn()) window.location.replace(signInUrl);
          else if (shouldVerify()) window.location.replace(verifyUrl);
        }
      };
      redirectIfNeeded();
    },
    [shouldSignIn, shouldVerify, user.profile.loading],
  );

  const renderVerifiedContent = () => {
    if (shouldVerify()) {
      return (
        <va-loading-indicator set-focus message="Redirecting to verify..." />
      );
    }

    const { serviceRequired } = props;

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
        <div className="row">
          <div className="small-12 columns">
            <div>
              <h3>
                Sorry, our system is temporarily down while we fix a few things.
                Please try again later.
              </h3>
              <a href="/">Go back to VA.gov</a>
            </div>
          </div>
        </div>
      );
    }
    if (user.profile.status === 'NOT_FOUND' && !attemptingAppealsAccess) {
      // If va_profile is "not found", show message that we cannot find the user in our system.
      return (
        <div className="row">
          <div className="small-12 columns">
            <div>
              <h3>We couldn’t find your records with that information.</h3>
              <h4>
                <span>
                  Please <SubmitSignInForm />
                </span>
              </h4>
              <a href="/">Go back to VA.gov</a>
            </div>
          </div>
        </div>
      );
    }

    // If va_profile has any other value, continue on to check if this user can
    // use this specific service.
    // If they have the required service, show the application view.
    if (isAccessible()) {
      return props.children;
    }

    // If the required service is not available, the component will still be rendered,
    // but we pass an `isDataAvailable` prop to child components indicating there is
    // no data. (Only add this prop to React components (functions), and not ordinary
    // DOM elements.)
    return React.Children.map(props.children, child => {
      if (!React.isValidElement(child)) {
        return null;
      }

      const prop =
        typeof child.type === 'function' ? { isDataAvailable: false } : null;
      return React.cloneElement(child, prop);
    });
  };
  const renderWrappedContent = () => {
    if (showProfileErrorMessage && user.profile.errors) {
      return <ProfileErrorMessage />;
    }

    if (user.profile.loading) {
      return props.loadingIndicator || <RequiredLoginLoader />;
    }

    if (shouldSignIn()) {
      return (
        <div className="vads-u-margin-y--5" data-testid="redirect-to-login">
          <va-loading-indicator set-focus message="Redirecting to login..." />;
        </div>
      );
    }

    if (verify) {
      return renderVerifiedContent();
    }

    return props.children;
  };

  return <>{renderWrappedContent()}</>;
};

const validService = PropTypes.oneOf(Object.values(backendServices));

RequiredLoginView.propTypes = {
  serviceRequired: PropTypes.oneOfType([
    validService,
    PropTypes.arrayOf(validService),
  ]).isRequired,
  user: PropTypes.object.isRequired,
  loadingIndicator: PropTypes.node,
  showProfileErrorMessage: PropTypes.bool,
  verify: PropTypes.bool,
};

export default RequiredLoginView;

export { RequiredLoginLoader };
