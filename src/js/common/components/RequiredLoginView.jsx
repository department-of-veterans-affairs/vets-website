import React from 'react';

import environment from '../helpers/environment.js';
import { handleVerify, addEvent } from '../helpers/login-helpers.js';

import SystemDownView from './SystemDownView';
import LoadingIndicator from '../../common/components/LoadingIndicator';

class RequiredLoginView extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.setUserLevel = this.setUserLevel.bind(this);
    this.setInitialLevel = this.setInitialLevel.bind(this);

    this.handleVerify = handleVerify;
    this.state = {
      accountType: 0,
      services: null,
      loading: true
    };
  }

  componentDidMount() {
    if (sessionStorage.userToken) {
      this.setUserLevel();
    } else {
      this.handleLogout();
    }

    this.serverRequest = fetch(`${environment.API_URL}/v0/sessions/new?level=1`, {
      method: 'GET',
    }).then(response => {
      return response.json();
    }).then(json => {
      this.setState({ loginUrl: json.authenticate_via_get });
    });

    addEvent(window, 'message', (evt) => {
      this.setInitialLevel(evt);
    });

    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  }

  setInitialLevel(event) {
    if (event.data === sessionStorage.userToken) {
      this.setUserLevel();
    }
  }

  setUserLevel() {
    fetch(`${environment.API_URL}/v0/user`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Token token=${sessionStorage.userToken}`
      })
    }).then(response => {
      return response.json();
    }).then(json => {
      const systemStatus = json.data.attributes.va_profile.status;
      const requiredApp = this.props.serviceRequired;
      const userAccounts = json.data.attributes.profile.loa;
      const userServices = json.data.attributes.services;
      this.setState(
        {
          accountType: userAccounts.current,
          profileStatus: systemStatus,
          services: userServices,
          isServiceAvailableForUse: userServices.includes(requiredApp),
        }
      );
    });
  }

  handleLogin() {
    const myLoginUrl = this.state.loginUrl;
    const receiver = window.open(`${myLoginUrl}&op=signin`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  handleSignup() {
    const myLoginUrl = this.state.loginUrl;
    const receiver = window.open(`${myLoginUrl}&op=signup`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  handleLogout() {
    this.setState({ accountType: 0 });
  }

  render() {
    let view;

    const loginComponent = (
      <div className="row primary">
        <div className="medium-12 small-12 columns">
          <div className="react-conatiner">
            <h1>Sign in to your Vets.gov Account</h1>
            <p>Vets.gov is a new website from the VA offering online services for Veterans.</p>
            <p>To refill a prescription, send a secure message to your healthcare provider, or check the status of a disability claim, sign in to Vets.gov.</p>
            <p>
              <button className="usa-button-primary va-button-primary usa-button-big" onClick={this.handleLogin}><strong>Sign In</strong></button>
              <button className="va-button-secondary usa-button-big" onClick={this.handleSignup}><strong>Create an account</strong></button>
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
        if (this.state.accountType >= 1) {
          view = this.props.children;
        } else {
          view = loginComponent;
        }
      } else if (this.props.authRequired === 3) {
        if (this.state.accountType === 3) {
          if (this.state.profileStatus === 'SERVER_ERROR') {
            // If va_profile is null, the system is down and we will show system down message.
            view = <SystemDownView messageLine1="Sorry, our system is temporarily down while we fix a few things. Please try again later."/>;
          } else if (this.state.profileStatus === 'NOT_FOUND') {
            // If va_profile is "not found", we cannot find you in our system and we will show a, we can't find you message.
            view = <SystemDownView messageLine1="We couldn't find your records with that information." messageLine2="Please call the Vets.gov Help Desk at 1-855-574-7286. We're open Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET)."/>;
          } else {
            // If there is something in the va_profile attribute, continue on to check if this user can use this specific service.
            if (this.state.isServiceAvailableForUse) {
              // If you have the required service show the application view.
              view = this.props.children;
            } else {
              // If you do not have the required service in your `services` array then we will show the component but pass a prop to let them know that you don't have any data. Only passes prop on React components (functions) and not elements like divs so that React does not throw a warning
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
        } else if (this.state.accountType === 1) {
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

export default RequiredLoginView;
