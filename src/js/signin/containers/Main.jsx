import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import environment from '../../common/helpers/environment.js';
import { getUserData, handleLogin, addEvent, getVerifyUrl, getLoginUrls } from '../../common/helpers/login-helpers';

import { updateLoggedInStatus, updateVerifyUrl, updateLogoutUrl, updateLogInUrls } from '../../login/actions';
import Signin from '../components/Signin';
import Verify from '../components/Verify';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.setMyToken = this.setMyToken.bind(this);
    this.getLogoutUrl = this.getLogoutUrl.bind(this);
    this.getLoginUrls = this.getLoginUrls.bind(this);
    this.getVerifyUrl = this.getVerifyUrl.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.checkTokenStatus = this.checkTokenStatus.bind(this);
  }

  componentDidMount() {
    if (sessionStorage.userToken) {
      this.getLogoutUrl();
    }
    this.getLoginUrls();
    this.getVerifyUrl();
    addEvent(window, 'message', (evt) => {
      this.setMyToken(evt);
    });
    window.onload = this.checkTokenStatus();
  }

  componentDidUpdate(prevProps) {
    const shouldGetVerifyUrl =
      !prevProps.login.currentlyLoggedIn &&
      this.props.login.currentlyLoggedIn &&
      !this.props.login.verifyUrl;

    if (shouldGetVerifyUrl) {
      this.getVerifyUrl();
    }
  }

  componentWillUnmount() {
    this.loginUrlRequest.abort();
    this.verifyUrlRequest.abort();
    if (this.logoutUrlRequest) {
      this.logoutUrlRequest.abort();
    }
  }

  getLoginUrls() {
    this.loginUrlRequest = getLoginUrls(this.props.updateLogInUrls);
  }

  getVerifyUrl() {
    const { currentlyLoggedIn, verifyUrl } = this.props.login;
    if (currentlyLoggedIn && !verifyUrl) {
      this.verifyUrlRequest = getVerifyUrl(this.props.updateVerifyUrl);
    }
  }

  setMyToken(event) {
    if (event.data === sessionStorage.userToken) {
      this.props.getUserData();
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
      this.props.updateLogoutUrl(json.logout_via_get);
    });
  }

  handleLogin(loginUrl = 'idme') {
    this.loginUrlRequest = handleLogin(this.props.login.loginUrls[loginUrl], this.props.onUpdateLoginUrl);
  }

  handleSignup() {
    window.dataLayer.push({ event: 'register-link-clicked' });
    const myLoginUrl = this.props.login.loginUrls.idmeUrl;
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
        if (this.props.getUserData()) {
          this.props.updateLoggedInStatus(true);
        }
      }
    } else {
      this.props.updateLoggedInStatus(false);
    }
  }

  render() {
    const currentlyLoggedIn = this.props.login.currentlyLoggedIn;

    if (this.props.verify && currentlyLoggedIn) {
      return (
        <Verify
          verifyUrl={this.props.login.verifyUrl}/>
      );
    }

    return (
      <Signin
        onLoggedIn={this.props.onLoggedIn}
        currentlyLoggedIn={currentlyLoggedIn}
        handleSignup={this.handleSignup}
        handleLogin={this.handleLogin}/>
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
    updateLogInUrls: (update) => {
      dispatch(updateLogInUrls(update));
    },
    updateVerifyUrl: (update) => {
      dispatch(updateVerifyUrl(update));
    },
    updateLogoutUrl: (update) => {
      dispatch(updateLogoutUrl(update));
    },
    updateLoggedInStatus: (update) => {
      dispatch(updateLoggedInStatus(update));
    },
    getUserData: () => {
      getUserData(dispatch);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
export { Main };
