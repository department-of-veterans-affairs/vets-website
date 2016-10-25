import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import environment from '../../common/helpers/environment.js';

import { updateLoggedInStatus, updateLogInUrl, updateProfileField } from '../../common/actions';
import SignInProfileButton from '../components/SignInProfileButton';

// TODO(crew): Redux-ify the state and how it is stored here.
class Main extends React.Component {
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

    // TODO: Remove this conditional statement when going to production.
    if (__BUILDTYPE__ !== 'production') {
      this.serverRequest = $.get(`${environment.API_URL}/v0/sessions/new`, result => {
        this.props.onUpdateLoginUrl('first', result.authenticate_via_get);
      });

      this.serverRequest = $.get(`${environment.API_URL}/v0/sessions/new?level=3`, result => {
        this.props.onUpdateLoginUrl('third', result.authenticate_via_get);
      });
    }

    // TODO (crew): Change to just listen for localStorage update but currently known bug in Chrome prevents this from firing (https://bugs.chromium.org/p/chromium/issues/detail?id=136356).
    window.addEventListener('message', this.setMyToken);
  }

  componentWillUnmount() {
    this.serverRequest.abort();
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
      // console.log(json);
      const userData = json.data.attributes.profile;
      this.props.onUpdateProfile('accountType', userData.loa.current);
      this.props.onUpdateProfile('email', userData.email);
      this.props.onUpdateProfile('userFullName.first', userData.first_name);
      this.props.onUpdateProfile('userFullName.middle', userData.middle_name);
      this.props.onUpdateProfile('userFullName.last', userData.last_name);
      // this.props.onUpdateProfile('userFullName.suffix', userData.first_name);
      this.props.onUpdateProfile('gender', userData.gender);
      this.props.onUpdateProfile('dob', userData.birth_date);
      this.props.onUpdateLoggedInStatus(true);
    });
  }

  handleLogin() {
    const myLoginUrl = this.props.login.loginUrl.first;
    const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  handleVerify() {
    const myLoginUrl = this.props.login.loginUrl.third;
    const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  render() {
    let content;

    if (__BUILDTYPE__ !== 'production') {
      content = (
        <SignInProfileButton onUserLogin={this.handleLogin}/>
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
    onUpdateProfile: (field, update) => {
      dispatch(updateProfileField(field, update));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(Main);
export { Main };
