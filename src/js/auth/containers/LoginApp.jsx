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
    const myToken = this.props.location.query.token;
    window.opener.localStorage.removeItem('userToken');
    window.opener.localStorage.setItem('userToken', myToken);
    window.opener.postMessage(myToken, environment.BASE_URL);
    localStorage.setItem('userToken', myToken);
    window.close();
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
