import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { updateLoggedInStatus } from '../actions';


class SignInProfileButton extends React.Component {
  render() {
    let content;
    let greeting;

    if (this.props.login.currentlyLoggedIn) {
      if (this.props.profile.userFullName.first) {
        const firstName = _.startCase(_.toLower(this.props.profile.userFullName.first));
        greeting = `Hello, ${firstName}`;
      } else {
        greeting = this.props.profile.email;
      }

      content = (
        <span>
          <span className="signin-greeting">{greeting}</span><span className="signin-spacer">|</span>
          <a href="/profile">Account</a><span className="signin-spacer">|</span>
          <a href="#" onClick={this.props.onUserLogout}>Sign Out</a>
        </span>
      );
    } else {
      content = (<div>
        <a href="#" onClick={this.props.onUserLogin}>Sign In</a><span className="signin-spacer">|</span><a href="#" onClick={this.props.onUserSignup}>Register</a>
      </div>
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
  const userState = state.user;
  return {
    login: userState.login,
    profile: userState.profile
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
