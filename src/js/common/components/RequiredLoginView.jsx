import React from 'react';
import { connect } from 'react-redux';

import { commonStore } from '../store';

class RequiredLoginView extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenPopup = this.handleOpenPopup.bind(this);
  }

  handleLogin() {
    const myLoginUrl = this.props.login.loginUrl;
    const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  handleVerify() {
    const myLoginUrl = this.props.login.loginUrl;
    const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  render() {
    let view;
    const myStore = commonStore.getState();
    const profile = myStore.profile;

    const loginComponent = (
      <div className="row primary">
        <div className="medium-12 small-12 columns">
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
    );

    const verifyComponent = (
      <div className="row primary">
        <div className="medium-12 small-12 columns">
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
    );

    if (this.props.authRequired === 1) {
      if (profile.accountType === 1) {
        view = this.props.component;
      } else {
        view = loginComponent;
      }
    } else if (this.props.authRequired === 3) {
      if (profile.accountType === 3) {
        view = this.props.component;
      } else if (profile.accountType === 1) {
        view = verifyComponent;
      } else {
        view = loginComponent;
      }
    } else {
      view = this.props.component;
    }

    return view;
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(RequiredLoginView);
export { RequiredLoginView };
