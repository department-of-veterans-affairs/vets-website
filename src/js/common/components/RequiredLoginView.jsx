import React from 'react';

export default class RequiredLoginView extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenPopup = this.handleOpenPopup.bind(this);
  }

  handleOpenPopup() {
    const myLoginUrl = this.props.loginUrl;
    const receiver = window.open(myLoginUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  render() {
    return (
      <div className="row primary">
        <div className="medium-12 small-12 columns">
          <h1>Sign in to your Vets.gov Account</h1>
          <p>Vets.gov is a new website from the VA offering online services for Veterans</p>
          <p>We must meet increased security standards to keep your information secure. To safely verify your identity to these standards, we are using <strong>ID.me</strong>, at third-party service.</p>
          <p>When you create an account on vets.gov, you will need to verifty your identity through <strong>ID.me</strong> in order for the VA to identify you and locate your records.</p>
          <p>
            <button className="usa-button-primary va-button-primary usa-button-big" onClick={this.handleOpenPopup}><strong>Sign In</strong></button>
            <button className="usa-button-big" onClick={this.handleOpenPopup}><strong>Create an account</strong></button>
          </p>
          <p>Having trouble signing in or creating  an account? See <a href="#">Frequently Asked Questions</a></p>
        </div>
      </div>
    );
  }
}
