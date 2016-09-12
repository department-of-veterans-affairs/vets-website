import React from 'react';
import { connect } from 'react-redux';

class LoginApp extends React.Component {
  constructor(props) {
    super(props);
    this.setMyToken = this.setMyToken.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  setMyToken() {
    var saml = new FormData();
    saml.append('SAMLResponse', this.props.location.query.SAMLResponse);
    fetch('http://localhost:4000/auth/saml/callback', {
      method: 'POST',
      body: saml
    }).then(response => {
      return response.json();
    }).then(json => {
      localStorage.setItem('userToken', json.token);
      this.getProfile();
    });
  }

  getProfile() {
    fetch('http://localhost:4000/v0/user', {
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

  render() {
    this.setMyToken();
    return (
      <div>
        Logging you in ...
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

export default connect(mapStateToProps)(LoginApp);
