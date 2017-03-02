import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import DropDown from '../../common/components/DropDown';
import IconUser from '../../common/components/svgicons/IconUser';

import { updateLoggedInStatus } from '../actions';

class SignInProfileButton extends React.Component {
  render() {
    let content;
    let greeting;

    if (this.props.login.currentlyLoggedIn) {
      if (this.props.profile.userFullName.first) {
        const firstName = _.startCase(_.toLower(this.props.profile.userFullName.first));
        greeting = firstName;
      } else {
        greeting = this.props.profile.email;
      }

      const icon = <IconUser color="#fff"/>;

      const dropDownContents = (
        <ul>
          <li><a href="/profile">Account</a></li>
          <li><a href="#" onClick={this.props.onUserLogout}>Sign Out</a></li>
        </ul>
      );

      content = (
        <DropDown
            buttonText={greeting}
            contents={dropDownContents}
            id="usermenu"
            icon={icon}
            isOpen={false}/>
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
