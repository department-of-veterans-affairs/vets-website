import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import moment from 'moment';

import environment from '../../common/helpers/environment.js';
import { getUserData, addEvent } from '../../common/helpers/login-helpers';

import { updateLoggedInStatus, updateLogInUrl, logOut } from '../../common/actions';
import SignInProfileButton from '../components/SignInProfileButton';

// TODO(crew): Redux-ify the state and how it is stored here.
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.setMyToken = this.setMyToken.bind(this);
    this.getLogoutUrl = this.getLogoutUrl.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.checkTokenStatus = this.checkTokenStatus.bind(this);
    this.getUserData = getUserData;
  }

  componentDidMount() {
    if (sessionStorage.userToken) {
      this.getLogoutUrl();
    }

    this.serverRequest = $.get(`${environment.API_URL}/v0/sessions/new?level=1`, result => {
      this.setState({ loginUrl: result.authenticate_via_get });
    });

    addEvent(window, 'message', (evt) => {
      this.setMyToken(evt);
    });

    window.onload = this.checkTokenStatus();
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  setMyToken(event) {
    if (event.data === sessionStorage.userToken) {
      this.getUserData();
      this.getLogoutUrl();
    }
  }

  getLogoutUrl() {
    $.ajax({
      url: `${environment.API_URL}/v0/sessions`,
      type: 'DELETE',
      headers: {
        Authorization: `Token token=${sessionStorage.userToken}`
      },
      success: (result) => {
        this.setState({ logoutUrl: result.logout_via_get });
      }
    });
  }

  handleLogin() {
    const myLoginUrl = this.state.loginUrl;
    const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  handleLogout() {
    const myLogoutUrl = this.state.logoutUrl;
    const receiver = window.open(myLogoutUrl, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
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
        this.props.onUpdateLoggedInStatus(true);
        this.getUserData();
      }
    } else {
      this.props.onUpdateLoggedInStatus(false);
    }
  }

  render() {
    let content;

    if (__BUILDTYPE__ !== 'production') {
      content = (
        <SignInProfileButton onUserLogin={this.handleLogin} onUserLogout={this.handleLogout}/>
      );
    } else {
      content = null;
    }
    return content;
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login,
    profile: state.profile
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

export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(Main);
export { Main };
