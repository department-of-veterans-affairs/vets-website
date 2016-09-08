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
          <button className="usa-button usa-button-outline-inverse">{this.props.profile.email}</button>
          <button className="usa-button usa-button-outline-inverse" onClick={this.clearUserToken}>Sign Out</button>
        </span>
      );
    } else {
      content = (
        <button className="usa-button usa-button-outline-inverse" onClick={this.props.onButtonClick}>Sign In</button>
      );
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
