import React from 'react';
import { connect } from 'react-redux';

import { commonStore } from '../store';

import environment from '../helpers/environment.js';
import { updateLoggedInStatus, updateLogInUrl, updateProfileField } from '../actions';

class RequiredLoginView extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleVerify = this.handleVerify.bind(this);
    this.setMyToken = this.setMyToken.bind(this);
    this.getUserData = this.getUserData.bind(this);
  }

  componentDidMount() {
    if (localStorage.userToken) {
      this.props.onUpdateLoggedInStatus(true);
      this.getUserData();
    } else {
      this.props.onUpdateLoggedInStatus(false);
    }

    window.addEventListener('message', this.setMyToken);
  }

  setMyToken() {
    if (event.data === localStorage.userToken) {
      this.getUserData();
    }
  }

  getUserData() {
    fetch(`${environment.API_URL}/v0/user`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Token token=${localStorage.userToken}`
      })
    }).then(response => {
      return response.json();
    }).then(json => {
      const userData = json.data.attributes.profile;
      this.props.onUpdateProfile('accountType', userData.loa.current);
      this.props.onUpdateProfile('email', userData.email);
      this.props.onUpdateProfile('userFullName.first', userData.first_name);
      this.props.onUpdateProfile('userFullName.middle', userData.middle_name);
      this.props.onUpdateProfile('userFullName.last', userData.last_name);
      this.props.onUpdateProfile('gender', userData.gender);
      this.props.onUpdateProfile('dob', userData.birth_date);
      this.props.onUpdateLoggedInStatus(true);
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

  handleVerify() {
    const myStore = commonStore.getState();
    const login = myStore.login;
    const myVerifyUrl = login.loginUrl.third;
    const receiver = window.open(myVerifyUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
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
          // TODO(crew): replace FQA link.
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

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoginUrl: (field, update) => {
      dispatch(updateLogInUrl(field, update));
    },
    onUpdateLoggedInStatus: (update) => {
      dispatch(updateLoggedInStatus(update));
    },
    onUpdateProfile: (field, update) => {
      dispatch(updateProfileField(field, update));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(RequiredLoginView);
export { RequiredLoginView };
