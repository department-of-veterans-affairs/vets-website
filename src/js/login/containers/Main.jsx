import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import environment from '../helpers/environment.js';

import { updateLoggedInStatus, updateLogInUrl, updateProfileField } from '../../common/actions';
import SignInProfileButton from '../components/SignInProfileButton';

// TODO(crew): Redux-ify the state and how it is stored here.
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenPopup = this.handleOpenPopup.bind(this);
    this.setMyToken = this.setMyToken.bind(this);
    this.getUserToken = this.getUserToken.bind(this);
  }

  componentDidMount() {
    if (localStorage.userToken) {
      this.props.onUpdateLoggedInStatus(true);
      this.getUserToken();
    }

    this.serverRequest = $.get(`${environment.BASE_URL}/v0/sessions/new`, result => {
      this.props.onUpdateLoginUrl(result.authenticate_via_get);
    });

    window.addEventListener('message', this.setMyToken);
  }

  componentWillUnmount() {
    this.serverRequest.abort();
    window.removeEventListener('message', this.setMyToken);
  }

  setMyToken() {
    if (event.origin === environment.BASE_URL) {
      localStorage.setItem('userToken', event.data.token);
      this.getUserToken();
    }
  }

  getUserToken() {
    fetch(`${environment.BASE_URL}/v0/user`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Token token=${localStorage.userToken}`
      })
    }).then(response => {
      return response.json();
    }).then(json => {
      this.props.onUpdateProfile('email', json.email);
      this.props.onUpdateLoggedInStatus(true);
    });
  }

  handleOpenPopup() {
    const myLoginUrl = this.props.login.loginUrl;
    const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  render() {
    return (
      <SignInProfileButton onButtonClick={this.handleOpenPopup}/>
    );
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
