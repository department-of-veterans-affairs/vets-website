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
    return (
      <main className="verify">
        <div className="row">
          <div className="columns">
            <div className="logo">
              <a href="/">
                <img alt="vets.gov" className="va-header-logo" src="/img/design/logo/logo-alt.png"/>
              </a>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="columns small-12">
              <h1>Verify your identity</h1>
            </div>
          </div>
          <div className="row hide-for-medium-up mobile-explanation">
            <div className="columns small-12">
              <h2>Manage the benefits and services you've earned. Simply and securely.</h2>
              <p>
                <a href="#">What can I do with Vets.gov?</a>
              </p>
            </div>
          </div>
          <div className="row">
            <div className="columns small-12">
              <p>
                We'll need to verify your identity so that you can securely access and manage your benefits.<br/>
                <a href="/faq#dbq2">Why does Vets.gov verify identity?</a>
              </p>
              <p>This one-time process will take <strong>5 - 10 minutes</strong> to complete.</p>
              <button className="usa-button-primary va-button-primary" onClick={this.handleLogin}>
                <img alt="ID.me" src="/img/signin/idme-icon-white.svg"/><strong> Verify with ID.me</strong>
              </button>
              <span className="sidelines">OR</span>

              <h4>Already using other VA online services?</h4>
              <p>If you have a <strong>premium account</strong> with My HealtheVet or DS Logon, you can use it to verify your identity automatically:</p>

              <button className="usa-button-primary" onClick={this.handleLogin}>
                <img alt="ID.me" src="/img/signin/mhv-icon.svg"/><strong> Verify with My HealtheVet</strong>
              </button>
              <button className="dslogon" onClick={this.handleLogin}>
                <img alt="ID.me" src="/img/signin/dslogon-icon.svg"/><strong> Verify with DS Logon</strong>
              </button>
              <span>(Used for eBenefits and milConnect)</span>
            </div>
          </div>
          <div className="row">
            <div className="columns small-12">
              <div className="help-info">
                <h4>Having trouble verifying your identity?</h4>
                <p><a href="/faq">Get answers to Frequently Asked Questions</a></p>
                <p>
                  Call the Vets.gov Help Desk at <a href="tel:+18555747286">1-855-574-7286</a> (TTY: <a href="tel:+18008294833">1-800-829-4833</a>).<br/>
                  We're here Monday – Friday, 8:00am – 8:00pm (ET).
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
