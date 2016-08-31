import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import { updateLoggedInStatus, updateLogInUrl, updateProfileField } from '../actions';
import SignInProfileButton from '../components/SignInProfileButton';
import TabNav from '../components/TabNav';

// TODO(crew): Redux-ify the state and how it is stored here.
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenPopup = this.handleOpenPopup.bind(this);
    this.setMyToken = this.setMyToken.bind(this);
    this.getUserToken = this.getUserToken.bind(this);
  }

  componentDidMount() {
    this.serverRequest = $.get('http://localhost:3000/v0/sessions/new', result => {
      this.props.onUpdateLoginUrl(result.authenticate_via_get);
    });

    window.addEventListener('message', this.setMyToken);
  }

  componentWillUnmount() {
    this.serverRequest.abort();
    window.removeEventListener('message', this.setMyToken);
  }

  setMyToken() {
    if (event.origin === 'http://localhost:3000') {
      localStorage.setItem('userToken', event.data.token);
      this.getUserToken();
    }
  }

  getUserToken() {
    fetch('http://localhost:3000/v0/user', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Token token=${localStorage.userToken}`
      })
    }).then(response => {
      return response.json();
    }).then(json => {
      this.props.onUpdateProfile('email', json.email);
      this.props.onUpdateLoggedInStatus(true);
      localStorage.removeItem('userToken');
    });
  }

  handleOpenPopup() {
    const myLoginUrl = this.props.login.loginUrl;
    const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  render() {
    return (
      <div>
        <SignInProfileButton onButtonClick={this.handleOpenPopup}/>
        <div className="rx-app row">
          <TabNav/>
          {this.props.children}
        </div>
      </div>
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
