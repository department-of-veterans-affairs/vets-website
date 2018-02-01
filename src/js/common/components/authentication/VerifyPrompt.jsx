import PropTypes from 'prop-types';
import React from 'react';

import { handleVerify } from '../../helpers/login-helpers.js';

class VerifyPrompt extends React.Component {
  componentDidMount() {
    window.dataLayer.push({ event: 'verify-prompt-displayed' });
  }

  render() {
    return (
      <div className="row primary">
        <div className="medium-12 small-12 columns">
          <div className="react-container">
            <h1>Verify your Identity with ID.me</h1>
            <p>You need to verify your identity to access this part of Vets.gov.</p>
            <p>To access Vets.gov services, you’ll need to verify your identity through ID.me, a third-party service that provides strong identity verification. We have added this protection to increase security for your information. Here’s what you’ll need:
              <ul>
                <li>Your passport or driver’s license</li>
                <li>A phone that can receive texts or calls</li>
              </ul>
            Don’t have a supported ID? You can provide personal information and answer questions about your credit history instead.</p>
            <p>
              <button className="usa-button-primary va-button-primary usa-button-big" onClick={() => handleVerify(this.props.verifyUrl)}><strong>Get Started</strong></button>
            </p>
            <h5>Having trouble verifying your identity?</h5>
            <p>
              <a href="/faq/">Get answers to Frequently Asked Questions (FAQs)</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

VerifyPrompt.propTypes = {
  verifyUrl: PropTypes.string
};

export default VerifyPrompt;
