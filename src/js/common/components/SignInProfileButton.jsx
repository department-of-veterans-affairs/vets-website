import React from 'react';

class SignInProfileButton extends React.Component {
  render() {
    return (
      <div className="va-action-bar--header">
        <div className="row">
          <div className="small-12 columns">
            <a className="usa-button-primary" href={this.props.loginUrl}>Sign In</a>
          </div>
        </div>
      </div>
    );
  }
}

export default SignInProfileButton;
