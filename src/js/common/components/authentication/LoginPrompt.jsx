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
            <h1>Sign In to Your Vets.gov Account</h1>
            <p>Vets.gov is a new VA website offering online services for Veterans.</p>
            <p>Sign in to:</p>
            <ul>
              <li>Refill a prescription.</li>
              <li>Send a secure message to your health care team.</li>
              <li>Check the status of a disability or pension claim or appeal.</li>
            </ul>
            <p>
              <button className="usa-button-primary va-button-primary usa-button-big" onClick={this.handleLogin}><strong>Sign In</strong></button>
              <button className="va-button-secondary usa-button-big" onClick={this.handleSignup}><strong>Create Account</strong></button>
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
