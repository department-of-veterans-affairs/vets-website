import React from 'react';
import $ from 'jquery';

import environment from '../helpers/environment.js';

export default class RequiredVerifyView extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenPopup = this.handleOpenPopup.bind(this);
  }

  componentDidMount() {
    // TODO: Remove this conditional statement when going to production.
    if (__BUILDTYPE__ !== 'production') {
      this.serverRequest = $.get(`${environment.API_URL}/v0/sessions/new?level=3`, result => {
        this.setState({ verifyUrl: result.authenticate_via_get });
      });
    }
  }

  handleOpenPopup() {
    const myVerifyUrl = this.state.verifyUrl;
    const receiver = window.open(myVerifyUrl, '_blank', 'resizable=yes,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  render() {
    return (
      <div className="row primary">
        <div className="medium-12 small-12 columns">
          <h1>Verify your Vets.gov Account</h1>
          <p>You need to verify your identity to access this part of Vets.gov</p>
          <p>We must meet increased security standards to keep your information secure. To safely verify your identity to these standards, we are using <strong>ID.me</strong>, at third-party service.</p>
          <p>When you create an account on vets.gov, you will need to verifty your identity through <strong>ID.me</strong> in order for the VA to identify you and locate your records.</p>
          <p>
            <button className="usa-button-primary va-button-primary usa-button-big" onClick={this.handleOpenPopup}><strong>Continue</strong></button>
          </p>
          <p>Having trouble signing in or creating  an account? See <a href="#">Frequently Asked Questions</a></p>
        </div>
      </div>
    );
  }
}
