import PropTypes from 'prop-types';
import React from 'react';

class LoginPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  componentDidMount() {
    window.dataLayer.push({ event: 'login-prompt-displayed' });
  }

  handleLogin() {
    window.dataLayer.push({ event: 'login-link-clicked' });
    const myLoginUrl = this.props.loginUrl;
    if (myLoginUrl) {
      window.dataLayer.push({ event: 'login-link-opened' });
      const receiver = window.open(`${myLoginUrl}&op=signin`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
      receiver.focus();
    }
  }

  handleSignup() {
    window.dataLayer.push({ event: 'register-link-clicked' });
    const myLoginUrl = this.props.loginUrl;
    if (myLoginUrl) {
      window.dataLayer.push({ event: 'register-link-opened' });
      const receiver = window.open(`${myLoginUrl}&op=signup`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
      receiver.focus();
    }
  }

  render() {
    return (
      <div className="row primary">
        <div className="medium-12 small-12 columns">
          <div className="react-container">
            <h1>Log In to Your Vets.gov Account</h1>
            <p>Log in with your verified ID.me account on Vets.gov to:</p>
            <ul>
              <li>Use health tools to refill your VA prescriptions, send secure messages to your health care team, and access your VA health records</li>
              <li>Check the status of your claims and appeals</li>
              <li>View your Post-9/11 GI Bill benefits summary and enrollment information</li>
              <li>Download VA letters and documents related to your benefits and eligibility</li>
            </ul>
            <p>
              <button className="usa-button-primary va-button-primary usa-button-big" onClick={this.handleLogin}><strong>Log In</strong></button>
              <button className="va-button-secondary usa-button-big" onClick={this.handleSignup}><strong>Sign Up</strong></button>
            </p>
            <p>Even without an account, you can apply for VA benefits.</p>
            <h5>Having trouble signing in?</h5>
            <p>
              <a href="/faq/">Get answers to Frequently Asked Questions (FAQs)</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

LoginPrompt.propTypes = {
  loginUrl: PropTypes.string
};

export default LoginPrompt;
