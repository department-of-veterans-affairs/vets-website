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
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>
            <button className="usa-button-primary va-button-primary usa-button-big" onClick={this.handleOpenPopup}><strong>Continue</strong></button>
          </p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </div>
    );
  }
}
