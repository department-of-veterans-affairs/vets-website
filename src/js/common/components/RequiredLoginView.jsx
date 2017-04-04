import React from 'react';

import { handleVerify } from '../helpers/login-helpers.js';

import SystemDownView from './SystemDownView';
import LoadingIndicator from '../../common/components/LoadingIndicator';

class RequiredLoginView extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.setUserLevel = this.setUserLevel.bind(this);
    this.handleVerify = handleVerify;
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

  handleLogin() {
    const myLoginUrl = this.props.loginUrl;
    const receiver = window.open(`${myLoginUrl}&op=signin`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  handleSignup() {
    const myLoginUrl = this.props.loginUrl;
    const receiver = window.open(`${myLoginUrl}&op=signup`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  render() {
    let view;

    const loginComponent = (
      <div className="row primary">
        <div className="medium-12 small-12 columns">
          <div className="react-conatiner">
            <h1>Sign In to Your Vets.gov Account</h1>
            <p>Vets.gov is a new VA website offering online services for Veterans.</p>
            <p>Sign in to:</p>
            <ul>
              <li>Refill a prescription.</li>
              <li>Send a secure message to your health care provider.</li>
              <li>Check the status of a disability or pension claim.</li>
            </ul>
            <p>
              <button className="usa-button-primary va-button-primary usa-button-big" onClick={this.handleLogin}><strong>Sign In</strong></button>
              <button className="va-button-secondary usa-button-big" onClick={this.handleSignup}><strong>Create Account</strong></button>
            </p>
          </div>
        </div>
      </div>
    );

    const verifyComponent = (
      <div className="row primary">
        <div className="medium-12 small-12 columns">
          <div className="react-container">
            <h1>Verify your Identity with ID.me</h1>
            <p>You need to verify your identity to access this part of Vets.gov.</p>
            <p>To access Vets.gov services, you'll need to verify your identity through ID.me, a third party service that provides strong identity verification. We have added this protection to increase security for your information. Here's what you'll need:
              <ul>
                <li>Your passport or driver's license</li>
                <li>A phone that can receive texts or calls</li>
              </ul>
            Don't have a supported ID? You can provide personal information and answer questions about your credit history instead.</p>
            <p>
              <button className="usa-button-primary va-button-primary usa-button-big" onClick={this.handleVerify}><strong>Get Started</strong></button>
            </p>
          </div>
        </div>
      </div>
    );

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
  authRequired: React.PropTypes.number.isRequired,
  serviceRequired: React.PropTypes.string.isRequired,
  userProfile: React.PropTypes.object.isRequired,
  loginUrl: React.PropTypes.string,
};

export default RequiredLoginView;
