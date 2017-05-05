import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import environment from '../../common/helpers/environment.js';
import { getUserData, addEvent } from '../../common/helpers/login-helpers';

import { updateLoggedInStatus, updateLogInUrl } from '../actions';
import { logOut } from '../../common/actions';
import SearchHelpSignIn from '../components/SearchHelpSignIn';

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
  }

  getLoginUrl() {
    this.loginUrlRequest = fetch(`${environment.API_URL}/v0/sessions/new?level=1`, {
      method: 'GET',
    }).then(response => {
      return response.json();
    }).then(json => {
      this.props.onUpdateLoginUrl('first', json.authenticate_via_get);
    }).catch(() => {
    });
  }

  getVerifyUrl() {
    this.verifyUrlRequest = fetch(`${environment.API_URL}/v0/sessions/new?level=3`, {
      method: 'GET',
    }).then(response => {
      return response.json();
    }).then(json => {
      this.props.onUpdateLoginUrl('third', json.authenticate_via_get);
    }).catch(() => {
    });
  }

  setMyToken(event) {
    if (event.data === sessionStorage.userToken) {
      this.getUserData();
      this.getLogoutUrl();
    }
  }

  getLogoutUrl() {
    fetch(`${environment.API_URL}/v0/sessions`, {
      method: 'DELETE',
      headers: new Headers({
        Authorization: `Token token=${sessionStorage.userToken}`
      })
    }).then(response => {
      return response.json();
    }).then(json => {
      this.setState({ logoutUrl: json.logout_via_get });
    }).catch(() => {
    });
  }

  handleLogin() {
    window.dataLayer.push({ event: 'login-link-clicked' });
    const myLoginUrl = this.props.login.loginUrl.first;
    if (myLoginUrl) {
      window.dataLayer.push({ event: 'login-link-opened' });
      const receiver = window.open(`${myLoginUrl}&op=signin`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
      receiver.focus();
      this.getLoginUrl();
    }
  }

  handleSignup() {
    window.dataLayer.push({ event: 'register-link-clicked' });
    const myLoginUrl = this.props.login.loginUrl.first;
    if (myLoginUrl) {
      window.dataLayer.push({ event: 'register-link-opened' });
      const receiver = window.open(`${myLoginUrl}&op=signup`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
      receiver.focus();
    }
  }

  handleLogout() {
    window.dataLayer.push({ event: 'logout-link-clicked' });
    const myLogoutUrl = this.state.logoutUrl;
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
        if (confirm("For security, you'll be automatically signed out in 2 minutes. To stay signed in, click OK. ")) {
          this.handleLogin();
        } else {
          this.handleLogout();
        }
      } else {
        if (this.getUserData()) {
          this.props.onUpdateLoggedInStatus(true);
        }
      }
    } else {
      this.props.onUpdateLoggedInStatus(false);
    }
  }

  render() {
    return (
      <SearchHelpSignIn onUserLogin={this.handleLogin} onUserSignup={this.handleSignup} onUserLogout={this.handleLogout}/>
    );
  }
}

const mapStateToProps = (state) => {
  const userState = state.user;
  return {
    // TODO(romano): looks like we only need userState.login.loginURL,
    // so replace this (similar to UserProfileAp.jsx) with
    // loginUrl: userState.login.loginUrl,
    login: userState.login,
    profile: userState.profile
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoginUrl: (field, update) => {
      dispatch(updateLogInUrl(field, update));
    },
    onUpdateLoggedInStatus: (update) => {
      dispatch(updateLoggedInStatus(update));
    },
    onClearUserData: () => {
      dispatch(logOut());
    }
  };
};

// TODO(romano): safe to remove { pure: false } now?
// https://github.com/reactjs/react-redux/blob/master/docs/troubleshooting.md
export default connect(mapStateToProps, mapDispatchToProps)(Main);
export { Main };
