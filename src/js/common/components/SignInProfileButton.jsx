import React from 'react';

class SignInProfileButton extends React.Component {
  render() {
    return (
      <div className="va-action-bar--header">
        <div className="row">
          <div className="small-12 columns">
            <button className="usa-button-primary" onClick={this.props.onButtonClick}>Sign In</button>
          </div>
        </div>
      </div>
    );
  }
}

export default SignInProfileButton;
