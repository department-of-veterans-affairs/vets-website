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
            <h1>Log In With Your Account for Vets.gov</h1>
            <p>Log in with your verified ID.me account on Vets.gov to:</p>
            <ul>
              <li>Use health tools, including refilling your VA prescription, sending messages to your healthcare team, and accessing your VA health record</li>
              <li>Check the status of your claims and appeals</li>
              <li>View Post-9/11 GI Bill enrollment information</li>
            </ul>
            <p>
              <button className="usa-button-primary va-button-primary usa-button-big" onClick={this.handleLogin}><strong>Sign In</strong></button>
              <button className="va-button-secondary usa-button-big" onClick={this.handleSignup}><strong>Create Account</strong></button>
            </p>
            <p>Even without an account, you can apply for VA benefits.</p>
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
