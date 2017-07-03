import PropTypes from 'prop-types';
import React from 'react';
import { intersection } from 'lodash';

import SystemDownView from './SystemDownView';
import LoginPrompt from './authentication/LoginPrompt';
import VerifyPrompt from './authentication/VerifyPrompt';
import LoadingIndicator from '../../common/components/LoadingIndicator';

class RequiredLoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  }

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

  render() {
    let view;

    const loginComponent = <LoginPrompt loginUrl={this.props.loginUrl}/>;
    const verifyComponent = <VerifyPrompt verifyUrl={this.props.verifyUrl}/>;

    if (this.state.loading === true) {
      view = <LoadingIndicator setFocus message="Loading your information"/>;
    } else {
      if (this.props.authRequired === 1) {
        if (this.props.userProfile.accountType >= 1) {
          view = this.props.children;
        } else {
          view = loginComponent;
        }
      } else if (this.props.authRequired === 3) {
        if (this.props.userProfile.accountType === 3) {
          // TODO: Delete the logic around attemptingAppealsAccess once we
          // resolve the MVI/Appeals Users issues.
          // if app we are trying to access includes appeals,
          // bypass the checks for userProfile status
          const requiredApp = this.props.serviceRequired;
          let attemptingAppealsAccess;

          if (Array.isArray(requiredApp)) {
            attemptingAppealsAccess = requiredApp.indexOf('appeals-status') !== -1;
          } else {
            attemptingAppealsAccess = requiredApp === 'appeals-status';
          }

          if (this.props.userProfile.status === 'SERVER_ERROR' && !attemptingAppealsAccess) {
            // If va_profile is null, show a system down message.
            view = <SystemDownView messageLine1="Sorry, our system is temporarily down while we fix a few things. Please try again later."/>;
          } else if (this.props.userProfile.status === 'NOT_FOUND' && !attemptingAppealsAccess) {
            // If va_profile is "not found", show message that we cannot find the user
            // in our system.
            view = <SystemDownView messageLine1="We couldn't find your records with that information." messageLine2="Please call the Vets.gov Help Desk at 1-855-574-7286. We're open Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET)."/>;
          } else {
            // If va_profile has any other value, continue on to check if this user can
            // use this specific service.
            if (this.isServiceAvailable()) {
              // If you have the required service, show the application view.
              view = this.props.children;
            } else {
              // If the required service is not available, the component will still be rendered,
              // but we pass an `isDataAvailable` prop to child components indicating there is
              // no data. (Only add this prop to React components (functions), and not ordinary
              // DOM elements.)
              view = React.Children.map(this.props.children,
                (child) => {
                  let props = null;
                  if (typeof child.type === 'function') {
                    props = { isDataAvailable: false };
                  }
                  return React.cloneElement(child, props);
                }
              );
            }
          }
        } else if (this.props.userProfile.accountType === 1) {
          view = verifyComponent;
        } else {
          view = loginComponent;
        }
      } else {
        view = this.props.children;
      }
    }

    return (
      <div>
        {view}
      </div>
    );
  }
}

RequiredLoginView.propTypes = {
  authRequired: PropTypes.number.isRequired,
  serviceRequired: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  userProfile: PropTypes.object.isRequired,
  loginUrl: PropTypes.string,
  verifyUrl: PropTypes.string
};

export default RequiredLoginView;
