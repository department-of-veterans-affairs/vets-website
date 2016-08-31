import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class SignInProfileButton extends React.Component {
  render() {
    let content;

    if (this.props.login.currentlyLoggedIn) {
      content = (
        <Link to="/profile">
          <button className="usa-button-primary-alt">{this.props.profile.email}</button>
        </Link>
      );
    } else {
      content = (
        <button className="usa-button-primary" onClick={this.props.onButtonClick}>Sign In</button>
      );
    }
    return (
      <div className="va-action-bar--header">
        <div className="row">
          <div className="small-12 columns">
            {content}
          </div>
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

export default connect(mapStateToProps)(SignInProfileButton);
