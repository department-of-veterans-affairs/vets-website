import React from 'react';
import { handleVerify } from '../../helpers/login-helpers.js';

class VerifyPrompt extends React.Component {

  constructor(props) {
    super(props);
    this.handleVerify = handleVerify;
  }

  componentDidMount() {
		// event for google analytics that we prompted to verify account
    window.dataLayer.push({ event: 'verify-prompt-displayed' });
  }

  render() {
    return (
      <div className="row primary">
        <div className="medium-12 small-12 columns">
          <div className="react-container">
            <h1>Verify your Identity with ID.me</h1>
            <p>You need to verify your identity to access this part of Vets.gov.</p>
            <p>To access Vets.gov services, you'll need to verify your identity through ID.me, a third party service that provides strong identity verification. We have added this protection to increase security for your information. Here's what you'll need:
              <ul>
                <li>Your passport or driver's license</li>
                <li>A phone that can receive texts or calls</li>
              </ul>
            Don't have a supported ID? You can provide personal information and answer questions about your credit history instead.</p>
            <p>
              <button className="usa-button-primary va-button-primary usa-button-big" onClick={this.handleVerify}><strong>Get Started</strong></button>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default VerifyPrompt;
