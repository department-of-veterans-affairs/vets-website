import React from 'react';
import { connect } from 'react-redux';

import environment from '../../common/helpers/environment.js';

import { updateLoggedInStatus, updateProfileField } from '../../common/actions';

class LoginApp extends React.Component {
  constructor(props) {
    super(props);
    this.setMyToken = this.setMyToken.bind(this);
  }

  componentDidMount() {
    this.setMyToken();
  }

  setMyToken() {
    const saml = new FormData();
    saml.append('SAMLResponse', this.props.location.query.SAMLResponse);
    fetch(`${environment.API_URL}/auth/saml/callback`, {
      method: 'POST',
      body: saml
    }).then(response => {
      return response.json();
    }).then(json => {
      window.opener.localStorage.removeItem('userToken');
      window.opener.localStorage.setItem('userToken', json.token);
      window.opener.postMessage(json.token, environment.BASE_URL);
      localStorage.setItem('userToken', json.token);
      window.close();
    });
  }

  render() {
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

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoggedInStatus: (update) => {
      dispatch(updateLoggedInStatus(update));
    },
    onUpdateProfile: (field, update) => {
      dispatch(updateProfileField(field, update));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(LoginApp);
export { LoginApp };
