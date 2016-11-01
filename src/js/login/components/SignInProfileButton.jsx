import React from 'react';
import { connect } from 'react-redux';

import { updateLoggedInStatus, logOut } from '../../common/actions';


class SignInProfileButton extends React.Component {
  constructor(props) {
    super(props);
    this.clearUserToken = this.clearUserToken.bind(this);
  }

  clearUserToken() {
    localStorage.removeItem('userToken');
    this.props.onUpdateLoggedInStatus(false);
    this.props.onClearUserData();
  }

  render() {
    let content;

    if (this.props.login.currentlyLoggedIn) {
      content = (
        <span>
          <span>Hello, {this.props.profile.email}</span><span className="signin-spacer">|</span>
          <a href="/profile">Profile</a><span className="signin-spacer">|</span>
          <a href="#" onClick={this.clearUserToken}>Sign Out</a>
        </span>
      );
    } else {
      content = (
        <a href="#" onClick={this.props.onUserLogin}>Sign In<span className="signin-spacer">|</span>Register</a>
      );
    }
    return (
      <div className="sign-in-link">
        {content}
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
    onClearUserData: () => {
      dispatch(logOut());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(SignInProfileButton);
export { SignInProfileButton };
