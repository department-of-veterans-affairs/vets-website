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
    this.handleOpenPopup = this.handleOpenPopup.bind(this);
    this.setMyToken = this.setMyToken.bind(this);
    this.getUserData = this.getUserData.bind(this);
  }

  componentDidMount() {
    if (localStorage.length > 0) {
      this.props.onUpdateLoggedInStatus(true);
      this.getUserData();
    }

    // TODO: Remove this conditional statement when going to production.
    if (__BUILDTYPE__ !== 'production') {
      this.serverRequest = $.get(`${environment.API_URL}/v0/sessions/new`, result => {
        this.props.onUpdateLoginUrl(result.authenticate_via_get);
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
      this.props.onUpdateProfile('accountType', json.level_of_assurance);
      this.props.onUpdateProfile('email', json.email);
      this.props.onUpdateProfile('userFullName.first', json.first_name);
      this.props.onUpdateProfile('userFullName.middle', json.middle_name);
      this.props.onUpdateProfile('userFullName.last', json.last_name);
      // this.props.onUpdateProfile('userFullName.suffix', json.first_name);
      this.props.onUpdateProfile('gender', json.gender);
      this.props.onUpdateProfile('dob', json.birth_date);
      this.props.onUpdateLoggedInStatus(true);
    });
  }

  handleOpenPopup() {
    const myLoginUrl = this.props.login.loginUrl;
    const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  render() {
    let content;

    if (__BUILDTYPE__ !== 'production') {
      content = (
        <SignInProfileButton onButtonClick={this.handleOpenPopup}/>
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
    onUpdateLoginUrl: (update) => {
      dispatch(updateLogInUrl(update));
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
