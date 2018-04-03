import appendQuery from 'append-query';
import PropTypes from 'prop-types';
import React from 'react';
import { intersection } from 'lodash';

import SystemDownView from '@department-of-veterans-affairs/jean-pants/SystemDownView';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import Main from '../../login/containers/Main';

const healthTools = ['health-records', 'rx', 'messaging'];

class RequiredLoginView extends React.Component {
  isServiceAvailable() {
    const requiredApp = this.props.serviceRequired;
    const userServices = this.props.userProfile.services;
    // Checks that
    // 1) session has a valid authentication token, and
    // 2) the application being loaded (requiredApp) is in the list of
    //    applications/services the user is authorized to use (userServices)
    // TODO: replace indexOf() once NodeJS versions in all environments support includes()

    if (sessionStorage.userToken && userServices) {
      if (Array.isArray(requiredApp)) {
        return intersection(userServices, requiredApp).length > 0;
      }
      return userServices.indexOf(requiredApp) !== -1;
    }

    return false;
  }

  renderContent() {
    const { userProfile, serviceRequired: requiredApp } = this.props;

    if (userProfile.loading === true) {
      return <LoadingIndicator setFocus message="Loading your information..."/>;
    }

    const nextQuery = { next: window.location.pathname };
    const signInUrl = appendQuery('/', nextQuery);

    if (this.props.authRequired === 1) {
      if (userProfile.accountType >= 1) {
        return this.props.children;
      }

      return window.location.replace(signInUrl);

    } else if (this.props.authRequired === 3) {
      // Ignore LOA when accessing health tools with MHV sign-in.
      const mhvAccess =
        healthTools.includes(requiredApp) &&
        userProfile.authnContext === 'myhealthevet';

      if (userProfile.accountType === 3 || mhvAccess) {
        // TODO: Delete the logic around attemptingAppealsAccess once we
        // resolve the MVI/Appeals Users issues.
        // if app we are trying to access includes appeals,
        // bypass the checks for userProfile status
        let attemptingAppealsAccess;

        if (Array.isArray(requiredApp)) {
          attemptingAppealsAccess = requiredApp.indexOf('appeals-status') !== -1;
        } else {
          attemptingAppealsAccess = requiredApp === 'appeals-status';
        }

        if (userProfile.status === 'SERVER_ERROR' && !attemptingAppealsAccess) {
          // If va_profile is null, show a system down message.
          return <SystemDownView messageLine1="Sorry, our system is temporarily down while we fix a few things. Please try again later."/>;
        } else if (userProfile.status === 'NOT_FOUND' && !attemptingAppealsAccess) {
          // If va_profile is "not found", show message that we cannot find the user
          // in our system.
          return <SystemDownView messageLine1="We couldn’t find your records with that information." messageLine2="Please call the Vets.gov Help Desk at 1-855-574-7286, TTY: 1-800-877-8339. We're open Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)."/>;
        }

        // If va_profile has any other value, continue on to check if this user can
        // use this specific service.
        if (this.isServiceAvailable()) {
          // If you have the required service, show the application view.
          return this.props.children;
        }

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
      } else if (userProfile.accountType === 1) {
        return  <Main renderType="verifyPage"/>;
      }

      return window.location.replace(signInUrl);
    }

    return this.props.children;
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

RequiredLoginView.propTypes = {
  authRequired: PropTypes.number.isRequired,
  serviceRequired: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  userProfile: PropTypes.object.isRequired
};

export default RequiredLoginView;
