import PropTypes from 'prop-types';
import React from 'react';

import SystemDownView from './SystemDownView';
import LoginPrompt from './authentication/LoginPrompt';
import VerifyPrompt from './authentication/VerifyPrompt';
import LoadingIndicator from '../../common/components/LoadingIndicator';

class RequiredLoginView extends React.Component {
  constructor(props) {
    super(props);
    this.setUserLevel = this.setUserLevel.bind(this);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    if (sessionStorage.userToken) {
      this.setUserLevel();
    }

    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  }

  setUserLevel() {
    const requiredApp = this.props.serviceRequired;
    const userServices = this.props.userProfile.services;
    if (userServices) {
      this.setState(
        {
          isServiceAvailableForUse: userServices.includes(requiredApp),
        }
      );
    }
  }

  render() {
    let view;

    const loginComponent = <LoginPrompt loginUrl={this.props.loginUrl.first}/>;
    const verifyComponent = <VerifyPrompt verifyUrl={this.props.loginUrl.third}/>;

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
          if (this.props.userProfile.status === 'SERVER_ERROR') {
            // If va_profile is null, the system is down and we will show system down message.
            view = <SystemDownView messageLine1="Sorry, our system is temporarily down while we fix a few things. Please try again later."/>;
          } else if (this.props.userProfile.status === 'NOT_FOUND') {
            // If va_profile is "not found", we cannot find you in our system and we will show a, we can't find you message.
            view = <SystemDownView messageLine1="We couldn't find your records with that information." messageLine2="Please call the Vets.gov Help Desk at 1-855-574-7286. We're open Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET)."/>;
          } else {
            // If there is something in the va_profile attribute, continue on to check if this user can use this specific service.
            if (this.state.isServiceAvailableForUse) {
              // If you have the required service show the application view.
              view = this.props.children;
            } else {
              // If you do not have the required service in your `userServices` array then we will show the component but pass a prop to let them know that you don't have any data. Only passes prop on React components (functions) and not elements like divs so that React does not throw a warning
              view = React.Children.map(this.props.children,
                (child) => {
                  let props = null;
                  if (typeof child.type === 'function') {
                    props = {
                      isDataAvailable: this.state.isServiceAvailableForUse,
                    };
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
  serviceRequired: PropTypes.string.isRequired,
  userProfile: PropTypes.object.isRequired,
  loginUrl: PropTypes.object.isRequired
};

export default RequiredLoginView;
