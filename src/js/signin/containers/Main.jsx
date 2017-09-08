import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import environment from '../../common/helpers/environment.js';
import { getUserData, addEvent, handleLogin, getLoginUrl } from '../../common/helpers/login-helpers';

import { updateLoggedInStatus, updateLogInUrl, updateVerifyUrl, updateLogoutUrl } from '../actions';
// import SearchHelpSignIn from '../components/SearchHelpSignIn';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.setMyToken = this.setMyToken.bind(this);
    this.getLogoutUrl = this.getLogoutUrl.bind(this);
    this.getLoginUrl = this.getLoginUrl.bind(this);
    this.getVerifyUrl = this.getVerifyUrl.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.checkTokenStatus = this.checkTokenStatus.bind(this);
    this.getUserData = getUserData;
  }

  componentDidMount() {
    if (sessionStorage.userToken) {
      this.getLogoutUrl();
    }
    this.getLoginUrl();
    this.getVerifyUrl();
    addEvent(window, 'message', (evt) => {
      this.setMyToken(evt);
    });
    window.onload = this.checkTokenStatus();
  }

  componentWillUnmount() {
    this.loginUrlRequest.abort();
    this.verifyUrlRequest.abort();
    this.logoutUrlRequest.abort();
  }

  getLoginUrl() {
    this.loginUrlRequest = getLoginUrl(this.props.onUpdateLoginUrl);
  }

  getVerifyUrl() {
    this.verifyUrlRequest = fetch(`${environment.API_URL}/v0/sessions/new?level=3`, {
      method: 'GET',
    }).then(response => {
      return response.json();
    }).then(json => {
      this.props.onUpdateVerifyUrl(json.authenticate_via_get);
    });
  }

  setMyToken(event) {
    if (event.data === sessionStorage.userToken) {
      this.getUserData(this.props.dispatch);
      this.getLogoutUrl();
    }
  }

  getLogoutUrl() {
    this.logoutUrlRequest = fetch(`${environment.API_URL}/v0/sessions`, {
      method: 'DELETE',
      headers: new Headers({
        Authorization: `Token token=${sessionStorage.userToken}`
      })
    }).then(response => {
      return response.json();
    }).then(json => {
      this.props.onUpdateLogoutUrl(json.logout_via_get);
    });
  }

  handleLogin() {
    this.loginUrlRequest = handleLogin(this.props.login.loginUrl, this.props.onUpdateLoginUrl);
  }

  handleSignup() {
    window.dataLayer.push({ event: 'register-link-clicked' });
    const myLoginUrl = this.props.login.loginUrl;
    if (myLoginUrl) {
      window.dataLayer.push({ event: 'register-link-opened' });
      const receiver = window.open(`${myLoginUrl}&op=signup`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
      receiver.focus();
    }
  }

  handleLogout() {
    window.dataLayer.push({ event: 'logout-link-clicked' });
    const myLogoutUrl = this.props.login.logoutUrl;
    if (myLogoutUrl) {
      window.dataLayer.push({ event: 'logout-link-opened' });
      const receiver = window.open(myLogoutUrl, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
      receiver.focus();
    }
  }

  checkTokenStatus() {
    if (sessionStorage.userToken) {
      if (moment() > moment(sessionStorage.entryTime).add(45, 'm')) {
        // TODO(crew): make more customized prompt.
        if (confirm('For security, you’ll be automatically signed out in 2 minutes. To stay signed in, click OK.')) {
          this.handleLogin();
        } else {
          this.handleLogout();
        }
      } else {
        if (this.getUserData(this.props.dispatch)) {
          this.props.onUpdateLoggedInStatus(true);
        }
      }
    } else {
      this.props.onUpdateLoggedInStatus(false);
    }
  }

  render() {
    // return (
    //   <SearchHelpSignIn
    //     onUserLogin={this.handleLogin}
    //     onUserSignup={this.handleSignup}
    //     onUserLogout={this.handleLogout}/>
    // );

    return (
      <main className="login">
        <div className="row">
          <div className="columns">
            <div className="logo">
              <a href="/">
                <img alt="vets.gov" className="va-header-logo" src="/img/vetslogo.png"/>
              </a>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="columns small-12">
              <h1>Sign in to Vets.gov</h1>
            </div>
          </div>
          <div className="row">
            <div className="columns usa-width-one-half medium-6">
              <div className="signin-actions-container">
                <div className="top-banner">
                  <div>
                    <img alt="ID.me" src="/img/signin/lock-icon.svg"/> Secured & powered by <img alt="ID.me" src="/img/signin/idme-icon-dark.svg"/>
                  </div>
                </div>
                <div className="signin-actions">
                  <h5>Sign in with an existing account</h5>
                  <div>
                    <button className="usa-button-primary" onClick={this.handleLogin}>
                      <img alt="ID.me" src="/img/signin/mhv-icon.svg"/><strong> Sign in with My HealtheVet</strong>
                    </button>
                    <button className="dslogon" onClick={this.handleLogin}>
                      <img alt="ID.me" src="/img/signin/dslogon-icon.svg"/><strong> Sign in with DS Logon</strong>
                    </button>
                    <button className="usa-button-primary va-button-primary" onClick={this.handleLogin}>
                      <img alt="ID.me" src="/img/signin/idme-icon-white.svg"/><strong> Sign in with ID.me</strong>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="columns usa-width-one-half medium-6">
              <div className="explanation-content">
                <h4>Manage the benefits and services you've earned. Simply and securely.</h4>
                <p>
                  With Vets.gov you can:
                </p>
                <ul>
                  <li>Track your VA claims and appeals</li>
                  <li>Download your VA health record</li>
                  <li>Refill your VA prescriptions</li>
                  <li><a href="#">And more</a></li>
                </ul>
                <p>
                  <strong>A secure account powered by ID.me</strong><br/>
                  ID.me is our trusted technology partner in helping to keep your personal information safe. They specialize in digital identity protection and help us make sure you're you—and not someone pretending to be you—before we give you access to your information. <a href="#">Learn more about ID.me</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state) => {
  const userState = state.user;
  return {
    login: userState.login,
    profile: userState.profile
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoginUrl: (update) => {
      dispatch(updateLogInUrl(update));
    },
    onUpdateVerifyUrl: (update) => {
      dispatch(updateVerifyUrl(update));
    },
    onUpdateLogoutUrl: (update) => {
      dispatch(updateLogoutUrl(update));
    },
    onUpdateLoggedInStatus: (update) => {
      dispatch(updateLoggedInStatus(update));
    },
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
export { Main };
