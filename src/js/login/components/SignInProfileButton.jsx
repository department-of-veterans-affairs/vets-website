import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { updateLoggedInStatus } from '../../common/actions';


class SignInProfileButton extends React.Component {
  render() {
    let content;
    let greeting;

    if (this.props.profile.userFullName.first) {
      const firstName = _.startCase(_.toLower(this.props.profile.userFullName.first));
      greeting = `Hello, ${firstName}`;
    } else {
      greeting = this.props.profile.email;
    }

    if (this.props.login.currentlyLoggedIn) {
      content = (
        <span>
          <span>{greeting}</span><span className="signin-spacer">|</span>
          <a href="/profile">Account</a><span className="signin-spacer">|</span>
          <a href="#" onClick={this.props.onUserLogout}>Sign Out</a>
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(SignInProfileButton);
export { SignInProfileButton };
