import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import moment from 'moment';

import environment from '../../common/helpers/environment.js';
import { getUserData } from '../../common/helpers/login-helpers';

import { updateLoggedInStatus, updateLogInUrl, logOut } from '../../common/actions';
import SignInProfileButton from '../components/SignInProfileButton';

// TODO(crew): Redux-ify the state and how it is stored here.
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.setMyToken = this.setMyToken.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.checkTokenStatus = this.checkTokenStatus.bind(this);
    this.getUserData = getUserData;
  }

  componentDidMount() {
    window.addEventListener('message', this.setMyToken);
    window.onload = this.checkTokenStatus();
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  setMyToken() {
    if (event.data === sessionStorage.userToken) {
      this.getUserData();
    }
  }

  handleLogin() {
    this.serverRequest = $.get(`${environment.API_URL}/v0/sessions/new?level=1`, result => {
      const myLoginUrl = result.authenticate_via_get;
      const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
      receiver.focus();
    });
  }

  handleLogout() {
    fetch(`${environment.API_URL}/v0/sessions`, {
      method: 'delete',
      headers: new Headers({
        Authorization: `Token token=${sessionStorage.userToken}`
      })
    }).then(response => {
      return response.json();
    }).then(json => {
      const myLogoutUrl = json.logout_via_get;
      window.open(myLogoutUrl, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    });
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
