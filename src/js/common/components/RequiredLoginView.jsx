import React from 'react';
import $ from 'jquery';
import _ from 'lodash';

import { commonStore } from '../store';

import environment from '../helpers/environment.js';
import { handleVerify } from '../helpers/login-helpers.js';

import SystemDownView from './SystemDownView';

class RequiredLoginView extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.setUserLevel = this.setUserLevel.bind(this);
    this.setInitialLevel = this.setInitialLevel.bind(this);
    this.content = this.content.bind(this);
    this.handleVerify = handleVerify;
    this.state = {
      accountType: 0,
      services: null
    };
  }

  componentWillMount() {
    if (localStorage.userToken !== undefined) {
      this.setUserLevel();
    }
  }

  componentDidMount() {
    if (__BUILDTYPE__ !== 'production') {
      this.serverRequest = $.get(`${environment.API_URL}/v0/sessions/new?level=3`, result => {
        this.setState({ verifyUrl: result.authenticate_via_get });
      });
    }

    if (!localStorage.userToken) {
      this.handleLogout();
    }

    window.addEventListener('message', this.setInitialLevel);
  }

  setInitialLevel() {
    if (event.data === localStorage.userToken) {
      this.setUserLevel();
    }
  }

  setUserLevel() {
    fetch(`${environment.API_URL}/v0/user`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Token token=${localStorage.userToken}`
      })
    }).then(response => {
      return response.json();
    }).then(json => {
      const systemProfile = _.isEmpty(json.data.attributes.va_profile);
      const requiredApp = this.props.serviceRequired;
      const userAccounts = json.data.attributes.profile.loa;
      const userServices = json.data.attributes.services;
      this.setState(
        {
          accountType: userAccounts.current,
          isServiceOffline: systemProfile,
          services: userServices,
          isServiceAvailableForUse: userServices.includes(requiredApp),
        }
      );
    });
  }

  handleLogin() {
    const myStore = commonStore.getState();
    const login = myStore.login;
    const myLoginUrl = login.loginUrl.first;
    // TODO(crew): Check on how this opens on mobile.
    const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  handleLogout() {
    this.setState({ accountType: 0 });
  }

  render() {
    let view;

    // TODO(crew): replace FQA link.
    const loginComponent = (
      <div className="row primary">
        <div className="medium-12 small-12 columns">
          <div className="react-conatiner">
            <h1>Sign in to your Vets.gov Account</h1>
            <p>Vets.gov is a new website from the VA offering online services for Veterans</p>
            <p>We must meet increased security standards to keep your information secure. To safely verify your identity to these standards, we are using <strong>ID.me</strong>, at third-party service.</p>
            <p>When you create an account on vets.gov, you will need to verifty your identity through <strong>ID.me</strong> in order for the VA to identify you and locate your records.</p>
            <p>
              <button className="usa-button-primary va-button-primary usa-button-big" onClick={this.handleLogin}><strong>Sign In</strong></button>
              <button className="usa-button-big" onClick={this.handleLogin}><strong>Create an account</strong></button>
            </p>
            <p>Having trouble signing in or creating an account? See <a href="#">Frequently Asked Questions</a></p>
          </div>
        </div>
      </div>
    );

    const verifyComponent = (
      <div className="row primary">
        <div className="medium-12 small-12 columns">
          <div className="react-conatiner">
            <h1>Verify your Vets.gov Account</h1>
            <p>You need to verify your identity to access this part of Vets.gov</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>
              <button className="usa-button-primary va-button-primary usa-button-big" onClick={this.handleVerify}><strong>Continue</strong></button>
            </p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </div>
    );

    if (this.props.authRequired === 1) {
      if (this.state.accountType >= 1) {
        view = this.props.children;
      } else {
        view = loginComponent;
      }
    } else if (this.props.authRequired === 3) {
      if (this.state.accountType === 3) {
        if (this.state.isServiceOffline) {
          // If there is nothing in va_profile, show system down message.
          view = <SystemDownView messageLine1="We're sorry. The application you are looking for is currently down while we fix a few things. We will be back up as soon as we can."/>;
        } else {
          // If there is something in the va_profile attribute, continue on to check if this user can use this specific service.
          if (this.state.isServiceAvailableForUse) {
            // If you have the required service show the application view.
            view = this.props.children;
          } else {
            // If you do not have the required service in your `services` array then we will show the component but pass a prop to let them know that you don't have any data.
            view = React.Children.map(this.props.children,
              (child) => React.cloneElement(child, {
                isDataAvailable: this.state.isServiceAvailableForUse
              })
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

    return view;
  }
}

export default RequiredLoginView;
