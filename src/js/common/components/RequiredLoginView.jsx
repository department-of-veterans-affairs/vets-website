import appendQuery from 'append-query';
import PropTypes from 'prop-types';
import React from 'react';
import { intersection } from 'lodash';

import SystemDownView from './SystemDownView';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import Main from '../../login/containers/Main';

const healthTools = ['health-records', 'rx', 'messaging'];
const nextQuery = { next: window.location.pathname };
const signInUrl = appendQuery('/', nextQuery);

class RequiredLoginView extends React.Component {
  componentDidUpdate() {
    const isLoading = this.props.user.profile.loading;
    if (!isLoading && this.shouldSignIn()) {
      window.location.replace(signInUrl);
    }
  }

  shouldSignIn = () => !this.props.user.login.currentlyLoggedIn;

  // Checks that (1) session has a valid authentication token and
  // (2) the user is authorized to use services required by this application
  isAccessible = () => {
    const { serviceRequired, user } = this.props;
    const userServices = user.profile.services;
    const hasRequiredServices = userServices && (
      Array.isArray(serviceRequired) ?
        intersection(userServices, serviceRequired).length > 0 :
        userServices.includes(serviceRequired)
    );

    return sessionStorage.userToken && hasRequiredServices;
  }

  renderVerifiedContent = () => {
    const { serviceRequired, user } = this.props;

    // Ignore required verification when accessing health tools with MHV sign-in.
    const hasMhvAccess =
      healthTools.includes(serviceRequired) &&
      user.profile.authnContext === 'myhealthevet';

    if (user.profile.verified || hasMhvAccess) {
      // TODO: Delete the logic around attemptingAppealsAccess once we
      // resolve the MVI/Appeals Users issues.
      // if app we are trying to access includes appeals,
      // bypass the checks for user profile status
      const attemptingAppealsAccess = Array.isArray(serviceRequired) ?
        serviceRequired.includes('appeals-status') :
        serviceRequired === 'appeals-status';

      if (user.profile.status === 'SERVER_ERROR' && !attemptingAppealsAccess) {
        // If va_profile is null, show a system down message.
        return <SystemDownView messageLine1="Sorry, our system is temporarily down while we fix a few things. Please try again later."/>;
      } else if (user.profile.status === 'NOT_FOUND' && !attemptingAppealsAccess) {
        // If va_profile is "not found", show message that we cannot find the user in our system.
        return (
          <SystemDownView
            messageLine1="We couldn’t find your records with that information."
            messageLine2="Please call the Vets.gov Help Desk at 1-855-574-7286, TTY: 1-800-877-8339. We're open Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)."/>
        );
      }

      // If va_profile has any other value, continue on to check if this user can
      // use this specific service.
      // If they have the required service, show the application view.
      if (this.isAccessible()) { return this.props.children; }

      // If the required service is not available, the component will still be rendered,
      // but we pass an `isDataAvailable` prop to child components indicating there is
      // no data. (Only add this prop to React components (functions), and not ordinary
      // DOM elements.)
      return React.Children.map(this.props.children, (child) => {
        const props = typeof child.type === 'function'
          ? { isDataAvailable: false }
          : null;
        return React.cloneElement(child, props);
      });
    }

    // If the user is not verified and doesn't have MHV access, they need to verify.
    return <Main renderType="verifyPage"/>;
  }

  renderWrappedContent = () => {
    const { user, verify } = this.props;

    if (user.profile.loading) {
      return <LoadingIndicator setFocus message="Loading your information..."/>;
    }

    if (this.shouldSignIn()) {
      return <LoadingIndicator setFocus message="Redirecting to login..."/>;
    }

    if (verify) {
      return this.renderVerifiedContent();
    }

    return this.props.children;
  }

  render() {
    return <div className={this.props.containerClass}>{this.renderWrappedContent()}</div>;
  }
}

RequiredLoginView.propTypes = {
  serviceRequired: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  user: PropTypes.object.isRequired,
  verify: PropTypes.bool
};

export default RequiredLoginView;
